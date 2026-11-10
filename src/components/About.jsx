import { profile } from '../content/profile';
import { ui } from '../content/ui';

export default function About({ lang }) {
  const t = ui[lang].about;
  const [lede, ...rest] = t.body;
  return (
    <section id="about" className="about wrap">
      <h2 className="title display" data-reveal="rise"><span>{t.title}</span></h2>
      {profile.photo && (
        <img className="about-photo" src={profile.photo} alt={profile.name} width="480" height="480" loading="lazy" decoding="async" />
      )}
      <div className="about-text">
        <p className="about-lede" data-reveal>{lede}</p>
        {rest.map((paragraph) => <p key={paragraph} data-reveal>{paragraph}</p>)}
      </div>
      <ol className="timeline">
        {t.timeline.map(([date, text], i) => (
          <li key={date} data-reveal style={{ '--i': i }}>
            <span className="timeline-date display">{date}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
