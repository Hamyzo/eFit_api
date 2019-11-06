/**
 * PACKAGES
 */
const { Schema } = require("mongoose");
const Exercise = require("./exercise");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Result:
 *       type: object
 *       required:
 *         - exercise
 *         - performance
 *       properties:
 *         exercise:
 *           type: string
 *           example: id111111111111111111111111
 *         performance:
 *           type: string
 *           example: Easy
 *         time:
 *           type: float
 *           example: 120
 */

module.exports = new Schema({
  _id: false,
  exercise: {
    type: Exercise
  },
  performance: {
    type: Number,
    enum: [-1, 0, 1],
    required: true
  },
  time: {
    type: Number
  }
});
