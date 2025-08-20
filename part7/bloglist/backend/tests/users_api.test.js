import supertest from 'supertest'
import { connection } from 'mongoose'
import { test, describe, after, beforeEach } from 'node:test'
import app from '../app.js'
const api = supertest(app)
import { usersInDb } from './test_helper.js'
import { strictEqual } from 'assert'

import { deleteMany } from '../models/user.js'

describe('users', () => {
    beforeEach(async () => {
        await deleteMany({})
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password',
        }

        const usersAtStart = await usersInDb()

        const response = await api.post('/api/users').send(newUser).expect(201)

        strictEqual(response.body.username, newUser.username)
        strictEqual(response.body.name, newUser.name)

        const usersAtEnd = await usersInDb()

        strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test('user without username is not added', async () => {
        const newUser = {
            name: 'New User',
            password: 'password',
        }

        const usersAtStart = await usersInDb()

        await api.post('/api/users').send(newUser).expect(400)

        const usersAtEnd = await usersInDb()

        strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user without password is not added', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
        }

        const usersAtStart = await usersInDb()

        const result = await api.post('/api/users').send(newUser).expect(400)

        const usersAtEnd = await usersInDb()

        strictEqual(result.body.error, 'password missing or too short')
        strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test.only('same username can not be added twice', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password',
        }

        await api.post('/api/users').send(newUser)

        const usersAtStart = await usersInDb()

        await api.post('/api/users').send(newUser).expect(400)

        const usersAtEnd = await usersInDb()

        strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    after(() => {
        connection.close()
    })
})
