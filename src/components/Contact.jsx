import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa6';
import { profile } from '../content/profile';
import { ui } from '../content/ui';
import TileWall from './TileWall';

export default function Contact({ lang }) {
  const t = ui[lang];
  const links = [
    { href: profile.telegram.url, icon: <FaTelegram />, label: 'Telegram', value: profile.telegram.handle, external: true },
    { href: `mailto:${profile.email}`, icon: <FaEnvelope />, label: t.contact.email, value: profile.email },
    { href: profile.github.url, icon: <FaGithub />, label: 'GitHub', value: profile.github.handle, external: true },
    { href: profile.linkedin.url, icon: <FaLinkedin />, label: 'LinkedIn', value: profile.name, external: true },
  ];

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <TileWall text="SALOM" palette="night" className="contact-wall" />
        <div className="contact-grid">
          <div>
            <h2>{t.contact.title}</h2>
            <p>{t.contact.lede}</p>
          </div>
          <ul className="contact-links">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="contact-icon" aria-hidden="true">{link.icon}</span>
                  <span className="contact-label">{link.label}</span>
                  <span className="contact-value">{link.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <footer className="site-footer">
          <span>© {profile.name}</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </section>
  );
}
