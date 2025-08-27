import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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

  return (
    <Router>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
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
