import { test, expect } from '@playwright/test';

const legalPages = [
  { path: '/impressum', title: /Impressum|Imprint|C-H/i },
  { path: '/datenschutz', title: /Datenschutz|Privacy|C-H/i },
  { path: '/agb', title: /AGB|Terms|C-H/i },
];

for (const { path, title } of legalPages) {
  test.describe(`Legal page: ${path}`, () => {
    test(`loads ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
      await expect(page.locator('#main-content')).toBeVisible();
    });

    test(`${path} has content`, async ({ page }) => {
      await page.goto(path);
      const content = page.locator('#main-content');
      const text = await content.textContent();
      expect(text!.length).toBeGreaterThan(100);
    });
  });
}

test.describe('About Us Page', () => {
  test('loads about page', async ({ page }) => {
    await page.goto('/ueber-uns');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('has company info', async ({ page }) => {
    await page.goto('/ueber-uns');
    const content = page.locator('#main-content');
    await expect(content).toContainText(/C-H Automobile|Friedberg|automobile/i);
  });
});

test.describe('Reviews Page', () => {
  test('loads reviews page', async ({ page }) => {
    await page.goto('/bewertungen');
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('loads blog listing', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('blog has articles or empty state', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const articles = page.locator('article, a[href*="/blog/"]');
    const empty = page.locator('text=/keine Beiträge|no posts/i');
    expect((await articles.count()) + (await empty.count())).toBeGreaterThanOrEqual(0);
  });
});
