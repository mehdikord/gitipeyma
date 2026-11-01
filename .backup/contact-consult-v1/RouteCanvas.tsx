'use client';

import React, { useEffect, useRef } from 'react';
import { AIR_LEGS, CITIES, LonLat, ROAD, STAGE, StagePoint, project } from './geo';
import { IRAN_TURKEY, TURKEY_EU } from './borders.generated';

export type HeroLayer = 'bus' | 'cargo' | 'currency' | 'offices';

const TEAL = '18, 184, 176';
const GOLD = '226, 201, 140';
const WHITE = '247, 247, 243';

// When the first shipment reaches each stop during the opening. The second
// headline line in globals.css (.hero-line-second) is timed to BORDER_AT.
const BORDER_AT = 1.1;
const ISTANBUL_AT = 2.4;
const FRANKFURT_AT = 3.4;
const OPENING_ENDS = 4.6;

// How visible each part of the map is for each service in the strip below it.
type Emphasis = { roadEast: number; roadWest: number; air: number; money: number; offices: number; buses: number; trucks: number };
const EMPHASIS: Record<HeroLayer, Emphasis> = {
  bus: { roadEast: 1, roadWest: 0.14, air: 0.1, money: 0, offices: 0, buses: 1, trucks: 0 },
  cargo: { roadEast: 1, roadWest: 1, air: 1, money: 0, offices: 0, buses: 0, trucks: 1 },
  currency: { roadEast: 0.16, roadWest: 0.16, air: 0, money: 1, offices: 0, buses: 0, trucks: 0 },
  offices: { roadEast: 0.22, roadWest: 0.1, air: 0, money: 0, offices: 1, buses: 0, trucks: 0 },
};

// ---- Path helpers -----------------------------------------------------------

type Track = { points: StagePoint[]; lengths: number[]; total: number };

const buildTrack = (points: StagePoint[]): Track => {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
};

