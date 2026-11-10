import About from '../components/About';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import Offer from '../components/Offer';
import Skills from '../components/Skills';
import Work from '../components/Work';
import { useLang } from '../lib/i18n';

export default function Home() {
  const lang = useLang();
  return (
    <div className="home">
      <Hero lang={lang} />
      {/* The rest of the page slides up over the opening scene. */}
      <div className="after-hero">
        <Work lang={lang} />
        <Offer lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Contact lang={lang} />
      </div>
    </div>
  );
}
