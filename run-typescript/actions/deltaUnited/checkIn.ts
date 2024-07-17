import { Page } from 'playwright';

export async function deltaUnitedCheckIn(page: Page, params: { bookingReference: string, lastName: string }): Promise<SuccessOrFail> {
  const { bookingReference, lastName } = params;

  try {
    // Navigate to the Delta/United check-in page
    await page.goto('https://www.delta.com/checkin/search', { waitUntil: 'networkidle' });

    // Check if there's a cookie acceptance dialog and handle it
    const cookieAcceptSelector = '#onetrust-accept-btn-handler';
    if (await page.isVisible(cookieAcceptSelector)) {
      await page.click(cookieAcceptSelector);
    }

    // Fill in the booking reference
    await page.fill('#booking-reference', bookingReference);

    // Fill in the last name
    await page.fill('#last-name', lastName);

    // Click the submit button
    await page.click('#submit-check-in');

    // Wait for the confirmation page
    await page.waitForSelector('#confirmation-message', { timeout: 30000 });

    // Check if check-in was successful
    const confirmationText = await page.innerText('#confirmation-message');

    if (confirmationText.includes('Check-in successful')) {
      console.log('Delta/United check-in successful');
      return 'Success';
    } else {
      console.log('Delta/United check-in failed: Unexpected confirmation message');
      return 'Fail';
    }

  } catch (error) {
    console.error('Error during Delta/United check-in:', error);
    return 'Fail';
  }
}

type SuccessOrFail = 'Success' | 'Fail';