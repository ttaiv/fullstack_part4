// HTTP POST tests have been fixed to work with user autentication.

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./blog_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});
  // Hash the passwords of initial users
  const hashedUserPromises = helper.initialUsers.map(async user => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    return (
      {
        username: user.username,
        name: user.name,
        passwordHash,
        _id: user._id,
      });
  });
  const hashedUsers = await Promise.all(hashedUserPromises);
  await User.insertMany(hashedUsers);
});

const loginAndGetToken = async (username, password) => {
  const credentials = { username, password };
  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(200);

  return response.body.token;
};

describe('Testing HTTP GET /api/blogs', () => {
  test('HTTP GET returns correct number of blogs in JSON form', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test('returned blogs have field id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => expect(blog.id).toBeDefined());
  });
});

describe('Testing HTTP POST /api/blogs', () => {
  test('Adding a valid blog works correctly', async () => {
    const user = helper.initialUsers[0];
    const token = await loginAndGetToken(user.username, user.password);
    const newBlog = {
      title: 'Nice blogpost',
      author: 'Me',
      url: 'https://niceplace.com',
      likes: 11,
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain('Nice blogpost');
  });
  test('Trying to add blog without title or url results to 400 bad request', async () => {
    const user = helper.initialUsers[0];
    const token = await loginAndGetToken(user.username, user.password);
    const withoutTitle = {
      author: 'Me',
      url: 'https://niceplace.com',
      likes: 1,
    };
    const withoutUrl = {
      title: 'Nice blogpost',
      author: 'Me',
      likes: 2,
    };
    const withoutBoth = {
      author: 'Me',
      likes: 3,
    };
    const faultyBlogs = [withoutTitle, withoutUrl, withoutBoth];
    await Promise.all(faultyBlogs.map(async blog => {
      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    }));
  });
  test('default value for likes is zero', async () => {
    const user = helper.initialUsers[0];
    const token = await loginAndGetToken(user.username, user.password);
    const newBlog = {
      title: 'Blog without likes',
      author: 'some guy',
      url: 'https://niceplace.com',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogFromDB = await Blog.findOne({ title: 'Blog without likes' });
    expect(newBlogFromDB.likes).toEqual(0);
  });
  test('Adding a blog does not work without a token', async () => {
    const newBlog = {
      title: 'Nice blogpost',
      author: 'Me',
      url: 'https://niceplace.com',
      likes: 11,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });
});

describe('Testing HTTP DELETE', () => {
  test('Deleting reduces amount of notes in the database and deletes correct blog', async () => {
    const idToDelete = '5a422a851b54a676234d17f7'; // id of one of the initial notes
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(204);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length - 1);
    const ids = response.body.map(blog => blog.id);
    expect(ids).not.toContain(idToDelete);
  });
  test('Trying to delete blog that does not exist does not do anything', async () => {
    const id = await helper.createNonExistingId();
    await api
      .delete(`/api/blogs/${id}`)
      .expect(204);
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('Testing HTTP PUT', () => {
  const idToUpdate = helper.initialBlogs[0]._id;
  const newBlog = {
    title: 'Nice blogpost',
    author: 'Me',
    url: 'https://niceplace.com',
    likes: 11,
  };
  test('Replaces existing blog with a valid blog', async () => {
    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
    expect(response.body.map(blog => blog.title)).toContain(newBlog.title);
  });
  test('Trying to add blog without title or url results to 400 bad request', async () => {
    const withoutTitle = {
      author: 'Me',
      url: 'https://niceplace.com',
      likes: 1,
    };
    const withoutUrl = {
      title: 'Nice blogpost',
      author: 'Me',
      likes: 2,
    };
    const withoutBoth = {
      author: 'Me',
      likes: 3,
    };
    const faultyBlogs = [withoutTitle, withoutUrl, withoutBoth];
    await Promise.all(faultyBlogs.map(async blog => {
      await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(blog)
        .expect(400);
    }));
  });
  test('Trying to update nonexistent id leads to error 404', async () => {
    const id = await helper.createNonExistingId();
    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
