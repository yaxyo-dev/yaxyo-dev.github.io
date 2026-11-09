// The dome itself: a ribbed, tiled shell in the style of Samarkand's Timurid
// architecture, on a drum with your name running around it in brick lettering.
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SplineCurve,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { GLYPHS } from '../lib/glyphs';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const DOME_HEIGHT = 1.68;

const RIBS = 28;
const DRUM_RADIUS = 0.8;
const DRUM_HEIGHT = 0.66;

// Radius and height along the dome, from the drum up to the tip. The full
// shoulders and rounded crown follow the melon domes of Samarkand.
const PROFILE = [
  [0.8, 0], [0.97, 0.06], [1.06, 0.2], [1.1, 0.4], [1.1, 0.62], [1.05, 0.84],
  [0.94, 1.06], [0.77, 1.26], [0.55, 1.43], [0.31, 1.56], [0.12, 1.64], [0, DOME_HEIGHT],
];

function buildDomeGeometry(perRib) {
  const around = RIBS * perRib;
  const rings = 120;
  const outline = new SplineCurve(PROFILE.map(([r, y]) => new Vector2(r, y))).getSpacedPoints(rings);
  const count = (around + 1) * (rings + 1);
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const colors = new Float32Array(count * 3);

  for (let j = 0; j <= rings; j++) {
    const t = j / rings;
    const depth = 0.09 * smoothstep(0, 0.1, t) * (1 - smoothstep(0.7, 1, t));
    for (let i = 0; i <= around; i++) {
      const theta = (i / around) * Math.PI * 2;
      const lobe = Math.abs(Math.cos((theta * RIBS) / 2)) ** 0.6;
      const radius = outline[j].x * (1 - depth + depth * lobe);
      const k = j * (around + 1) + i;
      positions.set([radius * Math.cos(theta), outline[j].y, radius * Math.sin(theta)], k * 3);
      uvs.set([(i / around) * RIBS + 0.5, t], k * 2); // Centres the pattern on each rib.
      // Darken the grooves between ribs, so the shape reads even in soft light.
      const shade = 1 - (1 - lobe) * 0.62 * smoothstep(0, 0.1, t);
      colors.set([shade, shade, shade], k * 3);
    }
  }

  const indices = [];
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < around; i++) {
      const a = j * (around + 1) + i;
      const b = a + around + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // The first and last columns are the same place on the dome, so they share a normal.
  const normals = geometry.attributes.normal;
  const shared = new Vector3();
  for (let j = 0; j <= rings; j++) {
    const first = j * (around + 1);
    const last = first + around;
    shared
      .set(normals.getX(first) + normals.getX(last), normals.getY(first) + normals.getY(last), normals.getZ(first) + normals.getZ(last))
      .normalize();
    normals.setXYZ(first, shared.x, shared.y, shared.z);
    normals.setXYZ(last, shared.x, shared.y, shared.z);
  }
  return geometry;
}

const makeCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext('2d')];
};

function diamond(g, x, y, size, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - size);
  g.lineTo(x + size, y);
  g.lineTo(x, y + size);
  g.lineTo(x - size, y);
  g.closePath();
  g.fill();
}

// One rib of glazed tiles, with a chain of diamonds running up its centre.
function drawRib(scale) {
  const [canvas, g] = makeCanvas(256 * scale, 2048 * scale);
  g.scale(scale, scale);
  const size = 32;
  const shades = ['#17a4a8', '#1cabad', '#139ca2', '#22b2b2'];
  g.fillStyle = '#0c6c75';
  g.fillRect(0, 0, 256, 2048);
  for (let row = 0; row < 64; row++) {
    for (let col = 0; col < 8; col++) {
      g.fillStyle = shades[(col * 7 + row * 13 + ((col * row) % 3)) % 4];
      g.fillRect(col * size + 2, row * size + 2, size - 4, size - 4);
    }
  }
  for (let y = 80; y < 2048; y += 192) {
    diamond(g, 128, y, 48, '#f3eee3');
    diamond(g, 128, y, 38, '#163a8f');
    diamond(g, 128, y, 16, '#e0b450');
  }
  return canvas;
}

