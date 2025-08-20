import express from 'express'
const router = express.Router()
import Blog from '../models/blog.js'
import User from '../models/user.js'

router.post('/reset', async (_request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

export default router
