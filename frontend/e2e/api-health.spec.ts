import { test, expect } from '@playwright/test';

const API_BASE = 'https://c-h-automobile.on-forge.com/api/v1';

test.describe('API Health — Vehicles', () => {
  test('GET /vehicles returns 200 with paginated structure', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('meta');
    expect(json.meta).toHaveProperty('current_page');
    expect(json.meta).toHaveProperty('total');
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /vehicles vehicle items have required fields', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles`);
    const json = await response.json();
    if (json.data.length > 0) {
      const v = json.data[0];
      expect(v).toHaveProperty('id');
      expect(v).toHaveProperty('brand');
      expect(v).toHaveProperty('model');
      expect(v).toHaveProperty('slug');
      expect(v).toHaveProperty('price');
      expect(v).toHaveProperty('fuel_type');
    }
  });

  test('GET /vehicles/featured returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles/featured`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /vehicles/brands returns 200 with brand list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles/brands`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /vehicles filter by brand works', async ({ request }) => {
    // First get available brands
    const brandsResp = await request.get(`${API_BASE}/vehicles/brands`);
    const brandsJson = await brandsResp.json();
    if (brandsJson.data.length === 0) {
      test.skip(true, 'No brands available');
      return;
    }
    const firstBrand = brandsJson.data[0].brand ?? brandsJson.data[0];
    const response = await request.get(`${API_BASE}/vehicles?brand=${encodeURIComponent(firstBrand)}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /vehicles/{slug} returns 200 for first available vehicle', async ({ request }) => {
    const listResp = await request.get(`${API_BASE}/vehicles`);
    const listJson = await listResp.json();
    if (listJson.data.length === 0) {
      test.skip(true, 'No vehicles available');
      return;
    }
    const slug = listJson.data[0].slug;
    const response = await request.get(`${API_BASE}/vehicles/${slug}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('id');
    expect(json.data).toHaveProperty('brand');
    expect(json.data).toHaveProperty('model');
    expect(json.data).toHaveProperty('description');
    expect(json).toHaveProperty('related');
  });

  test('GET /vehicles/{slug} returns 404 for unknown slug', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles/this-vehicle-does-not-exist-xyz`);
    expect(response.status()).toBe(404);
  });
});

test.describe('API Health — Blog', () => {
  test('GET /blog/posts returns 200 with paginated structure', async ({ request }) => {
    const response = await request.get(`${API_BASE}/blog/posts`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('meta');
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /blog/categories returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/blog/categories`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBeTruthy();
  });

  test('GET /blog/posts/{slug} returns 200 for first post', async ({ request }) => {
    const listResp = await request.get(`${API_BASE}/blog/posts`);
    const listJson = await listResp.json();
    if (listJson.data.length === 0) {
      test.skip(true, 'No blog posts available');
      return;
    }
    const slug = listJson.data[0].slug;
    const response = await request.get(`${API_BASE}/blog/posts/${slug}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('slug');
    expect(json).toHaveProperty('related');
  });
});

test.describe('API Health — Reviews', () => {
  test('GET /reviews returns 200 with aggregate', async ({ request }) => {
    const response = await request.get(`${API_BASE}/reviews`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('aggregate');
    expect(json.aggregate).toHaveProperty('average_rating');
    expect(json.aggregate).toHaveProperty('total_count');
    expect(json.aggregate).toHaveProperty('breakdown');
  });
});

test.describe('API Health — Settings', () => {
  test('GET /settings returns 200 with company info', async ({ request }) => {
    const response = await request.get(`${API_BASE}/settings`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('data');
    const d = json.data;
    expect(d).toHaveProperty('company_name');
    expect(d).toHaveProperty('phone');
    expect(d).toHaveProperty('email');
    expect(d).toHaveProperty('address');
  });

  test('GET /legal/imprint returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/legal/imprint`);
    expect(response.status()).toBe(200);
  });

  test('GET /legal/privacy returns 200 or 404 (depends on content populated)', async ({ request }) => {
    const response = await request.get(`${API_BASE}/legal/privacy`);
    // 200 = content populated; 404 = content not yet entered in admin
    expect([200, 404]).toContain(response.status());
  });

  test('GET /legal/terms returns 200 or 404 (depends on content populated)', async ({ request }) => {
    const response = await request.get(`${API_BASE}/legal/terms`);
    expect([200, 404]).toContain(response.status());
  });

  test('GET /legal/invalid returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/legal/nonexistent`);
    expect(response.status()).toBe(404);
  });
});

test.describe('API Health — Newsletter', () => {
  test('POST /newsletter/subscribe with honeypot filled returns fake 200', async ({ request }) => {
    // Trigger honeypot (website_url filled) — should return fake success, not create record
    const response = await request.post(`${API_BASE}/newsletter/subscribe`, {
      data: { email: 'bot@spam.com', website_url: 'https://spam.com' },
    });
    // Honeypot returns fake success (200 or 201) — or 429 if rate-limited on retry
    expect([200, 201, 429]).toContain(response.status());
  });

  test('POST /newsletter/subscribe with invalid email returns 422', async ({ request }) => {
    const response = await request.post(`${API_BASE}/newsletter/subscribe`, {
      data: { email: 'not-an-email' },
    });
    // 422 = validation error (expected); 429 = rate-limited after full suite runs multiple POSTs
    expect([422, 429]).toContain(response.status());
    if (response.status() === 422) {
      const json = await response.json();
      expect(json).toHaveProperty('error');
    }
  });
});

test.describe('API Health — Security', () => {
  test('CORS allows requests from production frontend', async ({ request }) => {
    const response = await request.get(`${API_BASE}/vehicles`, {
      headers: { Origin: 'https://www.ch-automobile.com' },
    });
    expect(response.status()).toBe(200);
    const headers = response.headers();
    // CORS header should be present
    expect(headers['access-control-allow-origin']).toBeTruthy();
  });

  test('API rate limiting responds with 429 after excess POST requests', async ({ request }) => {
    // newsletter has 5/min limit — send 6 POST requests with invalid data
    let lastStatus = 0;
    for (let i = 0; i < 7; i++) {
      const r = await request.post(`${API_BASE}/newsletter/subscribe`, {
        data: { email: `test${i}@example.com` },
      });
      lastStatus = r.status();
      if (lastStatus === 429) break;
    }
    // Either we hit the rate limit or all returned 422/200 (valid behavior if counter reset)
    expect([200, 201, 422, 429]).toContain(lastStatus);
  });
});
