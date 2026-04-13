import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/C-H Automobile/i);
  });

  test('has main navigation links', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Menü öffnen"]').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(1000);
      }
      // Mobile nav is inside a Sheet — check the link is attached (locale-prefixed href, e.g. /de/fahrzeuge)
      await expect(page.locator('nav a[href*="/fahrzeuge"]').first()).toBeAttached();
    } else {
      await expect(page.locator('a[href*="/fahrzeuge"]').first()).toBeVisible();
    }
  });

  test('has hero section content', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();
  });

  test('has footer with legal links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    // next-intl prefixes hrefs with locale, e.g. /de/impressum
    await expect(page.locator('a[href*="/impressum"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/datenschutz"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/agb"]').first()).toBeVisible();
  });

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('.skip-to-content');
    await expect(skip).toBeAttached();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter out known benign errors (e.g., third-party scripts)
    const critical = errors.filter(
      (e) => !e.includes('third-party') && !e.includes('favicon') && !e.includes('Failed to load resource')
    );
    expect(critical).toHaveLength(0);
  });
});
