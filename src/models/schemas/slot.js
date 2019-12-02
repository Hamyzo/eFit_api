/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Slot:
 *       type: object
 *       required:
 *         - time_start
 *         - time_end
 *       properties:
 *         time_start:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         time_end:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 */

module.exports = new Schema({
  _id: false,
  time_start: {
    type: Date,
    required: true
  },
  time_end: {
    type: Date,
    required: true
  }
});
