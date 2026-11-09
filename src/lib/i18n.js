import { useLocation } from 'react-router';

export const langOf = (pathname) =>
  pathname === '/uz' || pathname.startsWith('/uz/') ? 'uz' : 'en';

export function useLang() {
  return langOf(useLocation().pathname);
}

/** A path in the given language. `path` is written from the English root, like '/work/x/'. */
export const localized = (lang, path) => (lang === 'uz' ? `/uz${path}` : path);

/** The English-root form of any path, with no language prefix. */
export const unlocalized = (pathname) => {
  if (pathname === '/uz') return '/';
  return pathname.startsWith('/uz/') ? pathname.slice(3) : pathname;
};

/** The same page in the other language. */
export const otherLanguagePath = (pathname) => {
  const base = unlocalized(pathname);
  return localized(langOf(pathname) === 'en' ? 'uz' : 'en', base);
};
