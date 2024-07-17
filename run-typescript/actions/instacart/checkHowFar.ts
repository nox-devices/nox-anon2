import { Page } from 'playwright';

export async function instacartCheckHowFar(page: Page, params: { orderId: string }): Promise<{ status: string, estimatedDeliveryTime: string }> {
  const { orderId } = params;

  try {
    // Navigate to Instacart order tracking page
    await page.goto('https://www.instacart.com/orders');

    // Check if login is required
    const loginButton = await page.$('button:has-text("Log in")');
    if (loginButton) {
      // Implement login logic here
      // For example:
      // await loginButton.click();
      // await page.fill('input[name="email"]', 'your_email@example.com');
      // await page.fill('input[name="password"]', 'your_password');
      // await page.click('button:has-text("Log in")');
      console.log('Login required. Please implement login logic.');
    }

    // Find the order with the given orderId
    const orderElement = await page.waitForSelector(`[data-testid="order-${orderId}"]`, { timeout: 5000 });
    if (!orderElement) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Extract the order status
    const statusElement = await orderElement.$('[data-testid="order-status"]');
    const status = await statusElement?.textContent() || 'Unknown';

    // Extract the estimated delivery time
    const deliveryTimeElement = await orderElement.$('[data-testid="estimated-delivery-time"]');
    const estimatedDeliveryTime = await deliveryTimeElement?.textContent() || 'Unknown';

    return {
      status: status.trim(),
      estimatedDeliveryTime: estimatedDeliveryTime.trim()
    };
  } catch (error) {
    console.error('Error checking Instacart order status:', error);
    throw error;
  }
}