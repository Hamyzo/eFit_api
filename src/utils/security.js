/*
 * PACKAGES
 */


const jwt = require('jsonwebtoken');
const { Unauthorized } = require('./Errors');
const config = require('../../config/config');

const verifyToken = (token, callback) => {
  if (!token) {
    return callback(new Unauthorized('Token must be provided.'));
  }
  return jwt.verify(token, config.sha256, (err, decoded) => {
    if (err) {
      return callback(err);
    }
    return callback(null, decoded);
  });
};

const isRoutesWithoutToken = req => {
  for (const route of config.routes_without_token) {
    if (req.path.includes(route.path)) {
      if (!route.methods) {
        return true;
      }
      for (const method of route.methods.split(' ')) {
        if (method === req.method) {
          return true;
        }
      }
    }
  }
  return false;
};

const checkToken = (req, callback) => {
  if (isRoutesWithoutToken(req)) {
    return callback();
  }
  if (req.headers && req.headers.authorization) {
    // Get Bearer token
    const parts = req.headers.authorization.split(' ');
    let token = null;

    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
    return verifyToken(token, (err, decoded) => {
      if (err) {
        return callback(err);
      }
      req.decoded_token = decoded;
      return callback();
    });
  }
  return callback(new Unauthorized('Token must be provided.'));
};

module.exports = (req, res, next) => {
  checkToken(req, err => {
    if (err) {
      return next(err);
    }
    return true;
  });
  return next();
};
