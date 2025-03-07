import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm.jsx'
import { expect } from 'vitest'

describe('<BlogForm />', () => {
  test('should call the event hanlder with the right details when a blog is added', async () => {
    const blog = {
      title: 'BlogForm Test',
      author: 'Tester',
      url: 'Jest-dom'
    }
    const addBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={addBlog} />)

    const title = screen.getByPlaceholderText('Title')
    const author = screen.getByPlaceholderText('Author')
    const url = screen.getByPlaceholderText('Url')
    const sendButton = screen.getByText('create')

    await user.type(title, blog.title)
    await user.type(author, blog.author)
    await user.type(url, blog.url)
    await user.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toStrictEqual(blog)
  })
})
