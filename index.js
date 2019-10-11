/**
 * PACKAGES
 */
const async = require('async');
const logger = require('./src/utils/logger');
const server = require('./config/server');
const database = require('./config/database');


async.series(
  [
    callback => {
      database(callback);
    },
    callback => {
      server(callback);
    }
  ],
  err => {
    if (err) {
      logger.error('[API]: Initialized FAILED!');
      logger.error(`[API]: error: ${err}`);
    } else {
      logger.info('[API]: Initialized SUCCESSFULLY!');
    }
  }
);
