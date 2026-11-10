import { SITE_URL, profile } from '../content/profile';
import { projects, projectBySlug } from '../content/projects';
import { ui } from '../content/ui';
import { langOf, localized, unlocalized } from './i18n';

const OG_IMAGE = '/og.png';

/** Every page that gets its own static HTML file. */
export function allPaths() {
  const base = ['/', ...projects.map((p) => `/work/${p.slug}/`)];
  return ['en', 'uz'].flatMap((lang) => base.map((path) => localized(lang, path)));
}

/** Title, description and language for one page. */
export function pageMeta(pathname) {
  const lang = langOf(pathname);
  const base = unlocalized(pathname);
  const match = base.match(/^\/work\/([^/]+)\/?$/);
  const project = match && projectBySlug(match[1]);
  if (project) {
    return {
      lang,
      base,
      title: `${project[lang].name} · ${profile.name}`,
      description: project[lang].summary,
      type: 'article',
    };
  }
  return { lang, base, title: ui[lang].meta.title, description: ui[lang].meta.description, type: 'website' };
}

const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const personJsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: `${SITE_URL}/`,
    jobTitle: 'Junior Engineer',
    address: { '@type': 'PostalAddress', addressLocality: 'Samarkand', addressCountry: 'UZ' },
    sameAs: [profile.github.url, profile.linkedin.url, profile.telegram.url, profile.instagram.url],
  }).replace(/</g, '\\u003c');

/** The <head> tags for one prerendered page. */
export function headTags(pathname) {
  const { lang, base, title, description, type } = pageMeta(pathname);
  const url = (path) => `${SITE_URL}${path}`;
  const canonical = url(localized(lang, base));
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="en" href="${url(base)}" />`,
    `<link rel="alternate" hreflang="uz" href="${url(localized('uz', base))}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url(base)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.name)}" />`,
    `<meta property="og:locale" content="${ui[lang].locale}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${url(OG_IMAGE)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (base === '/') {
    tags.push(`<script type="application/ld+json">${personJsonLd()}</script>`);
  }
  return tags.join('\n    ');
}
