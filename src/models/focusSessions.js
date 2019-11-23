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
 *     FocusSession:
 *       type: object
 *       required:
 *         - customer
 *         - customer_program
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
 *         - due_date
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         customer_program:
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
 *             type: string
 *             example: id111111111111111111111111
 *         results:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               time:
 *                 type: integer
 *                 format: int64
 *                 example: 120
 *               reps:
 *                 type: integer
 *                 format: int64
 *                 example: 35
 *         due_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         validation_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 */

const FocusSessionSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true
  },
  customer_program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customerPrograms",
    required: true
  },
  age: {
    type: Number
  },
  weight: {
    type: Number
  },
  weight_unit: {
    type: String,
    enum: ["kg", "lbs"],
    default: "kg"
  },
  rest_heart_rate: {
    type: Number
  },
  target_heart_rate: {
    type: Number
  },
  five_min_rest_hr: {
    type: Number
  },
  thirty_deflections_hr: {
    type: Number
  },
  one_min_elongated_hr: {
    type: Number
  },
  dickson_index: {
    type: Number
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "focusExercises"
    }
  ],
  results: [
    {
      _id: false,
      time: {
        type: Number
      },
      reps: {
        type: Number
      }
    }
  ],
  due_date: {
    type: Date,
    required: true
  },
  validation_date: {
    type: Date
  }
});

FocusSessionSchema.plugin(uniqueValidator);

const FocusSessions = mongoose.model(filename, FocusSessionSchema);

module.exports = FocusSessions;
