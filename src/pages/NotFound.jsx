import { useEffect } from 'react';
import { Link } from 'react-router';

// Shown in both languages, because a missing page can't tell which one you wanted.
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · Yaxyo Nigmatov';
  }, []);

  return (
    <main id="main" className="not-found wrap">
      <p className="display not-found-code dome-fill" aria-hidden="true">404</p>
      <h1 className="display">This page doesn’t exist.</h1>
      <p lang="uz">Bunday sahifa yo‘q.</p>
      <div className="actions">
        <Link className="pill pill-solid" to="/">Go to the home page</Link>
        <Link className="pill" to="/uz/" lang="uz">Bosh sahifaga o‘tish</Link>
      </div>
    </main>
  );
}
