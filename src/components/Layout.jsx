import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigationType } from 'react-router';
import Cursor from './Cursor';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import { pageMeta } from '../lib/head';
import { localized, otherLanguagePath, useLang } from '../lib/i18n';

const NAV_SECTIONS = ['work', 'about', 'skills', 'contact'];

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

// Works out which section is under the header, so the menu can mark where you are.
function useActiveSection(pathname) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 36;
      const current = NAV_SECTIONS.find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= line && rect.bottom > line;
      });
      // The last section may be too short to ever reach the header.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const last = document.getElementById(NAV_SECTIONS.at(-1));
      setActive(atBottom && last ? NAV_SECTIONS.at(-1) : (current ?? null));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return active;
}

// Fades elements marked data-reveal into place as they scroll into view.
function useReveal(pathname) {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]:not(.is-in)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [pathname]);
}

export default function Layout() {
  usePageChange();
  const lang = useLang();
  const { pathname } = useLocation();
  const active = useActiveSection(pathname);
  useReveal(pathname);
  const t = ui[lang];
  const home = localized(lang, '/');
  const [first, last] = profile.name.split(' ');

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <Cursor />
      <header className="site-header">
        <div className="site-header-inner wrap">
          <Link className="brand" to={home} aria-label={profile.name}>
            <span className="brand-name">{first}</span>
            <i className="brand-dot" aria-hidden="true" />
            <span className="brand-last">{last}</span>
          </Link>
          <nav className="site-nav" aria-label={lang === 'uz' ? 'Asosiy menyu' : 'Main'}>
            {NAV_SECTIONS.map((id) => (
              <Link key={id} className={`nav-${id}`} to={`${home}#${id}`} aria-current={active === id ? 'true' : undefined}>
                {t.nav[id]}
              </Link>
            ))}
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
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
