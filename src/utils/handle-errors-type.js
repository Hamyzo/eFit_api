/**
 * PACKAGES
 */
const { BadRequest } = require('./Errors');


module.exports = err => {
  switch (err.name) {
    case 'ValidationError':
      return new BadRequest(err.message);
    default:
      return err;
  }
};
