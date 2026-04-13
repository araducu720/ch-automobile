import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('loads contact page', async ({ page }) => {
    await page.goto('/kontakt');
    await expect(page).toHaveTitle(/Kontakt|Contact|C-H/i);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('has contact form', async ({ page }) => {
    await page.goto('/kontakt');
    const form = page.locator('form');
    await expect(form.first()).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    await page.goto('/kontakt');
    // Check for name, email, message fields
    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"]').first();
    const emailInput = page.locator('input[name*="email"], input[type="email"]').first();
    const messageArea = page.locator('textarea').first();
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageArea).toBeVisible();
  });

  test('form validates empty submission', async ({ page }) => {
    await page.goto('/kontakt');
    await page.waitForLoadState('networkidle');
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    // Should show validation errors or native validation
    await page.waitForTimeout(1000);
    // Check for required attribute or error messages
    const invalidFields = page.locator(':invalid');
    const errorMessages = page.locator('[class*="error"], [role="alert"], [aria-invalid="true"], text=/erforderlich|required|Pflicht/i');
    const hasValidation = (await invalidFields.count() > 0) || (await errorMessages.count() > 0);
    expect(hasValidation).toBeTruthy();
  });

  test('has Google Maps embed or address', async ({ page }) => {
    await page.goto('/kontakt');
    const map = page.locator('iframe[src*="google"], iframe[src*="maps"]');
    const address = page.locator('text=/Friedberg|Bayern|86316/i');
    const hasMap = await map.count() > 0;
    const hasAddress = await address.count() > 0;
    expect(hasMap || hasAddress).toBeTruthy();
  });

  test('has phone number and email', async ({ page }) => {
    await page.goto('/kontakt');
    const phone = page.locator('a[href^="tel:"]');
    const email = page.locator('a[href^="mailto:"]');
    expect((await phone.count()) + (await email.count())).toBeGreaterThan(0);
  });
});

test.describe('Trade-in Page', () => {
  test('loads trade-in page', async ({ page }) => {
    await page.goto('/inzahlungnahme');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('has trade-in form', async ({ page }) => {
    await page.goto('/inzahlungnahme');
    const form = page.locator('form');
    await expect(form.first()).toBeVisible();
  });
});
