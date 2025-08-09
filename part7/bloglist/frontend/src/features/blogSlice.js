import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter(b => b.id !== id)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(b => (b.id === updatedBlog.id ? updatedBlog : b))
    },
  },
})

export const { setBlogs, appendBlog, deleteBlog, updateBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = newBlog => {
  return async dispatch => {
    const savedBlog = await blogService.create(newBlog)
    dispatch(appendBlog(savedBlog))
  }
}

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch(deleteBlog(blog.id))
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export default blogSlice.reducer
