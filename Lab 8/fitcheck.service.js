const { BadRequestException, Injectable, NotFoundException } = require('@nestjs/common');
const { randomUUID } = require('node:crypto');
const { join } = require('node:path');
const { createStore } = require('../Lab 7 Part 2/store');
const { products, reviews } = require('../Lab 7 Part 2/seed.json');

const fresh = () => ({
  products: structuredClone(products), reviews: structuredClone(reviews), carts: [], orders: []
});
const hasText = value => typeof value === 'string' && value.trim().length > 0;

class FitcheckService {
  constructor(file = join(__dirname, '..', 'Lab 7 Part 2', 'data', 'lab8-fitcheck.json')) {
    this.store = createStore(file);
  }

  async list(resource) {
    const [database = fresh()] = await this.store.list();
    return database[resource];
  }

  async read(resource, id) {
    const records = await this.list(resource);
    const record = records.find(item => String(item.id) === id);
    if (record) return record;
    if (resource === 'carts') return { id, items: {} };
    throw new NotFoundException('Record not found');
  }

  edit(change) {
    return this.store.edit(rows => {
      if (!rows.length) rows.push(fresh());
      return { changed: true, value: change(rows[0]) };
    });
  }

  create(resource, body) {
    return this.save(resource, undefined, body);
  }

  update(resource, id, body) {
    return this.save(resource, id, body);
  }

  remove(resource, id) {
    return this.edit(database => {
      const records = database[resource];
      const index = records.findIndex(record => String(record.id) === id);
      if (index >= 0) records.splice(index, 1);
      else if (resource !== 'carts') throw new NotFoundException('Record not found');
    });
  }

  save(resource, id, body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new BadRequestException('JSON object required');
    }

    return this.edit(database => {
      const records = database[resource];
      const index = records.findIndex(record => String(record.id) === id);
      if (id && index < 0 && resource !== 'carts') throw new NotFoundException('Record not found');

      const fields = this.fields(resource, body, database);
      let recordId = records[index]?.id ?? id;
      if (recordId === undefined) {
        if (resource === 'products') {
          const previousId = database.lastProductId ?? 0;
          recordId = records.reduce((max, product) => Math.max(max, product.id), previousId) + 1;
          database.lastProductId = recordId;
        } else {
          recordId = randomUUID();
        }
      }

      const record = { ...records[index], ...fields, id: recordId };
      if (index < 0) records.push(record);
      else records[index] = record;
      return record;
    });
  }

  fields(resource, body, database) {
    if (resource === 'products') {
      if (!hasText(body.n) || !hasText(body.cat) || !Number.isFinite(body.p) || body.p < 0) {
        throw new BadRequestException('Product requires n, cat and nonnegative numeric p');
      }
      return { n: body.n.trim(), cat: body.cat.trim(), p: body.p };
    }
    if (resource === 'reviews') {
      if (!hasText(body.n) || !hasText(body.t) || !Number.isInteger(body.s) || body.s < 1 || body.s > 5) {
        throw new BadRequestException('Review requires n, t and s from 1 to 5');
      }
      return { n: body.n.trim(), t: body.t.trim(), s: body.s };
    }

    const { items } = body;
    if (!items || typeof items !== 'object' || Array.isArray(items)) {
      throw new BadRequestException('items must map product IDs to quantities');
    }
    let subtotalInCents = 0;
    for (const [id, quantity] of Object.entries(items)) {
      const product = database.products.find(item => String(item.id) === id);
      if (!product || !Number.isSafeInteger(quantity) || quantity < 1) {
        throw new BadRequestException('Invalid product or quantity');
      }
      subtotalInCents += Math.round(product.p * 100) * quantity;
    }
    if (resource === 'carts') return { items };
    if (!hasText(body.email) || !Object.keys(items).length || !Number.isSafeInteger(subtotalInCents)) {
      throw new BadRequestException('Order requires an email and a valid item total');
    }

    const subtotal = subtotalInCents / 100;
    const shipping = subtotal >= 8000 ? 0 : 250;
    if (typeof body.cartId === 'string') {
      database.carts = database.carts.filter(cart => cart.id !== body.cartId);
    }
    return { items, email: body.email.trim(), subtotal, shipping, total: subtotal + shipping, date: new Date().toISOString() };
  }
}
Injectable()(FitcheckService);

module.exports = { FitcheckService };
