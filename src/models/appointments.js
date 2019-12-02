/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Slot = require("./schemas/slot");

const filename = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - customer
 *         - coach
 *         - subject
 *         - slot
 *       properties:
 *         customer:
 *           type: string
 *           example: id111111111111111111111111
 *         coach:
 *           type: string
 *           example: id111111111111111111111111
 *         subject:
 *           type: string
 *           example: The appointment's subject
 *         description:
 *           type: string
 *           example: The appointment's description
 *         notes:
 *           type: string
 *           example: Some optional notes, feedback, remarks...
 *         slot:
 *           $ref: '#/components/schemas/Slot'
 */

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Slot:
 *       type: object
 *       required:
 *         - time_start
 *         - time_end
 *       properties:
 *         time_start:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         time_end:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 */

const AppointmentSchema = new Schema({
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
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  notes: {
    type: String
  },
  slot: {
    type: Slot,
    required: true
  }
});

AppointmentSchema.plugin(uniqueValidator);

const Appointments = mongoose.model(filename, AppointmentSchema);

module.exports = Appointments;
