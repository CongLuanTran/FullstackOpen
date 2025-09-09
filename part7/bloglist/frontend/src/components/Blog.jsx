import { useParams } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'
import { useBlogs } from '../hooks/useBlogs'
import { useDeleteBlog } from '../hooks/useDeleteBlog'
import { useUpdateBlog } from '../hooks/useUpdateBlog'
import storage from '../services/storage'
import { useState } from 'react'
import { useAddComment } from '../hooks/useAddComment'

const Blog = () => {
  const [comment, setComment] = useState('')
  const id = useParams().id
  const { data: blogs, isLoading } = useBlogs()

  const { notify } = useNotification()
  const updateBlogMutation = useUpdateBlog()
  const deleteBlogMutation = useDeleteBlog()
  const addCommentMutation = useAddComment()

  if (isLoading) {
    return <p>Loading...</p>
  }

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

  const handleAddComment = (blog, comment) => {
    addCommentMutation.mutate(
      { id: blog.id, text: comment },
      {
        onSuccess: (_data, { id, text }) => {
          notify(`Comment ${text} added`)
        },
      }
    )
  }

  const blog = blogs.find((b) => b.id === id)

  if (!blog) return null

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'
  const canRemove = blog.user ? blog.user.username === storage.me() : true

  console.log(blog.user, storage.me(), canRemove)

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
          like
        </button>
      </div>
      <div>added by {nameOfUser}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}

      <h3>comments</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleAddComment(blog, comment)
          setComment('')
        }}
      >
        <input
          type="text"
          data-testid="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
