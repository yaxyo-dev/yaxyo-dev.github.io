import { useEffect, useRef } from 'react';

// A ring that trails the real pointer and grows over anything clickable.
// The normal cursor stays visible, so nothing gets harder to use.
export default function Cursor() {
  const ring = useRef(null);

  useEffect(() => {
    const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!allowed.matches) return undefined;

    const el = ring.current;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      el.classList.add('is-on');
      el.classList.toggle('is-hot', Boolean(event.target.closest?.('a, button, summary')));
    };
    const tick = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <div className="cursor" ref={ring} aria-hidden="true" />;
}
