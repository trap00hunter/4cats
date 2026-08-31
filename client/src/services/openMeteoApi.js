const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
].join(',');

const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'uv_index_max',
  'sunrise',
  'sunset',
].join(',');

const HOURLY_VARS = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'wind_speed_10m',
].join(',');

export const PH_CITIES = [
  // Luzon
  { name: 'Manila', group: 'Luzon', latitude: 14.5995, longitude: 120.9842, admin1: 'Metro Manila', country: 'Philippines' },
  { name: 'Baguio', group: 'Luzon', latitude: 16.4023, longitude: 120.5960, admin1: 'Benguet', country: 'Philippines' },
  { name: 'Tagaytay', group: 'Luzon', latitude: 14.1153, longitude: 120.9621, admin1: 'Cavite', country: 'Philippines' },
  { name: 'Batanes', group: 'Luzon', latitude: 20.4485, longitude: 121.9708, admin1: 'Batanes', country: 'Philippines' },
  
  // Visayas
  { name: 'Cebu', group: 'Visayas', latitude: 10.3157, longitude: 123.8854, admin1: 'Cebu', country: 'Philippines' },
  { name: 'Boracay', group: 'Visayas', latitude: 11.9674, longitude: 121.9248, admin1: 'Aklan', country: 'Philippines' },
  { name: 'Iloilo', group: 'Visayas', latitude: 10.7202, longitude: 122.5621, admin1: 'Iloilo', country: 'Philippines' },
  
  // Mindanao
  { name: 'Davao', group: 'Mindanao', latitude: 7.1907, longitude: 125.4553, admin1: 'Davao del Sur', country: 'Philippines' },
  { name: 'Cagayan de Oro', group: 'Mindanao', latitude: 8.4542, longitude: 124.6319, admin1: 'Misamis Oriental', country: 'Philippines' },
  { name: 'Zamboanga', group: 'Mindanao', latitude: 6.9214, longitude: 122.0790, admin1: 'Zamboanga del Sur', country: 'Philippines' },
  
  // Hotspots / Tourist Spots
  { name: 'Siargao', group: 'Hotspots', latitude: 9.8583, longitude: 126.0475, admin1: 'Surigao del Norte', country: 'Philippines' },
  { name: 'El Nido', group: 'Hotspots', latitude: 11.1949, longitude: 119.4075, admin1: 'Palawan', country: 'Philippines' },
  { name: 'Coron', group: 'Hotspots', latitude: 12.0019, longitude: 120.2039, admin1: 'Palawan', country: 'Philippines' },
];

export async function searchCity(query, count = 5) {
  if (!query || query.trim().length < 2) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query.trim())}&count=${count}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  return data.results || [];
}

export async function fetchForecast(lat, lon, { pastDays = 3, forecastDays = 8 } = {}) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: CURRENT_VARS,
    daily: DAILY_VARS,
    hourly: HOURLY_VARS,
    past_days: String(pastDays),
    forecast_days: String(forecastDays),
    timezone: 'auto',
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Weather request failed');
  return res.json();
}

export async function fetchForecastByCity(cityName) {
  const results = await searchCity(cityName, 1);
  if (!results.length) throw new Error('CITY_NOT_FOUND');
  const place = results[0];
  const forecast = await fetchForecast(place.latitude, place.longitude);
  return { place, forecast };
}

export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}
