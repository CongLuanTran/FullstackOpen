import { createContext, useContext, useEffect, useReducer } from 'react'
import loginService from '../services/login'
import storage from '../services/storage'
import { useNotification } from './NotificationContext'

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  const [user, userDispatch] = useReducer(UserReducer, null)
  const { notify } = useNotification()

  useEffect(() => {
    const user = storage.loadUser()
    if (user) userDispatch({ type: 'SET', payload: user })
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      userDispatch({ type: 'SET', payload: user })
      storage.saveUser(user)
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR' })
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
