import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Royal Travel | رویال تراول',
    short_name: 'Royal Travel',
    description: 'VIP travel, cargo, currency transfers, legal services, company registration and residency between Iran and Turkey.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07191F',
    theme_color: '#07191F',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
