import { test, expect } from '@playwright/test';

test.describe('on computer', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('should navigate to the about page', async ({ page }, testInfo) => {
    if (testInfo.project.use.isMobile) {
      test.skip();
    }
    await page.goto('/');
    await page.getByText('About').click();
    await expect(page).toHaveURL('about');
  });
});
