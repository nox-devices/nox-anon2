import { Page } from 'playwright';

interface UberBookParams {
  pickup: string;
  dropoff: string;
  type: string;
}

export async function uberBook(page: Page, params: UberBookParams): Promise<string> {
  try {
    // Navigate to Uber booking page
    await page.goto('https://m.uber.com/looking');

    // Fill in pickup location
    await page.fill('input[data-test="search-pickup"]', params.pickup);

    // Fill in dropoff location
    await page.fill('input[data-test="search-destination"]', params.dropoff);

    // Select ride type
    await page.click(`button[data-test="vehicle-type-${params.type}"]`);

    // Confirm booking and get the booking ID
    await page.click('button[data-test="request-trip-button"]');
    const bookingId = await page.innerText('[data-test="trip-id"]');

    return bookingId;
  } catch (error) {
    console.error('Error booking Uber ride:', error);
    throw error;
  }
}