import { ArrowRight } from './Icons';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

export default function Offer({ lang }) {
  const t = ui[lang].offer;
  const request = `${profile.telegram.url}?text=${encodeURIComponent(t.prefill)}`;
  return (
    <section className="offer wrap" aria-labelledby="offer-title">
      <h2 id="offer-title" className="offer-title display" data-reveal>{t.title}</h2>
      <ul className="offer-list">
        {t.items.map(([title, text], i) => (
          <li key={title} data-reveal style={{ '--i': i }}>
            <strong className="display">{title}</strong>
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <a className="button" href={request} target="_blank" rel="noopener noreferrer" data-reveal>
        {t.cta} <ArrowRight />
      </a>
    </section>
  );
}
