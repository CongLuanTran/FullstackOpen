import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import { useUpdateBlog } from '../hooks/useUpdateBlog'
import storage from '../services/storage'
import { useDeleteBlog } from '../hooks/useDeleteBlog'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const { notify } = useNotification()
  const updateBlogMutation = useUpdateBlog()
  const deleteBlogMutation = useDeleteBlog()


  const handleVote = (blog) => {
    updateBlogMutation.mutate(
      { ...blog, likes: blog.likes + 1 },
      {
        onSuccess: (updatedBlog) => {
          notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
        },
      }
    )
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog, {
        onSuccess: (_data, blog) => {
          notify(`Blog ${blog.title}, by ${blog.author} removed`)
        },
      })
    }
  }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  console.log(blog.user, storage.me(), canRemove)

  return (
    <div style={style} className="blog">
      {blog.title} by {blog.author}
      <button style={{ marginLeft: 3 }} onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}
            <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
              like
            </button>
          </div>
          <div>{nameOfUser}</div>
          {canRemove && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired,
}

export default Blog
