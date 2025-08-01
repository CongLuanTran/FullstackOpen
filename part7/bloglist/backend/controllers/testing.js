import express from 'express'
const router = express.Router()
import { deleteMany as deleteManyBlogs } from '../models/blog.js'
import { deleteMany as deleteManyUsers } from '../models/user.js'

router.post('/reset', async (_request, response) => {
    await deleteManyBlogs({})
    await deleteManyUsers({})

    response.status(204).end()
})

export default router
