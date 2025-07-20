const router = require('express').Router()
import { deleteMany as deleteManyBlogs } from '../models/blog'
import { deleteMany as deleteManyUsers } from '../models/user'

router.post('/reset', async (_request, response) => {
    await deleteManyBlogs({})
    await deleteManyUsers({})

    response.status(204).end()
})

export default router
