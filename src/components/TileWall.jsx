import { useMemo } from 'react';
import { GLYPHS } from '../lib/glyphs';

const UNIT = 10;
const TILE = 9.3;
const INSET = (UNIT - TILE) / 2;
const LETTER_GAP = 2;
const MARGIN_X = 1;
const MARGIN_Y = 1;

// Letters take turns between two glazes. A few bricks in each letter pick up
// the accent colour, the way hand-glazed walls never quite match.
const ACCENT_RATE = 0.05;

const PALETTES = {
  day: {
    ground: ['#e8e1d2', '#e5ddcd', '#ebe5d7', '#e3dbca'],
    glazes: [
      { tones: ['#17387f', '#1a3f8d', '#1d469a'], accent: '#178a93' },
      { tones: ['#15808a', '#188a92', '#1b949a'], accent: '#1a3f8d' },
    ],
  },
  night: {
    ground: ['#142e68', '#132b62', '#16316d', '#122a60'],
    glazes: [
      { tones: ['#38a8a7', '#3fb0ae', '#48b6b3'], accent: '#e3b45a' },
      { tones: ['#e6dece', '#efe8da', '#f3eee3'], accent: '#3fb0ae' },
    ],
  },
};

// A small seeded random generator, so the server and the browser draw
// exactly the same wall.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWall(text, paletteName) {
  const palette = PALETTES[paletteName];
  const letters = [...text].map((ch) => GLYPHS[ch]);
  const inner = letters.reduce((sum, g) => sum + g[0].length, 0) + LETTER_GAP * (letters.length - 1);
  const cols = inner + MARGIN_X * 2;
  const rows = 7 + MARGIN_Y * 2;

  // Which letter (if any) sits on each brick.
  const map = new Map();
  let offset = MARGIN_X;
  letters.forEach((glyph, letter) => {
    glyph.forEach((line, y) => {
      [...line].forEach((cell, x) => {
        if (cell === '#') map.set(`${offset + x},${MARGIN_Y + y}`, letter);
      });
    });
    offset += glyph[0].length + LETTER_GAP;
  });

  const random = seeded(text.length * 7919 + text.charCodeAt(0));
  const pick = (list) => list[Math.floor(random() * list.length)];
  const glaze = ({ tones, accent }) => (random() < ACCENT_RATE ? accent : pick(tones));

  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const letter = map.get(`${col},${row}`);
      const glazed = letter !== undefined;
      tiles.push({
        key: `${col}-${row}`,
        x: col * UNIT + INSET,
        y: row * UNIT + INSET,
        fill: glazed ? glaze(palette.glazes[letter % 2]) : pick(palette.ground),
        delay: glazed ? col + row * 2 : null,
      });
    }
  }
  return { cols, rows, tiles, ground: palette.ground[0] };
}

// Brushing the wall glazes a brick for a moment, then it fades back.
function paint(event) {
  const brick = event.target;
  if (brick.tagName !== 'rect') return;
  brick.classList.add('is-lit');
  clearTimeout(brick.litTimer);
  brick.litTimer = setTimeout(() => brick.classList.remove('is-lit'), 420);
}

export default function TileWall({ text, palette = 'day', className = '' }) {
  const { cols, rows, tiles, ground } = useMemo(() => buildWall(text, palette), [text, palette]);
  return (
    <svg
      className={`wall ${className}`}
      viewBox={`0 0 ${cols * UNIT} ${rows * UNIT}`}
      style={{ '--wall-ground': ground }}
      aria-hidden="true"
      focusable="false"
      onPointerOver={paint}
    >
      {tiles.map((t) => (
        <rect
          key={t.key}
          x={t.x}
          y={t.y}
          width={TILE}
          height={TILE}
          rx="0.9"
          fill={t.fill}
          className={t.delay === null ? undefined : 'glazed'}
          style={t.delay === null ? undefined : { '--d': t.delay }}
        />
      ))}
    </svg>
  );
}
