/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const Exercises = require("../models/exercises");
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
 *   /exercises:
 *     get:
 *       description: Get all exercises.
 *       operationId: getExercises
 *       summary: Get all exercises.
 *       tags:
 *         - exercises
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Exercise'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const exercises = await Exercises.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, exercises);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /exercises/{id}:
 *     get:
 *       description: Get a exercise information corresponding to a specific ID.
 *       operationId: getExercise
 *       summary: Get a specific exercise information.
 *       tags:
 *         - exercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the exercise.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Exercise'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const exercise = await Exercises.findOne({ _id: id }, "-password");

    if (!exercise) {
      return next(new NotFound(`Exercise #${id} could not be found.`));
    }
    return sendPayload(res, exercise, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /exercises:
 *     post:
 *       description: Register a new exercise to the database.
 *       operationId: createExercise
 *       summary: Create a new exercise.
 *       tags:
 *         - exercises
 *       requestBody:
 *         description: Exercise information needed in order to create an exercise.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Exercise'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newExercise = new Exercises(req.body);
  const err = newExercise.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const exercise = await newExercise.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${exercise.id}`
    });

    return sendCreated(res, "Exercise successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /exercises/{id}:
 *     patch:
 *       description: Update an exercise to the database.
 *       operationId: patchExercise
 *       summary: Update an exercise.
 *       tags:
 *         - exercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the exercise.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Exercise information needed in order to update a exercise. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Exercise'
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
  Exercises.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Exercise #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /exercises/{id}:
 *     delete:
 *       description: Delete an exercise thanks to a specific ID.
 *       operationId: deleteExercise
 *       summary: Delete a specific exercise.
 *       tags:
 *         - exercises
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the exercise.
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

  Exercises.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Exercise #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
