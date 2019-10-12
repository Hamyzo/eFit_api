/**
 * PACKAGES
 */
const { Schema } = require("mongoose");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     period:
 *       type: object
 *       required:
 *         - nb_repetitions
 *         - nb_days
 *       properties:
 *         nb_repetitions:
 *           type: integer
 *           format: int64
 *           example: 5
 *         nb_days:
 *           type: integer
 *           format: int64
 *           example: 14
 */

module.exports = new Schema({
  _id: false,
  nb_repetitions: {
    type: Number,
    required: true
  },
  nb_days: {
    type: Number,
    required: true
  }
});
