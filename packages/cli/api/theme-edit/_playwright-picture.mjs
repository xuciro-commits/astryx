// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file One picture of a page through the project's Playwright, run as its
 * own process by the editor's browser runner.
 * @input argv: the Playwright entry file, the page (.html), the picture
 *   (.png), the color mode, and a browser to use instead of Playwright's own
 * @output the picture at the path given; on failure, Playwright's error on
 *   stderr and exit code 1
 * @position run by `screenshot` in _preview.mjs through `runBrowser`, which
 *   gives it a temp folder of its own, its time bound and its stop
 */

import {pathToFileURL} from 'node:url';

const [entry, html, png, mode, executablePath] = process.argv.slice(2);
try {
  const pw = await import(pathToFileURL(entry).href);
  const chromium = pw.chromium ?? pw.default?.chromium;
  // A headless browser still opens the system keychain for its "Safe
  // Storage" item, and a machine whose browser never stored one is asked
  // where to put it — once for every picture taken. These keep that storage
  // in memory instead, whatever browser this is: Playwright's own or the
  // one the machine has.
  const browser = await chromium.launch({
    ...(executablePath ? {executablePath} : {}),
    args: ['--use-mock-keychain', '--password-store=basic'],
  });
  try {
    const page = await browser.newPage({
      viewport: {width: 1280, height: 900},
      colorScheme: mode === 'dark' ? 'dark' : 'light',
    });
    await page.goto(pathToFileURL(html).href, {waitUntil: 'load'});
    await page.screenshot({path: png, fullPage: true});
  } finally {
    await browser.close();
  }
} catch (e) {
  process.stderr.write(`${e instanceof Error ? e.message : String(e)}\n`);
  process.exitCode = 1;
}
