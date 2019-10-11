/**
 * PACKAGES
 */
const mongoose = require('mongoose')
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const { Unauthorized } = require('../utils/Errors');
const config = require('../../config/config');

const Address = require('./schemas/address');

const filename = __filename.slice(__dirname.length + 1, -3);
// eslint-disable-next-line no-useless-escape
const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regExpPhone = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     TestLaurent:
 *       type: object
 *       required:
 *       - nom
 *       - prenom
 *       properties:
 *         prenom:
 *           type: string
 *           example: aaa
 *         nom:
 *           type: string
 *           example: bbb
 */

const TestLaurentSchema = new Schema({
  prenom: {
    type: String
  },
  nom: {
    type: String
  }
});

TestLaurentSchema.plugin(uniqueValidator);

const TestLaurents = mongoose.model(filename, TestLaurentSchema);

module.exports = TestLaurents;
