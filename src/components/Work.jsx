import { Link } from 'react-router';
import ChatMock from './ChatMock';
import { ArrowRight, ArrowUpRight } from './Icons';
import { gallery } from '../content/projects';
import { ui } from '../content/ui';
import { localized } from '../lib/i18n';

// What sits on the right of each project: the page itself, the game art or the chat.
function Media({ project, lang }) {
  if (project.group === 'site') {
    return (
      <>
        <div className="shot shot-page">
          <img src={project.shots.full} alt="" width="1200" height="3000" loading="lazy" decoding="async" />
        </div>
        <div className="shot shot-phone">
          <img src={project.shots.phone} alt="" width="640" height="5000" loading="lazy" decoding="async" />
        </div>
      </>
    );
  }
  if (project.group === 'game') {
    return (
      <div className="shot shot-art">
        <img src={project.art.banner} alt="" width="1600" height="900" loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className="shot shot-chat">
      <ChatMock lang={lang} />
    </div>
  );
}

function Wall({ project, lang, index }) {
  const t = ui[lang].work;
  const c = project[lang];
  const caseLink = localized(lang, `/work/${project.slug}/`);
  const kind = [c.place ? `${c.type}, ${c.place}` : c.type, project.demo && t.demoTag].filter(Boolean).join(' · ');

  return (
    <article className="wall" style={{ '--wall': project.wall, zIndex: index + 1 }}>
      <div className="wall-text">
        <div data-reveal>
          <p className="wall-kind">{kind}</p>
          <h3 className="wall-name display">
            <Link to={caseLink}>{c.name}</Link>
          </h3>
        </div>
        <div className="wall-foot" data-reveal>
          <p>{c.summary}</p>
          <div className="wall-links">
            <Link className="text-link" to={caseLink}>{t.case} <ArrowRight /></Link>
            {project.demo && (
              <a className="text-link" href={project.demo} target="_blank" rel="noopener noreferrer">
                {t.demo} <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </div>
      <Link className="wall-media" to={caseLink} tabIndex={-1} aria-hidden="true" data-reveal>
        <Media project={project} lang={lang} />
      </Link>
    </article>
  );
}

export default function Work({ lang }) {
  const t = ui[lang].work;
  return (
    <section id="work" className="work">
      <header className="work-head wrap">
        <h2 className="title display" data-reveal="rise"><span>{t.title}</span></h2>
        <p className="work-intro" data-reveal>{t.intro}</p>
      </header>
      <div className="walls">
        {gallery.map((project, index) => (
          <Wall key={project.slug} project={project} lang={lang} index={index} />
        ))}
      </div>
    </section>
  );
}
