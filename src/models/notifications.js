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
 *         - coach
 *         - sender
 *         - type
 *         - content
 *         - creation date
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         coach:
 *           type: string
 *           example: id111111111111111111111111
 *         sender:
 *           type: string
 *           example: CUSTOMER
 *         type:
 *           type: string
 *           example: REMINDER
 *         content:
 *           type: string
 *           example: Your focus session is coming soon
 *         seen:
 *           type: boolean
 *           example: false
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

const NotificationSchema = new Schema({
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
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  creation_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  updated_date: {
    type: Date
  }
});

NotificationSchema.plugin(uniqueValidator);

const Notifications = mongoose.model(filename, NotificationSchema);

module.exports = Notifications;
