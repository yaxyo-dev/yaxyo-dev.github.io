// The 3D wall in the hero: your name as glazed bricks that fly into place,
// ripple under the pointer and burst apart as you scroll away.
// Loaded on its own, after the page is ready, so it never slows the first paint.
import {
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildWall } from '../lib/wall';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - (1 - t) ** 4;
const spread = () => Math.random() * 2 - 1;

// The wall sits above the middle of the hero, leaving room for the headline.
// These match the position of the flat wall in styles.css.
const raiseFor = (aspect) => (aspect < 1 ? 0.17 : 0.14);

export function mountHeroScene(host, { text, onReady }) {
  const { cols, rows, tiles } = buildWall(text, 'hero');

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = NeutralToneMapping; // Keeps the glaze colours true.
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.28;

  const camera = new PerspectiveCamera(26, 1, 0.1, 500);
  const group = new Group();
  scene.add(group);

  const key = new DirectionalLight(0xfff1dc, 1.9);
  key.position.set(-14, 18, 30);
  scene.add(key);
  const glint = new PointLight(0xffc878, 60, 0, 2);
  glint.position.z = 6;
  group.add(glint);

  const bricks = tiles.map((tile) => ({
    ...tile,
    x: tile.col - (cols - 1) / 2,
    y: (rows - 1) / 2 - tile.row,
    delay: tile.glazed ? 0.15 + tile.col * 0.012 + Math.random() * 0.18 : Math.random() * 0.5,
    startZ: -40 - Math.random() * 50,
    sx: spread(),
    sy: spread(),
    sz: Math.random(),
    rx: spread() * 3,
    ry: spread() * 3,
    rz: spread() * 2,
  }));

  const geometry = new RoundedBoxGeometry(0.94, 0.94, 0.62, 2, 0.1);
  const glazedMaterial = new MeshPhysicalMaterial({ roughness: 0.34, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.18 });
  const groundMaterial = new MeshStandardMaterial({ roughness: 0.9, metalness: 0, envMapIntensity: 0.3 });

  const makeMesh = (list, material) => {
    const mesh = new InstancedMesh(geometry, material, list.length);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    const color = new Color();
    list.forEach((brick, i) => mesh.setColorAt(i, color.set(brick.fill)));
    group.add(mesh);
    return { mesh, list };
  };
  const layers = [
    makeMesh(bricks.filter((b) => b.glazed), glazedMaterial),
    makeMesh(bricks.filter((b) => !b.glazed), groundMaterial),
  ];

  const view = { halfW: 1, halfH: 1 };
  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const halfTan = Math.tan((camera.fov * Math.PI) / 360);
    const fit = camera.aspect < 1 ? 0.97 : 0.9;
    const distance = cols / fit / (2 * halfTan * camera.aspect);
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
    view.halfH = distance * halfTan;
    view.halfW = view.halfH * camera.aspect;
    group.position.y = view.halfH * 2 * raiseFor(camera.aspect);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // Where the pointer is, in wall coordinates.
  const target = { x: 0, y: 0, ndcX: 0, ndcY: 0, strength: 0 };
  const pointer = { x: 0, y: 0, ndcX: 0, ndcY: 0, strength: 0 };
  const onPointerMove = (event) => {
    const rect = host.getBoundingClientRect();
    target.ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    target.ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    target.x = target.ndcX * view.halfW;
    target.y = target.ndcY * view.halfH - group.position.y;
    target.strength = 1;
  };
  const onPointerLeave = () => {
    target.strength = 0;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  const dummy = new Object3D();
  const placeBricks = ({ mesh, list }, time, burst) => {
    list.forEach((b, i) => {
      const intro = easeOut(clamp01((time - b.delay) / 1.25));
      const wave = Math.sin(b.x * 0.32 + time * 0.7) * 0.1 + Math.cos(b.y * 0.7 + time * 0.5) * 0.06;
      const dx = b.x - pointer.x;
      const dy = b.y - pointer.y;
      const near = Math.exp(-(dx * dx + dy * dy) / 14) * pointer.strength;
      dummy.position.set(
        b.x + b.sx * burst * 16,
        b.y + b.sy * burst * 9,
        (1 - intro) * b.startZ + wave + near * 1.5 + b.sz * burst * 34 + (b.glazed ? 0.24 : 0),
      );
      dummy.rotation.set(
        (1 - intro) * b.rx + dy * near * 0.16 + b.rx * burst,
        (1 - intro) * b.ry - dx * near * 0.16 + b.ry * burst,
        (1 - intro) * b.rz + b.rz * burst,
      );
      dummy.scale.setScalar(0.4 + 0.6 * intro);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  let startedAt = null;
  let announced = false;
  const frame = (now) => {
    startedAt ??= now;
    const progress = clamp01(window.scrollY / Math.max(1, window.innerHeight));
    if (progress >= 1 || document.hidden) return;

    const time = (now - startedAt) / 1000;
    for (const key2 of ['x', 'y', 'ndcX', 'ndcY', 'strength']) {
      pointer[key2] += (target[key2] - pointer[key2]) * 0.12;
    }

    const burst = progress * progress;
    layers.forEach((layer) => placeBricks(layer, time, burst));

    group.rotation.y = Math.sin(time * 0.4) * 0.04 + pointer.ndcX * 0.1;
    group.rotation.x = -0.05 - pointer.ndcY * 0.06;

    // With no pointer on the wall, the highlight drifts across it by itself.
    const drift = Math.sin(time * 0.45) * (cols / 2);
    glint.position.x = drift + (pointer.x - drift) * pointer.strength;
    glint.position.y = pointer.y * pointer.strength;

    renderer.render(scene, camera);
    if (!announced) {
      announced = true;
      onReady?.();
    }
  };
  renderer.setAnimationLoop(frame);

  return function dispose() {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    layers.forEach(({ mesh }) => mesh.dispose());
    geometry.dispose();
    glazedMaterial.dispose();
    groundMaterial.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
