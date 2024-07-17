import { Page } from 'playwright';

export async function uberCheckHowFar(page: Page, params: { rideId: string }): Promise<{ distance: string }> {
  const { rideId } = params;

  try {
    // Navigate to Uber's ride status page
    await page.goto('https://www.uber.com/us/en/trip/');

    // Input the ride ID
    await page.fill('#ride-id-input', rideId);

    // Click the submit button
    await page.click('#submit-ride-id');

    // Wait for the ride details to load
    await page.waitForSelector('#ride-distance');

    // Extract the distance
    const distance = await page.$eval('#ride-distance', (el) => el.textContent);

    if (!distance) {
      throw new Error('Unable to retrieve ride distance');
    }

    return { distance };
  } catch (error) {
    console.error('Error checking Uber ride distance:', error);
    throw error;
  }
}