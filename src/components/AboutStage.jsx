import { profile } from '../content/profile';
import { ui } from '../content/ui';

// While this section is on screen the camera holds a close-up of the dome.
// On large screens the text stays pinned as you scroll past it.
export default function AboutStage({ lang }) {
  const t = ui[lang].about;
  return (
    <section id="about" className="about" data-shot="about">
      <div className="about-pin">
        <div className="about-panel wrap">
          <h2 className="display about-title" data-reveal>{t.title}</h2>
          {profile.photo && (
            <img className="about-photo" src={profile.photo} alt={t.photoAlt} width="480" height="480" loading="lazy" decoding="async" />
          )}
          <div className="about-text" data-reveal>
            {t.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="about-path" data-reveal>
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
