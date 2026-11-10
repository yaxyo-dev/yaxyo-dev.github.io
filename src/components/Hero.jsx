import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from './Icons';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

// The opening screen. The still image of the dome shows straight away, and the
// live 3D version replaces it once it's ready, on devices that can run it.
export default function Hero({ lang }) {
  const t = ui[lang].hero;
  const [first, last] = profile.name.split(' ');
  const pin = useRef(null);
  const stage = useRef(null);
  const slot = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.scene === 'static') return undefined;

    let dispose;
    let cancelled = false;
    const start = () => {
      import('./domeScene')
        .then(({ mountDomeScene }) => {
          if (cancelled) return;
          dispose = mountDomeScene({
            pin: pin.current,
            stage: stage.current,
            slot: slot.current,
            onReady: () => setLive(true),
          });
        })
        .catch(() => {
          root.dataset.scene = 'static';
        });
    };

    // Waits until the browser is free, so the page can be used first.
    const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    const handle = idle(start, { timeout: 1500 });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      dispose?.();
    };
  }, []);

  return (
    <section className={`hero-pin${live ? ' is-live' : ''}`} ref={pin} aria-label={profile.name}>
      <div className="hero-sky" aria-hidden="true" />
      <div className="hero-disc" aria-hidden="true" />

      <h1 className="hero-name display">
        <span className="name-mask"><span style={{ '--i': 0 }}>{first}</span></span>
        {' '}
        <span className="name-mask"><span style={{ '--i': 1 }}>{last}</span></span>
      </h1>

      <div className="hero-stage" ref={stage} aria-hidden="true">
        <div className="dome-slot" ref={slot}>
          <div className="dome-poster" />
        </div>
      </div>

      <div className="hero-offer">
        <p className="hero-statement display">{t.statement}</p>
        <p className="hero-sub">{t.sub}</p>
        <a className="button" href={profile.telegram.url} target="_blank" rel="noopener noreferrer">
          {t.primary} <ArrowRight />
        </a>
      </div>

      <a className="hero-scroll" href="#work">{t.scroll} <ArrowDown /></a>
    </section>
  );
}
