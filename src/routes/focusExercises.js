/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const FocusExercises = require("../models/focusExercises");
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
 *   /focusExercises:
 *     get:
 *       description: Get all focusExercises.
 *       operationId: getFocusExercises
 *       summary: Get all focusExercises.
 *       tags:
 *         - focusExercises
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/FocusExercise'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const focusExercises = await FocusExercises.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, focusExercises);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusExercises/{id}:
 *     get:
 *       description: Get a focusExercise information corresponding to a specific ID.
 *       operationId: getFocusExercise
 *       summary: Get a specific focusExercise information.
 *       tags:
 *         - focusExercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the focusExercise.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FocusExercise'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const focusExercise = await FocusExercises.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!focusExercise) {
      return next(new NotFound(`FocusExercise #${id} could not be found.`));
    }
    return sendPayload(res, focusExercise, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusExercises:
 *     post:
 *       description: Register a new focusExercise to the database.
 *       operationId: createFocusExercise
 *       summary: Create a new focusExercise.
 *       tags:
 *         - focusExercises
 *       requestBody:
 *         description: FocusExercise information needed in order to create an focusExercise.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/FocusExercise'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newFocusExercise = new FocusExercises(req.body);
  const err = newFocusExercise.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const focusExercise = await newFocusExercise.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${focusExercise.id}`
    });

    return sendCreated(res, "FocusExercise successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /focusExercises/{id}:
 *     patch:
 *       description: Update an focusExercise to the database.
 *       operationId: patchFocusExercise
 *       summary: Update an focusExercise.
 *       tags:
 *         - focusExercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the focusExercise.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: FocusExercise information needed in order to update a focusExercise. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/FocusExercise'
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
  FocusExercises.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`FocusExercise #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /focusExercises/{id}:
 *     delete:
 *       description: Delete an focusExercise thanks to a specific ID.
 *       operationId: deleteFocusExercise
 *       summary: Delete a specific focusExercise.
 *       tags:
 *         - focusExercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the focusExercise.
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

  FocusExercises.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`FocusExercise #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
