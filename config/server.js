/**
 * PACKAGES
 */
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const queryHandler = require('express-api-queryhandler');
const cors = require('cors');
const swaggerStats = require('swagger-stats');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const logger = require('../src/utils/logger');
const config = require('./config');
const personal = require('./personal');
const routes = require('../src/routes/index');
const middleware = require('../src/utils/request-middleware');
const configSwagger = require('./swagger');
const handleErrorType = require('../src/utils/handle-errors-type');
const { NotFound } = require('../src/utils/Errors');

if (process.env.NODE_ENV === 'prod') {
  global.api_url = `${config.prod_api_url}:${personal.port_https}`;
} else if (process.env.NODE_ENV === 'dev') {
  global.api_url = `${config.dev_api_url}:${personal.port_http}`;
} else {
  global.api_url = `http://localhost:${personal.port_http}`;
}

/**
 * VARIABLES
 */
const app = express();
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'eFit API',
      version: '0.1.0'
    },
    basePath: '/',
    host: global.api_url
  },
  produces: ['application/json'],
  consumes: ['application/json'],
  apis: ['src/utils/Errors.js', 'src/utils/Responses.js', 'src/routes/*.js', 'src/models/*.js']
};
const swaggerSpec = swaggerJSDoc(options);

configSwagger.onAuthenticate = (req, username, password) =>
  username === configSwagger.username && password === configSwagger.password;

module.exports = callback => {
  app.use('*', cors());
  app.use(swaggerStats.getMiddleware(configSwagger));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: config.request_body_max_size }));
  app.use(queryHandler.sort());
  app.use(queryHandler.fields());
  app.use(queryHandler.filter());
  //app.use(middleware);

  routes(app);
  app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Default response
  app.use((req, res, next) => next(new NotFound(`url: '${req.originalUrl}' not found.`)));

  // Error handler
  app.use((err, req, res, next) => {
    const error = handleErrorType(err);
    logger.error(error);
    if (error.message[0] === '\t') {
      // Delete incomprehensible '\t' first character.
      error.message = error.message.substr(1);
    }
    res.status(error.statusCode || 500).send({
      error: {
        status_code: error.statusCode || 500,
        name: error.name,
        message: error.message,
        description: error.description
      }
    });
    next();
  });

  http.createServer(app).listen(config.port_http);
  logger.info(`[SERVER]: Listening on ${global.api_url}.`);

  if (callback) {
    return callback();
  }
  return true;
};

