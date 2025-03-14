import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBotton: 5,
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const displayStyle = { display: visible ? '' : 'none' }

  const like = () => {
    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div className='blogDetails' style={displayStyle}>
        <div>{blog.url}</div>
        <div>
          <span data-testid='likes'>{blog.likes}</span>
          <button onClick={like}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )
}

export default Blog
