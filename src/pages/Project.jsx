import { Link } from 'react-router';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import ChatMock from '../components/ChatMock';
import Contact from '../components/Contact';
import LiveDemo from '../components/LiveDemo';
import { projectBySlug, projects } from '../content/projects';
import { ui } from '../content/ui';
import { localized, useLang } from '../lib/i18n';

function Stage({ project, lang }) {
  const t = ui[lang];
  const c = project[lang];

  if (project.group === 'site') {
    return (
      <div className="stage stage-site">
        <img
          className="stage-desktop"
          src={project.shots.desktop}
          alt={t.case.desktopAlt(c.name)}
          width="1800"
          height="1125"
          decoding="async"
        />
        <LiveDemo
          src={project.demo}
          poster={project.shots.phone}
          posterAlt={t.case.phoneAlt(c.name)}
          title={t.case.liveTitle(c.name)}
          labels={t.case}
        />
      </div>
    );
  }

  if (project.group === 'game') {
    return (
      <div className="stage stage-game">
        <img className="stage-banner" src={project.art.banner} alt={t.game.alt} width="1600" height="900" decoding="async" />
        <img src={project.art.lava} alt={t.game.altLava} width="960" height="540" loading="lazy" decoding="async" />
        <img src={project.art.secret} alt={t.game.altSecret} width="960" height="540" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className="stage stage-bot">
      <ChatMock lang={lang} />
      <div className="flow">
        <h2>{t.case.flowTitle}</h2>
        <ol>
          {c.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
    </div>
  );
}

export default function Project({ slug }) {
  const lang = useLang();
  const t = ui[lang].case;
  const project = projectBySlug(slug);
  const c = project[lang];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  const facts = [
    [t.role, c.role],
    [t.year, project.year],
    [t.stack, project.stack.join(', ')],
    ...(c.status ? [[t.status, c.status]] : []),
  ];

  return (
    <>
      <article className="case">
        <header className="case-head wrap">
          <Link className="case-back" to={`${localized(lang, '/')}#work`}>
            <FaArrowLeft aria-hidden="true" /> {t.back}
          </Link>
          <p className="case-kind">{c.place ? `${c.type}, ${c.place}` : c.type}</p>
          <h1>{c.name}</h1>
          <p className="case-lede">{c.summary}</p>
          <dl className="case-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="case-band" style={{ '--band': project.band, '--band-ink': project.bandInk }}>
          <div className="wrap">
            <Stage project={project} lang={lang} />
          </div>
        </div>

        <div className="case-body wrap">
          {c.stats && (
            <ul className="stats">
              {c.stats.map(([value, label]) => (
                <li key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}
          {c.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>

        <nav className="case-next wrap" aria-label={t.next}>
          <span>{t.next}</span>
          <Link to={localized(lang, `/work/${next.slug}/`)}>
            {next[lang].name} <FaArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </article>
      <Contact lang={lang} />
    </>
  );
}
