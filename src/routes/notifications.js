/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const Notifications = require("../models/notifications");
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
 *   /notifications:
 *     get:
 *       description: Get all notifications.
 *       operationId: getNotifications
 *       summary: Get all notifications.
 *       tags:
 *         - notifications
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Notification'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const notifications = await Notifications.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, notifications);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /notifications/{id}:
 *     get:
 *       description: Get a notification information corresponding to a specific ID.
 *       operationId: getNotification
 *       summary: Get a specific notification information.
 *       tags:
 *         - notifications
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the focusSession.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Notification'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const notification = await Notifications.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!notification) {
      return next(new NotFound(`Notification #${id} could not be found.`));
    }
    return sendPayload(res, notification, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /notifications:
 *     post:
 *       description: Register a new notification to the database.
 *       operationId: createNotification
 *       summary: Create a new notification.
 *       tags:
 *         - notifications
 *       requestBody:
 *         description: Notification information needed in order to create an notification.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Notification'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newNotification = new Notifications(req.body);
  const err = newNotification.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const notification = await newNotification.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${notification.id}`
    });

    return sendCreated(res, "Notification successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /notifications/{id}:
 *     patch:
 *       description: Update a notification to the database.
 *       operationId: patchNotification
 *       summary: Update a notification.
 *       tags:
 *         - notifications
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the notification.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Notification information needed in order to update a notification. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Notification'
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
  Notifications.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Notification #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /notifications/{id}:
 *     delete:
 *       description: Delete a Notification thanks to a specific ID.
 *       operationId: deleteNotification
 *       summary: Delete a specific notification.
 *       tags:
 *         - notifications
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the notification.
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

  Notifications.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Notification #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
