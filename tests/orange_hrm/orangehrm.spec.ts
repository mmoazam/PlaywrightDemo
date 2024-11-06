import {test, expect} from '@playwright/test';
import { describe } from 'node:test';




describe('OrangeHRM', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    })
    
    test('Login', async ({page}) => {    
        await page.locator('[placeholder="Username"]').click();
        await page.locator('[placeholder="Username"]').fill('Admin');
        await page.locator('[placeholder="Username"]').press('Tab');
        await page.locator('[placeholder="Password"]').fill('admin123');
        await page.locator('[placeholder="Password"]').press('Tab');
        await page.locator('button:has-text("Login")').click();
        await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    })
})
