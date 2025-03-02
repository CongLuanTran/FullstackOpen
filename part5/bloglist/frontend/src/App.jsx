import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm.jsx'
import Togglable from './components/Togglable.jsx'
import BlogForm from './components/BlogForm.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll().then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify({
        message: 'wrong username or password',
        isError: true,
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const notify = (notification) => {
    if (!notification) {
      return null
    }

    const { message, isError } = notification
    if (!message) {
      return null
    }

    setTimeout(() => {
      setNotification(null)
    }, 5000)

    const notifyState = {
      color: isError ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

    return <div style={notifyState}>{message}</div>
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify({
          message: `${blogObject.title} by ${blogObject.author} added`
        })
      })
      .catch(error => {
        notify({
          message: error,
          isError: true
        })
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map((blog) => (
          blog.id === returnedBlog.id
            ? { ...returnedBlog, user: blog.user }
            : blog
        )))
      })
      .catch(error => {
        notify({
          message: error,
          isError: true,
        })
      })
  }

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
    </div>
  )

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </div>
  )

  const allBlogs = () => (
    <>
      <h2>blogs</h2>
      {notify(notification)}
      <p>
        {user.name} logged-in
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      {
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
          )
      }
    </>
  )

  return (
    <div>
      {
        user === null
          ? loginForm()
          : allBlogs()
      }
    </div>
  )
}

export default App
