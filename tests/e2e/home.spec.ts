import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Vercel Spine/);

    // Check heading
    await expect(page.locator('h1')).toContainText('Vercel Spine');
  });

  test('should display features', async ({ page }) => {
    await page.goto('/');

    // Check for section headings using more specific selectors
    await expect(page.getByRole('heading', { name: /🚀 Features/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /✅ Testing/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /🛠️ Tools/i })).toBeVisible();
  });

  test('should meet basic performance requirements', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display footer with copyright text', async ({ page }) => {
    await page.goto('/');

    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check copyright text
    await expect(footer).toContainText('© 2023 Maxwell Software Solutions MB');
  });
});
