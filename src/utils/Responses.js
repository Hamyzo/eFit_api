/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: OK.
 */
const sendCustom = (res, message, statusCode) => {
  res.status(statusCode || 200).send({
    response: {
      status_code: statusCode || 200,
      message
    }
  });
};

/**
 * @swagger
 *
 * components:
 *   responses:
 *     OK:
 *       description: OK.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_code:
 *                 type: integer
 *                 example: 200
 *               message:
 *                 type: string
 *                 example: OK.
 *             required:
 *               - status_code
 *               - message
 */
const sendOk = res => {
  sendCustom(res, 'OK.', 200);
};

/**
 * @swagger
 *
 * components:
 *   responses:
 *     Created:
 *       description: The specified resource was successfully created.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_code:
 *                 type: integer
 *                 example: 201
 *               message:
 *                 type: string
 *                 example: The specified resource was successfully created.
 *             required:
 *               - status_code
 *               - message
 */
const sendCreated = (res, message) => {
  sendCustom(res, message, 201);
};


const sendPayload = (res, payload, statusCode) => {
  res.status(statusCode || 200).send(payload);
};

module.exports = {
  sendCustom,
  sendOk,
  sendCreated,
  sendPayload
};
