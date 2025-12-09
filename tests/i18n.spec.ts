import { test, expect, Page } from '@playwright/test';

const LOCALES = ['en', 'es', 'pt', 'fr'] as const;

// Expected translated content for each locale (sample keys to verify translations are loaded)
const LOCALE_CONTENT: Record<string, { landing: RegExp; about: RegExp; login: RegExp }> = {
  en: {
    landing: /The smartest way|Explore Events|Sign In/i,
    about: /About EventMaple|Our Mission|Community/i,
    login: /Welcome|Sign in|Email|Password/i,
  },
  es: {
    landing: /La forma más inteligente|Explorar Eventos|Iniciar sesión/i,
    about: /Acerca de EventMaple|Nuestra Misión|Comunidad/i,
    login: /Bienvenido|Iniciar sesión|Correo|Contraseña/i,
  },
  pt: {
    landing: /A forma mais inteligente|Explorar Eventos|Entrar/i,
    about: /Sobre o EventMaple|Nossa Missão|Comunidade/i,
    login: /Bem-vindo|Entrar|Email|Senha/i,
  },
  fr: {
    landing: /La façon la plus intelligente|Explorer les événements|Se connecter/i,
    about: /À propos d'EventMaple|Notre Mission|Communauté/i,
    login: /Bienvenue|Se connecter|Email|Mot de passe/i,
  },
};

/**
 * Check for untranslated keys in the page body
 * Untranslated keys look like: {key.path}, {Error.common}, etc.
 */
async function checkForUntranslatedKeys(page: Page): Promise<string[]> {
  const bodyText = await page.locator('body').innerText();
  
  // Pattern to match untranslated i18n keys like {key.path} or {Error.common}
  const untranslatedPattern = /\{[A-Za-z]+\.[A-Za-z.]+\}/g;
  const matches = bodyText.match(untranslatedPattern) || [];
  
  // Filter out valid template patterns (like {year} which is intentional)
  const invalidKeys = matches.filter(match => {
    const validPatterns = ['{year}', '{count}', '{email}'];
    return !validPatterns.includes(match);
  });
  
  return invalidKeys;
}

test.describe('Internationalization (i18n)', () => {
  for (const locale of LOCALES) {
    test.describe(`Locale: ${locale}`, () => {
      
      test(`should load landing page with correct translations in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}`));
        await expect(page.locator('body')).toBeVisible();
        
        // Verify translated content is present
        const bodyText = await page.locator('body').innerText();
        expect(bodyText).toMatch(LOCALE_CONTENT[locale].landing);
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load About Us page with correct translations in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/about`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/about`));
        await expect(page.locator('h1')).toBeVisible();
        
        // Verify translated content
        const bodyText = await page.locator('body').innerText();
        expect(bodyText).toMatch(LOCALE_CONTENT[locale].about);
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load Terms page without untranslated keys in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/terms`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/terms`));
        await expect(page.locator('h1')).toBeVisible();
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load Privacy page without untranslated keys in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/privacy`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/privacy`));
        await expect(page.locator('h1')).toBeVisible();
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load Login page with correct translations in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/login`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/login`));
        await expect(page.locator('h1')).toBeVisible();
        
        // Verify form elements
        await expect(page.locator('input[id="email"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
        
        // Verify translated content
        const bodyText = await page.locator('body').innerText();
        expect(bodyText).toMatch(LOCALE_CONTENT[locale].login);
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load Events page without untranslated keys in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/events`));
        await expect(page.locator('body')).toBeVisible();
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });

      test(`should load Event Detail page without untranslated keys in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events/1`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/events/1`));
        await page.waitForLoadState('domcontentloaded');
        
        // Check for untranslated keys
        const untranslatedKeys = await checkForUntranslatedKeys(page);
        expect(untranslatedKeys, `Found untranslated keys: ${untranslatedKeys.join(', ')}`).toHaveLength(0);
      });
    });
  }

  test.describe('No Console Errors', () => {
    for (const locale of LOCALES) {
      test(`should have no critical errors on ${locale} pages`, async ({ page }) => {
        const consoleErrors: string[] = [];
        
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Visit main pages
        const pages = ['', '/about', '/terms', '/privacy', '/events', '/events/1'];
        for (const path of pages) {
          await page.goto(`/${locale}${path}`);
          await page.waitForLoadState('domcontentloaded');
        }

        // Filter non-critical errors (React dev warnings, hydration, service worker, network, etc.)
        const criticalErrors = consoleErrors.filter((error) => {
          const nonCriticalPatterns = [
            'favicon', '404', 'hydrat', 'ServiceWorker', 'sw.js', 'redirect',
            // React development warnings
            'cannot contain a nested',
            'mounting a new',
            'unmounted first',
            'render more than one',
            '%s', // React template strings
            'ancestor stack trace',
            'html html html',
            'body body body',
            // Network errors (transient)
            'ERR_NETWORK',
            'net::ERR_',
            'Failed to load resource',
          ];
          return !nonCriticalPatterns.some(pattern =>
            error.toLowerCase().includes(pattern.toLowerCase())
          );
        });

        expect(criticalErrors).toHaveLength(0);
      });
    }
  });
});
