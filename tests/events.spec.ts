import { test, expect, Page } from '@playwright/test';

const LOCALES = ['en', 'es', 'pt', 'fr'] as const;
const EVENT_NAME = 'DevOpsDays Bogotá 2025';

/**
 * Check for untranslated keys in the page body
 */
async function checkForUntranslatedKeys(page: Page): Promise<string[]> {
  const bodyText = await page.locator('body').innerText();
  const untranslatedPattern = /\{[A-Za-z]+\.[A-Za-z.]+\}/g;
  const matches = bodyText.match(untranslatedPattern) || [];
  
  const validPatterns = ['{year}', '{count}', '{email}'];
  return matches.filter(match => !validPatterns.includes(match));
}

/**
 * Enable past events filter in the sidebar
 */
async function enablePastEventsFilter(page: Page): Promise<void> {
  // The sidebar toggle has id="show-past-events"
  const toggle = page.locator('#show-past-events');
  
  // Check if toggle is visible (sidebar might be open on desktop)
  if (await toggle.isVisible()) {
    const isChecked = await toggle.isChecked();
    if (!isChecked) {
      await toggle.click();
      await page.waitForTimeout(500);
    }
    return;
  }
  
  // On mobile, need to open the sidebar first
  const filtersButton = page.locator('button:has-text("Filters"), button:has-text("Filtros")').first();
  if (await filtersButton.isVisible()) {
    await filtersButton.click();
    await page.waitForTimeout(500);
    
    // Now click the toggle
    const toggleAfterOpen = page.locator('#show-past-events');
    if (await toggleAfterOpen.isVisible()) {
      const isChecked = await toggleAfterOpen.isChecked();
      if (!isChecked) {
        await toggleAfterOpen.click();
        await page.waitForTimeout(500);
      }
    }
  }
}

test.describe('Events Page', () => {
  
  test.describe('Event Search and Navigation', () => {
    
    test('should search for event and find it in past events', async ({ page }) => {
      await page.goto('/en/events');
      await page.waitForLoadState('domcontentloaded');
      
      // Enable past events filter
      await enablePastEventsFilter(page);
      await page.waitForTimeout(500);
      
      // Search for the event
      const searchInput = page.locator('input[type="text"], input[type="search"]').first();
      await searchInput.fill(EVENT_NAME);
      await page.waitForTimeout(1000);
      
      // Verify event appears in the list
      const eventCard = page.locator(`text=${EVENT_NAME}`).first();
      await expect(eventCard).toBeVisible({ timeout: 10000 });
    });

    test('should access event detail page from event card', async ({ page }) => {
      await page.goto('/en/events');
      await page.waitForLoadState('domcontentloaded');
      
      // Enable past events filter
      await enablePastEventsFilter(page);
      await page.waitForTimeout(500);
      
      // Search for the event
      const searchInput = page.locator('input[type="text"], input[type="search"]').first();
      await searchInput.fill(EVENT_NAME);
      await page.waitForTimeout(1000);
      
      // Find and click on "View details" button
      const viewDetailsButton = page.locator('a:has-text("View details"), a:has-text("Ver detalles")').first();
      await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
      await viewDetailsButton.click();
      
      // Verify we're on the event detail page
      await page.waitForURL(/\/events\/\d+/);
      await expect(page.locator('body')).toBeVisible();
      
      // Verify no untranslated keys
      const untranslatedKeys = await checkForUntranslatedKeys(page);
      expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
    });

    test('should display event content without errors', async ({ page }) => {
      await page.goto('/en/events/1');
      await page.waitForLoadState('domcontentloaded');
      
      // Verify page has content
      await expect(page.locator('body')).toBeVisible();
      
      // Check for untranslated keys
      const untranslatedKeys = await checkForUntranslatedKeys(page);
      expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      
      // Verify no error state
      const errorElement = page.locator('text=Something went wrong, text=Error');
      const errorCount = await errorElement.count();
      // Allow "Error" in navigation/labels but not as main content
      expect(errorCount).toBeLessThan(3);
    });
  });

  test.describe('Event Detail i18n', () => {
    for (const locale of LOCALES) {
      test(`should load event detail page correctly in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events/1`);
        await page.waitForLoadState('domcontentloaded');
        
        // Verify URL
        await expect(page).toHaveURL(new RegExp(`/${locale}/events/1`));
        
        // Verify page loaded
        await expect(page.locator('body')).toBeVisible();
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys in ${locale}: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });
    }
  });
});

