/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - customer
 *         - customerProgram
 *         - age
 *         - weight
 *         - weight_unit
 *         - rest_heart_rate
 *         - target_heart_rate
 *         - five_min_rest_hr
 *         - thirty_deflections_hr
 *         - one_min_elongated_hr
 *         - dickson_index
 *         - exercises
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         customerProgram:
 *           type: string
 *           example: id111111111111111111111111
 *         age:
 *           type: integer
 *           format: int64
 *           example: 30
 *         weight:
 *           type: integer
 *           format: int64
 *           example: 50
 *         weight_unit:
 *           type: string
 *           example: kg
 *         rest_heart_rate:
 *           type: integer
 *           format: int64
 *           example: 80
 *         target_heart_rate:
 *           type: integer
 *           format: int64
 *           example: 130
 *         five_min_rest_hr:
 *           type: integer
 *           format: int64
 *           example: 77
 *         thirty_deflections_hr:
 *           type: integer
 *           format: int64
 *           example: 88
 *         one_min_elongated_hr:
 *           type: integer
 *           format: int64
 *           example: 80
 *         dickson_index:
 *           type: float
 *           example: 2.4
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - exercise
 *             properties:
 *               exercise:
 *                 type: string
 *                 example: id111111111111111111111111
 *               time:
 *                 type: integer
 *                 format: int64
 *                 example: 120
 *               reps:
 *                 type: integer
 *                 format: int64
 *                 example: 35
 */

const FocusSessionSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  customerProgram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customerPrograms"
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  weight_unit: {
    type: String,
    enum: ["kg", "lbs"],
    required: true,
    default: "kg"
  },
  rest_heart_rate: {
    type: Number,
    required: true
  },
  target_heart_rate: {
    type: Number,
    required: true
  },
  five_min_rest_hr: {
    type: Number,
    required: true
  },
  thirty_deflections_hr: {
    type: Number,
    required: true
  },
  one_min_elongated_hr: {
    type: Number,
    required: true
  },
  dickson_index: {
    type: Number,
    required: true
  },
  exercises: [
    {
      _id: false,
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "focusExercises"
      },
      time: {
        type: Number
      },
      reps: {
        type: Number
      }
    }
  ]
});

FocusSessionSchema.plugin(uniqueValidator);

const FocusSessions = mongoose.model(filename, FocusSessionSchema);

module.exports = FocusSessions;
