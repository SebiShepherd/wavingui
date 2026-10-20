import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { inkGaps } from './ink';

/**
 * The gallery as the kit's product surface: it must render with no network,
 * under the strictest content security policy any target runtime imposes, and
 * every component in it must hold the states the rules describe.
 *
 * Carried over from Hikaru's `component-states.spec.ts` where the case is
 * generic; the cases that depended on Hikaru's own components stayed there.
 */

/** A colour that resolves to nothing paints as this, whatever the theme is. */
const NOT_PAINTED = new Set(['rgba(0, 0, 0, 0)', 'transparent', '']);

/** Open the gallery, failing on any request that leaves the page's origin. */
async function openGallery(page: Page, theme: 'light' | 'dark' = 'light') {
  const foreign: string[] = [];
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'localhost' && url.protocol !== 'data:') {
      foreign.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.addInitScript((t) => localStorage.setItem('wavingui.gallery.theme', t), theme);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'wavingui gallery' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  return foreign;
}

test.describe('the gallery', () => {
  test('renders under the runtime CSP with no violation and no foreign request', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') violations.push(message.text());
    });
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (event) =>
        console.error(`CSP: ${event.violatedDirective} ${event.blockedURI}`),
      );
    });
    const foreign = await openGallery(page);
    // Open the parts that only exist under interaction, so they are covered too.
    await page.getByRole('button', { name: 'Delete limit' }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.keyboard.press('Escape');

    expect(foreign, 'requests that left the origin').toEqual([]);
    expect(violations, 'console errors, including CSP violations').toEqual([]);
  });

  test('the theme script sets the stored theme before the first paint', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('wavingui.gallery.theme', 'dark'));
    await page.goto('/', { waitUntil: 'commit' });
    // Read at DOMContentLoaded, before React has rendered anything.
    const dark = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const read = () => resolve(document.documentElement.classList.contains('dark'));
          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', read);
          else read();
        }),
    );
    expect(dark).toBe(true);
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`a rail entry names itself on hover in the ${theme} theme`, async ({ page }) => {
      await openGallery(page, theme);
      const entry = page.getByRole('navigation', { name: 'Navigation' }).getByRole('link').first();
      const name = (await entry.getAttribute('aria-label')) ?? '';
      expect(name, 'a rail entry with no accessible name').not.toBe('');

      await entry.hover();
      const bubble = page.locator('[data-tooltip]');
      await expect(bubble).toHaveText(name, { timeout: 1000 });
      const painted = await bubble.evaluate((node) => getComputedStyle(node).backgroundColor);
      expect(NOT_PAINTED.has(painted), `the bubble paints "${painted}"`).toBe(false);
    });

    test(`keyboard focus is visible on every control in the ${theme} theme`, async ({ page }) => {
      await openGallery(page, theme);
      // The first stretch of the tab order covers the shell, the toggle, the
      // checkboxes and the icon buttons: one of each kind of focus treatment.
      for (let i = 0; i < 16; i += 1) {
        await page.keyboard.press('Tab');
        const shown = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return { name: 'body', visible: true };
          const style = getComputedStyle(el);
          const ring = style.boxShadow !== 'none' && style.boxShadow !== '';
          const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
          return {
            name: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 30) ?? el.tagName,
            visible: ring || outline,
          };
        });
        expect(shown.visible, `no visible focus on "${shown.name}"`).toBe(true);
      }
    });
  }

  test('the swatch in a colour trigger is inset by the same amount on every side', async ({ page }) => {
    await openGallery(page);
    const control = page.getByRole('button', { name: 'Gallery brand colour' }).first();
    await control.scrollIntoViewIfNeeded();
    const outer = await control.boundingBox();
    const inner = await control.locator('span.rounded').first().boundingBox();
    expect(outer).not.toBeNull();
    expect(inner).not.toBeNull();
    const top = (inner?.y ?? 0) - (outer?.y ?? 0);
    const bottom = (outer?.y ?? 0) + (outer?.height ?? 0) - ((inner?.y ?? 0) + (inner?.height ?? 0));
    const left = (inner?.x ?? 0) - (outer?.x ?? 0);
    expect(Math.abs(top - bottom), `top ${top}, bottom ${bottom}`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(top - left), `top ${top}, left ${left}`).toBeLessThanOrEqual(1);
  });

  test('a badge keeps its height however its label is trimmed', async ({ page }) => {
    await openGallery(page);
    const badge = page.locator('span.rounded-pill', { hasText: 'Success' }).first();
    await badge.scrollIntoViewIfNeeded();
    const box = await badge.boundingBox();
    expect(box?.height ?? 0, 'the badge collapsed onto its own letters').toBeGreaterThanOrEqual(22);
  });

  test('the caret half of a split button opens the rest of the vocabulary', async ({ page }) => {
    await openGallery(page);
    const caret = page.getByRole('button', { name: 'Other statuses' }).first();
    await caret.scrollIntoViewIfNeeded();
    await caret.click();
    const items = page.getByRole('menuitem');
    await expect(items.first()).toBeVisible();
    const box = await items.first().boundingBox();
    expect(box?.width ?? 0, 'the menu has no width where it opened').toBeGreaterThan(0);
  });

  test('a dialog leaves with a motion, then is gone (wavingui#1)', async ({ page }) => {
    await openGallery(page);
    const opener = page.getByRole('button', { name: 'Lock for a while' });
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Lock with a timer' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    // Still drawn, running its exit, the moment it is closed.
    await expect(dialog).toHaveClass(/pop-out/);
    await expect(dialog).toHaveCount(0);
    await expect(opener, 'focus did not return to what opened it').toBeFocused();
  });
});

