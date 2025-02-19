const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = async () => {
  const users = [
    {
      username: 'tester',
      name: 'Tester',
      passwordHash: await bcrypt.hash('sekret', 10),
    },
    {
      username: 'admin',
      name: 'Admin',
      passwordHash: await bcrypt.hash('password', 10),
    }
  ]

  return users
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'tobedeleted',
    author: 'tester',
    url: 'dummy'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb
}