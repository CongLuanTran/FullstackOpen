import { Col, ListGroup } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

const User = () => {
  const id = useParams().id
  const { data: users, isLoading } = useUsers()

  if (isLoading) {
    return <p>Loading...</p>
  }

  const user = users.find((u) => u.id === id)

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <Col xs={6}>
        <ListGroup as="ul">
          {[...user.blogs].map((blog) => (
            <ListGroup.Item as="li" key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </div>
  )
}

export default User
