import { useEffect, useState } from 'react';
import { FaArrowDown, FaTelegram } from 'react-icons/fa6';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

function Rotator({ words }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="rotator">
      {words.map((word, n) => (
        <span key={word} className={n === current ? 'is-on' : undefined}>{word}</span>
      ))}
    </span>
  );
}

export default function Hero({ lang }) {
  const t = ui[lang].hero;
  return (
    <section className="hero" data-shot="hero">
      <div className="hero-left">
        <h1 className="hero-title display">
          <span className="sr-only">{t.statement}</span>
          <span className="hero-line" aria-hidden="true">
            {t.before && <span>{t.before}</span>}
            <Rotator words={t.words} />
            {t.after && <span>{t.after}</span>}
          </span>
        </h1>
      </div>

      <div className="hero-right">
        <span className="badge"><i aria-hidden="true" />{t.badge}</span>
        <a className="pill pill-solid" href={profile.telegram.url} target="_blank" rel="noopener noreferrer">
          <FaTelegram aria-hidden="true" /> {t.primary}
        </a>
      </div>

      <div className="hero-foot wrap">
        <span>{t.stack}</span>
        <a href="#work">{t.scroll} <FaArrowDown aria-hidden="true" /></a>
      </div>
    </section>
  );
}
