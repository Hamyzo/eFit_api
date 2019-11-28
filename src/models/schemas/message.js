/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *         - creation_date
 *       properties:
 *         sender:
 *           type: string
 *           example: CUSTOMER
 *         content:
 *           type: string
 *           example: Hey Coach how are you ?
 *         seen:
 *           type: boolean
 *           example: false
 *         creation_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 */

module.exports = new Schema({
  _id: false,
  sender: {
    type: String,
    required: true,
    enum: ["COACH", "CUSTOMER"]
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
  }
});
