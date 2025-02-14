const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helpers')

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(await helper.initialUsers())

    const users = await helper.usersInDb()
    const firstUser = users[0]

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: firstUser.id })))

    const blogs = await helper.blogsInDb()
    const blogsId = blogs.map(blog => blog.id)
    const tester = await User.findOne({ username: 'tester' })
    tester.blogs = blogsId
    await tester.save()
  })

  describe.only('viewing all record', () => {
    test('should return result as JSON', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('should contain only one user', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const users = response.body
      const initialUsers = await helper.initialUsers()

      assert(users.length, initialUsers)
    })

    test('should populate the blogs', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const users = response.body
      const blogs = users[0].blogs
      assert(blogs.every(blog => {
        const keys = Object.keys(blog)
        return keys.includes('id')
        && keys.includes('user')
        && keys.includes('title')
        && keys.includes('url')
        && keys.includes('likes')
      }))
    })
  })

  describe('creation of a user', () => {
    test('should succeed with a fresh username', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'newuser',
        name: 'John Dole',
        password: 'password',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const userAtEnd = await helper.usersInDb()
      assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

      const usernames = userAtEnd.map(r => r.username)
      assert(usernames.includes(newUser.username))
    })

    test('should fail with status code 400 if username already exists', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'tester',
        name: 'Duplicate',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const userAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(userAtEnd.length, userAtStart.length)
    })

    test('should fail with status code 400 if username is shorter than 3 characters', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'sh',
        name: 'ShortUser',
        password: 'password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const userAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('username must be at least 3 characters long'))
      assert.strictEqual(userAtEnd.length, userAtStart.length)
    })

    test('should fail with status code 400 if password is shorter than 3 characters', async () => {
      const userAtStart = await helper.usersInDb()

      const newUser = {
        username: 'normal',
        name: 'ShortPassword',
        password: 'ps',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const userAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password must be at least 3 characters long'))
      assert.strictEqual(userAtEnd.length, userAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})