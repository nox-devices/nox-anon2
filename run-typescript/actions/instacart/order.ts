import { Page } from 'playwright';

export async function instacartOrder(page: Page, params: { items: Array<{ name: string, quantity: number }>, address: string }): Promise<string> {
  const { items, address } = params;

  try {
    // Navigate to Instacart
    await page.goto('https://www.instacart.com');

    // Handle any initial popups or cookie notices
    await handlePopups(page);

    // Search for each item and add to cart
    for (const item of items) {
      await searchAndAddItem(page, item);
    }

    // Proceed to checkout
    await proceedToCheckout(page);

    // Enter delivery address
    await enterDeliveryAddress(page, address);

    // Complete the order process
    const orderId = await completeOrder(page);

    console.log(`Instacart order placed successfully. Order ID: ${orderId}`);
    return orderId;
  } catch (error) {
    console.error('Error during Instacart order:', error);
    throw error;
  }
}

async function handlePopups(page: Page): Promise<void> {
  try {
    // Check for and close any cookie notice
    const cookieNotice = await page.waitForSelector('#cookie-banner', { timeout: 5000 }).catch(() => null);
    if (cookieNotice) {
      await page.click('#cookie-banner button[aria-label="Close"]');
    }

    // Check for and close any promotional popups
    const promoPopup = await page.waitForSelector('.modal-content', { timeout: 5000 }).catch(() => null);
    if (promoPopup) {
      await page.click('.modal-content button[aria-label="Close"]');
    }
  } catch (error) {
    console.error('Error handling popups:', error);
  }
}

async function searchAndAddItem(page: Page, item: { name: string, quantity: number }): Promise<void> {
  try {
    // Search for the item
    await page.fill('input[data-testid="search-bar-input"]', item.name);
    await page.press('input[data-testid="search-bar-input"]', 'Enter');

    // Wait for search results
    await page.waitForSelector('.item-card', { timeout: 10000 });

    // Click on the first item in the search results
    await page.click('.item-card');

    // Add the item to the cart with the specified quantity
    for (let i = 0; i < item.quantity; i++) {
      await page.click('button[data-testid="add-to-cart-button"]');
    }
  } catch (error) {
    console.error(`Error adding item ${item.name} to cart:`, error);
  }
}

async function proceedToCheckout(page: Page): Promise<void> {
  try {
    // Click on the cart icon
    await page.click('a[data-testid="cart-button"]');

    // Wait for the cart page to load
    await page.waitForSelector('button[data-testid="checkout-button"]', { timeout: 10000 });

    // Click the checkout button
    await page.click('button[data-testid="checkout-button"]');
  } catch (error) {
    console.error('Error proceeding to checkout:', error);
  }
}

async function enterDeliveryAddress(page: Page, address: string): Promise<void> {
  try {
    // Wait for the address input field
    await page.waitForSelector('input[data-testid="address-input"]', { timeout: 10000 });

    // Enter the delivery address
    await page.fill('input[data-testid="address-input"]', address);

    // Wait for address suggestions and select the first one
    await page.waitForSelector('.address-suggestion', { timeout: 5000 });
    await page.click('.address-suggestion');

    // Click continue or save button
    await page.click('button[data-testid="continue-button"]');
  } catch (error) {
    console.error('Error entering delivery address:', error);
  }
}

async function completeOrder(page: Page): Promise<string> {
  try {
    // Wait for the payment section
    await page.waitForSelector('button[data-testid="place-order-button"]', { timeout: 10000 });

    // Click the place order button
    await page.click('button[data-testid="place-order-button"]');

    // Wait for the order confirmation page
    await page.waitForSelector('.order-confirmation', { timeout: 20000 });

    // Extract the order ID from the confirmation page
    const orderIdElement = await page.$('.order-id');
    const orderId = await orderIdElement?.textContent() || 'Unknown';

    return orderId.trim();
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
}