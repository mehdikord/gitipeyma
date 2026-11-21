import type { Settings } from '../modules/settings/definitions';
import type { Locale } from '../i18n/config';

/**
 * The office on Google Maps, from the "map" settings: the place page (the link pasted in the admin
 * panel), turn-by-turn directions to it, and the embeddable map. None of these need an API key.
 */
export function officeMap(settings: Pick<Settings, 'map_url' | 'map_latitude' | 'map_longitude'>, locale: Locale) {
  const lat = Number.parseFloat(settings.map_latitude);
  const lng = Number.parseFloat(settings.map_longitude);
  const at = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : null;
  const placeUrl = settings.map_url.trim() || (at ? `https://www.google.com/maps/search/?api=1&query=${at}` : '');
  return {
    placeUrl,
    directionsUrl: at ? `https://www.google.com/maps/dir/?api=1&destination=${at}` : placeUrl,
    embedUrl: at ? `https://maps.google.com/maps?q=${at}&z=17&hl=${locale}&output=embed` : null,
  };
}
