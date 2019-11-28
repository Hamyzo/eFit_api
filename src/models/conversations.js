/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Message = require("./schemas/message");

const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - customer
 *         - coach
 *         - creation date
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         coach:
 *           type: string
 *           example: id111111111111111111111111
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *         creation_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         updated_date:
 *           type: string
 *           format: date-time
 *           example: 2019-12-15T20:20:20Z
 *
 */

const ConversationSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coaches",
    required: true
  },
  messages: [
    {
      type: Message
    }
  ],
  creation_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  updated_date: {
    type: Date
  }
});

ConversationSchema.plugin(uniqueValidator);

const Conversations = mongoose.model(filename, ConversationSchema);

module.exports = Conversations;
