import { useEffect, useRef, useState } from 'react';
import { profile } from '../content/profile';

const prefersLessMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Skips the 3D scene for people who asked for less motion, are saving data,
// or are on a device that would struggle. They get still images instead.
function canRun3D() {
  if (prefersLessMotion()) return false;
  const { connection, deviceMemory, hardwareConcurrency } = navigator;
  if (connection?.saveData || deviceMemory <= 2 || hardwareConcurrency <= 2) return false;
  return 'WebGL2RenderingContext' in window;
}

// The layers behind the page: the sky, your name, and the dome in front of it.
export default function DomeStage() {
  const stage = useRef(null);
  const name = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!canRun3D()) {
      root.dataset.scene = 'static';
      return () => delete root.dataset.scene;
    }
    let dispose;
    let cancelled = false;
    const timer = setTimeout(() => {
      import('./domeScene')
        .then(({ mountDomeScene }) => {
          if (cancelled) return;
          dispose = mountDomeScene(stage.current, {
            onReady: () => {
              root.dataset.scene = 'live';
              setLive(true);
            },
          });
        })
        .catch(() => {
          root.dataset.scene = 'static';
        });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      dispose?.();
      delete root.dataset.scene;
    };
  }, []);

  // The name drifts up a little faster than the page as you scroll away.
  useEffect(() => {
    if (prefersLessMotion()) return undefined;
    const el = name.current;
    let frame = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty('--hp', Math.min(1, window.scrollY / window.innerHeight).toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  return (
    <>
      <div className="sky" aria-hidden="true" />
      <p className="hero-name display" ref={name}>{profile.shortName}</p>
      <div className={`dome-stage${live ? ' is-live' : ''}`} ref={stage} aria-hidden="true">
        <img className="dome-poster" src="/hero-dome.webp" alt="" width="1000" height="1120" fetchPriority="high" decoding="async" />
      </div>
    </>
  );
}
