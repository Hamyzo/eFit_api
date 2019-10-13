/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Session = require("./schemas/session");

const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     CustomerProgram:
 *       type: object
 *       required:
 *         - customer
 *         - program
 *         - sessions
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         program:
 *           type: string
 *           example: id111111111111111111111111
 *         sessions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Session'
 *         creation_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *
 */

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

const CustomerProgramSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "programs"
  },
  sessions: [
    {
      type: Session
    }
  ],
  creation_date: {
    type: Date,
    default: Date.now()
  }
});

CustomerProgramSchema.plugin(uniqueValidator);

const CustomerPrograms = mongoose.model(filename, CustomerProgramSchema);

module.exports = CustomerPrograms;