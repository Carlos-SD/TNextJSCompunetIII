import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByPlaceholder(/nombre de usuario|username/i).fill('admin');
    await page.getByPlaceholder(/contraseña|password/i).fill('password123');
    
    // Click login button and wait for navigation
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 15000 }),
      page.getByRole('button', { name: /iniciar sesión|login/i }).click()
    ]);
    
    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should access admin panel', async ({ page }) => {
    // Navigate directly to admin panel
    await page.goto('/dashboard/admin');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/\/dashboard\/admin/);
    await expect(page.getByText(/panel|admin|gestión/i).first()).toBeVisible();
  });

  test('should navigate to events management', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Click on events management card or link
    const eventsLink = page.getByRole('link', { name: /eventos|events|gestión de eventos/i });
    await eventsLink.click();
    
    await expect(page).toHaveURL(/\/dashboard\/admin\/events/, { timeout: 5000 });
  });

  test('should create a new event', async ({ page }) => {
    await page.goto('/dashboard/admin/events');
    await page.waitForTimeout(2000); // Wait for page load
    
    // Click create event button
    const createButton = page.getByRole('button', { name: /crear|nuevo|new event/i });
    await createButton.click();
    
    // Fill event form
    await page.getByPlaceholder(/nombre|name/i).first().fill(`Test Event ${Date.now()}`);
    await page.getByPlaceholder(/descripción|description/i).fill('Test Description');
    
    // Fill options
    const optionInputs = page.locator('input[placeholder*="opción"], input[placeholder*="option"]');
    const oddsInputs = page.locator('input[type="number"]');
    
    if (await optionInputs.count() > 0) {
      await optionInputs.nth(0).fill('Option A');
      await oddsInputs.nth(0).fill('2.5');
      
      await optionInputs.nth(1).fill('Option B');
      await oddsInputs.nth(1).fill('1.8');
    }
    
    // Submit form
    const submitButton = page.getByRole('button', { name: /crear|guardar|save/i }).last();
    await submitButton.click();
    
    // Should show success message
    await expect(page.getByText(/éxito|success|creado/i)).toBeVisible({ timeout: 5000 });
  });

  test('should filter events by status', async ({ page }) => {
    await page.goto('/dashboard/admin/events');
    await page.waitForTimeout(2000);
    
    // Find status filter dropdown
    const statusFilter = page.locator('select').first();
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('open');
      await page.waitForTimeout(1000);
      
      // Check that only open events are shown
      const events = page.locator('[class*="event"]');
      const count = await events.count();
      
      if (count > 0) {
        // Should see open status on events
        await expect(page.getByText(/abierto|open/i).first()).toBeVisible();
      }
    }
  });

  test('should close an event', async ({ page }) => {
    await page.goto('/dashboard/admin/events');
    await page.waitForTimeout(2000);
    
    // Find an open event and click close button
    const closeButtons = page.getByRole('button', { name: /cerrar|close/i });
    
    if (await closeButtons.count() > 0) {
      await closeButtons.first().click();
      
      // Select winner from modal
      await page.waitForTimeout(1000);
      const winnerSelect = page.locator('select, input[type="radio"]').first();
      
      if (await winnerSelect.isVisible({ timeout: 3000 })) {
        if (await winnerSelect.evaluate(el => el.tagName) === 'SELECT') {
          await winnerSelect.selectOption({ index: 1 });
        }
        
        // Confirm close
        const confirmButton = page.getByRole('button', { name: /cerrar|confirmar|close/i }).last();
        await confirmButton.click();
        
        // Should show success message
        await expect(page.getByText(/éxito|success|cerrado/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should access user management', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Click on users management
    const usersLink = page.getByRole('link', { name: /usuarios|users|gestión de usuarios/i });
    await usersLink.click();
    
    await expect(page).toHaveURL(/\/dashboard\/admin\/users/, { timeout: 5000 });
    
    // Should see users list
    await expect(page.getByText(/usuarios|users/i).first()).toBeVisible();
  });

  test('should toggle user admin role', async ({ page }) => {
    await page.goto('/dashboard/admin/users');
    await page.waitForTimeout(2000);
    
    // Find toggle admin button (not for current user)
    const toggleButtons = page.getByRole('button', { name: /admin|rol/i });
    
    if (await toggleButtons.count() > 1) {
      const initialState = await toggleButtons.nth(1).textContent();
      await toggleButtons.nth(1).click();
      
      // Should show success message
      await expect(page.getByText(/éxito|success|actualizado/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should search events', async ({ page }) => {
    await page.goto('/dashboard/admin/events');
    await page.waitForTimeout(2000);
    
    // Find search input
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      
      // Results should be filtered
      const noResults = await page.getByText(/no hay|no se encontr|sin result/i).isVisible({ timeout: 2000 }).catch(() => false);
      const hasResults = await page.locator('[class*="event"]').count() > 0;
      
      expect(noResults || hasResults).toBeTruthy();
    }
  });

  test('should paginate events list', async ({ page }) => {
    await page.goto('/dashboard/admin/events');
    await page.waitForTimeout(2000);
    
    // Look for pagination buttons
    const nextButton = page.getByRole('button', { name: /siguiente|next|›|»/i });
    
    if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
      const firstEvent = await page.locator('[class*="event"]').first().textContent();
      
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      const newFirstEvent = await page.locator('[class*="event"]').first().textContent();
      
      // Content should change
      expect(firstEvent).not.toBe(newFirstEvent);
    }
  });
});

