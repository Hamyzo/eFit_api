/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const Users = require("../models/users");
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
 *   /users:
 *     get:
 *       description: Get all users.
 *       operationId: getUsers
 *       summary: Get all users.
 *       tags:
 *         - users
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 */
router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find({}, "-password");

    return sendPayload(res, users);
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     get:
 *       description: Get a user information corresponding to a specific ID.
 *       operationId: getUser
 *       summary: Get a specific user information.
 *       tags:
 *         - users
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the user.
 *           schema:
 *             type: string
 *
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await Users.findOne({ _id: id }, "-password");

    if (!user) {
      return next(new NotFound(`User #${id} could not be found.`));
    }
    return sendPayload(res, user, 200);
  } catch (error) {
    return next(error);
  }
});


/**
 * @swagger
 * paths:
 *   /users:
 *     post:
 *       description: Register a new user to the database.
 *       operationId: createUser
 *       summary: Create a new user.
 *       tags:
 *         - users
 *       requestBody:
 *         description: User information needed in order to create an user.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/User'
 *       responses:
 *         '201':
 *           $ref: '#/components/responses/Created'
 *         '400':
 *           $ref: '#/components/responses/BadRequest'
 */
router.post("/", async (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  req.body._id = mongoose.Types.ObjectId(req.body._id);
  const newUser = new Users(req.body);
  const err = newUser.validateSync();

  console.log("in post with:", req.body);
  if (err !== undefined) {
    return next(new BadRequest(err.errors));
  }

  try {
    const user = await newUser.save();

    res.set({
      Location: `${global.api_url}/${endpointName}/${user.id}`
    });

    return sendCreated(res, "User successfully created.");
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     patch:
 *       description: Update an user to the database.
 *       operationId: patchUser
 *       summary: Update an user.
 *       tags:
 *         - users
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the user.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: User information needed in order to update a user. Just fields witch need to be updated are required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/User'
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
  Users.updateOne(
    { _id: id },
    req.body,
    { runValidators: true },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        return next(new NotFound(`User #${id} could not be found.`));
      }
      return sendOk(res);
    }
  );
});

/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     delete:
 *       description: Delete an user thanks to a specific ID.
 *       operationId: deleteUser
 *       summary: Delete a specific user.
 *       tags:
 *         - users
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the user.
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

  Users.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.n === 0) {
      return next(new NotFound(`User #${id} could not be found.`));
    }
    return sendOk(res);
  });
});

/**
 * @swagger
 * paths:
 *   /users/changePassword/{id}:
 *     patch:
 *       description: Update an user password to the database and hash it.
 *       operationId: patchUserPassword
 *       summary: Update an user password to the database and hash it.
 *       tags:
 *         - users
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The MongoDB ID of the user.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: A JSON containing the new password of the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/User'
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

  console.log("User pwd patch");
  const { password } = req.body;
  bcrypt.hash(password, config.salt_rounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    req.body.password = hash;
    Users.updateOne(
      { _id: id },
      req.body,
      { runValidators: true },
      (innerErr, result) => {
        if (innerErr) {
          return next(innerErr);
        }
        if (result.nModified === 0) {
          return next(new NotFound(`User #${id} could not be found.`));
        }
        return sendOk(res);
      }
    );
  });
});

module.exports = router;
