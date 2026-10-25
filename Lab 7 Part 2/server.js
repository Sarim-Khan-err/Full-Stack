const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createStore } = require('./store');
const { products, reviews } = require('./seed.json');
const error = (status, message) => { throw Object.assign(new Error(message), { status }); };
function createServer(file = path.join(__dirname, 'data', 'fitcheck.json')) {
  const store = createStore(file);
  const fresh = () => ({ products: structuredClone(products), reviews: structuredClone(reviews), carts: [], orders: [] });
  const read = async () => (await store.list())[0] || fresh();
  const edit = change => store.edit(rows => {
    if (!rows.length) rows.push(fresh());
    return { changed: true, value: change(rows[0]) };
  });
  return http.createServer(async (req, res) => {
    const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(value === undefined ? undefined : JSON.stringify(value)); };
    try {
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/')) {
        if (req.method !== 'GET') return send(405, { error: 'Use GET' });
        const relative = decodeURIComponent(url.pathname === '/' ? '/FITCHECK.html' : url.pathname);
        if (!(relative === '/FITCHECK.html' || relative.startsWith('/vendor/') || relative.startsWith('/assets/'))) error(404, 'Not found');
        const target = path.resolve(__dirname, '.' + relative);
        const allowedRoot = path.resolve(__dirname) + path.sep;
        if (!target.startsWith(allowedRoot)) error(404, 'Not found');
        let content;
        try { content = await fs.readFile(target); } catch (e) { if (['ENOENT','EISDIR'].includes(e.code)) error(404, 'Not found'); throw e; }
        const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.png':'image/png' }[path.extname(target)] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime }); return res.end(content);
      }
      const match = /^\/api\/(products|carts|orders|reviews)(?:\/([\w-]+))?$/.exec(url.pathname);
      if (!match) error(404, 'Not found');
      const [, resource, id] = match;
      if (req.method === 'GET') {
        const records = (await read())[resource];
        if (!id) return send(200, records);
        const record = records.find(r => String(r.id) === id);
        if (!record && resource === 'carts') return send(200, { id, items: {} });
        return send(200, record || error(404, 'Not found'));
      }
      const allowed = resource === 'carts' ? ['PUT', 'DELETE'] : resource === 'orders' ? ['POST'] : ['POST', 'PUT', 'DELETE'];
      if (!allowed.includes(req.method) || (req.method === 'POST' ? !!id : !id)) error(405, 'Method not allowed');
      let body;
      if (req.method !== 'DELETE') {
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) error(415, 'Use application/json');
        let raw = '';
        for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 65536) error(413, 'Too large'); }
        try { body = JSON.parse(raw); } catch { error(400, 'Invalid JSON'); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) error(400, 'JSON object required');
      }
      const value = await edit(db => {
        const records = db[resource], index = records.findIndex(r => String(r.id) === id);
        if (id && index < 0 && resource !== 'carts') error(404, 'Not found');
        if (req.method === 'DELETE') {
          if (index >= 0) records.splice(index, 1);
          return;
        }
        const nonempty = v => typeof v === 'string' && !!v.trim();
        let fields;
        if (resource === 'products') {
          if (!nonempty(body.n) || !nonempty(body.cat) || typeof body.p !== 'number' || !Number.isFinite(body.p) || body.p < 0) error(400, 'Product requires n, cat and nonnegative numeric p');
          fields = { n: body.n.trim(), cat: body.cat.trim(), p: body.p };
        }
        if (resource === 'reviews') {
          if (!nonempty(body.n) || !nonempty(body.t) || !Number.isInteger(body.s) || body.s < 1 || body.s > 5) error(400, 'Review requires n, t and s from 1 to 5');
          fields = { n: body.n.trim(), t: body.t.trim(), s: body.s };
        }
        if (['carts', 'orders'].includes(resource)) {
          if (!body.items || typeof body.items !== 'object' || Array.isArray(body.items)) error(400, 'items must map product IDs to quantities');
          for (const [productId, quantity] of Object.entries(body.items)) {
            if (!db.products.some(p => String(p.id) === productId) || !Number.isSafeInteger(quantity) || quantity < 1) error(400, 'Invalid product or quantity');
          }
          fields = { items: body.items };
        }
        if (resource === 'orders') {
          if (!Object.keys(body.items).length || !nonempty(body.email)) error(400, 'Order requires email and nonempty items');
          const subtotal = Object.entries(body.items).reduce((sum, [id, q]) => sum + Math.round(db.products.find(p => String(p.id) === id).p * 100) * q, 0) / 100;
          const shipping = subtotal >= 8000 ? 0 : 250;
          fields = { ...fields, email: body.email.trim(), subtotal, shipping, total: subtotal + shipping, date: new Date().toISOString() };
          if (typeof body.cartId === 'string') db.carts = db.carts.filter(c => c.id !== body.cartId);
        }
        const recordId = id ? (resource === 'carts' ? id : records[index].id) : resource === 'products' ? Math.max(0, ...records.map(r => r.id)) + 1 : require('node:crypto').randomUUID();
        const record = { id: recordId, ...fields };
        if (index < 0) records.push(record); else records[index] = record;
        return record;
      });
      send(req.method === 'DELETE' ? 204 : req.method === 'POST' ? 201 : 200, value);
    } catch (e) { if (!e.status) console.error(e); send(e.status || 500, { error: e.status ? e.message : 'Server error' }); }
  });
}
if (require.main === module) createServer().listen(3005, () => console.log('Fitcheck: http://localhost:3005'));
module.exports = { createServer };
