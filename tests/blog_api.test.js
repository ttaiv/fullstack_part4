const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./blog_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

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
    const newBlog = {
      title: 'Nice blogpost',
      author: 'Me',
      url: 'https://niceplace.com',
      likes: 11,
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain('Nice blogpost');
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
        .post('/api/blogs')
        .send(blog)
        .expect(400);
    }));
  });
});

test('default value for likes is zero', async () => {
  const validId = await helper.createNonExistingId();
  const newBlog = {
    title: 'Blog without likes',
    author: 'some guy',
    url: 'https://niceplace.com',
    _id: validId,
  };
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const newBlogFromDB = await Blog.findById(validId);
  expect(newBlogFromDB.likes).toEqual(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
