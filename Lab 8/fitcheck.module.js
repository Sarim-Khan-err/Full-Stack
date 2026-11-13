require('reflect-metadata');
const { Module } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { join } = require('node:path');
const { ProductsController, CartsController, OrdersController, ReviewsController } = require('./fitcheck.controller');
const { FitcheckService } = require('./fitcheck.service');

const storefront = join(__dirname, '..', 'Lab 7 Part 2');

class FitcheckModule {
  static register(file) {
    return {
      module: FitcheckModule,
      controllers: [ProductsController, CartsController, OrdersController, ReviewsController],
      providers: [{ provide: FitcheckService, useFactory: () => new FitcheckService(file) }]
    };
  }
}
Module({})(FitcheckModule);

async function createApp(file) {
  const app = await NestFactory.create(FitcheckModule.register(file), { logger: false });
  app.useStaticAssets(join(storefront, 'vendor'), { prefix: '/vendor' });
  app.useStaticAssets(join(storefront, 'assets'), { prefix: '/assets' });
  const express = app.getHttpAdapter().getInstance();
  express.get(['/', '/FITCHECK.html'], (_request, response) => {
    response.sendFile(join(storefront, 'FITCHECK.html'));
  });
  return app;
}

if (require.main === module) {
  createApp()
    .then(app => app.listen(3005, '127.0.0.1'))
    .then(() => console.log('Fitcheck: http://localhost:3005'))
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = { FitcheckModule, createApp };
