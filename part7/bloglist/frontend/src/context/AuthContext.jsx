import { createContext, useContext, useState, useEffect } from 'react'
import loginService from '../services/login'
import storage from '../services/storage'
import useNotify from '../hooks/useNotify'

const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null)
  const notify = useNotify()

  useEffect(() => {
    const user = storage.loadUser()
    if (user) setUser(user)
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      storage.saveUser(user)
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    notify(`Bye, ${user.name}!`)
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
