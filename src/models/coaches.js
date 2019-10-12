/**
 * PACKAGES
 */
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const { Unauthorized } = require("../utils/Errors");
const config = require("../../config/config");

const Address = require("./schemas/address");

const filename = __filename.slice(__dirname.length + 1, -3);
// eslint-disable-next-line no-useless-escape
const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Coach:
 *       type: object
 *       required:
 *         - password
 *         - email
 *         - status
 *         - registration_date
 *         - last_login_date
 *       properties:
 *         first_name:
 *           type: string
 *           example: AAA
 *         last_name:
 *           type: string
 *           example: BBB
 *         password:
 *           type: string
 *           format: password
 *           example: 1234
 *         email:
 *           type: string
 *           example: aaa@bbb.com
 *         age:
 *           type: integer
 *           format: int64
 *           example: 25
 *         phone:
 *           type: string
 *           example: +33 6 12 34 56 78
 *         title:
 *           type: string
 *           example: None
 *         registration_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         last_login_date:
 *           type: string
 *           format: date-time
 *           example: 2019-10-15T20:20:20Z
 *         img:
 *           type: string
 *           example: http://laderasoccer.net/wp-content/uploads/2019/02/become-a-coach.png
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

const CoachSchema = new Schema({
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
    type: Number
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
    enum: ["M.", "Ms.", ""],
    default: ""
  },
  img: {
    type: String,
    trim: true,
    default:
      "http://laderasoccer.net/wp-content/uploads/2019/02/become-a-coach.png"
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "ACTIVE", "DISABLED"],
    default: "PENDING"
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

CoachSchema.pre("save", function(next) {
  // Hash coach password before saving data in database.
  bcrypt.hash(this.password, config.salt_rounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

// TODO: update last_login_date
CoachSchema.statics.login = async (email, password, callback) => {
  // eslint-disable-next-line no-use-before-define
  const coach = await Coaches.findOne({ email });
  // eslint-disable-next-line no-use-before-define
  const coachWithoutPwd = await Coaches.findOne({ email }, "-password");
  if (!coach) {
    return callback(new Unauthorized("Wrong coachname or password."));
  }
  /*
  if (config.status_needed_for_login && coach.status !== config.status_needed_for_login) {
    return callback(new Unauthorized('Account not yet activated.'));
  }
  if (config.status_needed_for_login && coach.organisation.has_paid !== true) {
    return callback(new Unauthorized('Membership not paid yet.'));
  }
  */
  return bcrypt.compare(password, coach.password, (error, result) => {
    // Decrypt password
    if (error) {
      return callback(error);
    }
    if (result) {
      const token = jwt.sign({ id: coach.id }, config.sha256, {
        expiresIn: config.token_expires_in
      });
      return callback(null, coachWithoutPwd, token);
    }
    return callback(new Unauthorized("Wrong coachname or password."));
  });
};

CoachSchema.plugin(uniqueValidator);

const Coaches = mongoose.model(filename, CoachSchema);

module.exports = Coaches;
