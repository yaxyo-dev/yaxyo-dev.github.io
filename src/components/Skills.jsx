import { ui } from '../content/ui';

// One glaze colour per row, shown when you point at it.
const GLAZES = ['#1c3278', '#0b6a73', '#4a1e5c', '#0f5a47'];

// Everything is visible without clicking. Each row draws itself in as it comes
// into view: the line runs across, the title thickens and the tools drop in.
export default function Skills({ lang }) {
  const t = ui[lang].skills;
  return (
    <section id="skills" className="skills">
      <h2 className="title display wrap" data-reveal="rise"><span>{t.title}</span></h2>
      <ul className="skill-list">
        {t.items.map(([name, text, tools], i) => (
          <li key={name} className="skill" data-reveal="skill" style={{ '--glaze': GLAZES[i] }}>
            <div className="skill-row wrap">
              <h3 className="skill-name display">{name}</h3>
              <div className="skill-detail">
                <p>{text}</p>
                <ul className="tools">
                  {tools.map((tool, n) => <li key={tool} style={{ '--n': n }}>{tool}</li>)}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
