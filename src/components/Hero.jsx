import { useEffect, useRef, useState } from 'react';
import { FaArrowDown, FaTelegram } from 'react-icons/fa6';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import TileWall from './TileWall';

// Skips the 3D scene for people who asked for less motion, are saving data,
// or are on a device that would struggle. They keep the flat wall.
function canRun3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const { connection, deviceMemory, hardwareConcurrency } = navigator;
  if (connection?.saveData || deviceMemory <= 2 || hardwareConcurrency <= 2) return false;
  return 'WebGL2RenderingContext' in window;
}

function Rotator({ words }) {
  const [current, setCurrent] = useState(0);
  const slot = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(timer);
  }, [words.length]);

  // The slot takes the width of the word showing, so the headline stays
  // centred with no gap around shorter words.
  useEffect(() => {
    const el = slot.current;
    const fit = () => {
      el.style.width = `${el.querySelector('.is-on').offsetWidth}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [current]);

  return (
    <span className="rotator" ref={slot}>
      {words.map((word, n) => (
        <span key={word} className={n === current ? 'is-on' : undefined}>{word}</span>
      ))}
    </span>
  );
}

export default function Hero({ lang }) {
  const t = ui[lang].hero;
  const stage = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRun3D()) return undefined;
    let dispose;
    let cancelled = false;
    const start = () =>
      import('./heroScene')
        .then(({ mountHeroScene }) => {
          if (!cancelled) dispose = mountHeroScene(stage.current, { text: 'YAXYO', onReady: () => setLive(true) });
        })
        .catch(() => {}); // If 3D fails for any reason, the flat wall simply stays.
    const timer = setTimeout(start, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      dispose?.();
    };
  }, []);

  return (
    <section className={`hero${live ? ' is-live' : ''}`} data-tone="dark">
      <div className="hero-stage" ref={stage} aria-hidden="true">
        <TileWall text="YAXYO" palette="hero" className="hero-poster" />
      </div>

      <div className="hero-copy">
        <h1 className="hero-title display">
          <span className="sr-only">{t.statement}</span>
          <span className="hero-line" aria-hidden="true">
            {t.before && <span>{t.before}</span>}
            <Rotator words={t.words} />
            {t.after && <span>{t.after}</span>}
          </span>
        </h1>
        <div className="hero-badges">
          <span className="badge"><i aria-hidden="true" />{t.badge}</span>
          <a className="pill pill-solid" href={profile.telegram.url} target="_blank" rel="noopener noreferrer">
            <FaTelegram aria-hidden="true" /> {t.primary}
          </a>
        </div>
      </div>

      <div className="hero-foot wrap">
        <span>{t.stack}</span>
        <a href="#work">{t.scroll} <FaArrowDown aria-hidden="true" /></a>
      </div>
    </section>
  );
}
