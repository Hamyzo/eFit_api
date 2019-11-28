/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const Conversations = require("../models/conversations");
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
 *   /conversations:
 *     get:
 *       description: Get all conversations.
 *       operationId: getConversations
 *       summary: Get all conversations.
 *       tags:
 *         - conversations
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Conversations'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const conversations = await Conversations.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, conversations);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /conversations/{id}:
 *     get:
 *       description: Get a notification information corresponding to a specific ID.
 *       operationId: getConversations
 *       summary: Get a specific notification information.
 *       tags:
 *         - conversations
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
 *                 $ref: '#/components/schemas/Conversations'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const notification = await Conversations.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!notification) {
      return next(new NotFound(`Conversations #${id} could not be found.`));
    }
    return sendPayload(res, notification, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /conversations:
 *     post:
 *       description: Register a new notification to the database.
 *       operationId: createConversations
 *       summary: Create a new notification.
 *       tags:
 *         - conversations
 *       requestBody:
 *         description: Conversations information needed in order to create an notification.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Conversations'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newConversations = new Conversations(req.body);
  const err = newConversations.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const notification = await newConversations.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${notification.id}`
    });

    return sendCreated(res, "Conversations successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /conversations/{id}:
 *     patch:
 *       description: Update a notification to the database.
 *       operationId: patchConversations
 *       summary: Update a notification.
 *       tags:
 *         - conversations
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the notification.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Conversations information needed in order to update a notification. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Conversations'
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
  Conversations.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Conversations #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /conversations/{id}:
 *     delete:
 *       description: Delete a Conversations thanks to a specific ID.
 *       operationId: deleteConversations
 *       summary: Delete a specific notification.
 *       tags:
 *         - conversations
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

  Conversations.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Conversations #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
