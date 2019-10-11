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
 *         -
 *       properties:
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
