// Regenerates public/hero/map.svg and the crossing-border data from Natural Earth.
// Run after changing the camera in src/components/home/hero/geo.ts:
//   npm i --no-save world-atlas topojson-client
//   npx tsx scripts/build-hero-map.ts
// Set ATLAS_FROM=/some/dir/x.js if those two packages live outside this project.

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { STAGE, planeToLonLat, project } from '../src/components/home/hero/geo';

const require = createRequire(process.env.ATLAS_FROM ?? import.meta.url);
const { feature, mesh } = require('topojson-client');
const topology = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'));
const countries = (feature(topology, topology.objects.countries) as any).features as any[];

const CORRIDOR = new Set(['Iran', 'Turkey']);
const SPACING = 0.46;

type Ring = number[][];
const polygonsOf = (geometry: any): Ring[][] =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];

const inRing = (lon: number, lat: number, ring: Ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const shapes = countries
  .filter((c) => c.geometry)
  .map((c) => {
    const polygons = polygonsOf(c.geometry);
    const points = polygons.flat(2);
    const lons = points.map((p) => p[0]);
    const lats = points.map((p) => p[1]);
    return {
      name: c.properties.name as string,
      polygons,
      box: [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)],
    };
  });

const countryAt = (lon: number, lat: number) => {
  for (const s of shapes) {
    if (lon < s.box[0] || lat < s.box[1] || lon > s.box[2] || lat > s.box[3]) continue;
    for (const [outer, ...holes] of s.polygons) {
      if (inRing(lon, lat, outer) && !holes.some((h) => inRing(lon, lat, h))) return s.name;
    }
  }
  return null;
};

// Dots are bucketed by depth so each bucket is one <path>, which keeps the file small.
const DEPTH_BANDS = [0.78, 0.86, 0.94, 1.02, 1.12, Infinity];
const buckets = new Map<string, string[]>();
const add = (key: string, d: string) => (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(d);

let dots = 0;
for (let py = -24; py <= 34; py += SPACING) {
  for (let px = -44; px <= 44; px += SPACING) {
    const lonLat = planeToLonLat(px, py);
    const point = project(lonLat);
    // The far south and the horizon never show in any framing, so they are not worth the bytes.
    if (point.x < -10 || point.x > STAGE.width + 10 || point.y < 70 || point.y > 880) continue;
    const name = countryAt(lonLat[0], lonLat[1]);
    if (!name) continue;
    const band = DEPTH_BANDS.findIndex((limit) => point.depth < limit);
    add(`${CORRIDOR.has(name) ? 'corridor' : 'land'}:${band}`, `M${Math.round(point.x)} ${Math.round(point.y)}h0`);
    dots++;
  }
}

// Only the part of each border that lands on the stage, at whole-unit precision.
const toPath = (lines: number[][][]) => {
  let d = '';
  for (const line of lines) {
    let last = '';
    let pen = false;
    for (const c of line) {
      const p = project([c[0], c[1]]);
      const onStage = p.x > -20 && p.x < STAGE.width + 20 && p.y > 40 && p.y < 900;
      if (!onStage) {
        pen = false;
        continue;
      }
      const xy = `${Math.round(p.x)} ${Math.round(p.y)}`;
      if (xy === last) continue;
      d += `${pen ? 'L' : 'M'}${xy}`;
      last = xy;
      pen = true;
    }
  }
  return d;
};

const allBorders = mesh(topology, topology.objects.countries, (a: any, b: any) => a !== b) as any;

const borderBetween = (one: string, others: string[]) =>
  (
    mesh(
      topology,
      topology.objects.countries,
      (a: any, b: any) =>
        (a.properties.name === one && others.includes(b.properties.name)) ||
        (b.properties.name === one && others.includes(a.properties.name)),
    ) as any
  ).coordinates as number[][][];

const paths = [...buckets.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, d]) => {
    const [kind, bandText] = key.split(':');
    const band = Number(bandText);
    const stroke = kind === 'corridor' ? '#2FD2C9' : '#5C8E99';
    const opacity = (kind === 'corridor' ? 0.42 : 0.34) + band * (kind === 'corridor' ? 0.07 : 0.045);
    const width = 3 + band * 0.5;
    return `<path stroke="${stroke}" stroke-opacity="${opacity.toFixed(2)}" stroke-width="${width.toFixed(2)}" d="${d.join('')}"/>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STAGE.width} ${STAGE.height}" fill="none"><path stroke="#6E98A1" stroke-opacity=".16" stroke-width="1" d="${toPath(allBorders.coordinates)}"/><g stroke-linecap="round">${paths}</g></svg>`;
writeFileSync(new URL('../public/hero/map.svg', import.meta.url), svg);

const round = (lines: number[][][]) => lines.map((l) => l.map((c) => [+c[0].toFixed(2), +c[1].toFixed(2)]));
writeFileSync(
  new URL('../src/components/home/hero/borders.generated.ts', import.meta.url),
  `// Generated by scripts/build-hero-map.ts from Natural Earth; do not edit by hand.
export const IRAN_TURKEY: readonly (readonly (readonly [number, number])[])[] = ${JSON.stringify(round(borderBetween('Iran', ['Turkey'])))};
export const TURKEY_EU: readonly (readonly (readonly [number, number])[])[] = ${JSON.stringify(round(borderBetween('Turkey', ['Bulgaria', 'Greece'])))};
`,
);

console.log({ dots, kb: Math.round(svg.length / 1024), corridorNames: shapes.filter((s) => CORRIDOR.has(s.name)).map((s) => s.name) });