// The band around the drum: your name in square brick lettering, three times round.
function drawDrum() {
  const word = [...'YAXYO'].map((letter) => GLYPHS[letter]);
  const letters = word.reduce((sum, glyph) => sum + glyph[0].length, 0) + (word.length - 1) * 2;
  const repeat = letters + 9;
  const cell = 25;
  const rows = 21;
  const [canvas, g] = makeCanvas(repeat * 3 * cell, rows * cell);

  g.fillStyle = '#0b2257';
  g.fillRect(0, 0, canvas.width, canvas.height);
  const brick = (col, row, color) => {
    g.fillStyle = color;
    g.fillRect(col * cell + 1.5, row * cell + 1.5, cell - 3, cell - 3);
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < repeat * 3; col++) {
      brick(col, row, (col + row) % 2 ? '#12306f' : '#102a63');
    }
  }

  for (let col = 0; col < repeat * 3; col++) {
    [0, 20].forEach((row) => brick(col, row, '#f3eee3'));
    [2, 18].forEach((row) => brick(col, row, col % 2 ? '#17a4a8' : '#22b2b2'));
    [4, 16].forEach((row) => brick(col, row, col % 4 === 0 ? '#e0b450' : '#0b2257'));
  }

  for (let r = 0; r < 3; r++) {
    let col = r * repeat + 4;
    word.forEach((glyph) => {
      glyph.forEach((line, y) => {
        [...line].forEach((mark, x) => {
          if (mark === '#') brick(col + x, 7 + y, '#f3eee3');
        });
      });
      col += glyph[0].length + 2;
    });
    const star = cell * 2.6;
    const cx = (r * repeat + 4 + letters + 4.5) * cell;
    const cy = 10.5 * cell;
    diamond(g, cx, cy, star, '#e0b450');
    g.save();
    g.translate(cx, cy);
    g.rotate(Math.PI / 4);
    diamond(g, 0, 0, star, '#e0b450');
    g.restore();
    diamond(g, cx, cy, star * 0.42, '#0b2257');
  }
  return canvas;
}

export function buildTower(renderer, { perRib = 12, textureScale = 1 } = {}) {
  const sharpen = (texture) => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = RepeatWrapping;
    return texture;
  };
  const ribMap = sharpen(new CanvasTexture(drawRib(textureScale)));
  const drumMap = sharpen(new CanvasTexture(drawDrum()));

  const domeMaterial = new MeshPhysicalMaterial({ map: ribMap, vertexColors: true, roughness: 0.36, clearcoat: 0.9, clearcoatRoughness: 0.18 });
  const drumMaterial = new MeshPhysicalMaterial({ map: drumMap, roughness: 0.44, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const wallMaterial = new MeshStandardMaterial({ color: 0x10264f, roughness: 0.85 });
  const goldMaterial = new MeshStandardMaterial({ color: 0xe0b450, metalness: 1, roughness: 0.26, envMapIntensity: 2.4 });

  const tower = new Group();
  tower.add(new Mesh(buildDomeGeometry(perRib), domeMaterial));

  const drum = new Mesh(new CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS, DRUM_HEIGHT, 180, 1, true), drumMaterial);
  drum.position.y = -DRUM_HEIGHT / 2;
  tower.add(drum);

  const wall = new Mesh(new CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS, 3, 96, 1, true), wallMaterial);
  wall.position.y = -DRUM_HEIGHT - 1.5;
  tower.add(wall);

  const ringGeometry = new TorusGeometry(DRUM_RADIUS + 0.012, 0.024, 14, 200);
  [0, -DRUM_HEIGHT].forEach((y) => {
    const ring = new Mesh(ringGeometry, goldMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    tower.add(ring);
  });

  const finial = new Mesh(
    new LatheGeometry(
      [[0, 0], [0.05, 0.005], [0.078, 0.035], [0.05, 0.075], [0.02, 0.09], [0.046, 0.13], [0.03, 0.17], [0.012, 0.2], [0.006, 0.36], [0, 0.43]].map(
        ([r, y]) => new Vector2(r, y),
      ),
      32,
    ),
    goldMaterial,
  );
  finial.position.y = DOME_HEIGHT - 0.04;
  tower.add(finial);

  return {
    tower,
    dispose() {
      tower.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      ribMap.dispose();
      drumMap.dispose();
    },
  };
}
