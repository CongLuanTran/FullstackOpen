const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  }
]

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog unique identifier is `id`', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body.every(e => {
      const keys = Object.keys(e)
      return keys.includes('id')
      && !keys.includes('_id')
    }))
  })

  test('all inital blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the first blog is about type wars', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert(titles.includes('Type wars'))
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes('Go To Statement Considered Harmful'))
  })

  test('blog without like default to 0 like', async () => {
    const noLike = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    await api
      .post('/api/blogs')
      .send(noLike)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')

    const blogs = response.body

    assert.strictEqual(blogs.length, initialBlogs.length + 1)

    assert(blogs.find(blog => blog.title === 'React patterns').likes === 0)
  })

  describe('posting blogs without title or url return 400', () => {

    test('blog without url', async () => {
      const badBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(badBlog)
        .expect(400)
    })

    test('blog without title', async () => {
      const badBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(badBlog)
        .expect(400)
    })

    test('blog without both', async () => {
      const badBlog = {
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(badBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
