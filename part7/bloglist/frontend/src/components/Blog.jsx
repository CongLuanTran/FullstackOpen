import { useState } from 'react'
import PropTypes from 'prop-types'
import storage from '../services/storage'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../features/blogSlice'
import { useNotify } from '../hooks/useNotify'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const notify = useNotify()

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleVote = async blog => {
    dispatch(likeBlog(blog))
    notify.success(`You liked ${blog.title} by ${blog.author}`)
  }

  const handleDelete = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog))
      notify.success(`Blog ${blog.title}, by ${blog.author} removed`)
    }
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
