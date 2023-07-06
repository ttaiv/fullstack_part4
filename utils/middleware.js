const logger = require('./logger');

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error('Execution moved to error handler, error:', error);
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else {
    next(error);
  }
};

module.exports = { unknownEndpoint, errorHandler };
