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
 *                    $ref: '#/components/schemas/Conversation'
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
 *       description: Get a conversation information corresponding to a specific ID.
 *       operationId: getConversation
 *       summary: Get a specific conversation information.
 *       tags:
 *         - conversations
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the conversation.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Conversation'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const conversation = await Conversations.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!conversation) {
      return next(new NotFound(`Conversation #${id} could not be found.`));
    }
    return sendPayload(res, conversation, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /conversations:
 *     post:
 *       description: Register a new conversation to the database.
 *       operationId: createConversation
 *       summary: Create a new conversation.
 *       tags:
 *         - conversations
 *       requestBody:
 *         description: Conversation information needed in order to create an conversation.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Conversation'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newConversation = new Conversations(req.body);
  const err = newConversation.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const conversation = await newConversation.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${conversation.id}`
    });

    return sendCreated(res, "Conversation successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /conversations/{id}:
 *     patch:
 *       description: Update an conversation to the database.
 *       operationId: patchConversation
 *       summary: Update an conversation.
 *       tags:
 *         - conversations
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the conversation.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Conversation information needed in order to update a conversation. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Conversation'
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
        return next(new NotFound(`Conversation #${id} could not be found.`));
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
 *       description: Delete an conversation thanks to a specific ID.
 *       operationId: deleteConversation
 *       summary: Delete a specific conversation.
 *       tags:
 *         - conversations
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the conversation.
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
      return next(new NotFound(`Conversation #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
