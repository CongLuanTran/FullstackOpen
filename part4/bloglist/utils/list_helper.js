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

  const favorite = blogs.length === 0
    ? null
    : blogs.reduce(maxer, blogs[0])

  const { _id, __v, url, ...returnObj } = favorite
  return returnObj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}