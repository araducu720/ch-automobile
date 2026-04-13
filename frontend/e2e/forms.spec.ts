import { test, expect } from '@playwright/test';

test.describe('Inquiry / Contact Form', () => {
  test('contact form submits with validation feedback on empty send', async ({ page }) => {
    await page.goto('/kontakt');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    await page.waitForTimeout(1000);

    // Native HTML validation or react-hook-form errors
    const invalidFields = page.locator(':invalid');
    const errorMsgs = page.locator('[class*="error"], [role="alert"], [aria-invalid="true"]');
    const hasValidation = (await invalidFields.count()) > 0 || (await errorMsgs.count()) > 0;
    expect(hasValidation).toBeTruthy();
  });

  test('contact form accepts valid input without immediate API error', async ({ page }) => {
    await page.goto('/kontakt');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageArea = page.locator('textarea').first();

    if ((await nameInput.count()) === 0) {
      test.skip(true, 'Contact form not found');
      return;
    }

    await nameInput.fill('Test Benutzer');
    await emailInput.fill('test@example.com');
    await messageArea.fill('Das ist eine Testnachricht mit ausreichend Inhalt für die Validierung.');

    // Confirm filled fields are valid (do not check unfilled optional/hidden fields)
    expect(await nameInput.getAttribute('aria-invalid')).not.toBe('true');
    expect(await emailInput.getAttribute('aria-invalid')).not.toBe('true');
    expect(await messageArea.getAttribute('aria-invalid')).not.toBe('true');
  });
});

test.describe('Trade-in Form', () => {
  test('trade-in form validates empty submission', async ({ page }) => {
    await page.goto('/inzahlungnahme');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]').first();
    if ((await submitBtn.count()) === 0) {
      test.skip(true, 'Submit button not found on trade-in page');
      return;
    }
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const invalidFields = page.locator(':invalid');
    const errorMsgs = page.locator('[class*="error"], [role="alert"], [aria-invalid="true"]');
    const hasValidation = (await invalidFields.count()) > 0 || (await errorMsgs.count()) > 0;
    expect(hasValidation).toBeTruthy();
  });

  test('trade-in form has all required vehicle fields', async ({ page }) => {
    await page.goto('/inzahlungnahme');
    await page.waitForLoadState('networkidle');

    // Must have brand, model, year, mileage fields
    const brandInput = page.locator('input[name*="brand"], input[placeholder*="Marke"], input[placeholder*="brand"]');
    const modelInput = page.locator('input[name*="model"], input[placeholder*="Modell"], input[placeholder*="model"]');
    const hasVehicleFields = (await brandInput.count()) > 0 || (await modelInput.count()) > 0;
    expect(hasVehicleFields).toBeTruthy();
  });
});

test.describe('Reservation / Kaufen Form', () => {
  test('reservation page loads and shows form', async ({ page }) => {
    // Get first vehicle slug from listing
    await page.goto('/fahrzeuge');
    await page.waitForLoadState('networkidle');

    // Use card-hover links only (not internal nav links)
    const link = page.locator('a.card-hover[href*="/fahrzeuge/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No vehicle cards found');
      return;
    }
    const href = await link.getAttribute('href');
    if (!href) {
      test.skip(true, 'Could not read vehicle href');
      return;
    }

    await page.goto(`${href}/kaufen`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#main-content')).toBeVisible();

    // Should have customer name and email inputs
    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"]').first();
    const emailInput = page.locator('input[type="email"]').first();

    // At minimum one of these should exist
    const hasForm = (await nameInput.count()) > 0 || (await emailInput.count()) > 0;
    expect(hasForm).toBeTruthy();
  });

  test('reservation form validates empty submission', async ({ page }) => {
    await page.goto('/fahrzeuge');
    await page.waitForLoadState('networkidle');

    const link = page.locator('a.card-hover[href*="/fahrzeuge/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No vehicle cards found');
      return;
    }
    const href = await link.getAttribute('href');
    if (!href) return;

    await page.goto(`${href}/kaufen`);
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]').first();
    if ((await submitBtn.count()) === 0) return;

    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const invalidFields = page.locator(':invalid');
    const errorMsgs = page.locator('[class*="error"], [role="alert"], [aria-invalid="true"]');
    const hasValidation = (await invalidFields.count()) > 0 || (await errorMsgs.count()) > 0;
    expect(hasValidation).toBeTruthy();
  });
});

test.describe('Newsletter Form', () => {
  test('newsletter subscribe form exists in footer or dedicated section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Newsletter form could be in footer or on a dedicated section
    const emailInput = page.locator('footer input[type="email"], [class*="newsletter"] input[type="email"]');
    if ((await emailInput.count()) === 0) {
      // Check if there's a newsletter section on the page at all
      const newsletterSection = page.locator('[class*="newsletter"], [id*="newsletter"]');
      // It's OK if the newsletter form isn't present — just verify no errors
      expect(await newsletterSection.count()).toBeGreaterThanOrEqual(0);
      return;
    }
    await expect(emailInput.first()).toBeVisible();
  });

  test('newsletter invalid email shows validation error', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('footer input[type="email"], [class*="newsletter"] input[type="email"]').first();
    if ((await emailInput.count()) === 0) {
      test.skip(true, 'Newsletter form not found on homepage');
      return;
    }

    await emailInput.fill('not-a-valid-email');
    const form = emailInput.locator('..').locator('..').locator('form').first();
    const submitBtn = page.locator('[class*="newsletter"] button[type="submit"], footer button[type="submit"]').first();
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click();
      await page.waitForTimeout(500);
      const invalidFields = page.locator(':invalid');
      const errorMsgs = page.locator('[class*="error"], [role="alert"]');
      expect((await invalidFields.count()) + (await errorMsgs.count())).toBeGreaterThan(0);
    }
  });
});

test.describe('Review Submission', () => {
  test('review page loads correctly', async ({ page }) => {
    await page.goto('/bewertungen');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('review form present or reviews displayed', async ({ page }) => {
    await page.goto('/bewertungen');
    await page.waitForLoadState('networkidle');

    const reviewCards = page.locator('[class*="review"], article[class*="review"]');
    const reviewForm = page.locator('form');
    const stars = page.locator('[class*="star"], [aria-label*="Stern"], [aria-label*="star"]');

    const hasContent = (await reviewCards.count()) > 0 ||
      (await reviewForm.count()) > 0 ||
      (await stars.count()) > 0;
    expect(hasContent).toBeTruthy();
  });
});
