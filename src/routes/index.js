/**
 * PACKAGES
 */
const express = require('express');
const routes = require('require-dir');
const { ObjectID } = require('mongodb');
const logger = require('../utils/logger');
const { BadRequest } = require('../utils/Errors');

const routesInit = (app) => {
  Object.keys(routes()).forEach(routeName => {
    const router = express.Router();

    // eslint-disable-next-line
    const route = require(`./${routeName}`);

    // eslint-disable-next-line
    app.use(`/${routeName}`, route);

    router.param('id', (req, res, next, id) => {
      if (!ObjectID.isValid(id)) {
        return next(new BadRequest(`${id} is not a valid ID.`));
      }
      return next();
    });
  });

  logger.info('[SERVER]: Routes initialized!');
};


module.exports = routesInit;
