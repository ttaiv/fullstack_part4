const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response) => {
  const { user } = request;
  // Check if token has been valid and it correspond to user
  if (!user) {
    return;
  }
  const {
    title, author, url, likes,
  } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });
  const savedBlog = await blog.save();
  const blogId = savedBlog._id;
  user.blogs = user.blogs.concat(blogId);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request;
  if (!user) {
    return;
  }
  const idToDelete = request.params.id;
  const blogToDelete = await Blog.findById(idToDelete);
  if (!blogToDelete) {
    response.status(204).end();
    return;
  }
  const blogCreatorId = blogToDelete.user;
  if (user._id.toString() === blogCreatorId.toString()) {
    await blogToDelete.deleteOne();
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'No rights to delete this blog' });
  }
});

blogRouter.put('/:id', async (request, response) => {
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };
  await (new Blog(newBlog)).validate();
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  if (!updatedBlog) {
    response.status(404).end();
  } else {
    response.json(updatedBlog);
  }
});

module.exports = blogRouter;
