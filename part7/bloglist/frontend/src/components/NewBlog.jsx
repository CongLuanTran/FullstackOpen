import { createRef } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../features/blogSlice'
import { useNotify } from '../hooks/useNotify'
import Togglable from './Togglable'
import { useField } from '../hooks/useField'

const NewBlog = () => {
  const title = useField('text')
  const url = useField('text')
  const author = useField('text')
  const dispatch = useDispatch()
  const notify = useNotify()
  const blogFormRef = createRef()

  const handleSubmit = event => {
    event.preventDefault()
    const newBlog = {
      title: title.inputProps.value,
      url: url.inputProps.value,
      author: author.inputProps.value,
    }
    dispatch(createBlog(newBlog))
    notify.success(`Blog created: ${title}, ${author}`)
    blogFormRef.current.toggleVisibility()
    title.reset()
    url.reset()
    author.reset()
  }

  return (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input {...title.inputProps} data-testid="title" />
        </div>
        <div>
          <label>URL:</label>
          <input {...url.inputProps} data-testid="url" />
        </div>
        <div>
          <label>Author:</label>
          <input {...author.inputProps} data-testid="author" />
        </div>
        <button type="submit">Create</button>
      </form>
    </Togglable>
  )
}

export default NewBlog
