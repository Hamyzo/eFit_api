/**
 * PACKAGES
 */
const { createLogger, format, transports } = require('winston');

/**
 * VARIABLES
 */
const logLevel = process.env.LOG_LEVEL || 'debug';

const formatParams = info => {
  const { timestamp, level, message } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts} ${level}: ${message}`;
};


const finalFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

let logger;

if (process.env.NODE_ENV !== 'prod') {
  logger = createLogger({
    level: logLevel,
    format: finalFormat,
    transports: [new transports.Console()]
  });
} else {
  logger = createLogger({
    level: logLevel,
    format: finalFormat,
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'api.log' })
    ]
  });
}

module.exports = logger;
