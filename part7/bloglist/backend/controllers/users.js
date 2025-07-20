import { hash } from 'bcrypt'
const router = require('express').Router()
import User, { find } from '../models/user.js'

router.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
        return response
            .status(400)
            .json({ error: 'password missing or too short' })
    }

    const saltRounds = 10
    const passwordHash = await hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

router.get('/', async (_request, response) => {
    const users = await find({}).populate('blogs', {
        url: 1,
        title: 1,
        author: 1,
    })
    response.json(users)
})

export default router
