import { useMemo } from 'react';
import { buildWall } from '../lib/wall';

const UNIT = 10;
const TILE = 9.3;
const INSET = (UNIT - TILE) / 2;

// Brushing the wall glazes a brick for a moment, then it fades back.
function paint(event) {
  const brick = event.target;
  if (brick.tagName !== 'rect') return;
  brick.classList.add('is-lit');
  clearTimeout(brick.litTimer);
  brick.litTimer = setTimeout(() => brick.classList.remove('is-lit'), 420);
}

// A flat drawing of the wall. It's what you see before the 3D version loads,
// and instead of it when 3D isn't available.
export default function TileWall({ text, palette = 'day', className = '' }) {
  const { cols, rows, tiles } = useMemo(() => buildWall(text, palette), [text, palette]);
  return (
    <svg
      className={`wall ${className}`}
      viewBox={`0 0 ${cols * UNIT} ${rows * UNIT}`}
      aria-hidden="true"
      focusable="false"
      onPointerOver={paint}
    >
      {tiles.map((t) => (
        <rect
          key={`${t.col}-${t.row}`}
          x={t.col * UNIT + INSET}
          y={t.row * UNIT + INSET}
          width={TILE}
          height={TILE}
          rx="0.9"
          fill={t.fill}
        />
      ))}
    </svg>
  );
}
