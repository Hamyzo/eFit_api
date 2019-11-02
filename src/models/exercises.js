/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Period = require("./schemas/period");

const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Push ups
 *         description:
 *           type: text
 *           example: A description of how to do the push ups
 *         image:
 *           type: string
 *           example: https://greatist.com/sites/default/files/7MinuteWorkout_May_Feat.jpg
 */

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  img: {
    type: String,
    default:
      "https://greatist.com/sites/default/files/7MinuteWorkout_May_Feat.jpg"
  }
});

ExerciseSchema.plugin(uniqueValidator);

const Exercises = mongoose.model(filename, ExerciseSchema);

module.exports = Exercises;
