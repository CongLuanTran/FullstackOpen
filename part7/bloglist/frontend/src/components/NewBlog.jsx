import { createRef, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useNotification } from '../context/NotificationContext'
import { useAddBlog } from '../hooks/useAddBlog'
import Togglable from './Togglable'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const blogFormRef = createRef()
  const { notify } = useNotification()

  const newBlogMutation = useAddBlog()
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
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formTitle">
          <Form.Label column sm="2">
            Title:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              data-testid="title"
              value={title}
              onChange={handleTitleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formURL">
          <Form.Label column sm="2">
            URL:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              data-testid="url"
              value={url}
              onChange={handleUrlChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Author:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              data-testid="author"
              value={author}
              onChange={handleAuthorChange}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Create</Button>
      </Form>
    </Togglable>
  )
}

export default NewBlog
