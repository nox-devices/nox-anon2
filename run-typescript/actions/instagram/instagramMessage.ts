import { Page } from "playwright";
import { waitForNetworkIdle, retryWithBackoff, takeScreenshot, waitForPageLoad } from "../browserHelpers";
import { NETWORK_TIMEOUT } from "../config";

export const sendInstagramMessage = async (page: Page, params: { username: string, message: string }) => {
  // NOT WORKING
  const INSTAGRAM_MESSAGES_URL = `https://www.instagram.com/${params.username}`;
  console.log("Starting sendMessage function...");
  console.log("Step 1: Navigating to Instagram Messages...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Messages.");
  });
  await takeScreenshot(page, "instagram", "1-instagram-messages");

  // if (await page.isVisible('text="Not Now"')) {
  //   await page.click('text="Not Now"');
  //   console.log('"Not Now" button clicked.');
  // }

  await page.getByRole('button', { name: 'Message' }).click();
  await page.getByRole('button', { name: 'Not Now' }).click();

  console.log("Step 2: Waiting for page to load...");
  await waitForNetworkIdle(page);
  await waitForPageLoad(page)

  await page.getByLabel('Message', { exact: true }).fill(params.message);
  await page.getByRole('button', { name: 'Send' }).click();
  
  await takeScreenshot(page, "instagram", "2-after-page-load");
  console.log("Completed sendMessage function...");
}

export const getRecentNotification = async (page: Page) => {
  const INSTAGRAM_MESSAGES_URL = `https://instagram.com/notifications`;
  console.log("Starting getRecentNotification function...");

  console.log("Step 1: Navigating to Instagram Notifications...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Notifications.");
  });

  await waitForNetworkIdle(page);
  await waitForPageLoad(page);

  console.log("Step 2: Extracting text content...");
  const textContent = await page.evaluate(() => {
    return document.body.innerText;
  });

  console.log("Text content of the page:", textContent);
};


export const instaSearch = async (page: Page, query: string) => {
  const response = await page.request.get(`https://www.instagram.com/web/search/topsearch/?query=${query}`);
  const data = await response.json();
  if (data.users && Array.isArray(data.users)) {
    data.users.forEach((user, index) => {
      console.log(`User ${index}:`, JSON.stringify(user, null, 2));
    });
  } else {
    console.log("No users data found or data is not in expected format.");
  }
  console.log(data) // Todo: contains users, places, hashtags
  return data;
}