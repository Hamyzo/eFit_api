/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const express = require("express");
const aqp = require("api-query-params");
const CustomerPrograms = require("../models/customerPrograms");
const Customers = require("../models/customers");
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
 *   /customerPrograms:
 *     get:
 *       description: Get all customerPrograms.
 *       operationId: getCustomerPrograms
 *       summary: Get all customerPrograms.
 *       tags:
 *         - customerPrograms
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CustomerProgram'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const customerPrograms = await CustomerPrograms.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, customerPrograms);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customerPrograms/{id}:
 *     get:
 *       description: Get a customerProgram information corresponding to a specific ID.
 *       operationId: getCustomerProgram
 *       summary: Get a specific customerProgram information.
 *       tags:
 *         - customerPrograms
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customerProgram.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CustomerProgram'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);
  const { id } = req.params;

  try {
    const customerProgram = await CustomerPrograms.findOne({ _id: id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .populate("sessions.exercises.exercise")
      .populate("sessions.periods.results.exercise.exercise");

    if (!customerProgram) {
      return next(new NotFound(`CustomerProgram #${id} could not be found.`));
    }
    return sendPayload(res, customerProgram, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customerPrograms:
 *     post:
 *       description: Register a new customerProgram to the database.
 *       operationId: createCustomerProgram
 *       summary: Create a new customerProgram.
 *       tags:
 *         - customerPrograms
 *       requestBody:
 *         description: CustomerProgram information needed in order to create an customerProgram.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/CustomerProgram'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newCustomerProgram = new CustomerPrograms(req.body);
  const err = newCustomerProgram.validateSync();

  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const customerProgram = await newCustomerProgram.save();

    Customers.updateOne(
      { _id: customerProgram.customer },
      { current_program: customerProgram.id },
      { runValidators: true },
      (err, result) => {
        if (err) {
          return next(err);
        }
        if (result.nModified === 0) {
          return next(
            new NotFound(
              `Customer #${customerProgram.customer} could not be found.`
            )
          );
        }
        res.set({
          Location: `${global.api_url}/${endpointName}/${customerProgram.id}`
        });
        return sendCreated(
          res,
          "CustomerProgram successfully created and assigned to customer."
        );
      }
    );
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customerPrograms/{id}:
 *     patch:
 *       description: Update an customerProgram to the database.
 *       operationId: patchCustomerProgram
 *       summary: Update an customerProgram.
 *       tags:
 *         - customerPrograms
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customerProgram.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: CustomerProgram information needed in order to update a customerProgram. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/CustomerProgram'
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
  CustomerPrograms.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`CustomerProgram #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /customerPrograms/{id}:
 *     delete:
 *       description: Delete an customerProgram thanks to a specific ID.
 *       operationId: deleteCustomerProgram
 *       summary: Delete a specific customerProgram.
 *       tags:
 *         - customerPrograms
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customerProgram.
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

  CustomerPrograms.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`CustomerProgram #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

module.exports = router;
