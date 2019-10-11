/**
 * PACKAGES
 */
const mongoose = require('mongoose');
const config = require('./config');

module.exports = callback => {
  mongoose.connect(config.database_url, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
  const db = mongoose.connection;

  db.on('error', err => {
    callback(err);
  });
  db.on('open', () => {
    callback();
  });
};
