/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const filename = __filename.slice(__dirname.length + 1, -3);

const NotificationTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

NotificationTypeSchema.plugin(uniqueValidator);

const NotificationTypes = mongoose.model(filename, NotificationTypeSchema);

module.exports = NotificationTypes;
