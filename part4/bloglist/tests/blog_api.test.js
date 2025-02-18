const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
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
      return keys.includes('id') && !keys.includes('_id')
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
    test('should succeed with with status code 200 for valid existing IDs', async () => {
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

    describe('with a invalid login', () => {
      test('should fail with status code 401', async () => {
        const newBlog = {
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
        }

        const result = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)

        const body = result.body
        assert(body.error === 'token invalid')
      })
    })

    describe('with a valid login', () => {
      let token = ''
      let user = null
      beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(await helper.initialUsers())

        const users = await helper.usersInDb()
        const firstUser = users[0]
        user = firstUser

        const auth = await api
          .post('/api/login')
          .send({
            username: 'tester',
            password: 'sekret'
          })
          .expect(200)

        token = auth.body.token
      })

      test('should succeed if the blog is valid', async () => {
        const newBlog = {
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const blogs = response.body
        const titles = blogs.map(r => r.title)

        assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
        assert(titles.includes('Go To Statement Considered Harmful'))
        assert('user' in blogs.find(blog => blog.title.includes('Go To Statement Considered Harmful')))
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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

  describe('deletion of a blog', () => {

    describe('with a invalid token', () => {
      test('should fail with status code 401 ', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(401)
      })
    })

    describe('with a valid token', () => {
      let token = ''
      let user = null
      beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(await helper.initialUsers())

        const users = await helper.usersInDb()
        const firstUser = users[0]

        const auth = await api
          .post('/api/login')
          .send({
            username: 'tester',
            password: 'sekret'
          })
          .expect(200)

        token = auth.body.token

        await Blog.updateMany({}, { $set: { user: firstUser.id } })
      })

      describe('made by the user that creates it', () => {

        test('should succeed with status code 204 for valid IDs and ', async () => {
          const blogsAtStart = await helper.blogsInDb()
          const blogToDelete = blogsAtStart[0]

          await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

          const blogsAtEnd = await helper.blogsInDb()
          assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

          const titles = blogsAtEnd.map(r => r.title)
          assert(!titles.includes(blogToDelete.title))
        })

        test('should fail with status code 400 for invalid IDs', async () => {
          const invalidId = '8290482904829048989'

          await api
            .delete(`/api/blogs/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
        })
      })
      describe('made by a different user', () => {
        test('should fail with status code 401', async () => {
          const blogsAtStart = await helper.blogsInDb()
          const blogToDelete = blogsAtStart[0]

          const auth = await api
            .post('/api/login')
            .send({
              username: 'admin',
              password: 'password'
            })
            .expect(200)

          const newToken = auth.body.token

          await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${newToken}`)
            .expect(401)

          const blogsAtEnd = await helper.blogsInDb()

          assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
      })
    })
  })

  describe('updating the information of an individual blog post', () => {
    test('should succeed with status code 200 for valid IDs',  async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = { ...blogToUpdate,likes: 15 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const blogs = response.body

      assert.strictEqual(blogs.length, blogsAtStart.length)
      assert(blogs.find(blog => blog.title === blogToUpdate.title).likes === 15)
    })

    test('should fail with status code 404 for non-existing but valid IDs', async () => {
      const validNonExistingId = await helper.nonExistingId()
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = { ...blogToUpdate,likes: 15 }

      await api
        .put(`/api/blogs/${validNonExistingId}`)
        .send(updatedBlog)
        .expect(404)
    })

    test('should fail with status code 400 for invalid IDs', async () => {
      const invalidId = '0483290989'
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = { ...blogToUpdate,likes: 15 }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
