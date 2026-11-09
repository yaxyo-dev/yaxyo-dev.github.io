import { Link } from 'react-router';
import { FaArrowDown, FaArrowRight, FaTelegram } from 'react-icons/fa6';
import ChatMock from '../components/ChatMock';
import Contact from '../components/Contact';
import TileWall from '../components/TileWall';
import { profile } from '../content/profile';
import { bot, game, sites } from '../content/projects';
import { ui } from '../content/ui';
import { localized, useLang } from '../lib/i18n';

const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function Home() {
  const lang = useLang();
  const t = ui[lang];
  const caseLink = (project) => localized(lang, `/work/${project.slug}/`);
  const demoRequest = `${profile.telegram.url}?text=${encodeURIComponent(t.offer.prefill)}`;

  return (
    <>
      <section className="hero wrap">
        <TileWall text="YAXYO" className="hero-wall" />
        <div className="hero-grid">
          <h1 className="hero-statement">{t.hero.statement}</h1>
          <div className="hero-side">
            <p className="hero-intro">{t.hero.intro}</p>
            <div className="actions">
              <a className="button" href={profile.telegram.url} {...external}>
                <FaTelegram aria-hidden="true" /> {t.hero.primary}
              </a>
              <a className="text-link" href="#work">
                {t.hero.secondary} <FaArrowDown aria-hidden="true" />
              </a>
            </div>
            <p className="status"><i aria-hidden="true" />{t.hero.status}</p>
          </div>
        </div>
      </section>

      <section id="work" className="section wrap">
        <header className="section-head">
          <h2>{t.sites.title}</h2>
          <p>{t.sites.lede}</p>
        </header>
        <ul className="sites">
          {sites.map((site) => {
            const c = site[lang];
            return (
              <li key={site.slug}>
                <Link className="site-tile" to={caseLink(site)}>
                  <span className="site-frame">
                    <img src={site.shots.phone} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="site-name">{c.name}</span>
                  <span className="site-meta">{c.type}, {c.place}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <aside className="offer" aria-labelledby="offer-title">
          <h3 id="offer-title">{t.offer.title}</h3>
          <ul className="offer-list">
            {t.offer.items.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <a className="button" href={demoRequest} {...external}>
            <FaTelegram aria-hidden="true" /> {t.offer.cta}
          </a>
        </aside>
      </section>

      {game && (
        <section className="section wrap">
          <header className="section-head">
            <h2>{game[lang].name}</h2>
            <div className="section-head-side">
              <p>{t.game.lede}</p>
              <Link className="text-link" to={caseLink(game)}>
                {t.more} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </header>
          <Link className="mosaic" to={caseLink(game)} aria-label={game[lang].name}>
            <img className="mosaic-main" src={game.art.banner} alt={t.game.alt} width="1600" height="900" loading="lazy" decoding="async" />
            <img src={game.art.lava} alt={t.game.altLava} width="960" height="540" loading="lazy" decoding="async" />
            <img src={game.art.secret} alt={t.game.altSecret} width="960" height="540" loading="lazy" decoding="async" />
          </Link>
        </section>
      )}

      {bot && (
        <section className="bot-band">
          <div className="wrap bot-grid">
            <div className="bot-copy">
              <h2>{bot[lang].name}</h2>
              <p>{t.bot.lede}</p>
              <Link className="text-link" to={caseLink(bot)}>
                {t.more} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
            <ChatMock lang={lang} />
          </div>
        </section>
      )}

      <section id="about" className="section about wrap">
        <div className="about-side">
          <h2>{t.about.title}</h2>
          {profile.photo && (
            <img className="about-photo" src={profile.photo} alt={t.about.photoAlt} width="480" height="480" loading="lazy" decoding="async" />
          )}
        </div>
        <div className="about-body">
          <div className="about-text">
            {t.about.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="about-columns">
            <div>
              <h3>{t.about.skillsTitle}</h3>
              <dl className="skills">
                {t.about.skills.map(([group, items]) => (
                  <div key={group}>
                    <dt>{group}</dt>
                    <dd>{items}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3>{t.about.timelineTitle}</h3>
              <ol className="timeline">
                {t.about.timeline.map(([date, text]) => (
                  <li key={date}>
                    <span>{date}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <Contact lang={lang} />
    </>
  );
}
