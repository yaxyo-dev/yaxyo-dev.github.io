// The dome: a ribbed shell of hand-glazed tile in the style of Samarkand's
// Timurid architecture, on a drum with a band of pointed arches.
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

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const DOME_HEIGHT = 1.68;
const FINIAL_TOP = DOME_HEIGHT + 0.39;
const RIBS = 36;
const DRUM_RADIUS = 0.8;
const DRUM_HEIGHT = 0.66;

// The box that both the live camera and the still image frame: from the tip
// of the finial to the foot of the drum, a little wider than the dome.
export const FRAME = { top: FINIAL_TOP, bottom: -DRUM_HEIGHT, width: 2.3 };

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
    const depth = 0.075 * smoothstep(0, 0.1, t) * (1 - smoothstep(0.72, 1, t));
    for (let i = 0; i <= around; i++) {
      const theta = (i / around) * Math.PI * 2;
      const lobe = Math.abs(Math.cos((theta * RIBS) / 2)) ** 0.6;
      const radius = outline[j].x * (1 - depth + depth * lobe);
      const k = j * (around + 1) + i;
      positions.set([radius * Math.cos(theta), outline[j].y, radius * Math.sin(theta)], k * 3);
      // The texture is two ribs wide. The quarter step centres its pattern on a rib.
      uvs.set([(i / around) * (RIBS / 2) + 0.25, t], k * 2);
      // Darken the grooves between ribs, so the shape reads even in soft light.
      const shade = 1 - (1 - lobe) * 0.55 * smoothstep(0, 0.1, t);
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

function lozenge(g, x, y, halfWidth, halfHeight, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - halfHeight);
  g.lineTo(x + halfWidth, y);
  g.lineTo(x, y + halfHeight);
  g.lineTo(x - halfWidth, y);
  g.closePath();
  g.fill();
}

