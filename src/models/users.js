/**
 * PACKAGES
 */
const mongoose = require('mongoose');
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
 *     User:
 *       type: object
 *       required:
 *         - password
 *         - email
 *         - status
 *         - eula
 *         - role
 *         - registration_date
 *         - last_login_date
 *       properties:
 *         first_name:
 *           type: string
 *           example: Kikou
 *         last_name:
 *           type: string
 *           example: Légende
 *         password:
 *           type: string
 *           format: password
 *           example: 1234
 *         email:
 *           type: string
 *           example: kikou@gmail.com
 *         phone:
 *           type: string
 *           example: +33 6 12 34 56 78
 *         title:
 *           type: string
 *           example: None
 *         registration_date:
 *           type: string
 *           format: date-time
 *           example: 2017-07-21T17:32:28Z
 *         last_login_date:
 *           type: string
 *           format: date-time
 *           example: 2017-07-21T17:32:28Z
 *         img_url:
 *           type: string
 *           example: localhost/users_img/154sd121ds575sd7.jpg
 *         status:
 *           type: string
 *           example: PENDING
 *         address:
 *           $ref: '#/components/schemas/Address'
 */


/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - number
 *         - street
 *         - postcode
 *         - city
 *         - country
 *       properties:
 *         number:
 *           type: integer
 *           format: int64
 *           example: 123
 *         street:
 *           type: string
 *           example: Chemin de Ribaute
 *         additional:
 *           type: string
 *           example: 2ème étage
 *         postcode:
 *           type: int
 *           example: 31500
 *         city:
 *           type: string
 *           example: Toulouse
 *         state:
 *           type: string
 *           example: Occitanie
 *         country:
 *           type: string
 *           example: France
 */

const UserSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    match: regExpEmail,
    required: true,
    unique: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  title: {
    type: String,
    enum: ['M.', 'Ms.', ''],
    default: ''
  },
  img_url: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACTIVE', 'DISABLED'],
    default: 'PENDING'
  },
  registration_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  last_login_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  address: {
    type: Address
  }
});

UserSchema.pre('save', function(next) {
  // Hash user password before saving data in database.
  bcrypt.hash(this.password, config.salt_rounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

// TODO: update last_login_date
UserSchema.statics.login = async (email, password, callback) => {
  // eslint-disable-next-line no-use-before-define
  const user = await Users.findOne({ email });
  // eslint-disable-next-line no-use-before-define
  const userWithoutPwd = await Users.findOne({ email }, '-password');
  if (!user) {
    return callback(new Unauthorized('Wrong username or password.'));
  }
  /*
  if (config.status_needed_for_login && user.status !== config.status_needed_for_login) {
    return callback(new Unauthorized('Account not yet activated.'));
  }
  if (config.status_needed_for_login && user.organisation.has_paid !== true) {
    return callback(new Unauthorized('Membership not paid yet.'));
  }
  */
  return bcrypt.compare(password, user.password, (error, result) => {
    // Decrypt password
    if (error) {
      return callback(error);
    }
    if (result) {
      const token = jwt.sign({ id: user.id }, config.sha256, {
        expiresIn: config.token_expires_in
      });
      return callback(null, userWithoutPwd, token);
    }
    return callback(new Unauthorized('Wrong username or password.'));
  });
};

UserSchema.plugin(uniqueValidator);

const Users = mongoose.model(filename, UserSchema);

module.exports = Users;
