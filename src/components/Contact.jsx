import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa6';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import TileWall from './TileWall';

export default function Contact({ lang }) {
  const t = ui[lang];
  const links = [
    { href: profile.telegram.url, icon: <FaTelegram />, label: `Telegram: ${profile.telegram.handle}`, external: true, main: true },
    { href: `mailto:${profile.email}`, icon: <FaEnvelope />, label: `${t.contact.email}: ${profile.email}` },
    { href: profile.github.url, icon: <FaGithub />, label: `GitHub: ${profile.github.handle}`, external: true },
    { href: profile.linkedin.url, icon: <FaLinkedin />, label: 'LinkedIn', external: true },
  ];

  return (
    <section id="contact" className="contact" data-tone="dark">
      <div className="wrap">
        <h2 className="display contact-title" data-reveal>{t.contact.title}</h2>
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
        <TileWall text="SALOM" palette="night" className="contact-wall" />
        <footer className="site-footer">
          <span>© {profile.name}</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </section>
  );
}
