import { ArrowUpRight } from './Icons';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

export default function Contact({ lang }) {
  const t = ui[lang];
  const links = [
    { href: profile.telegram.url, name: 'Telegram', detail: profile.telegram.handle, external: true },
    { href: profile.instagram.url, name: 'Instagram', detail: profile.instagram.handle, external: true },
    { href: `mailto:${profile.email}`, name: t.contact.email, detail: profile.email },
    { href: profile.github.url, name: 'GitHub', detail: profile.github.handle, external: true },
    { href: profile.linkedin.url, name: 'LinkedIn', detail: profile.name, external: true },
  ];

  return (
    <section id="contact" className="contact">
      <div className="wrap contact-inner">
        <h2 className="sr-only">{t.contact.title}</h2>
        <div className="contact-words display" aria-hidden="true" data-reveal="salom">
          {t.contact.before && <span className="contact-word">{t.contact.before}</span>}
          <span className="salom">
            {[...'Salom'].map((letter, i) => (
              <span className="salom-mask" key={letter}><span style={{ '--i': i }}>{letter}</span></span>
            ))}
          </span>
          {t.contact.after && <span className="contact-word">{t.contact.after}</span>}
        </div>
        <p className="contact-lede" data-reveal>{t.contact.lede}</p>
        <ul className="contact-links">
          {links.map((link, i) => (
            <li key={link.name} data-reveal style={{ '--i': i }}>
              <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="contact-name display">{link.name}</span>
                <span className="contact-detail">{link.detail}</span>
                <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
        <footer className="site-footer">
          <span>© 2026 {profile.name}</span>
          <span>{t.place}</span>
        </footer>
      </div>
    </section>
  );
}
