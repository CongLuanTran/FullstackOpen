import { connect, connection } from 'mongoose'
import { MONGODB_URI } from './config.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import { hash } from 'bcrypt'

const initialUsers = [
    { username: 'adam', name: 'Adam Miller', password: 'password' },
    { username: 'john', name: 'John Smith', password: 'password' },
    { username: 'jack', name: 'Jack Black', password: 'password' },
]

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    },
]

const initilialize = async () => {
    try {
        // Connect to DB
        await connect(MONGODB_URI)

        // Clear old blog
        await Blog.deleteMany({})
        await User.deleteMany({})

        // Initialize users
        const hashingPromise = initialUsers.map(async (user) => {
            const { username, name, password } = user
            const saltRounds = 10
            const passwordHash = await hash(password, saltRounds)
            return new User({
                username,
                name,
                passwordHash,
            })
        })
        const hashedUsers = await Promise.all(hashingPromise)
        const users = await User.insertMany(hashedUsers)

        // Insert blogs with users
        const blogPromise = initialBlogs.map(async (blog, idx) => {
            const userIdx = (idx * 7 + 3) % initialUsers.length
            const user = users[userIdx]
            const newBlog = new Blog(blog)
            newBlog.user = user
            user.blogs = user.blogs.concat(newBlog._id)
            return await newBlog.save()
        })
        await Promise.all(blogPromise)

        const userPromise = users.map((user) => user.save())
        await Promise.all(userPromise)
    } catch (err) {
        console.error(err)
        process.exit(1)
    } finally {
        connection.close()
    }
}

initilialize()
