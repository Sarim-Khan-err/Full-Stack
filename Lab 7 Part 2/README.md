# Lab 7 — Part 2

Persistent API endpoints applied to the actual Lab 3 Fitcheck e-commerce store from [Lab03-Full-Stack](https://github.com/Sarim-Khan-err/Lab03-Full-Stack). `FITCHECK.html`, the local Bootstrap files and product images were copied from that project. Its existing design is retained. The product list, cart, checkout orders and reviews now use the Node.js backend instead of hardcoded products or browser-local storage.

## Run

With Node.js 22 or newer, run `npm start`, then open **http://localhost:3005**. No package installation or database setup is needed. Run `npm test` to check endpoints, persistence, static assets and frontend script syntax.

Use the website through this URL, rather than opening the HTML file directly. The first request uses the original eight catalog products and three reviews from `seed.json`. Mutations save to `data/fitcheck.json`; they survive a restart. The queued JSON-file store is taken from the supplied Week 7 persistent API example. Run one server process per data file.

## Endpoints

All request bodies are JSON with `Content-Type: application/json`.

| Method | Endpoint | Purpose / body |
| --- | --- | --- |
| GET | /api/products | List original Fitcheck catalog |
| GET | /api/products/:id | Read a product |
| POST | /api/products | Create: `{"n":"Tee","cat":"Tees","p":2200}` |
| PUT | /api/products/:id | Update using the same three fields |
| DELETE | /api/products/:id | Delete a product |
| GET | /api/carts | List saved carts |
| GET | /api/carts/:id | Read a cart; missing carts return empty items |
| PUT | /api/carts/:id | Save: `{"items":{"1":2,"3":1}}` |
| DELETE | /api/carts/:id | Clear saved cart |
| GET | /api/orders | List saved orders |
| GET | /api/orders/:id | Read an order |
| POST | /api/orders | Place: `{"email":"demo@example.com","items":{"1":2},"cartId":"demo"}` |
| GET | /api/reviews | List reviews |
| GET | /api/reviews/:id | Read a review |
| POST | /api/reviews | Create: `{"n":"Ali","s":5,"t":"Good quality"}` |
| PUT | /api/reviews/:id | Update using the same three fields |
| DELETE | /api/reviews/:id | Delete a review |

Field names follow the existing Lab 3 code: `n` is name, `cat` category, `p` price in PKR; for reviews `s` is stars and `t` text. Cart/order items map product IDs to positive integer quantities. Orders use server catalog prices and the original shipping rule (Rs. 250 below Rs. 8,000; free from Rs. 8,000). Placing an order clears its saved cart. The frontend remembers a cart ID in the browser so it can retrieve the same server cart after refresh.

The original browser-only demo signup/login remains as it was; it is not real authentication. Use fictional details. Payments and delivery remain simulated. No authentication system, stock management, extra customer/category modules or payment service has been added.

To verify persistence manually, add an item, refresh, then stop/restart the server and refresh again. Post a review and place a demo order; inspect `/api/reviews` and `/api/orders` after restarting.
