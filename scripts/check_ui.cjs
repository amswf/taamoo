/* Browser regression checks. Install Playwright or set PLAYWRIGHT_MODULE to its module path.
   Start a static server, then run: SITE_URL=http://127.0.0.1:8085 node scripts/check_ui.cjs */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:8085';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Do not send test visits or ad impressions to production services.
    await page.route(/googlesyndication|googletagmanager|google-analytics/, route => route.abort());
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/', '/games/', '/games/tendril/', '/games/panda-go/', '/support.html', '/privacy.html', '/privacy/tendril.html', '/404.html']) {
        await page.goto(base + path);
        const layout = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
          main: document.querySelectorAll('main').length,
          heading: document.querySelectorAll('h1').length
        }));
        assert.ok(layout.content <= layout.viewport + 1, `Overflow at ${width}: ${path}`);
        assert.equal(layout.main, 1, `Main landmark: ${path}`);
        assert.equal(layout.heading, 1, `Page heading: ${path}`);
        const active = await page.locator('nav[aria-label="Main navigation"] [aria-current]').count();
        assert.equal(active, path.startsWith('/games/') || path === '/support.html' ? 1 : 0, `Active navigation: ${path}`);
      }
    }

    await page.goto(base + '/');
    await page.getByRole('button', { name: 'Puzzles', exact: true }).click();
    assert.equal(await page.locator('.play-card:visible').count(), 6);
    await page.getByRole('checkbox', { name: 'English interface only' }).check();
    assert.equal(await page.locator('.play-card:visible').count(), 3);
    await page.getByRole('searchbox', { name: 'Find a browser game' }).fill('golf');
    assert.equal(await page.locator('.play-card:visible').count(), 1);
    await page.goto(base + '/games/tendril/');
    await page.goBack();
    assert.equal(await page.getByRole('searchbox').inputValue(), 'golf');
    assert.equal(await page.locator('.play-card:visible').count(), 1);
    await page.getByRole('searchbox').fill('no-such-game-123');
    assert.equal(await page.locator('.play-card:visible').count(), 0);
    assert.ok(await page.getByRole('heading', { name: 'No games found.' }).isVisible());
    await page.getByRole('button', { name: 'Clear filters' }).click();
    assert.equal(await page.locator('.play-card:visible').count(), 9);
    assert.equal(await page.locator('#game-search').evaluate(node => node === document.activeElement), true);

    await page.goto(base + '/games/');
    await page.getByRole('checkbox', { name: 'English interface only' }).check();
    assert.equal(await page.locator('.directory-card:visible').count(), 6);
    await page.goto(base + '/games/#ripple');
    assert.ok(await page.locator('#ripple').isVisible(), 'Explicit guide links must override saved filters');
    await page.locator('.comparison summary').click();
    assert.ok(await page.getByRole('table').isVisible());
    await page.goto(base + '/games/tendril/');
    await page.locator('summary').first().click();
    assert.equal(await page.locator('details').first().getAttribute('open'), '');

    // Skip links should put keyboard focus directly on content.
    await page.goto(base + '/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main');

    const noScript = await browser.newContext({ javaScriptEnabled: false });
    await noScript.route(/googlesyndication|googletagmanager|google-analytics/, route => route.abort());
    const staticPage = await noScript.newPage();
    await staticPage.goto(base + '/');
    assert.equal(await staticPage.locator('.play-card:visible').count(), 9);
    assert.equal(await staticPage.getByRole('button', { name: 'Puzzles', exact: true }).isVisible(), false);
    await staticPage.goto(base + '/games/');
    assert.equal(await staticPage.locator('.directory-card:visible').count(), 9);
    await noScript.close();

    // Blocked browser storage must not break catalogue controls.
    const restricted = await browser.newContext();
    await restricted.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
    });
    await restricted.route(/googlesyndication|googletagmanager|google-analytics/, route => route.abort());
    const restrictedPage = await restricted.newPage();
    await restrictedPage.goto(base + '/');
    await restrictedPage.getByRole('button', { name: 'Arcade', exact: true }).click();
    assert.equal(await restrictedPage.locator('.play-card:visible').count(), 3);
    await restricted.close();
    assert.deepEqual(errors, []);
    console.log('PASS: 32 page/viewport layouts; combined search/language/category filters, empty-state reset, back navigation, linked guides, FAQ, keyboard skip link, no-JS and blocked-storage behavior.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
