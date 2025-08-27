import { useParams } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'
import { useUpdateBlog } from '../hooks/useUpdateBlog'
import storage from '../services/storage'
import { useBlogs } from '../hooks/useBlogs'
import { useDeleteBlog } from '../hooks/useDeleteBlog'

const Blog = () => {
  const id = useParams().id
  const { data: blogs, isLoading } = useBlogs()

  const { notify } = useNotification()
  const updateBlogMutation = useUpdateBlog()
  const deleteBlogMutation = useDeleteBlog()

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
    </div>
  )
}

export default Blog
