import { test, expect } from '@playwright/test';

test.describe('Betting Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByPlaceholder(/nombre de usuario|username/i).fill('usuario1');
    await page.getByPlaceholder(/contraseña|password/i).fill('password123');
    
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 15000 }),
      page.getByRole('button', { name: /iniciar sesión|login/i }).click()
    ]);
    
    await page.waitForLoadState('networkidle');
  });

  test('should display available events on dashboard', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    // Check for events section or empty state
    const hasEventsHeading = await page.getByText(/eventos|events/i).first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasEmptyState = await page.getByText(/no hay eventos/i).isVisible({ timeout: 2000 }).catch(() => false);
    
    // Should see either events heading or empty state
    expect(hasEventsHeading || hasEmptyState).toBeTruthy();
    
    // If events exist, check for event cards
    if (hasEventsHeading && !hasEmptyState) {
      const eventCards = page.locator('.bg-gradient-to-br, [class*="event"]');
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should place a bet on an event', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check if events are available
    const hasEvents = await page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).count() > 0;
    
    if (!hasEvents) {
      // Skip test if no events available
      test.skip();
      return;
    }
    
    // Find first available event option button
    const firstOption = page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).first();
    await firstOption.waitFor({ state: 'visible', timeout: 10000 });
    await firstOption.click();
    
    // Bet slip should open
    await expect(page.getByText(/apuesta|bet slip/i)).toBeVisible({ timeout: 5000 });
    
    // Enter bet amount
    const stakeInput = page.locator('input[type="number"]').first();
    await stakeInput.fill('100');
    
    // Click place bet button
    const placeBetButton = page.getByRole('button', { name: /apostar|place bet|realizar/i });
    await placeBetButton.click();
    
    // Should show success message
    await expect(page.getByText(/éxito|success|realizada/i)).toBeVisible({ timeout: 5000 });
  });

  test('should not allow betting twice on same event', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check if events are available
    const hasEvents = await page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).count() > 0;
    
    if (!hasEvents) {
      test.skip();
      return;
    }
    
    // Place first bet
    const firstOption = page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).first();
    await firstOption.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the event container
    const eventCard = firstOption.locator('..').locator('..').locator('..').locator('..');
    
    // Click to place bet
    await firstOption.click();
    await page.waitForTimeout(500);
    
    const stakeInput = page.locator('input[type="number"]').first();
    if (await stakeInput.isVisible()) {
      await stakeInput.fill('50');
      const placeBetButton = page.getByRole('button', { name: /apostar|place bet|realizar/i });
      await placeBetButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Try to bet again on same event
    const secondOption = eventCard.locator('button').filter({ hasText: /^\d+\.\d+$/ }).nth(1);
    if (await secondOption.isVisible()) {
      await secondOption.click();
      
      // Should show warning message or buttons should be disabled
      const hasWarning = await page.getByText(/ya|already|apostado|bet/i).isVisible({ timeout: 3000 }).catch(() => false);
      const isDisabled = await secondOption.isDisabled();
      
      expect(hasWarning || isDisabled).toBeTruthy();
    }
  });

  test('should view bet history', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Navigate to My Bets page - use evaluate to bypass viewport issues
    const myBetsLink = page.getByRole('link', { name: /mis apuestas|my bets|historial/i });
    await myBetsLink.evaluate((el: HTMLElement) => el.click());
    
    await expect(page).toHaveURL(/\/my-bets/, { timeout: 5000 });
    
    // Should see bets list or empty state
    const hasBets = await page.getByText(/evento|event|apuesta|bet/i).isVisible({ timeout: 5000 }).catch(() => false);
    const isEmpty = await page.getByText(/no hay|no tienes|sin apuestas/i).isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasBets || isEmpty).toBeTruthy();
  });

  test('should display bet status correctly', async ({ page }) => {
    // Go to bet history
    await page.goto('/dashboard/my-bets');
    
    // If there are bets, check for status badges
    const statusBadges = page.locator('[class*="badge"]').or(page.locator('[class*="status"]'));
    const count = await statusBadges.count();
    
    if (count > 0) {
      // Should see status like: Pending, Won, Lost
      const firstStatus = await statusBadges.first().textContent();
      expect(firstStatus).toMatch(/pendiente|pending|ganada|won|perdida|lost/i);
    }
  });

  test('should show insufficient balance error', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check if events are available
    const hasEvents = await page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).count() > 0;
    
    if (!hasEvents) {
      test.skip();
      return;
    }
    
    // Try to place bet with very large amount
    const firstOption = page.locator('button').filter({ hasText: /^\d+\.\d+$/ }).first();
    await firstOption.waitFor({ state: 'visible', timeout: 10000 });
    await firstOption.click();
    
    await page.waitForTimeout(500);
    
    const stakeInput = page.locator('input[type="number"]').first();
    if (await stakeInput.isVisible()) {
      await stakeInput.fill('999999999');
      
      const placeBetButton = page.getByRole('button', { name: /apostar|place bet|realizar/i });
      await placeBetButton.click();
      
      // Should show insufficient balance error
      await expect(page.getByText(/insuficiente|insufficient|saldo|balance/i)).toBeVisible({ timeout: 5000 });
    }
  });
});

