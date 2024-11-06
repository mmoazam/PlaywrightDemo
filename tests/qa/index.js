// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function getArticleTitles(page) {
  const newsArticles = await page.locator('.titleline').all();
  const newsArticlesText = await Promise.all(newsArticles.map(async (element) => {
    return await element.innerText();
  }));

  const ageElements = await page.locator('.age').all();
  const timestamps = await Promise.all(ageElements.map(async (element) => {
    return await element.getAttribute('title');
  }));

  return { newsArticlesText, timestamps };
}

function isValidDate(dateStr) {
  const date = new Date(dateStr);
  return !isNaN(date);
}

function areTimestampsSorted(timestamps) {
  return timestamps.every((timestamp, index, arr) => {
    if (index === 0) return true; // Skip the first element

    const currentDateStr = timestamp.split(' ')[0];
    const previousDateStr = arr[index - 1].split(' ')[0];

    if (!isValidDate(currentDateStr) || !isValidDate(previousDateStr)) {
      console.error(`Invalid date found: ${currentDateStr} or ${previousDateStr}`);
      return false; // Return false if any date is invalid
    }

    const currentDate = new Date(currentDateStr);
    const previousDate = new Date(previousDateStr);

    return currentDate <= previousDate; // Check if current is less than or equal to the previous
  });
}

function saveResultsToFile(combinedResults) {
  const outputPath = path.join(__dirname, 'evidence', 'hackerNewsTop100.txt');

  // Ensure the evidence folder exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the combined results to the file
  fs.writeFileSync(outputPath, combinedResults.join('\n'), 'utf8');
  console.log(`Results saved to ${outputPath}`);
}

async function sortHackerNewsArticles() {
  const NUMBER_REQUIRED_TITLES = 100;
  let browser, page, context;

  try {
    // Launch browser
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto("https://news.ycombinator.com/newest");
    assert.strictEqual(await page.title(), "New Links | Hacker News", 'Page title does not match');

    await page.getByRole('link', { name: 'new', exact: true }).click();

    const allTitles = [];
    const allTimestamps = [];

    while (allTitles.length < NUMBER_REQUIRED_TITLES) {
      const { newsArticlesText, timestamps } = await getArticleTitles(page);
      allTitles.push(...newsArticlesText);
      allTimestamps.push(...timestamps);

      const moreLink = page.getByRole('link', { name: 'More', exact: true });
      if (await moreLink.count() > 0) {
        await moreLink.click();
      } else {
        break;
      }
    }

    const combinedResults = allTitles.map((title, index) => {
      return `${title} :: ${allTimestamps[index] || ''}`;
    });

    // Save the results to a file
    saveResultsToFile(combinedResults);

    // Check if timestamps are sorted
    if (areTimestampsSorted(allTimestamps)) {
      console.log("The timestamps are sorted from newest to oldest.");
    } else {
      console.log("The timestamps are NOT sorted correctly.");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await context.close();
    await browser.close();
  }
}


(async () => {
  await sortHackerNewsArticles();
})();
