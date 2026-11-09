// One 3D scene that stays behind the whole home page. As you scroll, the
// camera travels around the dome: a shot for each section of the page.
// Loaded on its own, after the page is ready, so it never slows the first paint.
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineLoop,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildTower, DOME_HEIGHT } from './domeModel';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  if (a === b) return x >= b ? 1 : 0;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// How large the dome is in the opening shot and where its tip sits. Keep in
// step with --s and --f in styles.css, which place the still image of the dome.
function frameFor(width, height) {
  return width / height < 1
    ? { scale: Math.min(0.24 * height, 0.377 * width), apex: 0.22 }
    : { scale: Math.min(0.324 * height, 0.217 * width), apex: 0.3 };
}

// Where the camera stands and how the light feels in each section.
// `wide` runs from 0 on a phone to 1 on a desktop screen.
function shotsFor(width, height) {
  const aspect = width / height;
  const wide = clamp01((aspect - 0.6) / 0.9);
  const { scale, apex } = frameFor(width, height);
  const worldHeight = height / scale;
  const heroFov = 24;
  const heroZ = worldHeight / (2 * Math.tan((heroFov * Math.PI) / 360));
  const heroY = DOME_HEIGHT + apex * worldHeight - worldHeight / 2;
  const workX = lerp(0, -2.2, wide);
  const workY = lerp(0.7, 1, wide);

  const frontLight = { keyX: -5, keyY: 6, keyZ: 7 };
  return {
    hero: { x: 0, y: heroY, z: heroZ, lookX: 0, lookY: heroY, fov: heroFov, roll: 0, ...frontLight, key: 2.6, rim: 2, env: 0.42, halo: 1, dim: 0, accent: 0, foot: 1 },
    work: { x: workX, y: workY, z: lerp(9.5, 7.6, wide), lookX: workX, lookY: workY, fov: 24, roll: 0, ...frontLight, key: 1.9, rim: 2.6, env: 0.3, halo: 0.35, dim: lerp(0.78, 0.5, wide), accent: 1, foot: 0 },
    about: { x: 0, y: 0.6, z: lerp(7, 4.3, wide), lookX: 0, lookY: 0.6, fov: 14, roll: 0.5, keyX: -6.5, keyY: 1.4, keyZ: 1.1, key: 7, rim: 0, env: 0.08, halo: 0, dim: lerp(0.62, 0.08, wide), accent: 0, foot: 0 },
    skills: { x: 0, y: -0.72, z: lerp(8, 5.2, wide), lookX: 0, lookY: -0.72, fov: 14, roll: 0, keyX: -4, keyY: 3, keyZ: 7, key: 2.4, rim: 1.2, env: 0.25, halo: 0, dim: lerp(0.86, 0.8, wide), accent: 0, foot: 0 },
    contact: { x: 0, y: lerp(5.4, 4.2, wide), z: 15, lookX: 0, lookY: lerp(5.4, 4.2, wide), fov: 24, roll: 0, ...frontLight, key: 2.6, rim: 2.4, env: 0.42, halo: 0.6, dim: 0.1, accent: 0, foot: 0 },
  };
}

// Finds where each section starts and stops on the page. The camera holds its
// shot while a section fills the screen and travels in the gaps between them.
function measureSections() {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return [...document.querySelectorAll('[data-shot]')].map((section) => {
    const rect = section.getBoundingClientRect();
    const start = Math.min(rect.top + window.scrollY, maxScroll);
    const end = Math.min(Math.max(start, start + rect.height - window.innerHeight), maxScroll);
    return { name: section.dataset.shot, start, end };
  });
}

function mixShots(a, b, t) {
  const mixed = {};
  for (const key of Object.keys(a)) mixed[key] = lerp(a[key], b[key], t);
  return mixed;
}

function shotAt(y, stops, shots) {
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    if (y <= stop.end || i === stops.length - 1) {
      if (y >= stop.start || i === 0) return shots[stop.name];
      const previous = stops[i - 1];
      return mixShots(shots[previous.name], shots[stop.name], smoothstep(previous.end, stop.start, y));
    }
  }
  return shots.hero;
}

// An eight-pointed star outline, the same shape as Samarkand's khatam tiles.
function starPoints(radius) {
  return Array.from({ length: 16 }, (_, k) => {
    const angle = (k * Math.PI) / 8;
    const r = k % 2 ? radius * 0.7654 : radius;
    return new Vector3(r * Math.cos(angle), r * Math.sin(angle), 0);
  });
}

