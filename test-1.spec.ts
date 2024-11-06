import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/');
  await page.locator('label').filter({ hasText: 'Can you enter name here through automation' }).getByRole('img').click();
  await page.getByPlaceholder('First Enter name').click();
  await page.getByPlaceholder('First Enter name').fill('moazam');
  await page.getByPlaceholder('First Enter name').press('Enter');
});