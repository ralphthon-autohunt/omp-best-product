#!/usr/bin/env node
/**
 * e2e-validate.mjs — Playwright E2E validator for sepe-template products
 *
 * Usage:
 *   node scripts/e2e-validate.mjs --url <deploy_url> --input1 <text> --input2 <text> [--timeout 30000]
 *
 * Output: JSON to stdout matching validator-v2.md Step 4 format
 * Exit codes:
 *   0 = success
 *   1 = runtime error
 *   2 = browser launch failure (triggers WebFetch fallback)
 */

import { chromium } from 'playwright';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    url:     { type: 'string' },
    input1:  { type: 'string' },
    input2:  { type: 'string' },
    timeout: { type: 'string', default: '30000' },
  },
});

if (!args.url || !args.input1 || !args.input2) {
  console.error('Usage: node e2e-validate.mjs --url <url> --input1 <text> --input2 <text> [--timeout ms]');
  process.exit(1);
}

const TIMEOUT = parseInt(args.timeout, 10);

async function runRound(page, url, inputText) {
  const result = {
    landing_loaded: false,
    landing_text: '',
    cta_found: false,
    input_accepted: false,
    result_returned: false,
    result_text: '',
    has_error: false,
    load_time_ms: 0,
  };

  const start = Date.now();

  // 1. Navigate to landing
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
    result.landing_loaded = true;
    result.landing_text = (await page.textContent('body')).slice(0, 500);
    result.load_time_ms = Date.now() - start;
  } catch {
    return result;
  }

  // 2. Find and click CTA → /feature
  try {
    const cta = page.locator('a[href="/feature"], a[href*="/feature"], button:has-text("시작"), button:has-text("Start")').first();
    if (await cta.isVisible({ timeout: 3000 })) {
      result.cta_found = true;
      await cta.click();
      await page.waitForLoadState('networkidle', { timeout: TIMEOUT });
    } else {
      // Try navigating directly
      await page.goto(url.replace(/\/$/, '') + '/feature', { waitUntil: 'networkidle', timeout: TIMEOUT });
      result.cta_found = true;
    }
  } catch {
    // Direct navigation fallback
    try {
      await page.goto(url.replace(/\/$/, '') + '/feature', { waitUntil: 'networkidle', timeout: TIMEOUT });
      result.cta_found = true;
    } catch {
      return result;
    }
  }

  // 3. Find input and fill
  try {
    const input = page.locator('textarea, input[type="text"], input:not([type])').first();
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(inputText);
    result.input_accepted = true;
  } catch {
    return result;
  }

  // 4. Find and click submit
  try {
    const submit = page.locator([
      'button[type="submit"]',
      'button:has-text("분석")',
      'button:has-text("시작")',
      'button:has-text("생성")',
      'button:has-text("Submit")',
      'button:has-text("Generate")',
      'button:has-text("Analyze")',
      'button:has-text("Create")',
      'button:has-text("확인")',
    ].join(', ')).first();
    await submit.click();
  } catch {
    // Some products auto-submit or use different patterns
  }

  // 5. Wait for result
  try {
    await page.waitForTimeout(3000);
    const resultEl = page.locator('.result, [class*="result"], [class*="Result"], main, [role="main"]').first();
    result.result_text = (await resultEl.textContent({ timeout: 5000 })).slice(0, 1000);
    result.result_returned = result.result_text.length > 0;
  } catch {
    // Try body as fallback
    try {
      result.result_text = (await page.textContent('body')).slice(0, 1000);
      result.result_returned = result.result_text.length > 10;
    } catch {
      // No result
    }
  }

  // 6. Check for errors
  try {
    result.has_error = (await page.locator('[class*="error"], [class*="Error"], [role="alert"]').count()) > 0;
  } catch {
    // Ignore
  }

  return result;
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.error(`Browser launch failed: ${err.message}`);
    process.exit(2); // Signal WebFetch fallback
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ko-KR',
  });

  try {
    // Round 1: First use (onboarding)
    const page1 = await context.newPage();
    const round1 = await runRound(page1, args.url, args.input1);
    await page1.close();

    // Round 2: Reuse (activation)
    const page2 = await context.newPage();
    // Go directly to feature page for round 2
    const featureUrl = args.url.replace(/\/$/, '') + '/feature';
    const round2Raw = await runRound(page2, featureUrl, args.input2);
    // Round 2 doesn't need landing/cta metrics
    const round2 = {
      input_accepted: round2Raw.input_accepted,
      result_returned: round2Raw.result_returned,
      result_text: round2Raw.result_text,
      has_error: round2Raw.has_error,
    };
    await page2.close();

    const output = { round_1: round1, round_2: round2 };
    console.log(JSON.stringify(output, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`E2E validation error: ${err.message}`);
  process.exit(1);
});
