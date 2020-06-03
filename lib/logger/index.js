const winston = require('winston')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const level = process.env.LOG_LEVEL || 'debug';

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = winston.createLogger({
  level: level,
  format: combine(
    label({ label: 'service' }),
    timestamp(),
    myFormat
  ),
  defaultMeta: 'user-service',
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' })

  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      label({ label: 'service1' }),
      timestamp(),
      myFormat
    ),
  }))
}


module.exports = logger
