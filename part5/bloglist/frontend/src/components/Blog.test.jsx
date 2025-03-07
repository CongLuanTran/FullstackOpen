import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Test Blog',
    author: 'Tester',
    likes: 0,
    url: 'localhost:3000',
    user: {
      name: 'Screen'
    }
  }
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
      />
    ).container
  })

  test('should render its children', async () => {
    await screen.findAllByText(`${blog.title} ${blog.author}`)
  })

  test('should not display the children at start', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).not.toBeVisible()
  })

  test('should display the children after view button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).toBeVisible()
  })


  test('should hide the children after hide button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).toBeVisible()

    await user.click(button)
    expect(div).not.toBeVisible()
  })

  describe('like button', () => {
    test('should be called twice when button clicked twice', async () => {
      const user = userEvent.setup()
      const button = screen.getByText('like')
      await user.click(button)
      await user.click(button)

      expect(mockHandler.mock.calls).toHaveLength(2)
    })
  })
})
