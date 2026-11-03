// Which country a visitor is in, as far as choosing the site's language needs: Iran, Turkey or
// somewhere else. A CDN in front of the site (Cloudflare, Vercel, nginx's GeoIP module, ...) can
// pass the country in a header; otherwise the IP address is looked up in RIPE's allocations.

import { IPV4_RANGES, IPV6_RANGES } from './ranges.generated';

const COUNTRY_HEADERS = ['cf-ipcountry', 'x-vercel-ip-country', 'cloudfront-viewer-country', 'x-country-code', 'x-geoip-country'];

const unpack = (packed: string) => packed.split(',').filter(Boolean).map((value) => [...value].reduce((total, digit) => total * 36n + BigInt(parseInt(digit, 36)), 0n));

let tables: { v4: Record<string, bigint[]>; v6: Record<string, bigint[]> } | null = null;
const load = () =>
  (tables ??= {
    v4: Object.fromEntries(Object.entries(IPV4_RANGES).map(([country, packed]) => [country, unpack(packed)])),
    v6: Object.fromEntries(Object.entries(IPV6_RANGES).map(([country, packed]) => [country, unpack(packed)])),
  });

// ranges is [start, end, start, end, ...], sorted and not overlapping
function within(ranges: bigint[], value: bigint) {
  let low = 0;
  let high = ranges.length / 2 - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (value < ranges[middle * 2]) high = middle - 1;
    else if (value > ranges[middle * 2 + 1]) low = middle + 1;
    else return true;
  }
  return false;
}

function parseIp(ip: string): { family: 'v4' | 'v6'; value: bigint } | null {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  const address = mapped ? mapped[1] : ip;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(address)) {
    const parts = address.split('.').map(Number);
    if (parts.some((part) => part > 255)) return null;
    return { family: 'v4', value: BigInt(parts.reduce((total, part) => total * 256 + part, 0)) };
  }
  if (!address.includes(':') || !/^[0-9a-f:]+$/i.test(address)) return null;
  const [head, tail = ''] = address.split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  if (left.length + right.length > 8) return null;
  const groups = [...left, ...Array(8 - left.length - right.length).fill('0'), ...right];
  return { family: 'v6', value: groups.slice(0, 4).reduce((total, group) => (total << 16n) | BigInt(parseInt(group || '0', 16)), 0n) };
}

/** "IR", "TR", or null when the address is in neither. */
export function countryOfIp(ip: string | null | undefined): string | null {
  const parsed = ip ? parseIp(ip.trim()) : null;
  if (!parsed) return null;
  const ranges = load()[parsed.family];
  for (const [country, list] of Object.entries(ranges)) if (within(list, parsed.value)) return country;
  return null;
}

/** The visitor's country from the request: a CDN's header if there is one, else their IP. */
export function countryOfRequest(headers: Headers): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name)?.trim().toUpperCase();
    if (value && /^[A-Z]{2}$/.test(value) && value !== 'XX') return value;
  }
  const ip = headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip');
  return countryOfIp(ip);
}
