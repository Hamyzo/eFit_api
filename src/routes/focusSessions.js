/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const FocusSessions = require("../models/focusSessions");
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
 *   /focusSessions:
 *     get:
 *       description: Get all focusSessions.
 *       operationId: getFocusSessions
 *       summary: Get all focusSessions.
 *       tags:
 *         - focusSessions
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/FocusSession'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const focusSessions = await FocusSessions.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, focusSessions);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusSessions/{id}:
 *     get:
 *       description: Get a focusSession information corresponding to a specific ID.
 *       operationId: getFocusSession
 *       summary: Get a specific focusSession information.
 *       tags:
 *         - focusSessions
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
 *                 $ref: '#/components/schemas/FocusSession'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const focusSession = await FocusSessions.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!focusSession) {
      return next(new NotFound(`FocusSession #${id} could not be found.`));
    }
    return sendPayload(res, focusSession, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusSessions:
 *     post:
 *       description: Register a new focusSession to the database.
 *       operationId: createFocusSession
 *       summary: Create a new focusSession.
 *       tags:
 *         - focusSessions
 *       requestBody:
 *         description: FocusSession information needed in order to create an focusSession.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/FocusSession'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newFocusSession = new FocusSessions(req.body);
  const err = newFocusSession.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const focusSession = await newFocusSession.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${focusSession.id}`
    });

    return sendCreated(res, "FocusSession successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusSessions/{id}:
 *     patch:
 *       description: Update an focusSession to the database.
 *       operationId: patchFocusSession
 *       summary: Update an focusSession.
 *       tags:
 *         - focusSessions
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the focusSession.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: FocusSession information needed in order to update a focusSession. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/FocusSession'
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
  FocusSessions.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`FocusSession #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /focusSessions/{id}:
 *     delete:
 *       description: Delete an focusSession thanks to a specific ID.
 *       operationId: deleteFocusSession
 *       summary: Delete a specific focusSession.
 *       tags:
 *         - focusSessions
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
 *           $ref: '#/components/responses/OK'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  FocusSessions.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`FocusSession #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
