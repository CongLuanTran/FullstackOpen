import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import { useAuth } from './context/AuthContext'

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
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <NewBlog />
      <BlogList />
    </div>
  )
}

export default App
