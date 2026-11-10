import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, Outlet, useLocation, useNavigationType } from 'react-router';
import { Close, Menu, Moon, Sun } from './Icons';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import { pageMeta } from '../lib/head';
import { localized, otherLanguagePath, unlocalized, useLang } from '../lib/i18n';

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
      // A frame later, so a closing menu has released the page first.
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash, key, navigationType]);
}

// Watches the scroll position for the two things the header needs to know:
// which section you're in, and whether the page has reached the top yet.
function useHeaderState(pathname) {
  const onHome = unlocalized(pathname) === '/';
  const [active, setActive] = useState(null);
  const [solid, setSolid] = useState(!onHome);

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const content = document.querySelector('.after-hero');
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = header.offsetHeight + 1;
      setSolid(!content || content.getBoundingClientRect().top <= line);
      const current = NAV_SECTIONS.find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= line && rect.bottom > line;
      });
      // The last section may be too short to ever reach the header.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atBottom && content ? NAV_SECTIONS.at(-1) : (current ?? null));
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

  return { active, solid };
}

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

// Switches between the dark and light themes and remembers the choice.
// A small script in index.html applies it before the page first draws.
function ThemeToggle({ label }) {
  const [light, setLight] = useState(false);
  const button = useRef(null);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === 'light');
  }, []);

  const toggle = () => {
    const next = !light;
    const root = document.documentElement;
    const apply = () => {
      if (next) root.dataset.theme = 'light';
      else delete root.dataset.theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#f5f0e6' : '#0a0e17');
      flushSync(() => setLight(next));
    };
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {
      // Private browsing can block storage. The switch still works for this visit.
    }

    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }

    // The new colours spread out from the button.
    const { left, top, width, height } = button.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  return (
    <button
      ref={button}
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={light}
      title={label}
      onClick={toggle}
    >
      <Sun className="icon-sun" />
      <Moon className="icon-moon" />
    </button>
  );
}

// The full menu on small screens, where the links don't fit in the header.
function PhoneMenu({ t, home }) {
  const dialog = useRef(null);
  const close = () => dialog.current.close();

  return (
    <>
      <button type="button" className="menu-open" aria-label={t.menu} aria-haspopup="dialog" onClick={() => dialog.current.showModal()}>
        <Menu />
      </button>
      <dialog ref={dialog} className="menu" aria-label={t.navLabel}>
        <button type="button" className="menu-close" aria-label={t.menuClose} onClick={close}>
          <Close />
        </button>
        <nav aria-label={t.navLabel}>
          {NAV_SECTIONS.map((id, i) => (
            <Link key={id} className="display" style={{ '--i': i }} to={`${home}#${id}`} onClick={close}>
              {t.nav[id]}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}

export default function Layout() {
  usePageChange();
  const { pathname } = useLocation();
  const lang = useLang();
  const { active, solid } = useHeaderState(pathname);
  useReveal(pathname);
  const t = ui[lang];
  const home = localized(lang, '/');

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className={`site-header${solid ? ' is-solid' : ''}`}>
        <div className="header-row wrap">
          <Link className="brand" to={home} aria-label={profile.name}>
            <span className="brand-name display">{profile.name}</span>
            <span className="brand-role" aria-hidden="true">{t.role}</span>
          </Link>
          <nav className="site-nav" aria-label={t.navLabel}>
            {NAV_SECTIONS.map((id) => (
              <Link key={id} to={`${home}#${id}`} aria-current={active === id ? 'true' : undefined}>
                {t.nav[id]}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
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
            <ThemeToggle label={t.themeLabel} />
            <PhoneMenu t={t} home={home} />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
