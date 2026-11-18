import { useState } from 'react';
import { FaArrowUpRightFromSquare, FaPlay, FaXmark } from 'react-icons/fa6';

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
          <button type="button" className="live-button" onClick={() => setLive(false)}>
            <FaXmark aria-hidden="true" /> {labels.closeLive}
          </button>
        ) : (
          <button type="button" className="live-button" onClick={() => setLive(true)}>
            <FaPlay aria-hidden="true" /> {labels.try}
          </button>
        )}
        <a className="live-open" href={src} target="_blank" rel="noopener noreferrer">
          {labels.open} <FaArrowUpRightFromSquare aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
