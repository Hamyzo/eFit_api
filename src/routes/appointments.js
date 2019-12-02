/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const Appointments = require("../models/appointments");
const { NotFound, BadRequest } = require("../utils/Errors");
const { sendCreated, sendOk, sendPayload } = require("../utils/Responses");

const router = express.Router();

/**
 * VARIABLES
 */
const endpointName = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 * paths:
 *   /appointments:
 *     get:
 *       description: Get all appointments.
 *       operationId: getAppointments
 *       summary: Get all appointments.
 *       tags:
 *         - appointments
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Appointment'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const appointments = await Appointments.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, appointments);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /appointments/{id}:
 *     get:
 *       description: Get a appointment information corresponding to a specific ID.
 *       operationId: getAppointment
 *       summary: Get a specific appointment information.
 *       tags:
 *         - appointments
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the appointment.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Appointment'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const appointment = await Appointments.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!appointment) {
      return next(new NotFound(`Appointment #${id} could not be found.`));
    }
    return sendPayload(res, appointment, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /appointments:
 *     post:
 *       description: Register a new appointment to the database.
 *       operationId: createAppointment
 *       summary: Create a new appointment.
 *       tags:
 *         - appointments
 *       requestBody:
 *         description: Appointment information needed in order to create an appointment.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Appointment'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newAppointment = new Appointments(req.body);
  const err = newAppointment.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const appointment = await newAppointment.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${appointment.id}`
    });

    return sendCreated(res, "Appointment successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /appointments/{id}:
 *     patch:
 *       description: Update an appointment to the database.
 *       operationId: patchAppointment
 *       summary: Update an appointment.
 *       tags:
 *         - appointments
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the appointment.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Appointment information needed in order to update a appointment. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Appointment'
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/OK'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 *         '404':
 *          $ref: '#/components/responses/NotFound'
 */
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  Appointments.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Appointment #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /appointments/{id}:
 *     delete:
 *       description: Delete an appointment thanks to a specific ID.
 *       operationId: deleteAppointment
 *       summary: Delete a specific appointment.
 *       tags:
 *         - appointments
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the appointment.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/OK'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Appointments.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Appointment #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
