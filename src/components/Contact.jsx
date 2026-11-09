import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa6';
import { profile } from '../content/profile';
import { ui } from '../content/ui';

export default function Contact({ lang }) {
  const t = ui[lang];
  const links = [
    { href: profile.telegram.url, icon: <FaTelegram />, label: `Telegram: ${profile.telegram.handle}`, external: true, main: true },
    { href: `mailto:${profile.email}`, icon: <FaEnvelope />, label: `${t.contact.email}: ${profile.email}` },
    { href: profile.github.url, icon: <FaGithub />, label: `GitHub: ${profile.github.handle}`, external: true },
    { href: profile.linkedin.url, icon: <FaLinkedin />, label: 'LinkedIn', external: true },
  ];

  return (
    <section id="contact" className="contact" data-shot="contact">
      <div className="wrap">
        <h2 className="contact-title" data-reveal>
          <span className="sr-only">{t.contact.title}</span>
          {t.contact.before && <span className="display contact-word" aria-hidden="true">{t.contact.before}</span>}
          <span className="display contact-salom dome-fill" aria-hidden="true">Salom</span>
          {t.contact.after && <span className="display contact-word" aria-hidden="true">{t.contact.after}</span>}
        </h2>
        <p className="contact-lede">{t.contact.lede}</p>
        <ul className="contact-links">
          {links.map((link) => (
            <li key={link.label}>
              <a
                className={`pill${link.main ? ' pill-solid' : ''}`}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span aria-hidden="true">{link.icon}</span> {link.label}
              </a>
            </li>
          ))}
        </ul>
        <footer className="site-footer">
          <span>© {profile.name}</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </section>
  );
}
