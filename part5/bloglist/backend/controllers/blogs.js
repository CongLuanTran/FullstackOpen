const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id
  }

  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true, runvalidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1, id: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'token invalid' })
  }

  user.blogs = user.blogs.filter(item => item.toString() !== blog.id)
  await blog.deleteOne()
  await user.save()
  response.status(204).end()
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
