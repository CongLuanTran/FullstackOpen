const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helpers')

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('contain a blog about `First class tests`', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert(titles.includes('First class tests'))
  })

  describe('viewing a specific blog', () => {
    test('should success with a valid id', async () => {
      const allBlogs = await helper.blogsInDb()
      const firstBlog = allBlogs[0]

      const resultBlog = await api
        .get(`/api/blogs/${firstBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, firstBlog)
    })

    test('should fail with status code 404 for non-existing but valid IDs', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404)
    })

    test('should should fail with status code 400 for invalid IDs', async () => {
      const invalidId = '8290482904829048989'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a blog', () => {
    test('should success if the blog is valid', async () => {
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

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(titles.includes('Go To Statement Considered Harmful'))
    })

    describe('should fail with status code 400 if title or url is empty', () => {

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

    test('should assign default value 0 to `likes` if it is missing', async () => {
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

      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
      assert(blogs.find(blog => blog.title === 'React patterns').likes === 0)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
