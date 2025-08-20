import Blog from '../models/blog.js'
import User from '../models/user.js'

const initialBlogs = [
    {
        title: 'First Blog',
        author: 'Author 1',
        url: 'http://example.com/1',
        likes: 5,
    },
    {
        title: 'Second Blog',
        author: 'Author 2',
        url: 'http://example.com/2',
        likes: 10,
    },
    {
        title: 'Third Blog',
        author: 'Author 3',
        url: 'http://example.com/3',
        likes: 7,
    },
]

blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map((blog) => blog.toJSON())
}

usersInDb = async () => {
    const users = await User.find({})
    return users.map((u) => u.toJSON())
}

export default {
    initialBlogs,
    blogsInDb,
    usersInDb,
}
