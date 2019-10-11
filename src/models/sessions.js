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
 *     Session:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *       name:
 *           type: string
 *           example: Day1
 *       description:
 *           type: text
 *           example: The session contains these exercises
 *
 */

const SessionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    repetitions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'repetitions'
        }
    ],
});

SessionSchema.plugin(uniqueValidator);

const Sessions = mongoose.model(filename, SessionSchema);

module.exports = Sessions;
