import { useState } from 'react'
import { userLogin } from '../features/userSlice'
import { useDispatch } from 'react-redux'
import { useNotify } from '../hooks/useNotify'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const notify = useNotify()

  const handleLogin = event => {
    event.preventDefault()
    try {
      dispatch(userLogin({ username, password }))
      notify.success(`Welcome back, ${user.name}`)
    } catch (error) {
      notify.error('Wrong credentials')
    }
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
          onChange={e => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          data-testid="password"
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
