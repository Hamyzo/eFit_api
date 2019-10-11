/**
 * PACKAGES
 */
const { Schema } = require('mongoose');


/**
 * @swagger
 *
 * components:
 *   schemas:
 *     address:
 *       type: object
 *       required:
 *         - number
 *         - street
 *         - postcode
 *         - city
 *         - country
 *       properties:
 *         number:
 *           type: integer
 *           format: int64
 *           example: 123
 *         street:
 *           type: string
 *           example: Chemin de Ribaute
 *         additional:
 *           type: string
 *           example: 2ème étage
 *         postcode:
 *           type: int
 *           example: 31500
 *         city:
 *           type: string
 *           example: Toulouse
 *         state:
 *           type: string
 *           example: Occitanie
 *         country:
 *           type: string
 *           example: France
 */

module.exports = new Schema({
  _id: false,
  number: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  additional: {
    type: String
  },
  postcode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  state: {
    type: String
  },
  country: {
    type: String,
    required: true,
    default: 'France'
  }
});
