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
      await page.getByRole('textbox').first().fill('ptester')
      await page.getByRole('textbox').last().fill('123456')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Playwright Tester logged-in')).toBeVisible()
    })

    test('fails with correct credentials', async ({ page }) => {

      await page.getByRole('textbox').first().fill('ptester')
      await page.getByRole('textbox').last().fill('abcxyz')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('ptester')
      await page.getByRole('textbox').last().fill('123456')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test(' a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('Title').fill('Testing blog creation with playwright')
      await page.getByPlaceholder('Author').fill('Playwright Tester')
      await page.getByPlaceholder('Url').fill('http://playwright.test/url')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Testing blog creation with playwright by Playwright Tester added')).toBeVisible()
      await expect(page.getByText('Testing blog creation with playwright Playwright Tester')).toBeVisible()
    })

    describe('and there is a blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByPlaceholder('Title').fill('Testing blog creation with playwright')
        await page.getByPlaceholder('Author').fill('Playwright Tester')
        await page.getByPlaceholder('Url').fill('http://playwright.test/url')
        await page.getByRole('button', { name: 'create' }).click()
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
    })
  })
})
