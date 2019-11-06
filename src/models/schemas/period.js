/**
 * PACKAGES
 */
const { Schema } = require("mongoose");
const Result = require("./result");

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
 *         results:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Result'
 */

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
  nb_repetitions: {
    type: Number,
    required: true
  },
  nb_days: {
    type: Number,
    required: true
  },
  results: [
    [
      {
        type: Result
      }
    ]
  ]
});
