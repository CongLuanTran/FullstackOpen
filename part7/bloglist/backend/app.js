import { MONGODB_URI } from './utils/config.js'
import express from 'express'
const app = express()
import cors from 'cors'
import 'express-async-errors'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import {
    requestLogger,
    unknownEndpoint,
    errorHandler,
} from './utils/middleware'
import { info, error as _error } from './utils/logger'
import { set, connect } from 'mongoose'

set('strictQuery', false)

info('connecting to', MONGODB_URI)

connect(MONGODB_URI)
    .then(() => {
        info('connected to MongoDB')
    })
    .catch((error) => {
        _error('error connection to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing').default.default
        .default
    app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
