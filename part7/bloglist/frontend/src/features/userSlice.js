import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storage from '../services/storage'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload
    },
    unsetUser() {
      return null
    },
  },
})

export const { setUser, unsetUser } = userSlice.actions

export const userLogin = credentials => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    dispatch(setUser(user))
    storage.saveUser(user)
  }
}

export const userLogout = () => {
  return async dispatch => {
    dispatch(unsetUser())
    storage.removeUser()
  }
}

export const userLoad = () => {
  return dispatch => {
    const user = storage.loadUser()
    if (user) {
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer
