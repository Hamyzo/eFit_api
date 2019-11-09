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
 *     Program:
 *       type: object
 *       required:
 *         - name
 *         - coach
 *         - sessions
 *       properties:
 *         name:
 *           type: string
 *           example: Dump bell program
 *         coach:
 *           type: string
 *           example: id111111111111111111111111
 *         description:
 *           type: text
 *           example: The program is about well being and fitness
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

const ProgramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coaches"
  },
  description: {
    type: String
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

ProgramSchema.plugin(uniqueValidator);

const Programs = mongoose.model(filename, ProgramSchema);

module.exports = Programs;
