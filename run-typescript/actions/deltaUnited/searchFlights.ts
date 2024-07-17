import { Page } from 'playwright';

type FlightList = {
  flights: Array<{
    airline: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: string;
  }>;
};

export async function deltaUnitedSearchFlights(page: Page, params: { origin: string, destination: string, departureDate: string, returnDate: string, class: string }): Promise<FlightList> {
  const { origin, destination, departureDate, returnDate, class: flightClass } = params;

  try {
    // Navigate to the flight search page (using Delta as an example)
    await page.goto('https://www.delta.com');

    // Handle cookie acceptance dialog if present
    try {
      await page.click('#onetrust-accept-btn-handler', { timeout: 5000 });
    } catch (error) {
      // If the cookie dialog is not present, continue
    }

    // Fill in the search form
    await page.fill('#fromAirportCode', origin);
    await page.fill('#toAirportCode', destination);
    await page.fill('#departureDate', departureDate);
    await page.fill('#returnDate', returnDate);
    await page.selectOption('#cabinType', flightClass);

    // Submit the search form
    await page.click('#btn-book-submit');

    // Wait for the search results to load
    await page.waitForSelector('.flight-result', { timeout: 30000 });

    // Extract flight information
    const flightList: FlightList = {
      flights: await page.$$eval('.flight-result', (elements) =>
        elements.map((el) => ({
          airline: el.querySelector('.airline-name')?.textContent?.trim() || '',
          departureTime: el.querySelector('.departure-time')?.textContent?.trim() || '',
          arrivalTime: el.querySelector('.arrival-time')?.textContent?.trim() || '',
          duration: el.querySelector('.flight-duration')?.textContent?.trim() || '',
          price: el.querySelector('.price')?.textContent?.trim() || '',
        }))
      ),
    };

    return flightList;
  } catch (error) {
    console.error('Error during Delta/United flight search:', error);
    throw error;
  }
}