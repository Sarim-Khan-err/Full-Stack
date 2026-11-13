const {
  Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put
} = require('@nestjs/common');
const { FitcheckService } = require('./fitcheck.service');

// Apply NestJS decorators directly so this CommonJS project needs no compiler.
class ProductsController {
  constructor(service) {
    this.service = service;
  }

  list() {
    return this.service.list('products');
  }

  read(id) {
    return this.service.read('products', id);
  }

  create(body) {
    return this.service.create('products', body);
  }

  update(id, body) {
    return this.service.update('products', id, body);
  }

  remove(id) {
    return this.service.remove('products', id);
  }
}
Controller('api/products')(ProductsController);
Inject(FitcheckService)(ProductsController, undefined, 0);
Get()(ProductsController.prototype, 'list', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'list'));
Get(':id')(ProductsController.prototype, 'read', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'read'));
Param('id')(ProductsController.prototype, 'read', 0);
Post()(ProductsController.prototype, 'create', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'create'));
Body()(ProductsController.prototype, 'create', 0);
Put(':id')(ProductsController.prototype, 'update', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'update'));
Param('id')(ProductsController.prototype, 'update', 0);
Body()(ProductsController.prototype, 'update', 1);
Delete(':id')(ProductsController.prototype, 'remove', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'remove'));
Param('id')(ProductsController.prototype, 'remove', 0);
HttpCode(204)(ProductsController.prototype, 'remove', Object.getOwnPropertyDescriptor(ProductsController.prototype, 'remove'));

class CartsController {
  constructor(service) {
    this.service = service;
  }

  list() {
    return this.service.list('carts');
  }

  read(id) {
    return this.service.read('carts', id);
  }

  update(id, body) {
    return this.service.update('carts', id, body);
  }

  remove(id) {
    return this.service.remove('carts', id);
  }
}
Controller('api/carts')(CartsController);
Inject(FitcheckService)(CartsController, undefined, 0);
Get()(CartsController.prototype, 'list', Object.getOwnPropertyDescriptor(CartsController.prototype, 'list'));
Get(':id')(CartsController.prototype, 'read', Object.getOwnPropertyDescriptor(CartsController.prototype, 'read'));
Param('id')(CartsController.prototype, 'read', 0);
Put(':id')(CartsController.prototype, 'update', Object.getOwnPropertyDescriptor(CartsController.prototype, 'update'));
Param('id')(CartsController.prototype, 'update', 0);
Body()(CartsController.prototype, 'update', 1);
Delete(':id')(CartsController.prototype, 'remove', Object.getOwnPropertyDescriptor(CartsController.prototype, 'remove'));
Param('id')(CartsController.prototype, 'remove', 0);
HttpCode(204)(CartsController.prototype, 'remove', Object.getOwnPropertyDescriptor(CartsController.prototype, 'remove'));

class OrdersController {
  constructor(service) {
    this.service = service;
  }

  list() {
    return this.service.list('orders');
  }

  read(id) {
    return this.service.read('orders', id);
  }

  create(body) {
    return this.service.create('orders', body);
  }
}
Controller('api/orders')(OrdersController);
Inject(FitcheckService)(OrdersController, undefined, 0);
Get()(OrdersController.prototype, 'list', Object.getOwnPropertyDescriptor(OrdersController.prototype, 'list'));
Get(':id')(OrdersController.prototype, 'read', Object.getOwnPropertyDescriptor(OrdersController.prototype, 'read'));
Param('id')(OrdersController.prototype, 'read', 0);
Post()(OrdersController.prototype, 'create', Object.getOwnPropertyDescriptor(OrdersController.prototype, 'create'));
Body()(OrdersController.prototype, 'create', 0);

class ReviewsController {
  constructor(service) {
    this.service = service;
  }

  list() {
    return this.service.list('reviews');
  }

  read(id) {
    return this.service.read('reviews', id);
  }

  create(body) {
    return this.service.create('reviews', body);
  }

  update(id, body) {
    return this.service.update('reviews', id, body);
  }

  remove(id) {
    return this.service.remove('reviews', id);
  }
}
Controller('api/reviews')(ReviewsController);
Inject(FitcheckService)(ReviewsController, undefined, 0);
Get()(ReviewsController.prototype, 'list', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'list'));
Get(':id')(ReviewsController.prototype, 'read', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'read'));
Param('id')(ReviewsController.prototype, 'read', 0);
Post()(ReviewsController.prototype, 'create', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'create'));
Body()(ReviewsController.prototype, 'create', 0);
Put(':id')(ReviewsController.prototype, 'update', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'update'));
Param('id')(ReviewsController.prototype, 'update', 0);
Body()(ReviewsController.prototype, 'update', 1);
Delete(':id')(ReviewsController.prototype, 'remove', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'remove'));
Param('id')(ReviewsController.prototype, 'remove', 0);
HttpCode(204)(ReviewsController.prototype, 'remove', Object.getOwnPropertyDescriptor(ReviewsController.prototype, 'remove'));

module.exports = { ProductsController, CartsController, OrdersController, ReviewsController };
