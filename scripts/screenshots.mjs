import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = resolve('storybook-static');
const outDir = resolve('docs/images');

const shots = [
  { name: 'tile-button', story: 'components-tilebutton--gallery' },
  { name: 'list', story: 'components-list--onboarding' },
  { name: 'input-button', story: 'components-input--with-button' },
  { name: 'bento', story: 'components-bento--hobbies' },
];
const themes = ['dark', 'light'];
const padding = 24;

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

if (!existsSync(root)) {
  console.error('Нет storybook-static — сначала npm run build:storybook');
  process.exit(1);
}

const server = createServer((req, res) => {
  const path = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = existsSync(path) && statSync(path).isDirectory() ? join(path, 'index.html') : path;
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((done) => server.listen(0, done));
const base = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({
  channel: process.env.CHROME_PATH ? undefined : 'chrome',
  executablePath: process.env.CHROME_PATH,
});

try {
  await mkdir(outDir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

  for (const { name, story } of shots) {
    for (const theme of themes) {
      await page.goto(`${base}/iframe.html?id=${story}&viewMode=story&globals=theme:${theme}`, {
        waitUntil: 'networkidle0',
      });
      const target = await page.waitForSelector('#storybook-root [data-vui-theme] > *');
      await page.evaluate(() => document.fonts.ready);
      const box = await target.evaluate((node) => {
        const rects = [...node.children].map((child) => child.getBoundingClientRect());
        if (!rects.length) rects.push(node.getBoundingClientRect());
        const x = Math.min(...rects.map((r) => r.left));
        const y = Math.min(...rects.map((r) => r.top));
        return {
          x,
          y,
          width: Math.max(...rects.map((r) => r.right)) - x,
          height: Math.max(...rects.map((r) => r.bottom)) - y,
        };
      });
      const file = join(outDir, `${name}-${theme}.png`);
      await page.screenshot({
        path: file,
        clip: {
          x: Math.max(box.x - padding, 0),
          y: Math.max(box.y - padding, 0),
          width: box.width + padding * 2,
          height: box.height + padding * 2,
        },
      });
      console.log(file);
    }
  }
} finally {
  await browser.close();
  server.close();
}
