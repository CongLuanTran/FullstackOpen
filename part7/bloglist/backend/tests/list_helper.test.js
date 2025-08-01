import { strictEqual, deepStrictEqual } from 'assert'
import { test, describe } from 'node:test'
import {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
} from '../utils/list_helper.js'

const blogs = [
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
]

describe('list_helper', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = dummy(blogs)
        strictEqual(result, 1)
    })

    describe('total likes', () => {
        test('when list has only one blog equals the likes of that', () => {
            const result = totalLikes([blogs[0]])
            strictEqual(result, blogs[0].likes)
        })

        test('is zero when list empty', () => {
            const result = totalLikes([])
            strictEqual(result, 0)
        })

        test('when list has many blogs equals the sum of likes', () => {
            const result = totalLikes(blogs)
            strictEqual(result, 36)
        })
    })

    describe('favorite blog', () => {
        test('when list has only one blog equals that blog', () => {
            const result = favoriteBlog([blogs[0]])
            deepStrictEqual(result, blogs[0])
        })

        test('is empty object when list empty', () => {
            const result = favoriteBlog([])
            deepStrictEqual(result, {})
        })

        test('when list has many blogs equals the blog with most likes', () => {
            const result = favoriteBlog(blogs)
            deepStrictEqual(result, blogs[2])
        })
    })

    describe('most blogs', () => {
        test('when list has only one blog equals the author of that blog', () => {
            const result = mostBlogs([blogs[0]])
            deepStrictEqual(result, { author: blogs[0].author, blogs: 1 })
        })

        test('is null when list empty', () => {
            const result = mostBlogs([])
            strictEqual(result, null)
        })

        test('when list has many blogs equals the author with most blogs', () => {
            const result = mostBlogs(blogs)
            deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
        })
    })

    describe('most likes', () => {
        test('when list has only one blog equals the author of that blog', () => {
            const result = mostLikes([blogs[0]])
            deepStrictEqual(result, {
                author: blogs[0].author,
                likes: blogs[0].likes,
            })
        })

        test('is null when list empty', () => {
            const result = mostLikes([])
            strictEqual(result, null)
        })

        test('when list has many blogs equals the author with most likes', () => {
            const result = mostLikes(blogs)
            deepStrictEqual(result, {
                author: 'Edsger W. Dijkstra',
                likes: 17,
            })
        })
    })
})
