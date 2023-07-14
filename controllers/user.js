const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');
const { isValid } = require('../utils/password_helper');

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  if (!isValid(password)) {
    response.status(400).json({ error: 'password must be 3 characters long' });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
});

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1, url: 1, author: 1, id: 1,
  });
  response.json(users);
});

module.exports = userRouter;
