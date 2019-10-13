/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const aqp = require("api-query-params");
const Coaches = require("../models/coaches");
const { NotFound, BadRequest } = require("../utils/Errors");
const { sendCreated, sendOk, sendPayload } = require("../utils/Responses");
const config = require("../../config/config");

const router = express.Router();

/**
 * VARIABLES
 */
const endpointName = __filename.slice(__dirname.length + 1, -3);

/**
 * @swagger
 * paths:
 *   /coaches:
 *     get:
 *       description: Get all coaches.
 *       operationId: getCoaches
 *       summary: Get all coaches.
 *       tags:
 *         - coaches
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Coach'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const coaches = await Coaches.find(filter, "-password")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, coaches);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /coaches/{id}:
 *     get:
 *       description: Get a coach information corresponding to a specific ID.
 *       operationId: getCoach
 *       summary: Get a specific coach information.
 *       tags:
 *         - coaches
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the coach.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Coach'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const coach = await Coaches.findOne({ _id: id }, "-password")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    if (!coach) {
      return next(new NotFound(`Coach #${id} could not be found.`));
    }
    return sendPayload(res, coach, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /coaches:
 *     post:
 *       description: Register a new coach to the database.
 *       operationId: createCoach
 *       summary: Create a new coach.
 *       tags:
 *         - coaches
 *       requestBody:
 *         description: Coach information needed in order to create an coach.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Coach'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newCoach = new Coaches(req.body);
  const err = newCoach.validateSync();

  console.log("in post with:", req.body);
  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const coach = await newCoach.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${coach.id}`
    });

    return sendCreated(res, "Coach successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /coaches/{id}:
 *     patch:
 *       description: Update an coach to the database.
 *       operationId: patchCoach
 *       summary: Update an coach.
 *       tags:
 *         - coaches
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the coach.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Coach information needed in order to update a coach. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Coach'
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
  Coaches.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Coach #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /coaches/{id}:
 *     delete:
 *       description: Delete an coach thanks to a specific ID.
 *       operationId: deleteCoach
 *       summary: Delete a specific coach.
 *       tags:
 *         - coaches
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the coach.
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

  Coaches.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Coach #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

/**
 * @swagger
 * paths:
 *   /coaches/changePassword/{id}:
 *     patch:
 *       description: Update an coach password to the database and hash it.
 *       operationId: patchCoachPassword
 *       summary: Update an coach password to the database and hash it.
 *       tags:
 *         - coaches
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the coach.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: A JSON containing the new password of the coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Coach'
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/OK'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 *         '404':
 *          $ref: '#/components/responses/NotFound'
 */
router.patch("/changePassword/:id", async (req, res, next) => {
  const { id } = req.params;

  console.log("Coach pwd patch");
  const { password } = req.body;
  bcrypt.hash(password, config.salt_rounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    req.body.password = hash;
    Coaches.updateOne(
      { _id: id },
      req.body,
      { runValidators: true },
      (innerErr, result) => {
        if (innerErr) {
          return next(innerErr);
        }
        if (result.nModified === 0) {
          return next(new NotFound(`Coach #${id} could not be found.`));
        }
        return sendOk(res);
      }
    );
  });
});

module.exports = router;
