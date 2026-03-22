import { test, expect } from '@playwright/test'

test('アプリが正常に起動する', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/aws-ri-simulator/)
})
