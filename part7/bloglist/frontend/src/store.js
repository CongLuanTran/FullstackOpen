import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './features/notificationSlice'
import blogReducer from './features/blogSlice'

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
})
