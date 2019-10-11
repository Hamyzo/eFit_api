/**
 * PACKAGES
 */
const { sendPayload } = require('../utils/Responses');
const Users = require('../models/users');


/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 *
 * paths:
 *   /login:
 *     get:
 *       description: Login an user.
 *       operationId: getUsers
 *       summary: Login an user.
 *       security:
 *         - basicAuth: []
 *       tags:
 *         - login
 *       responses:
 *         '200':
 *            description:
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
const getLogin = (req, res, next) => {
  // console.log(req.data);
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  // eslint-disable-next-line new-cap
  const [login, password] = new Buffer.from(b64auth, 'base64').toString().split(':');
  Users.login(login, password, (err, user, token) => {
    if (err) {
      return next(err);
    }
    delete user.password;
    return sendPayload(
      res,
      {
        user,
        token
      },
      200
    );
  });
};

module.exports = router => {
  router.route('/').get(getLogin);
};
