const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
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

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'tester', passwordHash })

    await user.save()
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