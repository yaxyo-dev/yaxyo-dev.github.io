import { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { ui } from '../content/ui';

// The colour the light behind the dome takes when each skill is open.
const TINTS = ['#37b3b0', '#2f6bff', '#ff7a2c', '#e0b450'];

export default function Skills({ lang }) {
  const t = ui[lang].skills;
  const [open, setOpen] = useState(0);
  const everyTool = t.items.flatMap(([, , chips]) => chips);

  const toggle = (index) => {
    const next = open === index ? -1 : index;
    setOpen(next);
    if (next === -1) return;
    window.dispatchEvent(new CustomEvent('dome:accent', { detail: { section: 'skills', color: TINTS[next] } }));
    window.dispatchEvent(new CustomEvent('dome:turn'));
  };

  return (
    <section id="skills" className="skills" data-shot="skills">
      <div className="wrap">
        <header className="skills-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display title-lg skills-title" aria-label={t.title}>
            {t.title.split(' ').map((word, i) => (
              <span className="word" key={word} aria-hidden="true">
                <span style={{ '--i': i }}>{word}</span>
              </span>
            ))}
          </h2>
        </header>

        <div className="accordion">
          {t.items.map(([title, text, chips], i) => {
            const isOpen = open === i;
            return (
              <div className="acc-row" key={title} data-reveal style={{ '--i': i }}>
                <div className={`acc${isOpen ? ' is-open' : ''}`}>
                  <h3 className="acc-heading">
                    <button
                      type="button"
                      className="acc-trigger"
                      id={`skill-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`skill-panel-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className="acc-n">0{i + 1}</span>
                      <span className="display acc-title">{title}</span>
                      <FaArrowDown className="acc-icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="acc-body" id={`skill-panel-${i}`} role="region" aria-labelledby={`skill-${i}`}>
                    <div className="acc-clip">
                      <div className="acc-panel">
                        <p>{text}</p>
                        <ul className="chips">
                          {chips.map((chip, n) => <li key={chip} style={{ '--n': n }}>{chip}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="skills-ticker" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="ticker-track" key={copy}>
            {everyTool.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}
