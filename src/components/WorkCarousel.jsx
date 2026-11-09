import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { FaArrowLeft, FaArrowRight, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { gallery } from '../content/projects';
import { ui } from '../content/ui';
import { localized } from '../lib/i18n';

const pad = (n) => String(n).padStart(2, '0');

function cardImage(project, lang) {
  if (project.group === 'site') return project.shots.desktop;
  if (project.group === 'game') return project.art.banner;
  return `/work/mijoz-card-${lang}.webp`;
}

function cardAlt(project, lang) {
  const t = ui[lang];
  if (project.group === 'site') return t.case.desktopAlt(project[lang].name);
  return project.group === 'game' ? t.game.alt : t.bot.chatLabel;
}

function frameLabel(project) {
  if (project.demo) return project.demo.replace(/^\//, '');
  return project.group === 'game' ? 'Roblox' : 'Telegram';
}

// If JavaScript is off, the gallery becomes a plain grid so nothing is hidden.
const noScriptStyles =
  '.carousel-stage{height:auto;perspective:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}' +
  '.slide{position:static;width:auto;transform:none;opacity:1}.carousel-controls{display:none}';

export default function WorkCarousel({ lang }) {
  const t = ui[lang].work;
  const count = gallery.length;
  const [active, setActive] = useState(0);
  const drag = useRef(null);
  const swiped = useRef(false);

  const go = (step) => setActive((n) => (n + step + count) % count);

  // How far a card sits from the centre, going whichever way round is shorter.
  const offsetOf = (i) => {
    let d = i - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  const onPointerDown = (event) => {
    drag.current = event.clientX;
    swiped.current = false;
  };
  const onPointerUp = (event) => {
    if (drag.current === null) return;
    const moved = event.clientX - drag.current;
    drag.current = null;
    if (Math.abs(moved) > 40) {
      swiped.current = true;
      go(moved < 0 ? 1 : -1);
    }
  };
  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  };

  const project = gallery[active];
  const c = project[lang];
  const caseLink = localized(lang, `/work/${project.slug}/`);

  // Tints the light behind the dome to match the project showing.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dome:accent', { detail: project.glow }));
  }, [project.glow]);

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={t.galleryLabel}
      onKeyDown={onKeyDown}
      style={{ '--glow': project.glow }}
    >
      <noscript><style dangerouslySetInnerHTML={{ __html: noScriptStyles }} /></noscript>

      <div className="wrap work-head">
        <div data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display title-xl">{t.title}</h2>
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => go(-1)} aria-label={t.prev}><FaArrowLeft aria-hidden="true" /></button>
          <span className="carousel-count">{pad(active + 1)} / {pad(count)}</span>
          <button type="button" onClick={() => go(1)} aria-label={t.next}><FaArrowRight aria-hidden="true" /></button>
        </div>
      </div>

      <div className="carousel-viewport">
        <ul
          className="carousel-stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onDragStart={(event) => event.preventDefault()}
        >
          {gallery.map((p, i) => {
            const d = offsetOf(i);
            const far = Math.abs(d);
            const centre = d === 0;
            return (
              <li
                key={p.slug}
                className={`slide${centre ? ' is-centre' : ''}`}
                style={{ '--x': d, '--far': far, zIndex: 10 - far }}
                aria-hidden={!centre}
              >
                <div className="slide-frame">
                  <div className="slide-bar"><i /><i /><i /><span>{frameLabel(p)}</span></div>
                  <img
                    src={cardImage(p, lang)}
                    alt={centre ? cardAlt(p, lang) : ''}
                    width="1600"
                    height="1000"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                {centre ? (
                  <Link
                    className="slide-hit"
                    to={caseLink}
                    aria-label={`${t.open}: ${p[lang].name}`}
                    onClick={(event) => {
                      if (swiped.current) event.preventDefault();
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="slide-hit"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (!swiped.current) setActive(i);
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap">
        <p className="sr-only" aria-live="polite">{`${pad(active + 1)} / ${pad(count)}: ${c.name}`}</p>

        <div className="carousel-info" key={project.slug}>
          <div>
            <p className="eyebrow">{c.place ? `${c.type}, ${c.place}` : c.type}</p>
            <h3 className="display carousel-name">{c.name}</h3>
          </div>
          <div className="carousel-side">
            <p>{c.summary}</p>
            {c.status && <p className="carousel-status">{c.status}</p>}
            <div className="actions">
              <Link className="pill pill-solid" to={caseLink}>{t.open} <FaArrowRight aria-hidden="true" /></Link>
              {project.demo && (
                <a className="pill" href={project.demo} target="_blank" rel="noopener noreferrer">
                  {t.live} <FaArrowUpRightFromSquare aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        <ul className="carousel-tabs">
          {gallery.map((p, i) => (
            <li key={p.slug}>
              <button type="button" className={i === active ? 'is-on' : undefined} aria-current={i === active ? 'true' : undefined} onClick={() => setActive(i)}>
                {p[lang].name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
