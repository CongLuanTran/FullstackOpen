import { createRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../features/blogSlice'
import { useNotify } from '../hooks/useNotify'
import Togglable from './Togglable'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const dispatch = useDispatch()
  const notify = useNotify()
  const blogFormRef = createRef()

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = event => {
    setAuthor(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(createBlog({ title, url, author }))
    notify.success(`Blog created: ${title}, ${author}`)
    blogFormRef.current.toggleVisibility()
    setTitle('')
    setUrl('')
    setAuthor('')
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
