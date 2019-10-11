/**
 * PACKAGES
 */
const { UnsupportedMediaType } = require('./Errors');
const checkSecurity = require('./security');


module.exports = (req, res, next) => {
  res.setHeader('Accept', 'application/json; charset=utf-8');

  if (req.method === 'PATCH' || req.method === 'POST') {
    // Content-Type validation.
    if (req.get('Content-Type') !== 'application/json') {
      return next(new UnsupportedMediaType());
    }
  }
  return checkSecurity(req, res, next);
};