export function mountDomeScene(host, { onReady }) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = NeutralToneMapping; // Keeps the glaze colours true.
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;

  const camera = new PerspectiveCamera(24, 1, 0.1, 100);

  const model = buildTower(renderer, { perRib: window.innerWidth < 700 ? 8 : 12 });
  const { tower } = model;
  scene.add(tower);

  // Thin gold star outlines turning slowly behind the dome.
  const halo = new Group();
  halo.position.set(0, 0.62, -1.5);
  scene.add(halo);
  const loops = [
    { radius: 1.55, opacity: 0.55, speed: 0.05 },
    { radius: 2.05, opacity: 0.3, speed: -0.035 },
    { radius: 2.6, opacity: 0.16, speed: 0.022 },
  ].map(({ radius, opacity, speed }) => {
    const loop = new LineLoop(
      new BufferGeometry().setFromPoints(starPoints(radius)),
      new LineBasicMaterial({ color: 0xe0b450, transparent: true, opacity }),
    );
    halo.add(loop);
    return { loop, opacity, speed };
  });

  const starCount = 900;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions.set([(Math.random() * 2 - 1) * 16, Math.random() * 20 - 8, -4 - Math.random() * 6], i * 3);
  }
  const stars = new Points(
    new BufferGeometry().setAttribute('position', new BufferAttribute(starPositions, 3)),
    new PointsMaterial({ color: 0xffffff, size: 0.026, transparent: true, opacity: 0.75, depthWrite: false }),
  );
  scene.add(stars);

  const key = new DirectionalLight(0xffe2b8, 2.6);
  scene.add(key);
  const restingRim = new Color(0x7aa2ff);
  const rim = new DirectionalLight(restingRim.clone(), 2);
  rim.position.set(6, 3, -4);
  scene.add(rim);
  const glint = new PointLight(0xffd39a, 8, 0, 2);
  scene.add(glint);

  // The gallery tints the light behind the dome to match the project showing.
  const accent = new Color(0x37b3b0);
  const accentTarget = accent.clone();
  const galleryGlow = document.querySelector('.carousel')?.style.getPropertyValue('--glow');
  if (galleryGlow) {
    accent.set(galleryGlow);
    accentTarget.set(galleryGlow);
  }
  const onAccent = (event) => accentTarget.set(event.detail);
  window.addEventListener('dome:accent', onAccent);

  let shots = shotsFor(1, 1);
  let stops = [];
  const remeasure = () => {
    stops = measureSections();
  };

  const view = { halfW: 1, halfH: 1 };
  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    shots = shotsFor(width, height);
    view.halfH = (height / frameFor(width, height).scale) / 2;
    view.halfW = view.halfH * camera.aspect;
    remeasure();
  };
  const stageObserver = new ResizeObserver(resize);
  stageObserver.observe(host);
  resize();

  // The page changes height when images load or a skill opens.
  const pageObserver = new ResizeObserver(remeasure);
  pageObserver.observe(document.body);

  const target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let scroll = window.scrollY;
  let startedAt = null;
  let lastFrame = null;
  let announced = false;
  const frame = (now) => {
    if (document.hidden) {
      lastFrame = null;
      return;
    }

    startedAt ??= now;
    const time = (now - startedAt) / 1000;
    const delta = lastFrame === null ? 0 : Math.min(0.5, (now - lastFrame) / 1000);
    lastFrame = now;

    // Eases toward the target at the same speed on fast and slow screens.
    const ease = (rate) => 1 - Math.exp(-rate * delta);
    scroll += (window.scrollY - scroll) * ease(6.5);
    pointer.x += (target.x - pointer.x) * ease(3.6);
    pointer.y += (target.y - pointer.y) * ease(3.6);

    const shot = shotAt(scroll, stops, shots);

    camera.position.set(shot.x + pointer.x * 0.12, shot.y + pointer.y * 0.08, shot.z);
    camera.up.set(Math.sin(shot.roll), Math.cos(shot.roll), 0);
    camera.lookAt(shot.lookX, shot.lookY, 0);
    if (Math.abs(camera.fov - shot.fov) > 0.001) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
    }

    // The dome turns so the lettering travels in reading direction.
    tower.rotation.y = -time * 0.13 - scroll * 0.0011 + pointer.x * 0.24;
    tower.rotation.x = 0.03 - pointer.y * 0.05;

    key.position.set(shot.keyX, shot.keyY, shot.keyZ);
    key.intensity = shot.key;
    rim.intensity = shot.rim;
    accent.lerp(accentTarget, ease(3));
    rim.color.copy(restingRim).lerp(accent, shot.accent);
    scene.environmentIntensity = shot.env;

    glint.position.set(shot.x + pointer.x * view.halfW, shot.y + pointer.y * view.halfH * 0.7, 3.2);
    glint.intensity = 8 * shot.halo;

    halo.visible = shot.halo > 0.01;
    loops.forEach(({ loop, opacity, speed }) => {
      loop.rotation.z = time * speed + scroll * speed * 0.004;
      loop.material.opacity = opacity * shot.halo;
    });
    halo.position.x = pointer.x * 0.14;

    stars.position.x = -pointer.x * 0.2;
    stars.position.y = -pointer.y * 0.12;

    host.style.setProperty('--dim', shot.dim.toFixed(3));
    host.style.setProperty('--foot', shot.foot.toFixed(3));

    renderer.render(scene, camera);
    if (!announced) {
      announced = true;
      onReady?.();
    }
  };
  renderer.setAnimationLoop(frame);

  return function dispose() {
    renderer.setAnimationLoop(null);
    stageObserver.disconnect();
    pageObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('dome:accent', onAccent);
    model.dispose();
    halo.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
    stars.geometry.dispose();
    stars.material.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
