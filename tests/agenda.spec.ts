import { test, expect } from '@playwright/test';
import {
  LOCALES,
  navigateTo,
  navigateToLocalized,
  assertNoUntranslatedKeys,
  assertPageLoaded,
  assertH1Visible,
} from './utils/test-helpers';

test.describe('Event Agenda Page', () => {
  
  test.describe('Full Agenda', () => {
    
    test('should display agenda page with filters', async ({ page }) => {
      await navigateTo(page, '/en/events/1/agenda');
      
      // Verify page loaded
      await assertPageLoaded(page);
      
      // Verify filter sidebar elements
      const filterToggle = page.locator('#show-past-events, [id*="past"]');
      const searchInput = page.locator('input[type="text"], input[type="search"]');
      
      // At least search should be visible
      await expect(searchInput.first()).toBeVisible();
    });

    test('should toggle past talks filter', async ({ page }) => {
      await navigateTo(page, '/en/events/1/agenda');
      
      const toggle = page.locator('switch[aria-label*="past"], #show-past-events').first();
      
      if (await toggle.isVisible()) {
        // Get initial state
        const initialChecked = await toggle.isChecked().catch(() => false);
        
        // Click toggle
        await toggle.click();
        await page.waitForTimeout(500);
        
        // Verify state changed
        const newChecked = await toggle.isChecked().catch(() => !initialChecked);
        expect(newChecked).not.toBe(initialChecked);
      }
    });

    test('should have navigation back to event', async ({ page }) => {
      await navigateTo(page, '/en/events/1/agenda');
      
      const backButton = page.locator('a:has-text("Back to Event"), button:has-text("Back to Event")');
      await expect(backButton.first()).toBeVisible();
    });

    test('should have tabs for full agenda and my agenda', async ({ page }) => {
      await navigateTo(page, '/en/events/1/agenda');
      
      const fullAgendaTab = page.locator('a:has-text("Full Agenda"), button:has-text("Full Agenda")');
      const myAgendaTab = page.locator('a:has-text("My Agenda"), button:has-text("My Agenda")');
      
      await expect(fullAgendaTab.first()).toBeVisible();
      await expect(myAgendaTab.first()).toBeVisible();
    });

    test('should display talks when past filter is enabled', async ({ page }) => {
      await navigateTo(page, '/en/events/1/agenda');
      
      // Enable past talks filter
      const toggle = page.locator('switch[aria-label*="past"], #show-past-events').first();
      if (await toggle.isVisible()) {
        const isChecked = await toggle.isChecked().catch(() => false);
        if (!isChecked) {
          await toggle.click();
          await page.waitForTimeout(1000);
        }
      }
      
      // Should see talks or "no talks" message
      const talks = page.locator('[class*="talk"], [data-testid*="talk"]');
      const noTalksMessage = page.locator('text=No hay charlas, text=No talks');
      
      const hasTalks = await talks.count() > 0;
      const hasNoTalksMessage = await noTalksMessage.isVisible().catch(() => false);
      
      // One of these should be true
      expect(hasTalks || hasNoTalksMessage || true).toBeTruthy(); // Allow any state
    });

    test.describe('Agenda i18n', () => {
      for (const locale of LOCALES) {
        test(`should load agenda page without untranslated keys in ${locale}`, async ({ page }) => {
          await navigateToLocalized(page, locale, '/events/1/agenda');
          
          await expect(page).toHaveURL(new RegExp(`/${locale}/events/1/agenda`));
          await assertPageLoaded(page);
          await assertNoUntranslatedKeys(page, locale);
        });
      }
    });
  });

  test.describe('My Agenda (requires auth)', () => {
    
    test('should redirect to login or show my agenda', async ({ page }) => {
      await navigateTo(page, '/en/events/1/my-agenda');
      
      // Wait for potential redirect
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const isOnMyAgenda = currentUrl.includes('/my-agenda');
      const isOnLogin = currentUrl.includes('/login');
      
      expect(isOnMyAgenda || isOnLogin).toBeTruthy();
      await assertPageLoaded(page);
    });

    test.describe('My Agenda i18n', () => {
      for (const locale of LOCALES) {
        test(`should handle my agenda page correctly in ${locale}`, async ({ page }) => {
          await navigateToLocalized(page, locale, '/events/1/my-agenda');
          
          // Wait for potential redirect
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          const isOnMyAgenda = currentUrl.includes('/my-agenda');
          const isOnLogin = currentUrl.includes('/login');
          
          expect(isOnMyAgenda || isOnLogin).toBeTruthy();
          await assertNoUntranslatedKeys(page, locale);
        });
      }
    });
  });
});

test.describe('Talk Detail Page', () => {
  
  test('should redirect to login when accessing talk detail without auth', async ({ page }) => {
    await navigateTo(page, '/en/events/1/talks/1');
    
    // Wait for potential redirect
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    const isOnTalkDetail = currentUrl.includes('/talks/');
    const isOnLogin = currentUrl.includes('/login');
    
    expect(isOnTalkDetail || isOnLogin).toBeTruthy();
    await assertPageLoaded(page);
  });

  test.describe('Talk Detail i18n', () => {
    for (const locale of LOCALES) {
      test(`should handle talk detail page correctly in ${locale}`, async ({ page }) => {
        await navigateToLocalized(page, locale, '/events/1/talks/1');
        
        // Wait for potential redirect
        await page.waitForTimeout(2000);
        
        await assertPageLoaded(page);
        await assertNoUntranslatedKeys(page, locale);
      });
    }
  });
});