test.describe('text sits in the middle of its control', () => {
  test.use({ deviceScaleFactor: 4 });

  test('the label in a primary button is centred on its letters', async ({ page }) => {
    await openGallery(page);
    const control = page.getByRole('button', { name: 'Primary' }).first();
    await control.scrollIntoViewIfNeeded();
    const label = control.locator('.optical-center').first();
    await expect(label).toHaveCount(1);
    const [box, labelBox] = [await control.boundingBox(), await label.boundingBox()];
    const above = (labelBox?.y ?? 0) - (box?.y ?? 0);
    const below = (box?.y ?? 0) + (box?.height ?? 0) - ((labelBox?.y ?? 0) + (labelBox?.height ?? 0));
    expect(Math.abs(above - below), `${above.toFixed(2)} above, ${below.toFixed(2)} below`).toBeLessThanOrEqual(0.5);
  });

  test('the glyph in a key cap is centred on its ink', async ({ page }) => {
    await openGallery(page);
    const cap = page.locator('kbd').first();
    await cap.scrollIntoViewIfNeeded();
    const gaps = await inkGaps(await cap.screenshot(), { scale: 4, inset: 1 });
    expect(gaps, 'the cap has ink').not.toBeNull();
    expect(Math.abs(gaps?.off ?? 0)).toBeLessThanOrEqual(0.5);
  });
});

/**
 * The reviewable record: the whole gallery, both themes, at the width the
 * baselines are approved at. Re-rendering them (`npm run baselines`) is how a
 * visual change is approved, in the same commit as the change.
 */
test.describe('baselines @visual', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`gallery, ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await openGallery(page, theme);
      await expect(page).toHaveScreenshot(`gallery-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});

/** Screenshots for the reviewing agent, at the widths the UX pass judges. */
test.describe('ux shots @visual', () => {
  for (const width of [1440, 1024, 820] as const) {
    test(`gallery at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openGallery(page);
      mkdirSync('test-results/ux', { recursive: true });
      await page.screenshot({ path: `test-results/ux/gallery-${width}.png`, fullPage: true });
    });
  }
});
