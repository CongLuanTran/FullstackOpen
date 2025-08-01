import express from 'express'
const router = express.Router()
import { deleteMany as deleteManyBlogs } from '../models/blog.js'
import { deleteMany as deleteManyUsers } from '../models/user.js'

router.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = router;
