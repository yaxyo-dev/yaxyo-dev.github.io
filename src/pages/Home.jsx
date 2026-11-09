import { FaArrowDown, FaTelegram } from 'react-icons/fa6';
import AboutStage from '../components/AboutStage';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import WorkCarousel from '../components/WorkCarousel';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import { useLang } from '../lib/i18n';

function Offer({ lang }) {
  const t = ui[lang].offer;
  const request = `${profile.telegram.url}?text=${encodeURIComponent(t.prefill)}`;
  return (
    <aside className="offer" aria-labelledby="offer-title" data-reveal>
      <h3 id="offer-title" className="display">{t.title}</h3>
      <ul className="offer-list">
        {t.items.map(([title, text]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <a className="pill pill-solid" href={request} target="_blank" rel="noopener noreferrer">
        <FaTelegram aria-hidden="true" /> {t.cta}
      </a>
    </aside>
  );
}

function Skills({ lang }) {
  const t = ui[lang].skills;
  return (
    <section id="skills" className="skills" data-tone="light">
      <div className="wrap">
        <header className="skills-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display title-lg">{t.title}</h2>
        </header>
        <div className="accordion">
          {t.items.map(([title, text, chips], i) => (
            <details key={title} name="skills" className="acc" open={i === 0}>
              <summary>
                <span className="acc-n">0{i + 1}</span>
                <span className="display acc-title">{title}</span>
                <FaArrowDown className="acc-icon" aria-hidden="true" />
              </summary>
              <div className="acc-panel">
                <p>{text}</p>
                <ul className="chips">
                  {chips.map((chip) => <li key={chip}>{chip}</li>)}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const lang = useLang();
  return (
    <>
      <Hero lang={lang} />
      <div className="after-hero">
        <section id="work" className="work" data-tone="light">
          <WorkCarousel lang={lang} />
          <div className="wrap">
            <Offer lang={lang} />
          </div>
        </section>
        <AboutStage lang={lang} />
        <Skills lang={lang} />
        <Contact lang={lang} />
      </div>
    </>
  );
}