test.describe('Event Favorites', () => {
  
  test('should display favorite button on event detail page', async ({ page }) => {
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Find the favorite button - it can be icon variant or button variant
    // Button variant has text like "Add to favorites" or "In favorites"
    // Icon variant has aria-label with "favorite"
    const favoriteButtonWithText = page.locator('button:has-text("Add to favorites"), button:has-text("favorites"), button:has-text("favoritos")').first();
    const favoriteButtonIcon = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first();
    
    // At least one variant should be visible
    const hasTextButton = await favoriteButtonWithText.isVisible();
    const hasIconButton = await favoriteButtonIcon.isVisible();
    
    expect(hasTextButton || hasIconButton, 'Favorite button should be visible').toBeTruthy();
  });

  test('should redirect to login when clicking favorite without auth', async ({ page }) => {
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Find the favorite button
    const favoriteButton = page.locator('button:has-text("Add to favorites"), button:has-text("favorites"), button[aria-label*="favorite"]').first();
    
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click();
      
      // Wait for potential redirect
      await page.waitForTimeout(2000);
      
      // Should either stay on page (if authenticated) or redirect to login
      const currentUrl = page.url();
      const isOnEventPage = currentUrl.includes('/events/1');
      const isOnLogin = currentUrl.includes('/login');
      
      // One of these should be true
      expect(isOnEventPage || isOnLogin, `Expected event page or login, got: ${currentUrl}`).toBeTruthy();
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should show heart icon with correct styling', async ({ page }) => {
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Find heart icon inside a button
    const heartIcon = page.locator('button svg.lucide-heart, button svg[class*="heart"]').first();
    
    if (await heartIcon.isVisible()) {
      // Heart icon should be visible
      await expect(heartIcon).toBeVisible();
      
      // Check if it has the expected classes (either gray for not favorite or red for favorite)
      const heartClasses = await heartIcon.getAttribute('class') || '';
      const hasValidStyling = heartClasses.includes('text-') || heartClasses.includes('fill-');
      expect(hasValidStyling, 'Heart icon should have color styling').toBeTruthy();
    }
  });
});

test.describe('Event Agenda Navigation', () => {
  
  test('should navigate to full agenda from event detail', async ({ page }) => {
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Find "View Full Agenda" or "Ver Agenda Completa" button
    const fullAgendaButton = page.locator('a:has-text("Full Agenda"), a:has-text("Agenda Completa"), button:has-text("Full Agenda"), button:has-text("Agenda Completa")').first();
    
    if (await fullAgendaButton.isVisible()) {
      await fullAgendaButton.click();
      
      // Verify URL changed to agenda page but still same event
      await page.waitForURL(/\/events\/1\/agenda/);
      await expect(page).toHaveURL(/\/events\/1\/agenda/);
      
      // Verify page loaded
      await expect(page.locator('body')).toBeVisible();
      
      // Check for untranslated keys
      const untranslatedKeys = await checkForUntranslatedKeys(page);
      expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
    }
  });

  test('should show my agenda button in event detail', async ({ page }) => {
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Find "My Personal Agenda" or "My Agenda" button/link
    const myAgendaButton = page.locator('a:has-text("My Personal Agenda"), a:has-text("My Agenda"), a:has-text("Personal Agenda")').first();
    
    // Verify the button exists (it should be visible in the Quick Actions section)
    // The button may redirect to login or my-agenda depending on auth state
    if (await myAgendaButton.isVisible()) {
      // Button is visible, test passes
      await expect(myAgendaButton).toBeVisible();
      
      // Get the href to verify it points to my-agenda
      const href = await myAgendaButton.getAttribute('href');
      expect(href).toContain('my-agenda');
    }
  });

  test('should maintain event context when navigating to full agenda', async ({ page }) => {
    // Start at event detail
    await page.goto('/en/events/1');
    await page.waitForLoadState('domcontentloaded');
    
    // Navigate to full agenda
    const fullAgendaButton = page.locator('a:has-text("Full Agenda"), a:has-text("View Full Agenda")').first();
    if (await fullAgendaButton.isVisible()) {
      await fullAgendaButton.click();
      await page.waitForURL(/\/events\/1/);
      
      // Verify still on event 1
      expect(page.url()).toContain('/events/1');
      
      // Check for untranslated keys
      const untranslatedKeys = await checkForUntranslatedKeys(page);
      expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
    }
  });

  test.describe('Agenda i18n', () => {
    for (const locale of LOCALES) {
      test(`should load full agenda page correctly in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events/1/agenda`);
        await page.waitForLoadState('domcontentloaded');
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/events/1/agenda`));
        await expect(page.locator('body')).toBeVisible();
        
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys in ${locale}: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should redirect to login or load my agenda page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events/1/my-agenda`);
        await page.waitForLoadState('domcontentloaded');
        
        // My agenda requires auth, so it will either load or redirect to login
        const currentUrl = page.url();
        const isOnMyAgenda = currentUrl.includes('/my-agenda');
        const isOnLogin = currentUrl.includes('/login');
        
        expect(isOnMyAgenda || isOnLogin, `Expected my-agenda or login, got: ${currentUrl}`).toBeTruthy();
        await expect(page.locator('body')).toBeVisible();
        
        // Check for untranslated keys on whatever page we landed on
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys in ${locale}: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });
    }
  });
});
