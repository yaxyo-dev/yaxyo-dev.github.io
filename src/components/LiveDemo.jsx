import { useState } from 'react';
import { ArrowUpRight, Close, Play } from './Icons';

// Shows a screenshot first. The real page only loads when someone asks for it,
// which keeps the case study fast and stops the frame from hijacking scrolling.
export default function LiveDemo({ src, poster, posterAlt, title, labels }) {
  const [live, setLive] = useState(false);

  return (
    <div className="live">
      <div className="live-frame">
        {live ? (
          <iframe src={src} title={title} sandbox="allow-scripts allow-forms" />
        ) : (
          <img src={poster} alt={posterAlt} decoding="async" />
        )}
      </div>
      <div className="live-actions">
        {live ? (
          <button type="button" className="button" onClick={() => setLive(false)}>
            <Close /> {labels.closeLive}
          </button>
        ) : (
          <button type="button" className="button" onClick={() => setLive(true)}>
            <Play /> {labels.try}
          </button>
        )}
        <a className="text-link" href={src} target="_blank" rel="noopener noreferrer">
          {labels.open} <ArrowUpRight />
        </a>
      </div>
    </div>
  );
}
