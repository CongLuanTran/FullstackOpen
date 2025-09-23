import { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin: doLogin } = useAuth()

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Form onSubmit={handleLogin}>
      <Row>
        <Col xs={4}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              data-testid="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              data-testid="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={1} className="d-flex align-items-end">
          <Button type="submit">Login</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default Login
