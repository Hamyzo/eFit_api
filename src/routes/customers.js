/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const aqp = require("api-query-params");
const Customers = require("../models/customers");
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
 *   /customers:
 *     get:
 *       description: Get all customers.
 *       operationId: getCustomers
 *       summary: Get all customers.
 *       tags:
 *         - customers
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Customer'
 */
router.get("/", async (req, res, next) => {
  try {
    const { filter, skip, limit, sort, projection, population } = aqp(
      req.query
    );
    const customers = await Customers.find(filter, "-password")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population);

    return sendPayload(res, customers);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customers/{id}:
 *     get:
 *       description: Get a customer information corresponding to a specific ID.
 *       operationId: getCustomer
 *       summary: Get a specific customer information.
 *       tags:
 *         - customers
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customer.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Customer'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const customer = await Customers.findOne({ _id: id }, "-password");

    if (!customer) {
      return next(new NotFound(`Customer #${id} could not be found.`));
    }
    return sendPayload(res, customer, 200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customers:
 *     post:
 *       description: Register a new customer to the database.
 *       operationId: createCustomer
 *       summary: Create a new customer.
 *       tags:
 *         - customers
 *       requestBody:
 *         description: Customer information needed in order to create an customer.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Customer'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newCustomer = new Customers(req.body);
  const err = newCustomer.validateSync();

  console.log("in post with:", req.body);
  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const customer = await newCustomer.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${customer.id}`
    });

    return sendCreated(res, "Customer successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /customers/{id}:
 *     patch:
 *       description: Update an customer to the database.
 *       operationId: patchCustomer
 *       summary: Update an customer.
 *       tags:
 *         - customers
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customer.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Customer information needed in order to update a customer. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Customer'
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
  Customers.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`Customer #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /customers/{id}:
 *     delete:
 *       description: Delete an customer thanks to a specific ID.
 *       operationId: deleteCustomer
 *       summary: Delete a specific customer.
 *       tags:
 *         - customers
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customer.
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

  Customers.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`Customer #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

/**
 * @swagger
 * paths:
 *   /customers/changePassword/{id}:
 *     patch:
 *       description: Update an customer password to the database and hash it.
 *       operationId: patchCustomerPassword
 *       summary: Update an customer password to the database and hash it.
 *       tags:
 *         - customers
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the customer.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: A JSON containing the new password of the customer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Customer'
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

  console.log("Customer pwd patch");
  const { password } = req.body;
  bcrypt.hash(password, config.salt_rounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    req.body.password = hash;
    Customers.updateOne(
      { _id: id },
      req.body,
      { runValidators: true },
      (innerErr, result) => {
        if (innerErr) {
          return next(innerErr);
        }
        if (result.nModified === 0) {
          return next(new NotFound(`Customer #${id} could not be found.`));
        }
        return sendOk(res);
      }
    );
  });
});

module.exports = router;
