import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import BlogList from './components/BlogList'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import User from './components/User'
import UserList from './components/UserList'
import { useAuth } from './context/AuthContext'
import Blog from './components/Blog'

const App = () => {
  const { user, handleLogout } = useAuth()

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login />
      </div>
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <nav>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        <span style={padding}>{user.name} logged in</span>
        <button style={padding} onClick={handleLogout}>
          logout
        </button>
      </nav>
      <h2>blogs</h2>
      <Notification />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <NewBlog />
              <BlogList />
            </div>
          }
        />
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Router>
  )
}

export default App
