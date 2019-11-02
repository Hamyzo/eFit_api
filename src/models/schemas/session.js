/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Period = require("./period");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Session 1
 *         description:
 *           type: text
 *           example: And introductory session, aimed to get the person at ease with the workouts
 *         periods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Period'
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               exercise:
 *                 type: string
 *                 example: id111111111111111111111111
 *               reps:
 *                 type: integer
 *                 format: int64
 *                 example: 10
 *               sets:
 *                 type: integer
 *                 format: int64
 *                 example: 10
 */

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Period:
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
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  periods: [
    {
      type: Period
    }
  ],
  exercises: [
    {
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
    }
  ]
});
