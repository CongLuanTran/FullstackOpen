const { loginWith, logout, createBlog } = require('./helper')
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: "Playwright Tester",
        username: "ptester",
        password: "123456"
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ptester', '123456')
      await expect(page.getByText('Playwright Tester logged-in')).toBeVisible()
    })

    test('fails with correct credentials', async ({ page }) => {
      await loginWith(page, 'ptester', 'abdxyz')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'ptester', '123456')
    })

    test(' a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing blog creation with playwright', 'Playwright Tester', 'http://playwright.test/url')
      await expect(page.getByText('Testing blog creation with playwright Playwright Tester')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Testing blog creation with playwright', 'Playwright Tester', 'http://playwright.test/url')
      })

      test('blog details are hidden by default', async ({ page }) => {
        await expect(page.locator('.blogDetails')).toBeHidden()
      })

      test('blog details are shown after clicking view button', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.locator('.blogDetails')).toBeVisible()
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByTestId('likes')).toContainText('0')
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByTestId('likes')).toContainText('1')
      })

      describe('deletion of the a blog', () => {
        test('succeeds by its creator', async ({ page }) => {
          await expect(page.locator('.blog')).toHaveCount(1)
          await page.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()
          await expect(page.locator('.blog')).toHaveCount(0)
        })

        test('fails by other users', async ({ page, request }) => {
          await request.post('/api/users', {
            data: {
              name: "Another Tester",
              username: "atester",
              password: "123456"
            }
          })
          await logout(page)
          await loginWith(page, 'atester', '123456')
          await expect(page.locator('.blog')).toHaveCount(1)
          await page.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()
          await expect(page.locator('.blog')).toHaveCount(1)
        })
      })
    })

    describe('and many blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'The first blog', 'Playwright Tester', 'http://playwright.test/url')
        await createBlog(page, 'The second blog', 'Playwright Tester', 'http://playwright.test/url')
        await createBlog(page, 'The third blog', 'Playwright Tester', 'http://playwright.test/url')
        await expect(page.locator('.blog')).toHaveCount(3)
      })

      test('blogs are ordered according to their likes', async ({ page }) => {
        const firstBlog = page.locator('.blog')
          .filter({ hasText: 'The first blog' })
        const thirdBlog = page.locator('.blog')
          .filter({ hasText: 'The third blog' })

        await firstBlog.getByRole('button', { name: 'view' }).click()
        await firstBlog.getByRole('button', { name: 'like' }).click()

        await thirdBlog.getByRole('button', { name: 'view' }).click()
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await expect(thirdBlog.getByTestId('likes')).toHaveText('1')
        await thirdBlog.getByRole('button', { name: 'like' }).click()

        await expect(page.locator('.blog').first()).toHaveText(/The third blog/)
        await expect(page.locator('.blog').last()).toHaveText(/The second blog/)
      })
    })
  })
})
