import {test, expect, Page, Browser} from '@playwright/test';


test.beforeAll(async () => {
    console.log('Before tests');
  });
  
  test.afterAll(async () => {
    console.log('After tests');
  });
  
  test.beforeEach(async ({page}) => {
    console.log('Before each test');
    
  });
  
  test.afterEach(async ({page}) => {
    console.log('After each test');
  });

test('Xpath Practice Page', async ({page}) => {  
  await page.goto('https://selectorshub.com/xpath-practice-page/');
    await expect(page).toHaveTitle("Xpath Practice Page | Shadow dom, nested shadow dom, iframe, nested iframe and more complex automation scenarios.");
})

test('Hover over check out here button and select join training navigates to Bootcamp page', async ({page}) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/');
  await page.locator('text=Checkout here').hover();
  await page.locator('text=Join Training').click();
  const pageBootcampPromise = page.waitForEvent('popup');
  const pageBootcamp = await pageBootcampPromise;
  await expect(pageBootcamp).toHaveTitle('Bootcamp - SelectorsHub');
})


test('enter name after enablling the textbox', async ({ page }) => {
  await page.goto('https://selectorshub.com/xpath-practice-page/');
  await page.locator('label').filter({ hasText: 'Can you enter name here through automation' }).getByRole('img').click();
  await page.getByPlaceholder('First Enter name').fill('john doe');
  await page.getByPlaceholder('First Enter name').press('Enter');
});

