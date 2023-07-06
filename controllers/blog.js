const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const { errorHandler } = require('../utils/middleware');

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body);
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => next(error));
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };
  try {
    await (new Blog(newBlog)).validate();
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
    console.log('new blog is', newBlog, 'updated blog is', updatedBlog);
    if (!updatedBlog) {
      response.status(404).end();
    } else {
      response.json(updatedBlog);
    }
  } catch (expection) {
    next(expection);
  }
});

blogRouter.use(errorHandler);

module.exports = blogRouter;
