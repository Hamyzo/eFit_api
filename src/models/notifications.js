/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Notification:
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
 *         focus_sessions:
 *           type: array
 *           items:
 *             type: string
 *             example: id111111111111111111111111
 *         creation_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *
 */

const NotificationSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers"
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coaches"
  },
  sender: {
    type: String,
    required: true,
    enum: ["COACH", "CUSTOMER"]
  },
  type: {
    type: String,
    required: true,
    enum: ["REMINDER", "ALERT", "FOCUS_SESSION"]
  },
  content: {
    type: String
  },
  seen: {
    type: Boolean,
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now()
  },
  updated_date: {
    type: Date
  }
});

NotificationSchema.plugin(uniqueValidator);

const Notifications = mongoose.model(filename, NotificationSchema);

module.exports = Notifications;
