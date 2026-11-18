import { FaTelegram } from 'react-icons/fa6';
import AboutStage from '../components/AboutStage';
import Contact from '../components/Contact';
import DomeStage from '../components/DomeStage';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
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
      <ol className="offer-list">
        {t.items.map(([title, text], i) => (
          <li key={title}>
            <span className="offer-n">0{i + 1}</span>
            <strong>{title}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <a className="pill pill-solid" href={request} target="_blank" rel="noopener noreferrer">
        <FaTelegram aria-hidden="true" /> {t.cta}
      </a>
    </aside>
  );
}

export default function Home() {
  const lang = useLang();
  return (
    <>
      <DomeStage />
      <div className="chapters">
        <Hero lang={lang} />
        <section id="work" className="work" data-shot="work">
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
