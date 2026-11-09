import { useEffect, useRef } from 'react';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (t) => t * t * (3 - 2 * t);

// One eight-pointed star, the unit of the khatam tile pattern used across
// Samarkand. Repeated edge to edge, the gaps between stars form crosses.
const star = (radius) =>
  Array.from({ length: 16 }, (_, k) => {
    const angle = (k * Math.PI) / 8;
    const r = k % 2 ? radius * 0.7654 : radius;
    return `${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

function TileField() {
  return (
    <svg className="tile-field" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="khatam" width="150" height="150" patternUnits="userSpaceOnUse" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#0a1226" />
          <polygon points={star(50)} fill="#132a66" stroke="#e0b450" strokeWidth="0.8" />
          <polygon points={star(33)} fill="#1a7f86" stroke="#e0b450" strokeWidth="0.6" />
          <polygon points={star(17)} fill="#f3eee3" />
          <circle cx="50" cy="50" r="5" fill="#132a66" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#khatam)" />
    </svg>
  );
}

// On large screens this section pins in place: a dark window opens over a
// wall of tiles as you scroll, and the text appears inside it.
export default function AboutStage({ lang }) {
  const t = ui[lang].about;
  const stage = useRef(null);

  useEffect(() => {
    const el = stage.current;
    const pinned = window.matchMedia('(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (!pinned.matches) {
        el.style.removeProperty('--p');
        el.style.removeProperty('--g');
        return;
      }
      const rect = el.getBoundingClientRect();
      const p = clamp01(-rect.top / (rect.height - window.innerHeight));
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--g', easeInOut(clamp01(p / 0.55)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section id="about" className="about-stage" data-tone="dark" ref={stage}>
      <div className="about-sticky">
        <TileField />
        <div className="about-window" />
        <h2 className="display about-title">{t.title}</h2>
        <div className="about-content wrap">
          {profile.photo && (
            <img className="about-photo" src={profile.photo} alt={t.photoAlt} width="480" height="480" loading="lazy" decoding="async" />
          )}
          <div className="about-text">
            {t.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="about-path">
            <p className="eyebrow">{t.timelineTitle}</p>
            <ol className="timeline">
              {t.timeline.map(([date, text]) => (
                <li key={date}>
                  <span className="timeline-date">{date}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
