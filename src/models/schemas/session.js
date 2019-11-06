/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Period = require("./period");
const Exercise = require("./exercise");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - name
 *         - periods
 *         - exercises
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
 *             $ref: '#/components/schemas/Exercise'
 */

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
      type: Exercise
    }
  ]
});
