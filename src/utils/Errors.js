/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: The requested resource could not be found.
 *         description:
 *           type: string
 *           example: More explicit error description. Optional.
 *       required:
 *         - status_code
 *         - message
 */
class CustomError {
  constructor(message = "Custom Error message", statusCode = 500, description) {
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.description = description;
  }
}

/**
 * @swagger
 *
 * components:
 *   responses:
 *     BadRequest:
 *       description: Cannot process the request may a malformed syntax request, invalid message framing, or deceptive request routing.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_code:
 *                 type: integer
 *                 example: 400
 *               message:
 *                 type: string
 *                 example: Cannot process the request may a malformed syntax request, invalid message framing, or deceptive request routing.
 *               description:
 *                 type: string
 *                 example: More explicit error description. Optional.
 *             required:
 *               - status_code
 *               - message
 */
class BadRequest extends CustomError {
  constructor(description) {
    super(
      "Cannot process the request may a malformed syntax request, invalid message framing, or deceptive request routing.",
      400,
      description
    );
  }
}

class Unauthorized extends CustomError {
  constructor(description) {
    super(
      "Unauthorized Access. Authentication required or invalid.",
      401,
      description
    );
  }
}

class PaymentRequired extends CustomError {
  constructor(description) {
    super("Payment Required.", 402, description);
  }
}

class Forbidden extends CustomError {
  constructor(description) {
    super(
      "The request is valid but you do not have access to this resource.",
      403,
      description
    );
  }
}

/**
 * @swagger
 *
 * components:
 *   responses:
 *     NotFound:
 *       description: The requested resource could not be found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_code:
 *                 type: integer
 *                 example: 404
 *               message:
 *                 type: string
 *                 example: The requested resource could not be found..
 *               description:
 *                 type: string
 *                 example: More explicit error description. Optional.
 *             required:
 *               - status_code
 *               - message
 */
class NotFound extends CustomError {
  constructor(description) {
    super("The requested resource could not be found.", 404, description);
  }
}

class MethodNotAllowed extends CustomError {
  constructor(description) {
    super(
      "A request method is not supported for the requested resource.",
      405,
      description
    );
  }
}

class NotAcceptable extends CustomError {
  constructor(description) {
    super(
      "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
      406,
      description
    );
  }
}

class ProxyAuthenticationRequired extends CustomError {
  constructor(description) {
    super(
      "The client must first authenticate itself with the proxy.",
      407,
      description
    );
  }
}

class RequestTimeout extends CustomError {
  constructor(description) {
    super("The server timed out waiting for the request.", 408, description);
  }
}

class Conflict extends CustomError {
  constructor(description) {
    super(
      "Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.",
      409,
      description
    );
  }
}

class Gone extends CustomError {
  constructor(description) {
    super(
      "The requested resource is no longer available and will not be available again.",
      410,
      description
    );
  }
}

class UnsupportedMediaType extends CustomError {
  constructor(description) {
    super(
      "The request entity has a media type which the server or resource does not support. This API only supports JSON payload.",
      415,
      description
    );
  }
}

class InternalServerError extends CustomError {
  constructor(description) {
    super("Oooops something wrong happened.", 500, description);
  }
}

class NotImplemented extends CustomError {
  constructor(description) {
    super(
      "The server either does not recognize the request method, or it lacks the ability to fulfil the request.",
      501,
      description
    );
  }
}

class BadGateway extends CustomError {
  constructor(description) {
    super(
      "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
      502,
      description
    );
  }
}

class ServiceUnvailable extends CustomError {
  constructor(description) {
    super(
      "The server is currently unavailable (because it is overloaded or down for maintenance).",
      503,
      description
    );
  }
}

class GatewayTimeout extends CustomError {
  constructor(description) {
    super(
      "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
      504,
      description
    );
  }
}

class HttpVersionNotSupported extends CustomError {
  constructor(description) {
    super(
      "The server does not support the HTTP protocol version used in the request.",
      505,
      description
    );
  }
}


module.exports = {
  CustomError,
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  Gone,
  UnsupportedMediaType,
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnvailable,
  GatewayTimeout,
  HttpVersionNotSupported
};
