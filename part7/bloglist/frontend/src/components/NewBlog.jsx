import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRef, useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const blogFormRef = createRef()
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onMutate: (blog) => {
      console.log('creating', blog)
    },
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => blogs.concat(newBlog))
    },
  })

  const handleCreate = (blog) => {
    newBlogMutation.mutate(blog, {
      onSuccess: (newBlog) => {
        notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
      },
    })
    blogFormRef.current.toggleVisibility()
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreate({ title, url, author })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            data-testid="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            data-testid="url"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            data-testid="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </Togglable>
  )
}

export default NewBlog
