import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(_state, action) {
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    },
    clearNotification() {
      return null
    },
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
