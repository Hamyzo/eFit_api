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
 *         repetitions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *             results:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *             date:
 *               type: string
 *               format: date-time
 *               example: 2019-10-15T20:20:20Z
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
  repetitions: [
    {
      results: [
        {
          type: Result
        }
      ],
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  results: [
    [
      {
        type: Result
      }
    ]
  ]
});
