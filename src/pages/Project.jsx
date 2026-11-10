import { Link } from 'react-router';
import ChatMock from '../components/ChatMock';
import Contact from '../components/Contact';
import { ArrowLeft, ArrowRight } from '../components/Icons';
import LiveDemo from '../components/LiveDemo';
import { gallery, projectBySlug } from '../content/projects';
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
        <h2 className="display">{t.case.flowTitle}</h2>
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
  const next = gallery[(gallery.indexOf(project) + 1) % gallery.length];

  const facts = [
    [t.role, c.role],
    [t.year, project.year],
    [t.stack, project.stack.join(', ')],
    ...(c.status ? [[t.status, c.status]] : []),
  ];

  return (
    <>
      <article className="case">
        <div className="case-wall" style={{ '--wall': project.wall }}>
          <header className="case-head wrap">
            <Link className="text-link case-back" to={`${localized(lang, '/')}#work`}>
              <ArrowLeft /> {t.back}
            </Link>
            <p className="wall-kind">{c.place ? `${c.type}, ${c.place}` : c.type}</p>
            <h1 className="case-title display">{c.name}</h1>
            <p className="case-lede">{c.summary}</p>
          </header>
          <div className="wrap">
            <Stage project={project} lang={lang} />
          </div>
        </div>

        <div className="wrap">
          <dl className="case-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="case-body">
            {c.stats && (
              <ul className="stats">
                {c.stats.map(([value, label]) => (
                  <li key={label}>
                    <strong className="display">{value}</strong>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            )}
            {c.sections.map(([title, text]) => (
              <section key={title} data-reveal>
                <h2 className="display">{title}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        </div>

        <nav className="case-next" style={{ '--wall': next.wall }} aria-label={t.next}>
          <Link className="wrap" to={localized(lang, `/work/${next.slug}/`)}>
            <span className="wall-kind">{t.next}</span>
            <span className="case-next-name display">{next[lang].name} <ArrowRight /></span>
          </Link>
        </nav>
      </article>
      <Contact lang={lang} />
    </>
  );
}
