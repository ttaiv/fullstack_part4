const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const list = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('works correctly for one blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
      },
    ];
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(listWithOneBlog[0].likes);
  });

  test('works for bigger list', () => {
    expect(listHelper.totalLikes(list)).toBe(2 + 10 + 12 + 5 + 7);
  });
});

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog([])).toBe(null);
  });
  test('works for list with one blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
      },
    ];
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0]);
  });
  test('works for longer list', () => {
    expect(listHelper.favoriteBlog(list)).toEqual(list[2]);
  });
});

describe('mostBlogs', () => {
  test('should work with list with more than one elements', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    expect(listHelper.mostBlogs(list)).toEqual(expected);
  });
  test('should work with list with one element', () => {
    const listWithOneBlog = [
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
      },
    ];
    const expected = {
      author: 'Robert C. Martin',
      blogs: 1,
    };
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(expected);
  });
  test('should return null with empty list', () => {
    expect(listHelper.mostBlogs([])).toBe(null);
  });
});

describe('mostLikes', () => {
  test('should work with list with more than one elements', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    expect(listHelper.mostLikes(list)).toEqual(expected);
  });
  test('should work with list with one element', () => {
    const listWithOneBlog = [
      {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
      },
    ];
    const expected = {
      author: 'Robert C. Martin',
      likes: 2,
    };
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(expected);
  });
  test('should return null with empty list', () => {
    expect(listHelper.mostLikes([])).toBe(null);
  });
});