// A repeatable random sequence, so every visitor sees the same dome.
function seeded(start) {
  let seed = start;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Two ribs of glazed tile. Each tile differs a little in colour and shine, the
// way hand-fired glaze does, and the diamonds step up the ribs in a diagonal net.
// `surface` holds how raised (red) and how rough (green) each spot is.
function drawTiles(scale) {
  const width = 512;
  const height = 2048;
  const [colorCanvas, color] = makeCanvas(width * scale, height * scale);
  const [surfaceCanvas, surface] = makeCanvas(width * scale, height * scale);
  color.scale(scale, scale);
  surface.scale(scale, scale);

  color.fillStyle = '#0a676f';
  color.fillRect(0, 0, width, height);
  surface.fillStyle = 'rgb(0, 215, 0)';
  surface.fillRect(0, 0, width, height);

  const random = seeded(19);
  const tile = width / 14;
  const inset = 1.1;
  for (let row = 0; row < Math.ceil(height / tile); row++) {
    for (let col = 0; col < 14; col++) {
      const x = col * tile + inset;
      const y = row * tile + inset;
      const size = tile - inset * 2;
      color.fillStyle = `hsl(${176 + random() * 11} ${66 + random() * 20}% ${32 + random() * 11}%)`;
      color.fillRect(x, y, size, size);
      surface.fillStyle = `rgb(255, ${Math.round(38 + random() * 70)}, 0)`;
      surface.fillRect(x, y, size, size);
    }
  }

  [0, 1].forEach((rib) => {
    const x = 128 + rib * 256;
    for (let y = rib ? 148 : 60; y < height; y += 176) {
      if (y < 320) continue; // The crown stays plain, where the ribs run together.
      lozenge(color, x, y, 29, 45, '#f3eee3');
      lozenge(color, x, y, 24, 38, '#14307f');
      lozenge(color, x, y, 9, 15, '#e0b450');
      lozenge(surface, x, y, 29, 45, 'rgb(255, 46, 0)');
    }
  });

  return { color: colorCanvas, surface: surfaceCanvas };
}

// One bay of the band around the drum: a pointed arch between two tiled friezes.
function drawArcade() {
  const width = 256;
  const height = 640;
  const [canvas, g] = makeCanvas(width * 2, height * 2);
  g.scale(2, 2);

  g.fillStyle = '#0e2768';
  g.fillRect(0, 0, width, height);

  const frieze = (top) => {
    g.fillStyle = '#e0b450';
    g.fillRect(0, top, width, 4);
    g.fillRect(0, top + 46, width, 4);
    for (let x = 0; x < width; x += 32) {
      g.fillStyle = x % 64 ? '#16a2a6' : '#20b1b1';
      g.fillRect(x + 1.5, top + 8, 29, 34);
      lozenge(g, x + 16, top + 25, 9, 13, '#f3eee3');
    }
  };
  frieze(6);
  frieze(height - 56);

  const arch = (inset, color) => {
    const left = 34 + inset;
    const right = width - 34 - inset;
    const mid = width / 2;
    const apex = 92 + inset * 1.5;
    const spring = 306;
    const base = height - 74;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(left, base);
    g.lineTo(left, spring);
    g.bezierCurveTo(left, spring - 124, mid - 24, apex + 70, mid, apex);
    g.bezierCurveTo(mid + 24, apex + 70, right, spring - 124, right, spring);
    g.lineTo(right, base);
    g.closePath();
    g.fill();
  };
  arch(0, '#f3eee3');
  arch(7, '#17a4a8');
  arch(20, '#0a1f57');

  lozenge(g, width / 2, 360, 30, 56, '#e0b450');
  lozenge(g, width / 2, 360, 19, 38, '#0a1f57');
  lozenge(g, width / 2, 360, 7, 14, '#f3eee3');

  [0, width].forEach((x) => {
    lozenge(g, x, 150, 22, 32, '#e0b450');
    lozenge(g, x, 150, 12, 19, '#0a1f57');
  });

  return canvas;
}

export function buildTower(renderer, { perRib = 12, textureScale = 1 } = {}) {
  const prepare = (texture) => {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = RepeatWrapping;
    return texture;
  };
  const tiles = drawTiles(textureScale);
  const tileMap = prepare(new CanvasTexture(tiles.color));
  tileMap.colorSpace = SRGBColorSpace;
  const tileSurface = prepare(new CanvasTexture(tiles.surface));
  const arcadeMap = prepare(new CanvasTexture(drawArcade()));
  arcadeMap.colorSpace = SRGBColorSpace;
  arcadeMap.repeat.x = 18;

  const domeMaterial = new MeshPhysicalMaterial({
    map: tileMap,
    vertexColors: true,
    roughnessMap: tileSurface,
    roughness: 1,
    bumpMap: tileSurface,
    bumpScale: 0.7,
    clearcoat: 0.75,
    clearcoatRoughness: 0.16,
  });
  const drumMaterial = new MeshPhysicalMaterial({ map: arcadeMap, roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.26 });
  const wallMaterial = new MeshStandardMaterial({ color: 0x0c2159, roughness: 0.85 });
  const goldMaterial = new MeshStandardMaterial({ color: 0xe0b450, metalness: 1, roughness: 0.28, envMapIntensity: 1.6 });

  const tower = new Group();
  tower.add(new Mesh(buildDomeGeometry(perRib), domeMaterial));

  const drum = new Mesh(new CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS, DRUM_HEIGHT, 180, 1, true), drumMaterial);
  drum.position.y = -DRUM_HEIGHT / 2;
  tower.add(drum);

  const wall = new Mesh(new CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS, 3, 96, 1, true), wallMaterial);
  wall.position.y = -DRUM_HEIGHT - 1.5;
  tower.add(wall);

  const ringGeometry = new TorusGeometry(DRUM_RADIUS + 0.012, 0.022, 14, 200);
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
      tileMap.dispose();
      tileSurface.dispose();
      arcadeMap.dispose();
    },
  };
}
