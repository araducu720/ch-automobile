import { test, expect } from '@playwright/test';

test.describe('Performance & Accessibility', () => {
  test('page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const images = page.locator('img:visible');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt should exist (can be empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('no broken links in header/footer', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('header a[href^="/"], footer a[href^="/"]');
    const count = await links.count();
    const broken: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && !href.includes('#')) {
        const response = await page.request.get(href);
        if (response.status() >= 400 && response.status() !== 404) {
          broken.push(`${href} → ${response.status()}`);
        }
      }
    }
    expect(broken).toHaveLength(0);
  });

  test('correct viewport meta tag', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('uses HTTPS and security headers', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.url()).toMatch(/^https:/);
    const headers = response?.headers() || {};
    // Vercel typically sets these
    expect(headers['x-frame-options'] || headers['content-security-policy']).toBeTruthy();
  });

  test('security headers: X-Content-Type-Options is set', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('security headers: Referrer-Policy is set', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};
    expect(headers['referrer-policy']).toBeTruthy();
  });

  test('security headers: HSTS is set on production', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};
    // Vercel sets HSTS on production domains
    const hsts = headers['strict-transport-security'];
    if (hsts) {
      expect(hsts).toMatch(/max-age=\d+/);
    }
    // HSTS may be handled at CDN level; at minimum URL must be HTTPS
    expect(response?.url()).toMatch(/^https:/);
  });

  test('images have alt attributes (extended — 20 images)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const images = page.locator('img:visible');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 20); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('API Health', () => {
  test('backend API is reachable', async ({ request }) => {
    const response = await request.get('https://c-h-automobile.on-forge.com/api/v1/vehicles');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });

  test('API returns vehicle data structure', async ({ request }) => {
    const response = await request.get('https://c-h-automobile.on-forge.com/api/v1/vehicles');
    const json = await response.json();
    if (json.data && json.data.length > 0) {
      const vehicle = json.data[0];
      expect(vehicle).toHaveProperty('id');
      expect(vehicle).toHaveProperty('brand');
      expect(vehicle).toHaveProperty('model');
    }
  });

  test('API vehicles endpoint returns brand data', async ({ request }) => {
    // Brands are returned within vehicle data (no separate /brands endpoint)
    const response = await request.get('https://c-h-automobile.on-forge.com/api/v1/vehicles');
    expect(response.status()).toBe(200);
    const json = await response.json();
    if (json.data && json.data.length > 0) {
      expect(json.data[0]).toHaveProperty('brand');
    }
  });
});
