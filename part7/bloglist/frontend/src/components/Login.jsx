import { useState } from 'react'
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
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          data-testid="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
