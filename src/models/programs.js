/**
 * PACKAGES
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

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
 *       properties:
 *        name:
 *           type: string
 *           example: Dump bell program
 *        description:
 *           type: text
 *           example: The program is about well being and fit
 *
 */

const ProgramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sessions'
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
