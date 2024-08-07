import { Page } from "playwright";
import { retryWithBackoff, takeScreenshot } from "../browserHelpers";
import { NETWORK_TIMEOUT } from "../config";

const AMAZON_URL = "https://amazon.com";

export const amazonAddAirpodsToCart = async (page: Page) => {
    console.log("Starting amazonAddAirpodsToCart function...");

    console.log("Step 0: Navigating to Amazon homepage...");
    await retryWithBackoff(async () => {
      await page.goto(AMAZON_URL, { timeout: NETWORK_TIMEOUT });
      console.log("Successfully navigated to Amazon.");
      await takeScreenshot(page, "amazon", "0-amazon-homepage-loaded");
    });

    console.log("Step 1: Focusing on the search bar and searching for AirPods...");
    await retryWithBackoff(async () => {
      await page.focus("#twotabsearchtextbox");
      await page.keyboard.type("AirPods");
      await page.keyboard.press("Enter");
      console.log("Search submitted for AirPods.");
      await takeScreenshot(page, "amazon", "1-search-submitted");
    });

    console.log("Step 2: Waiting for search results...");
    await page.waitForSelector(".s-main-slot.s-result-list");
    console.log("Search results loaded.");
    await takeScreenshot(page, "amazon", "2-search-results-loaded");

    console.log("Step 3: Navigating to AirPods product page...");
    await retryWithBackoff(async () => {
      await page.goto("https://www.amazon.com/Apple-AirPods-Charging-Latest-Model/dp/B07PXGQC1Q");
      console.log("Navigated to AirPods product page.");
      await takeScreenshot(page, "amazon", "3-product-page-loaded");
    });

    console.log("Step 4: Waiting for 'Add to Cart' button...");
    await retryWithBackoff(async () => {
      await page.waitForSelector("#add-to-cart-button", { state: "visible" });
      console.log("'Add to Cart' button is visible and enabled.");
      await takeScreenshot(page, "amazon", "4-add-to-cart-visible");
    });

    console.log("Step 5: Clicking 'Add to Cart' button...");
    await retryWithBackoff(async () => {
      const addToCartButton = await page.$("#add-to-cart-button");
      if (addToCartButton) {
        await addToCartButton.click();
        console.log("'Add to Cart' button clicked successfully.");
        await takeScreenshot(page, "amazon", "5-add-to-cart-clicked");
      } else {
        console.log("Add to Cart button not found");
      }
    });

    console.log("Step 6: Handling insurance option...");
    await retryWithBackoff(async () => {
      await page.waitForSelector("#attachSiNoCoverage", { state: "visible", timeout: 5000 });
      await page.click("#attachSiNoCoverage");
      console.log("Insurance option handled.");
      await takeScreenshot(page, "amazon", "6-insurance-option-handled");
    });

    console.log("Step 7: Navigating to Cart...");
    await retryWithBackoff(async () => {
        await page.click("a#nav-cart"); // Click on the cart icon to navigate to the cart page
        console.log("Navigated to Cart.");
        await takeScreenshot(page, "amazon", "7-cart-navigated");
    });

    console.log("Step 8: Waiting for Checkout Button...");
    await retryWithBackoff(async () => {
        await page.waitForSelector('input[name="proceedToRetailCheckout"]', { state: "visible" });
        console.log("Checkout button is visible.");
        await takeScreenshot(page, "amazon", "8-checkout-button-visible");
    });

    console.log("Amazon Airpods addition to cart process completed.");
};
