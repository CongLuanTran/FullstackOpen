const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxer = (max, blog) => {
    return max.likes > blog.likes
      ? max
      : blog
  }

  if (blogs.length >  0) {
    const { _id, __v, url, ...returnObj } = blogs.reduce(maxer, blogs[0])
    return returnObj
  }

  return null
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return _(blogs)
    .countBy('author')
    .map((count, author) => ({ author, blogs: count }))
    .maxBy('blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({ author, likes: _.sumBy(blogs, 'likes') }))
    .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}