const catmullRom = (input: readonly LonLat[], perSegment = 14): StagePoint[] => {
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

// Flight and transfer legs: straight on the ground, lifted into an arc on screen.
const buildArc = ([from, to]: readonly [LonLat, LonLat], lift: number) => {
  const ground: StagePoint[] = [];
  const sky: StagePoint[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = project([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
    ground.push(point);
    sky.push({ ...point, y: point.y - Math.sin(Math.PI * t) * lift * point.depth });
  }
  return { ground: buildTrack(ground), sky: buildTrack(sky) };
};

const pointAt = (track: Track, fraction: number) => {
  const target = Math.max(0, Math.min(1, fraction)) * track.total;
  let lo = 0;
  let hi = track.lengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (track.lengths[mid] <= target) lo = mid;
    else hi = mid;
  }
  const span = track.lengths[hi] - track.lengths[lo] || 1;
  const t = (target - track.lengths[lo]) / span;
  const a = track.points[lo];
  const b = track.points[hi];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
};

const fractionNear = (track: Track, target: LonLat) => {
  const p = project(target);
  let best = 0;
  let bestDistance = Infinity;
  track.points.forEach((q, i) => {
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return track.lengths[best] / track.total;
};

const road = buildTrack(catmullRom(ROAD));
const BAZARGAN_F = fractionNear(road, CITIES.bazargan);
const ISTANBUL_F = fractionNear(road, CITIES.istanbul);
const EDIRNE_F = fractionNear(road, [26.55, 41.72]);

const airLegs = AIR_LEGS.map((leg) => buildArc(leg, 92));
const moneyLegs = AIR_LEGS.map((leg, i) => buildArc(leg, i === 0 ? 150 : 120));
const borderEast = IRAN_TURKEY.map((line) => line.map(project));
const borderWest = TURKEY_EU.map((line) => line.map(project));
const OFFICES = [CITIES.tehran, CITIES.tabriz, CITIES.istanbul].map(project);
const STOPS = [CITIES.tehran, CITIES.tabriz, CITIES.bazargan, CITIES.istanbul, CITIES.frankfurt].map(project);

// Piecewise time → road fraction for the opening.
const openingFraction = (t: number) => {
  const ease = (x: number) => 1 - (1 - x) * (1 - x);
  if (t <= 0) return 0;
  if (t < BORDER_AT) return ease(t / BORDER_AT) * BAZARGAN_F;
  if (t < ISTANBUL_AT) return BAZARGAN_F + ((t - BORDER_AT) / (ISTANBUL_AT - BORDER_AT)) * (ISTANBUL_F - BAZARGAN_F);
  if (t < FRANKFURT_AT) return ISTANBUL_F + ((t - ISTANBUL_AT) / (FRANKFURT_AT - ISTANBUL_AT)) * (1 - ISTANBUL_F);
  return 1;
};

// A pre-rendered glow is far cheaper than canvas shadowBlur on phones.
const makeGlow = (rgb: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${rgb}, 0.95)`);
  gradient.addColorStop(0.3, `rgba(${rgb}, 0.32)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = gradient;
  g.fillRect(0, 0, 64, 64);
  return c;
};

// ---- Component --------------------------------------------------------------

interface RouteCanvasProps {
  layer: HeroLayer | null;
  paused: boolean;
  // Skip the opening and draw one finished, still frame.
  still: boolean;
}

export const RouteCanvas: React.FC<RouteCanvasProps> = ({ layer, paused, still }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ layer, paused, still });
  state.current = { layer, paused, still };
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    wake.current();
  }, [layer, paused, still]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const glowTeal = makeGlow(TEAL);
    const glowGold = makeGlow(GOLD);

    let unit = 1; // Stage units per CSS pixel, so strokes stay the same on every screen size.
    const resize = () => {
      const width = canvas.clientWidth;
      if (!width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const k = canvas.width / STAGE.width;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      unit = STAGE.width / width;
    };

    const current: Emphasis = { roadEast: 1, roadWest: 1, air: 1, money: 0, offices: 0, buses: 0.5, trucks: 0.5 };

    const stroke = (track: Track, from: number, to: number, rgb: string, alpha: number, width: number) => {
      if (alpha < 0.01 || to <= from) return;
      const a = from * track.total;
      const b = to * track.total;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < track.points.length; i++) {
        const length = track.lengths[i];
        if (length < a) continue;
        if (length > b) break;
        const p = track.points[i];
        if (!started) {
          const head = pointAt(track, from);
          ctx.moveTo(head.x, head.y);
          started = true;
        }
        ctx.lineTo(p.x, p.y);
      }
      const tail = pointAt(track, to);
      if (started) ctx.lineTo(tail.x, tail.y);
      ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
      ctx.lineWidth = width * unit;
      ctx.stroke();
    };

    const glow = (x: number, y: number, size: number, sprite: HTMLCanvasElement, alpha: number) => {
      if (alpha < 0.01) return;
      const s = size * unit;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
      ctx.globalAlpha = 1;
    };

    const comet = (track: Track, f: number, length: number, rgb: string, alpha: number, width: number) => {
      const pieces = 7;
      for (let i = 0; i < pieces; i++) {
        const a = Math.max(0, f - (length * (i + 1)) / pieces);
        const b = Math.max(0, f - (length * i) / pieces);
        stroke(track, a, b, rgb, (alpha * (1 - i / pieces)) ** 1.4, width);
      }
    };

    const vehicle = (x: number, y: number, angle: number, kind: 'bus' | 'truck', alpha: number) => {
      if (alpha < 0.02) return;
      const u = unit;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#07191F';
      ctx.fillRect(-9 * u, -4.2 * u, 18 * u, 8.4 * u);
      if (kind === 'bus') {
        ctx.fillStyle = '#7CF3EC';
        ctx.fillRect(-7.5 * u, -2.8 * u, 15 * u, 5.6 * u);
      } else {
        ctx.fillStyle = '#E2C98C';
        ctx.fillRect(-7.5 * u, -2.8 * u, 10.5 * u, 5.6 * u);
        ctx.fillStyle = '#F7F7F3';
        ctx.fillRect(4 * u, -2.3 * u, 3.5 * u, 4.6 * u);
      }
      ctx.restore();
    };

    const plane = (x: number, y: number, angle: number, alpha: number, size: number) => {
      if (alpha < 0.02) return;
      const u = unit * size;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(9 * u, 0);
      ctx.lineTo(2.5 * u, 1.3 * u);
      ctx.lineTo(-1.5 * u, 7.5 * u);
      ctx.lineTo(-3.8 * u, 7.5 * u);
      ctx.lineTo(-2 * u, 1.3 * u);
      ctx.lineTo(-6.5 * u, 1.1 * u);
      ctx.lineTo(-8.6 * u, 3.4 * u);
      ctx.lineTo(-9.6 * u, 3.4 * u);
      ctx.lineTo(-8.6 * u, 0);
      ctx.lineTo(-9.6 * u, -3.4 * u);
      ctx.lineTo(-8.6 * u, -3.4 * u);
      ctx.lineTo(-6.5 * u, -1.1 * u);
      ctx.lineTo(-2 * u, -1.3 * u);
      ctx.lineTo(-3.8 * u, -7.5 * u);
      ctx.lineTo(-1.5 * u, -7.5 * u);
      ctx.lineTo(2.5 * u, -1.3 * u);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawBorder = (lines: StagePoint[][], flash: number) => {
      const alpha = 0.34 + flash * 0.66;
      ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`;
      ctx.lineWidth = (1.1 + flash * 1.8) * unit;
      ctx.setLineDash(flash > 0.05 ? [] : [3 * unit, 3 * unit]);
      for (const line of lines) {
        ctx.beginPath();
        line.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    };

    const ring = (p: { x: number; y: number }, phase: number, rgb: string, alpha: number, radius: number) => {
      if (alpha < 0.02) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (4 + phase * radius) * unit, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb}, ${alpha * (1 - phase)})`;
      ctx.lineWidth = 1.2 * unit;
      ctx.stroke();
    };

    let clock = 0;

    const render = (dt: number) => {
      const { layer: activeLayer, still: isStill } = state.current;
      const t = isStill ? Math.max(clock, OPENING_ENDS + 6) : clock;
      const progress = openingFraction(t);
      const open = Math.min(1, Math.max(0, (t - FRANKFURT_AT) / (OPENING_ENDS - FRANKFURT_AT)));

      const target = activeLayer ? EMPHASIS[activeLayer] : null;
      const blend = isStill && !dt ? 1 : 1 - Math.exp(-dt * 4);
      (Object.keys(current) as (keyof Emphasis)[]).forEach((key) => {
        const goal = target ? target[key] : key === 'money' || key === 'offices' ? 0 : key === 'buses' || key === 'trucks' ? 0.8 : 1;
        current[key] += (goal - current[key]) * blend;
      });

      ctx.clearRect(0, 0, STAGE.width, STAGE.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Borders flash at the moment the opening shipment crosses them.
      const flashAt = (at: number) => (t < at ? 0 : Math.exp(-(t - at) * 1.25));
      drawBorder(borderEast, flashAt(BORDER_AT));
      drawBorder(borderWest, flashAt(BORDER_AT + ((EDIRNE_F - BAZARGAN_F) / (ISTANBUL_F - BAZARGAN_F)) * (ISTANBUL_AT - BORDER_AT)));

      // Air routes: ground shadow first, then the arc.
      airLegs.forEach((leg, i) => {
        const reach = open * current.air;
        const end = Math.min(1, open * 1.05);
        stroke(leg.ground, 0, end, WHITE, 0.07 * reach, 1);
        stroke(leg.sky, 0, end, WHITE, 0.26 * reach, 1);
        if (t > FRANKFURT_AT) {
          const f = ((t * 0.07 + i * 0.5) % 1);
          const sky = pointAt(leg.sky, f);
          const shadow = pointAt(leg.ground, f);
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          plane(shadow.x, shadow.y, shadow.angle, 0.4 * reach * open, 0.8);
          comet(leg.sky, f, 0.14, WHITE, 0.75 * reach * open, 1.4);
          ctx.fillStyle = '#F7F7F3';
          plane(sky.x, sky.y, sky.angle, reach * open, 1);
        }
      });

      // Road: a soft bed with a bright line on top, split at Istanbul so the
      // bus layer can light only the part the bus line runs on.
      const eastEnd = Math.min(progress, ISTANBUL_F);
      stroke(road, 0, eastEnd, GOLD, 0.2 * current.roadEast, 6);
      stroke(road, 0, eastEnd, GOLD, 0.92 * current.roadEast, 1.8);
      if (progress > ISTANBUL_F) {
        stroke(road, ISTANBUL_F, progress, GOLD, 0.2 * current.roadWest, 6);
        stroke(road, ISTANBUL_F, progress, GOLD, 0.92 * current.roadWest, 1.8);
      }

      // Head of the opening shipment.
      if (t < FRANKFURT_AT && !isStill) {
        const head = pointAt(road, progress);
        glow(head.x, head.y, 54, glowGold, 1);
      }

      if (open > 0) {
        // Buses run both ways between Tehran and Istanbul; trucks go on to Europe.
        const busLength = ISTANBUL_F;
        for (let i = 0; i < 4; i++) {
          const f = (t * 0.022 + i / 4) % 1;
          const eastbound = i % 2 === 1;
          const at = (eastbound ? 1 - f : f) * busLength;
          const p = pointAt(road, at);
          comet(road, at + (eastbound ? 0.03 : 0), 0.03, '124, 243, 236', 0.8 * current.buses * open, 1.8);
          glow(p.x, p.y, 34, glowTeal, 0.7 * current.buses * open);
          vehicle(p.x, p.y, p.angle + (eastbound ? Math.PI : 0), 'bus', current.buses * open);
        }
        for (let i = 0; i < 5; i++) {
          const at = (t * 0.016 + i / 5) % 1;
          const p = pointAt(road, at);
          glow(p.x, p.y, 30, glowGold, 0.65 * current.trucks * open);
          vehicle(p.x, p.y, p.angle, 'truck', current.trucks * open);
        }
      }

      // Currency: transfers hop along a high arc between the settlement cities.
      if (current.money > 0.01) {
        moneyLegs.forEach((leg, i) => {
          stroke(leg.sky, 0, 1, GOLD, 0.34 * current.money, 1.2);
          for (let n = 0; n < 3; n++) {
            const f = (t * 0.2 + n / 3 + i * 0.17) % 1;
            const forward = i === 0 ? f : 1 - f;
            const p = pointAt(leg.sky, forward);
            glow(p.x, p.y, 26, glowGold, current.money);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.6 * unit, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${WHITE}, ${current.money})`;
            ctx.fill();
          }
        });
      }

      // Stop markers.
      STOPS.forEach((p, i) => {
        const reached = [0, BORDER_AT * 0.72, BORDER_AT, ISTANBUL_AT, FRANKFURT_AT][i];
        if (t < reached) return;
        const pop = Math.min(1, (t - reached) / 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.4 * pop * unit, 0, Math.PI * 2);
        ctx.fillStyle = '#F7F7F3';
        ctx.fill();
        ctx.lineWidth = 1.4 * unit;
        ctx.strokeStyle = `rgb(${GOLD})`;
        ctx.stroke();
      });

      // Office pulses.
      if (current.offices > 0.01) {
        OFFICES.forEach((p, i) => {
          glow(p.x, p.y, 74, glowTeal, 0.9 * current.offices);
          ring(p, (t * 0.5 + i * 0.3) % 1, TEAL, current.offices, 34);
          ring(p, (t * 0.5 + i * 0.3 + 0.5) % 1, TEAL, current.offices, 34);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.4 * unit, 0, Math.PI * 2);
          ctx.fillStyle = '#7CF3EC';
          ctx.fill();
        });
      }
    };

    let raf = 0;
    let last = 0;
    let onScreen = true;

    const shouldRun = () => onScreen && !state.current.paused && !state.current.still && !document.hidden;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      render(dt);
      raf = shouldRun() ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (shouldRun()) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      } else if (!raf) {
        // Stopped: still reflect a changed layer once, settled.
        render(state.current.still ? 0 : 0.5);
      }
    };
    wake.current = start;

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    observer.observe(canvas);

    const sizer = new ResizeObserver(() => {
      resize();
      if (!raf) render(0);
    });
    sizer.observe(canvas);

    document.addEventListener('visibilitychange', start);
    resize();
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizer.disconnect();
      document.removeEventListener('visibilitychange', start);
      wake.current = () => {};
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[2] w-full h-full" />;
};
