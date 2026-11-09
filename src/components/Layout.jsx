import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigationType } from 'react-router';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import { pageMeta } from '../lib/head';
import { localized, otherLanguagePath, useLang } from '../lib/i18n';

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="10 10 70 70" aria-hidden="true" focusable="false">
      <path d="M10 10h20v30h30V10h20v40H60v30H30V50H10z" fill="currentColor" />
    </svg>
  );
}

// Keeps the page title, language, scroll position and keyboard focus
// right when moving between pages without a full reload.
function usePageChange() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const firstRender = useRef(true);

  useEffect(() => {
    const { title, description, lang } = pageMeta(pathname);
    document.title = title;
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [pathname]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!hash) return;
    }
    if (navigationType === 'POP') return;
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash, key, navigationType]);
}

export default function Layout() {
  usePageChange();
  const lang = useLang();
  const { pathname } = useLocation();
  const t = ui[lang];
  const home = localized(lang, '/');

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header wrap">
        <Link className="brand" to={home}>
          <BrandMark />
          <span className="brand-full">{profile.name}</span>
          <span className="brand-short">{profile.shortName}</span>
        </Link>
        <nav className="site-nav" aria-label={lang === 'uz' ? 'Asosiy menyu' : 'Main'}>
          <Link to={`${home}#work`}>{t.nav.work}</Link>
          <Link to={`${home}#about`}>{t.nav.about}</Link>
          <Link to={`${home}#contact`}>{t.nav.contact}</Link>
          <Link
            className="lang-switch"
            to={otherLanguagePath(pathname)}
            hrefLang={lang === 'en' ? 'uz' : 'en'}
            lang={lang === 'en' ? 'uz' : 'en'}
            title={t.switchTitle}
            aria-label={t.switchTitle}
          >
            <span className="lang-full">{t.switchLabel}</span>
            <span className="lang-short">{t.switchShort}</span>
          </Link>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
