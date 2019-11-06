/**
 * PACKAGES
 */
const { Schema } = require("mongoose");
const mongoose = require("mongoose");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - exercise
 *         - reps
 *         - sets
 *       properties:
 *         exercise:
 *           type: string
 *           example: id111111111111111111111111
 *         reps:
 *           type: integer
 *           format: int64
 *           example: 15
 *         sets:
 *           type: integer
 *           format: int64
 *           example: 3
 */

module.exports = new Schema({
  _id: false,
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exercises"
  },
  reps: {
    type: Number
  },
  sets: {
    type: Number
  }
});
