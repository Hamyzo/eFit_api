/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const Programs = require("../models/programs");
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
 *   /programs:
 *     get:
 *       description: Get all programs.
 *       operationId: getPrograms
 *       summary: Get all programs.
 *       tags:
 *         - programs
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Program'
 */
router.get("/", async (req, res, next) => {
  try {
    const programs = await Programs.find({}, "-password");

    return sendPayload(res, programs);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /programs/{id}:
 *     get:
 *       description: Get a program information corresponding to a specific ID.
 *       operationId: getProgram
 *       summary: Get a specific program information.
 *       tags:
 *         - programs
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the program.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Program'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const program = await Programs.findOne({ _id: id }, "-password");

    if (!program) {
      return next(new NotFound(`Program #${id} could not be found.`));
    }
    return sendPayload(res, program, 200);
  } catch (error) {
    return next(error);
  }
});


/**
 * @swagger
 * paths:
 *   /programs:
 *     post:
 *       description: Register a new program to the database.
 *       operationId: createProgram
 *       summary: Create a new program.
 *       tags:
 *         - programs
 *       requestBody:
 *         description: Program information needed in order to create an program.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Program'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newProgram = new Programs(req.body);
  const err = newProgram.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const program = await newProgram.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${program.id}`
    });

    return sendCreated(res, "Program successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /programs/{id}:
 *     patch:
 *       description: Update an program to the database.
 *       operationId: patchProgram
 *       summary: Update an program.
 *       tags:
 *         - programs
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the program.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Program information needed in order to update a program. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Program'
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
  Programs.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Program #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /programs/{id}:
 *     delete:
 *       description: Delete an program thanks to a specific ID.
 *       operationId: deleteProgram
 *       summary: Delete a specific program.
 *       tags:
 *         - programs
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the program.
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

  Programs.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Program #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
