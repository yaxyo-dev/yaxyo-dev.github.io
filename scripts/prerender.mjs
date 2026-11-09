// Runs after `vite build`. Renders every page to its own HTML file, so the site
// works without JavaScript, is readable by search engines and link previews,
// and can be hosted on any static host with no routing setup.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, allPaths, headTags, pageMeta, SITE_URL } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');

// Load the display font early, since it's used for the biggest text on the page.
const assets = await fs.readdir(path.join(dist, 'assets'));
const fontPreloads = assets
  .filter((file) => /^archivo-latin-wdth-normal-.*\.woff2$/.test(file))
  .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

const fill = ({ lang, head, app }) =>
  template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace('<!--head-->', [fontPreloads, head].filter(Boolean).join('\n    '))
    .replace('<!--app-->', app);

const paths = allPaths();
for (const route of paths) {
  const html = fill({ lang: pageMeta(route).lang, head: headTags(route), app: render(route) });
  const file = path.join(dist, ...route.split('/').filter(Boolean), 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

const notFoundHead = '<title>Page not found · Yaxyo Nigmatov</title>\n    <meta name="robots" content="noindex" />';
await fs.writeFile(
  path.join(dist, '404.html'),
  fill({ lang: 'en', head: notFoundHead, app: render('/page-that-does-not-exist') }),
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`).join('\n')}
</urlset>
`;
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${paths.length} pages, plus 404.html, sitemap.xml and robots.txt.`);
