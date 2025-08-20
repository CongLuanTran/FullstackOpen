import supertest from 'supertest'
import { connection } from 'mongoose'
import { test, describe, after, beforeEach } from 'node:test'
import app from '../app'
const api = supertest(app)
import { initialBlogs, blogsInDb } from './test_helper.js'
import assert, { strictEqual } from 'assert'

import Blog from '../models/blog.js'
import User from '../models/user.js'

const testUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password',
}

let token

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const blogObjects = initialBlogs.map((blog) => new Blog(blog))

        const promiseArray = blogObjects.map((blog) => blog.save())
        await Promise.all(promiseArray)

        await api.post('/api/users').send(testUser)

        const response = await api.post('/api/login').send(testUser)

        token = response.body.token
    })

    test('blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        strictEqual(response.body.length, initialBlogs.length)
    })

    test('blogs are returned with id property', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((blog) => {
            assert(blog.id)
        })
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            url: 'http://example.com/new',
            likes: 5,
        }

        const postResponse = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            .set('Authorization', `Bearer ${token}`)

        strictEqual(postResponse.body.title, newBlog.title)
        strictEqual(postResponse.body.author, newBlog.author)
        strictEqual(postResponse.body.url, newBlog.url)
        strictEqual(postResponse.body.likes, newBlog.likes)

        await api.get('/api/blogs')

        const blogsAtEnd = await blogsInDb()

        const titles = blogsAtEnd.map((blog) => blog.title)

        assert(titles.includes('New Blog'))
    })

    test('if likes property is missing, it will default to 0', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            url: 'http://example.com/new',
        }

        const postResponse = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        strictEqual(postResponse.body.likes, 0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'New Author',
            url: 'http://example.com/new',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        const blogsAtEnd = await blogsInDb()

        strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('a valid blog is not added without a token', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            url: 'http://example.com/new',
            likes: 5,
        }

        await api.post('/api/blogs').send(newBlog).expect(401)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        const blogsAtEnd = await blogsInDb()

        strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('a blog can be deleted', async () => {
        const blogToDelete = {
            title: 'New Blog',
            author: 'New Author',
            url: 'http://example.com/new',
            likes: 5,
        }

        const response = await api
            .post('/api/blogs')
            .send(blogToDelete)
            .set('Authorization', `Bearer ${token}`)

        const id = response.body.id

        const blogsAtStart = await blogsInDb()

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await blogsInDb()

        strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const titles = blogsAtEnd.map((r) => r.title)

        assert(!titles.includes(blogToDelete.title))
    })

    test('a blog can be updated', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const newBlog = {
            title: 'Updated Blog',
            author: 'Updated Author',
            url: 'http://example.com/updated',
            likes: 10,
        }

        await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200)

        const blogsAtEnd = await blogsInDb()

        const updatedBlog = blogsAtEnd.find(
            (blog) => blog.id === blogToUpdate.id
        )

        strictEqual(updatedBlog.title, newBlog.title)
        strictEqual(updatedBlog.author, newBlog.author)
        strictEqual(updatedBlog.url, newBlog.url)
        strictEqual(updatedBlog.likes, newBlog.likes)
    })

    after(() => {
        connection.close()
    })
})
