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
