// The live 3D dome in the opening screen. It frames itself to the page layout
// (the .dome-slot element) and flies in to the tiles as you scroll. Once the
// page has covered it, it stops drawing, so the rest of the site stays light.
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildTower, FRAME } from './domeModel';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

const FOV = 20;

// At night the dome is floodlit from below with a cold moon behind it.
// By day there's a high sun and open sky.
const NIGHT = {
  key: { from: [-3.4, -2.2, 6.5], colour: 0xffc48c, power: 3.3 },
  fill: { from: [5, -1.4, 5], colour: 0xff9e66, power: 1.5 },
  rim: { from: [4, 6, -6], colour: 0x9db6ff, power: 3.4 },
  sky: 0.2,
};
const DAY = {
  key: { from: [-5, 7, 6], colour: 0xfff0dc, power: 2.7 },
  fill: { from: [6, 1.5, 5], colour: 0xc3d8ff, power: 0.7 },
  rim: { from: [4, 6, -6], colour: 0xffffff, power: 1.1 },
  sky: 0.8,
};

function makeLight(scene, night, day) {
  const light = new DirectionalLight();
  scene.add(light);
  const a = { from: new Vector3(...night.from), colour: new Color(night.colour), power: night.power };
  const b = { from: new Vector3(...day.from), colour: new Color(day.colour), power: day.power };
  return (daylight) => {
    light.position.lerpVectors(a.from, b.from, daylight);
    light.color.lerpColors(a.colour, b.colour, daylight);
    light.intensity = lerp(a.power, b.power, daylight);
  };
}

// A soft sky for the glaze to reflect, brightest at the horizon.
function makeSkyReflection(renderer) {
  const geometry = new SphereGeometry(20, 48, 24);
  const position = geometry.attributes.position;
  const colours = new Float32Array(position.count * 3);
  const zenith = new Color(0.42, 0.6, 0.98);
  const horizon = new Color(1.7, 1.5, 1.25);
  const ground = new Color(0.24, 0.17, 0.12);
  const colour = new Color();
  for (let i = 0; i < position.count; i++) {
    const height = position.getY(i) / 20;
    if (height > 0) colour.lerpColors(horizon, zenith, height ** 0.55);
    else colour.lerpColors(horizon, ground, (-height) ** 0.4);
    colours.set([colour.r, colour.g, colour.b], i * 3);
  }
  geometry.setAttribute('color', new BufferAttribute(colours, 3));
  const material = new MeshBasicMaterial({ vertexColors: true, side: BackSide });
  const sky = new Scene();
  sky.add(new Mesh(geometry, material));

  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(sky, 0.02);
  generator.dispose();
  geometry.dispose();
  material.dispose();
  return target;
}

function makeStars() {
  const count = 240;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions.set([(Math.random() * 2 - 1) * 16, Math.random() * 16 - 3, -4 - Math.random() * 6], i * 3);
  }
  return new Points(
    new BufferGeometry().setAttribute('position', new BufferAttribute(positions, 3)),
    new PointsMaterial({ color: 0xffffff, size: 0.024, transparent: true, opacity: 0.7, depthWrite: false }),
  );
}

export function mountDomeScene({ pin, stage, slot, onReady }) {
  const small = window.innerWidth < 760;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const reflection = makeSkyReflection(renderer);
  scene.environment = reflection.texture;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  const model = buildTower(renderer, { perRib: small ? 8 : 12 });
  const { tower } = model;
  scene.add(tower);

  const stars = makeStars();
  scene.add(stars);

  const lights = [
    makeLight(scene, NIGHT.key, DAY.key),
    makeLight(scene, NIGHT.fill, DAY.fill),
    makeLight(scene, NIGHT.rim, DAY.rim),
  ];

  // Where the camera starts, set from the page layout, and where it ends:
  // close enough that the glazed tiles fill the whole screen.
  const start = { x: 0, y: 0, z: 10 };
  const end = { x: 0.34, y: 0.86, z: 3.05, lookX: 0.5, lookY: 0.8, roll: 0.3 };

  const content = document.querySelector('.after-hero');
  let travel = 1;

  const measure = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const host = stage.getBoundingClientRect();
    const box = slot.getBoundingClientRect();
    const unit = box.width / FRAME.width;
    start.z = height / unit / (2 * Math.tan((FOV * Math.PI) / 360));
    start.x = (width / 2 - (box.left - host.left + box.width / 2)) / unit;
    start.y = FRAME.top - (height / 2 - (box.top - host.top)) / unit;
    travel = Math.max(1, content.getBoundingClientRect().top + window.scrollY);
  };
  const stageObserver = new ResizeObserver(measure);
  stageObserver.observe(stage);
  const pageObserver = new ResizeObserver(measure);
  pageObserver.observe(document.body);
  measure();

  const target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const root = document.documentElement;
  let daylight = root.dataset.theme === 'light' ? 1 : 0;
  let scroll = window.scrollY;
  let turning = 0;
  let lastFrame = null;
  let announced = false;

  const frame = (now) => {
    if (document.hidden) {
      lastFrame = null;
      return;
    }
    const delta = lastFrame === null ? 0 : Math.min(0.5, (now - lastFrame) / 1000);
    lastFrame = now;

    // Eases toward the target at the same speed on fast and slow screens.
    const ease = (rate) => 1 - Math.exp(-rate * delta);
    scroll += (window.scrollY - scroll) * ease(9);
    const progress = clamp01(scroll / travel);
    if (progress >= 1 && announced) return; // Fully covered by the page.

    pointer.x += (target.x - pointer.x) * ease(3.6);
    pointer.y += (target.y - pointer.y) * ease(3.6);
    daylight += ((root.dataset.theme === 'light' ? 1 : 0) - daylight) * ease(5);
    turning += delta;

    const t = smoother(progress);
    const drift = 1 - t;
    camera.position.set(
      lerp(start.x, end.x, t) + pointer.x * 0.1 * drift,
      lerp(start.y, end.y, t) + pointer.y * 0.06 * drift,
      lerp(start.z, end.z, t),
    );
    camera.up.set(Math.sin(end.roll * t), Math.cos(end.roll * t), 0);
    camera.lookAt(lerp(start.x, end.lookX, t), lerp(start.y, end.lookY, t), 0);

    tower.rotation.y = -turning * 0.1 - progress * 0.9 + pointer.x * 0.16 * drift;

    lights.forEach((apply) => apply(daylight));
    scene.environmentIntensity = lerp(NIGHT.sky, DAY.sky, daylight);

    stars.visible = daylight < 0.98;
    stars.material.opacity = 0.7 * (1 - daylight);

    pin.style.setProperty('--p', progress.toFixed(4));
    pin.classList.toggle('is-covered', progress > 0.5);

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
    model.dispose();
    stars.geometry.dispose();
    stars.material.dispose();
    reflection.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
