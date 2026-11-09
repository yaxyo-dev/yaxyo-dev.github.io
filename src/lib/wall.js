import { GLYPHS } from './glyphs';

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
    ground: ['#0c1324', '#0b1221', '#0e1528', '#0a101e'],
    glazes: [
      { tones: ['#38a8a7', '#3fb0ae', '#48b6b3'], accent: '#e0b450' },
      { tones: ['#e6dece', '#efe8da', '#f3eee3'], accent: '#3fb0ae' },
    ],
  },
  hero: {
    ground: ['#101a33', '#0e1730', '#121d38', '#0d152b'],
    glazes: [
      { tones: ['#2456c7', '#2a60d6', '#1f4db5'], accent: '#37b3b0' },
      { tones: ['#2fa8a6', '#37b3b0', '#3fbdb9'], accent: '#e0b450' },
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

/** Works out every brick in a wall that spells `text`. */
export function buildWall(text, paletteName) {
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
        col,
        row,
        glazed,
        fill: glazed ? glaze(palette.glazes[letter % 2]) : pick(palette.ground),
      });
    }
  }
  return { cols, rows, tiles };
}
