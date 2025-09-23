import { useState } from 'react'
import { Button, Col, Form, ListGroup, Row, Stack } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'
import { useAddComment } from '../hooks/useAddComment'
import { useBlogs } from '../hooks/useBlogs'
import { useDeleteBlog } from '../hooks/useDeleteBlog'
import { useUpdateBlog } from '../hooks/useUpdateBlog'
import storage from '../services/storage'

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
        onSuccess: (_data, { text }) => {
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
    <Stack gap={2}>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        <Button className="ms-3 py-1" onClick={() => handleVote(blog)}>
          like
        </Button>
      </div>
      <div>added by {nameOfUser}</div>
      {canRemove && (
        <Button
          variant="danger"
          className="me-auto"
          onClick={() => handleDelete(blog)}
        >
          remove
        </Button>
      )}

      <h3>comments</h3>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          handleAddComment(blog, comment)
          setComment('')
        }}
      >
        <Row>
          <Col xs={6} className="pe-0">
            <Form.Control
              type="text"
              data-testid="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </Col>
          <Col>
            <Button variant="secondary" type="submit">
              add comment
            </Button>
          </Col>
        </Row>
      </Form>
      <Col xs={6}>
        <ListGroup>
          {blog.comments.map((comment, index) => (
            <ListGroup.Item key={index}>{comment.text}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Stack>
  )
}

export default Blog
