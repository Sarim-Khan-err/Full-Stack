// Modified from the supplied 06-student-api/01-memory-api.js.
// Same built-in HTTP server and arrays in memory; extended to four CRUD modules.
const http = require('node:http');
function createServer() {
  const data = { students: [], teachers: [], attendance: [], marks: [] };
  const nextId = { students: 1, teachers: 1, attendance: 1, marks: 1 };
  const fields = {
    students: ['name', 'rollNumber'], teachers: ['name', 'subject'],
    attendance: ['studentId', 'date', 'status'],
    marks: ['studentId', 'subject', 'score', 'maxScore']
  };
  return http.createServer(async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(body === undefined ? undefined : JSON.stringify(body));
    };
    try {
      const url = new URL(req.url, 'http://localhost');
      const match = /^\/(students|teachers|attendance|marks)(?:\/([1-9]\d*))?$/.exec(url.pathname);
      if (!match) return send(404, { error: 'Not found' });
      const resource = match[1], id = match[2] ? Number(match[2]) : null;
      const records = data[resource];
      const index = records.findIndex(record => record.id === id);
      if (id !== null && index < 0) return send(404, { error: 'Record not found' });
      if (req.method === 'GET') return send(200, id === null ? records : records[index]);
      if (req.method === 'DELETE' && id !== null) {
        if (resource === 'students' && [...data.attendance, ...data.marks].some(r => r.studentId === id)) {
          return send(409, { error: 'Delete this student’s attendance and marks first' });
        }
        records.splice(index, 1);
        return send(204);
      }
      if (!((req.method === 'POST' && id === null) || (req.method === 'PUT' && id !== null))) {
        return send(405, { error: 'Use GET/POST on collections or GET/PUT/DELETE with an id' });
      }
      if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(415, { error: 'Use application/json' });
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 65536) return send(413, { error: 'Too large' });
      }
      const body = JSON.parse(raw);
      if (!body || typeof body !== 'object' || Array.isArray(body)) return send(400, { error: 'JSON object required' });
      const record = {};
      for (const key of fields[resource]) {
        const value = body[key];
        if (['studentId', 'score', 'maxScore'].includes(key)) {
          if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return send(400, { error: `${key} must be a nonnegative number` });
          record[key] = value;
        } else {
          if (typeof value !== 'string' || !value.trim()) return send(400, { error: `${key} required` });
          record[key] = value.trim();
        }
      }
      if ('studentId' in record && !data.students.some(s => s.id === record.studentId)) return send(400, { error: 'Student does not exist' });
      if (resource === 'attendance') {
        if (!['present', 'absent', 'late'].includes(record.status)) return send(400, { error: 'Use present, absent or late' });
        if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date) || Number.isNaN(Date.parse(record.date)) || new Date(record.date).toISOString().slice(0, 10) !== record.date) return send(400, { error: 'Use a valid YYYY-MM-DD date' });
      }
      if (resource === 'marks' && (record.maxScore <= 0 || record.score > record.maxScore)) return send(400, { error: 'score must be between 0 and maxScore' });
      if (id === null) {
        record.id = nextId[resource]++;
        records.push(record);
        return send(201, record);
      }
      records[index] = { id, ...record };
      return send(200, records[index]);
    } catch (error) {
      if (error instanceof SyntaxError) return send(400, { error: 'Invalid JSON' });
      console.error(error);
      return send(500, { error: 'Server error' });
    }
  });
}
if (require.main === module) createServer().listen(3004, () => console.log('Student management: http://localhost:3004/students'));
module.exports = { createServer };
