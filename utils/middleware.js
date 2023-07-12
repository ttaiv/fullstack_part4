const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else {
    next(error);
  }
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    request.user = user;
  } catch {
    response.status(401).json({ error: 'invalid token' });
  }
  next();
};

module.exports = {
  unknownEndpoint, errorHandler, tokenExtractor, userExtractor,
};
