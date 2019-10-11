/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const TestLaurent = require("../models/testlaurent");
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
 *   /testlaurent:
 *     get:
 *       description: Get all testlaurent.
 *       operationId: getUsers
 *       summary: Get all testlaurent.
 *       tags:
 *         - testlaurent
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
    console.log("finding test laurent");

    const testlaurent = await TestLaurent.find();

    console.log(testlaurent);
    return sendPayload(res, testlaurent);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
