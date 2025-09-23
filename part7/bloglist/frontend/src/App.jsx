import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import User from './components/User'
import UserList from './components/UserList'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user, handleLogout } = useAuth()

  if (!user) {
    return (
      <Container>
        <h2>blogs</h2>
        <Notification />
        <Login />
      </Container>
    )
  }

  return (
    <Router>
      <Navbar>
        <Container>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse className="justify-content-between" id="navbar">
            <Nav>
              <Nav.Item className="m-1">
                <Link to="/">blogs</Link>
              </Nav.Item>
              <Nav.Item className="m-1">
                <Link to="/users">users</Link>
              </Nav.Item>
            </Nav>
            <Nav className="align-items-center">
              <Nav.Item className="m-1">
                <span>{user.name} logged in</span>
              </Nav.Item>
              <Nav.Item className="m-1">
                <Button variant="danger" className="p-1" onClick={handleLogout}>
                  logout
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <h2>blog app</h2>
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <NewBlog />
                <BlogList className="my-2" />
              </div>
            }
          />
          <Route
            path="/blogs"
            element={
              <div>
                <NewBlog />
                <BlogList className="my-2" />
              </div>
            }
          />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
