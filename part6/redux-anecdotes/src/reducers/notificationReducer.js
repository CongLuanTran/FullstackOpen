import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload
    },
    clear() {
      return null
    }
  }
})

const { notify, clear } = notificationSlice.actions

let timeoutId = null

export const setNotification = (content, timeout = 5) => {
  return async dispatch => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      dispatch(clear())
      timeoutId = null
    }, timeout * 1000)

    dispatch(notify(content))
  }
}

export default notificationSlice.reducer
