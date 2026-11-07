// Shared geometry for the hero map: the generated SVG (scripts/build-hero-map.ts)
// and the live canvas both project through here, so they always line up.

export const STAGE = { width: 1600, height: 1000 } as const;

const CAMERA = {
  lon: 30,
  lat: 42,
  centerX: 760,
  centerY: 540,
  scale: 31,
  pitch: (40 * Math.PI) / 180,
  yaw: (-7 * Math.PI) / 180,
  distance: 62,
};

const COS_LAT = Math.cos((CAMERA.lat * Math.PI) / 180);

export type LonLat = readonly [number, number];
export type StagePoint = { x: number; y: number; depth: number };

// Degrees on a flat plane around the camera target, used as the map's dot grid.
export const planeToLonLat = (x: number, y: number): LonLat => [x / COS_LAT + CAMERA.lon, y + CAMERA.lat];

export const project = ([lon, lat]: LonLat): StagePoint => {
  const px = (lon - CAMERA.lon) * COS_LAT;
  const py = lat - CAMERA.lat;
  const x = px * Math.cos(CAMERA.yaw) - py * Math.sin(CAMERA.yaw);
  const y = px * Math.sin(CAMERA.yaw) + py * Math.cos(CAMERA.yaw);
  const depth = CAMERA.distance / (CAMERA.distance + y * Math.sin(CAMERA.pitch));
  return {
    x: CAMERA.centerX + x * CAMERA.scale * depth,
    y: CAMERA.centerY - y * Math.cos(CAMERA.pitch) * CAMERA.scale * depth,
    depth,
  };
};

export const CITIES = {
  tehran: [51.39, 35.69],
  tabriz: [46.29, 38.08],
  bazargan: [44.39, 39.39],
  istanbul: [28.98, 41.01],
  frankfurt: [8.68, 50.11],
} as const satisfies Record<string, LonLat>;

// The road the Tehran–Istanbul line actually follows, continued into Europe.
export const ROAD: readonly LonLat[] = [
  CITIES.tehran,
  [50.0, 36.27], // Qazvin
  [48.48, 36.67], // Zanjan
  CITIES.tabriz,
  CITIES.bazargan,
  [41.27, 39.9], // Erzurum
  [37.02, 39.75], // Sivas
  [32.85, 39.93], // Ankara
  CITIES.istanbul,
  [26.55, 41.72], // Edirne
  [23.32, 42.7], // Sofia
  [20.46, 44.82], // Belgrade
  [16.37, 48.21], // Vienna
  CITIES.frankfurt,
];

export const AIR_LEGS: readonly (readonly [LonLat, LonLat])[] = [
  [CITIES.tehran, CITIES.istanbul],
  [CITIES.istanbul, CITIES.frankfurt],
];

// The hero map only covers Iran to Istanbul.
export const HERO_ROAD: readonly LonLat[] = ROAD.slice(0, ROAD.indexOf(CITIES.istanbul) + 1);
export const HERO_AIR_LEGS: readonly (readonly [LonLat, LonLat])[] = [[CITIES.tehran, CITIES.istanbul]];

export const catmullRom = (input: readonly LonLat[], perSegment = 14): StagePoint[] => {
  const p = input.map(project);
  const out: StagePoint[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, d] = [p[Math.max(i - 1, 0)], p[i], p[i + 1], p[Math.min(i + 2, p.length - 1)]];
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const blend = (k: 'x' | 'y' | 'depth') =>
        0.5 *
        (2 * b[k] +
          (c[k] - a[k]) * t +
          (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t +
          (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t * t * t);
      out.push({ x: blend('x'), y: blend('y'), depth: blend('depth') });
    }
  }
  out.push(p[p.length - 1]);
  return out;
};

// The road as one SVG path that passes exactly through every stop, for pages that draw it without the canvas.
const ROAD_POINTS = catmullRom(ROAD);
export const ROAD_PATH = `M${ROAD_POINTS.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join('L')}`;

const roadLengths = ROAD_POINTS.reduce<number[]>((lengths, point, index) => {
  if (index === 0) return [0];
  const previous = ROAD_POINTS[index - 1];
  return [...lengths, lengths[index - 1] + Math.hypot(point.x - previous.x, point.y - previous.y)];
}, []);

// How far along the whole road a stop is, from 0 at Tehran to 1 in Europe.
export const roadFraction = (stop: LonLat) => {
  const target = project(stop);
  let nearest = 0;
  ROAD_POINTS.forEach((point, index) => {
    const best = ROAD_POINTS[nearest];
    if (Math.hypot(point.x - target.x, point.y - target.y) < Math.hypot(best.x - target.x, best.y - target.y)) nearest = index;
  });
  return roadLengths[nearest] / roadLengths[roadLengths.length - 1];
};

// The same road cut off at a stop, for maps that only cover part of it.
export const roadPathTo = (stop: LonLat) => {
  const target = project(stop);
  let nearest = 0;
  ROAD_POINTS.forEach((point, index) => {
    const best = ROAD_POINTS[nearest];
    if (Math.hypot(point.x - target.x, point.y - target.y) < Math.hypot(best.x - target.x, best.y - target.y)) nearest = index;
  });
  return `M${ROAD_POINTS.slice(0, nearest + 1).map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join('L')}`;
};
