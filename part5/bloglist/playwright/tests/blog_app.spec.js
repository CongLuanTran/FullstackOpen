const { loginWith, logout, createBlog } = require('./helper')
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: "Playwright Tester",
        username: "ptester",
        password: "123456"
      }
    })
    await page.goto('http://localhost:5173')
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
        await expect(page.getByTestId('like')).toContainText('0')
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByTestId('like')).toContainText('1')
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
          await request.post('http://localhost:3003/api/users', {
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
  })
})
