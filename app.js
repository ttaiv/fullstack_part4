const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blog');
const { unknownEndpoint } = require('./utils/middleware');

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB.');
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error.message);
  });

const app = express();
app.use(cors());
app.use(express.json());

morgan.token('data', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.use('/api/blogs', blogRouter);
app.use(unknownEndpoint);

module.exports = app;
