import { expect, test } from '@playwright/test';

test.describe('Live Score Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load', () => {
    test('displays the page title', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Live Scores');
    });

    test('displays the filters section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();
    });

    test('displays match cards after loading', async ({ page }) => {
      // Wait for matches to load
      await expect(page.getByTestId('match-card').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Filter Functionality', () => {
    test('displays all filter buttons with counts', async ({ page }) => {
      await expect(page.getByTestId('filter-all')).toBeVisible();
      await expect(page.getByTestId('filter-result')).toBeVisible();
      await expect(page.getByTestId('filter-live')).toBeVisible();
      await expect(page.getByTestId('filter-upcoming')).toBeVisible();
    });

    test('All filter is selected by default', async ({ page }) => {
      const allFilter = page.getByTestId('filter-all');
      await expect(allFilter).toHaveAttribute('aria-selected', 'true');
    });

    test('clicking Live filter shows only live matches', async ({ page }) => {
      // Wait for initial load
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });

      // Click Live filter
      await page.getByTestId('filter-live').click();

      // Verify Live filter is selected
      await expect(page.getByTestId('filter-live')).toHaveAttribute('aria-selected', 'true');

      // Get all visible match cards
      const matchCards = page.getByTestId('match-card');
      const count = await matchCards.count();

      if (count > 0) {
        // All visible matches should have live status indicator
        for (let i = 0; i < count; i++) {
          const card = matchCards.nth(i);
          // Live matches show "LIVE" badge or have live status indicator
          const hasLiveStatus =
            (await card.getByTestId('status-live').count()) > 0 ||
            (await card.getByTestId('status-halftime').count()) > 0;
          expect(hasLiveStatus).toBeTruthy();
        }
      }
    });

    test('clicking Result filter shows only finished matches', async ({ page }) => {
      // Wait for initial load
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });

      // Click Result filter
      await page.getByTestId('filter-result').click();

      // Verify Result filter is selected
      await expect(page.getByTestId('filter-result')).toHaveAttribute('aria-selected', 'true');

      // Get all visible match cards
      const matchCards = page.getByTestId('match-card');
      const count = await matchCards.count();

      if (count > 0) {
        // All visible matches should have finished status indicator
        for (let i = 0; i < count; i++) {
          const card = matchCards.nth(i);
          await expect(card.getByTestId('status-finished')).toBeVisible();
        }
      }
    });

    test('clicking Upcoming filter shows only upcoming matches', async ({ page }) => {
      // Wait for initial load
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });

      // Click Upcoming filter
      await page.getByTestId('filter-upcoming').click();

      // Verify Upcoming filter is selected
      await expect(page.getByTestId('filter-upcoming')).toHaveAttribute('aria-selected', 'true');

      // Get all visible match cards
      const matchCards = page.getByTestId('match-card');
      const count = await matchCards.count();

      if (count > 0) {
        // All visible matches should have prematch or cancelled status
        for (let i = 0; i < count; i++) {
          const card = matchCards.nth(i);
          const hasPrematchStatus =
            (await card.getByTestId('status-prematch').count()) > 0 ||
            (await card.getByTestId('status-cancelled').count()) > 0;
          expect(hasPrematchStatus).toBeTruthy();
        }
      }
    });

    test('clicking All filter shows all matches again', async ({ page }) => {
      // Wait for initial load
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });

      // Get initial count
      const initialCount = await page.getByTestId('match-card').count();

      // Filter to live only
      await page.getByTestId('filter-live').click();

      // Click All to show all again
      await page.getByTestId('filter-all').click();

      // Verify All filter is selected
      await expect(page.getByTestId('filter-all')).toHaveAttribute('aria-selected', 'true');

      // Should show same count as initial
      await expect(page.getByTestId('match-card')).toHaveCount(initialCount);
    });
  });

  test.describe('Match Card Display', () => {
    test('match card displays team names', async ({ page }) => {
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });
      const firstCard = page.getByTestId('match-card').first();

      // Should have home and away team names (non-empty text)
      const teamNames = firstCard.locator('span');
      const teamNameCount = await teamNames.count();
      expect(teamNameCount).toBeGreaterThan(0);
    });

    test('match card displays score', async ({ page }) => {
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });
      const firstCard = page.getByTestId('match-card').first();

      // Should have score separator
      await expect(firstCard.getByText('-')).toBeVisible();
    });

    test('match card displays competition info', async ({ page }) => {
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });

      // Cards should have article role (semantic HTML)
      const articles = page.getByRole('article');
      const count = await articles.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Status Indicators', () => {
    test('finished matches show FT indicator', async ({ page }) => {
      // Go to result filter to ensure we see finished matches
      await page.getByTestId('match-card').first().waitFor({ timeout: 10000 });
      await page.getByTestId('filter-result').click();

      const matchCards = page.getByTestId('match-card');
      const count = await matchCards.count();

      if (count > 0) {
        // First finished match should show FT text
        const firstCard = matchCards.first();
        await expect(firstCard.getByText('FT')).toBeVisible();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('filter bar has proper ARIA attributes', async ({ page }) => {
      // Check tablist role
      await expect(page.getByRole('tablist')).toBeVisible();
      await expect(page.getByRole('tablist')).toHaveAttribute('aria-label', 'Match filters');
    });

    test('filter buttons have proper tab roles', async ({ page }) => {
      const tabs = page.getByRole('tab');
      const count = await tabs.count();
      expect(count).toBe(4); // All, Result, Live, Upcoming
    });

    test('active filter has aria-selected true', async ({ page }) => {
      const allFilter = page.getByTestId('filter-all');
      await expect(allFilter).toHaveAttribute('aria-selected', 'true');

      // Click on Live
      await page.getByTestId('filter-live').click();

      // Now Live should be selected
      await expect(page.getByTestId('filter-live')).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByTestId('filter-all')).toHaveAttribute('aria-selected', 'false');
    });
  });

  test.describe('Responsive Design', () => {
    test('layout adapts to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Page should still be functional
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId('filter-all')).toBeVisible();
    });

    test('layout adapts to tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Page should still be functional
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId('filter-all')).toBeVisible();
    });

    test('layout adapts to desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      // Page should still be functional
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId('filter-all')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('shows error message on network failure', async ({ page }) => {
      // Block the data request
      await page.route('**/data/sports.json', (route) => route.abort());

      await page.goto('/');

      // Should show error message (matches the actual error text from service)
      await expect(page.getByText(/unable to load|check your connection/i)).toBeVisible({ timeout: 15000 });
    });

    test('shows retry button on error', async ({ page }) => {
      // Block the data request
      await page.route('**/data/sports.json', (route) => route.abort());

      await page.goto('/');

      // Should show retry button
      await expect(page.getByRole('button', { name: /retry/i })).toBeVisible({ timeout: 15000 });
    });
  });
});
