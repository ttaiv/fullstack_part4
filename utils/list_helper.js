const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => (
  blogs.reduce((sum, nextBlog) => sum + nextBlog.likes, 0)
);

const favoriteBlog = (blogs) => {
  const chooseMoreLikes = (blog1, blog2) => {
    if (blog2.likes > blog1.likes) {
      return blog2;
    }
    return blog1;
  };

  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce((mostLikesBlog, blog) => chooseMoreLikes(mostLikesBlog, blog), blogs[0]);
};

const mostBlogs = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null;
  }
  return _.chain(blogs)
    .groupBy('author')
    .map((blogArr, author) => ({ author, blogs: blogArr.length }))
    .maxBy('blogs')
    .value();
};

const mostLikes = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null;
  }
  return _.chain(blogs)
    .groupBy('author')
    .map((blogArr, author) => ({ author, likes: _.sumBy(blogArr, 'likes') }))
    .maxBy('likes')
    .value();
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
