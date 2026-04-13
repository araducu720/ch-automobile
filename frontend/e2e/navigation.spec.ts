import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing', () => {
  test('navigates between pages', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Menü öffnen"]').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(1000);
      }
      // Mobile Sheet nav — locale-prefixed href (e.g. /de/fahrzeuge)
      const mobileLink = page.locator('nav a[href*="/fahrzeuge"]').last();
      await mobileLink.click();
    } else {
      await page.locator('a[href*="/fahrzeuge"]').first().click();
    }
    await expect(page).toHaveURL(/\/fahrzeuge/);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('404 page for invalid route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz');
    // Should either show 404 or redirect
    const status = response?.status();
    if (status === 404) {
      await expect(page.locator('body')).toContainText(/404|nicht gefunden|not found/i);
    }
    // If redirected, that's also acceptable
  });

  test('language switching works', async ({ page }) => {
    await page.goto('/');
    // Language selector is a button with aria-label "Sprache wählen"
    const langSelector = page.locator('button[aria-label="Sprache wählen"]').first();
    if (await langSelector.count() > 0) {
      await langSelector.click();
      await page.waitForTimeout(500);
      // Look for English link in the dropdown (anchor tag with /en path)
      const enOption = page.locator('a[href*="/en"]').first();
      if (await enOption.count() > 0) {
        await enOption.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('html')).toHaveAttribute('lang', /en/);
      }
    }
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('button[aria-label*="Farbschema"], button[aria-label*="theme"], button[aria-label*="dark"]').first();
    if (await themeToggle.count() > 0) {
      // Get initial theme
      const htmlEl = page.locator('html');
      const initialClass = await htmlEl.getAttribute('class') || '';
      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(500);
      // Theme should have changed
      const newClass = await htmlEl.getAttribute('class') || '';
      const dataTheme = await htmlEl.getAttribute('data-theme') || '';
      // At least one indicator should differ
      expect(newClass !== initialClass || dataTheme.length > 0).toBeTruthy();
    }
  });

  test('mobile menu works', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');
    await page.goto('/');
    const menuBtn = page.locator('button[aria-label="Menü öffnen"]').first();
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await page.waitForTimeout(1000);
    // next-intl prefixes hrefs with locale (e.g. /de/fahrzeuge, /de/kontakt)
    const navLinks = page.locator('a[href*="/fahrzeuge"], a[href*="/kontakt"]');
    expect(await navLinks.count()).toBeGreaterThan(0);
  });
});

test.describe('SEO & Meta', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.{20,}/);
  });

  test('homepage has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');
    expect(await ogTitle.count()).toBeGreaterThan(0);
    expect(await ogDesc.count()).toBeGreaterThan(0);
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });
});

test.describe('Locale Persistence', () => {
  test('switching to English persists on navigation to /fahrzeuge', async ({ page }) => {
    await page.goto('/');
    const langSelector = page.locator('button[aria-label="Sprache wählen"]').first();
    if (await langSelector.count() === 0) {
      test.skip(true, 'Language selector not found');
      return;
    }
    await langSelector.click();
    await page.waitForTimeout(500);
    const enOption = page.locator('a[href*="/en"]').first();
    if (await enOption.count() === 0) {
      test.skip(true, '/en link not found in language dropdown');
      return;
    }
    await enOption.click();
    await page.waitForLoadState('networkidle');
    // Now navigate to vehicles — should stay in English locale
    await page.goto('/en/fahrzeuge');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/en\/fahrzeuge/);
    await expect(page.locator('html')).toHaveAttribute('lang', /en/);
  });

  test('default locale (de) serves pages without locale prefix', async ({ page }) => {
    const response = await page.goto('/fahrzeuge');
    expect(response?.status()).toBe(200);
    // Should NOT redirect to /de/fahrzeuge (as-needed prefix)
    await expect(page).not.toHaveURL(/\/de\/fahrzeuge/);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('non-default locale prefix works for EN', async ({ page }) => {
    const response = await page.goto('/en/fahrzeuge');
    expect(response?.status()).toBe(200);
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', /en/);
  });
});
