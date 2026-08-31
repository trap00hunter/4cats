// weatherMap.js
// Maps Open-Meteo WMO weather codes + temperature + wind to a Fore-cat mascot,
// theme gradient, and Pinoy-flavored feline commentary.

export const TEMP_THEMES = [
  {
    id: 'chilly',
    label: 'Baguio Chill / Malamig',
    max: 22,
    gradient: 'from-cyan-100 to-teal-100',
    shadow: 'shadow-cyan-300/50',
    mascot: 'Nginig Kuting',
    image: '/cats/cat-snow.png',
    quote: 'Nangangatog ang whiskers ko! Sarap mag-kape sa Session Road.',
  },
  {
    id: 'presko',
    label: 'Tropical Presko',
    max: 28,
    gradient: 'from-emerald-100 to-lime-100',
    shadow: 'shadow-emerald-300/50',
    mascot: 'Munimuni Mingming',
    image: '/cats/cat-partly-cloudy.png',
    quote: 'Purr-fect na panahon! Presko ang simoy ng hangin.',
  },
  {
    id: 'sunny',
    label: 'Sunny / Maaliwalas',
    max: 33,
    gradient: 'from-amber-100 to-yellow-200',
    shadow: 'shadow-amber-300/50',
    mascot: 'Sunny Pusa',
    image: '/cats/cat-sunny.png',
    quote: 'Mainit-init pero keri! Mag-apply ng sunblock bago maglakwatsa.',
  },
  {
    id: 'meowinit',
    label: '"Meow-init!" Heat Alert',
    max: Infinity,
    gradient: 'from-orange-200 via-rose-200 to-amber-200',
    shadow: 'shadow-orange-300/60',
    mascot: 'Meow-init Cat',
    image: '/cats/cat-sunny.png',
    quote: 'Sobrang init meow! Painumin ng tubig ang sarili at mga alagang pusa!',
  },
];

// WMO code -> base condition entry. isDay swaps clear-sky art.
export const WEATHER_CAT_MAP = {
  0: (isDay) => ({
    label: isDay ? 'Clear Sky' : 'Clear Night',
    image: isDay ? '/cats/cat-sunny.png' : '/cats/cat-night-clear.png',
    mascot: isDay ? 'Sunny Pusa' : 'Midnight Mingming',
    quote: isDay ? 'Pawsitively glorious sunshine today!' : 'Purrfect starry night for a nap.',
    gradient: isDay ? 'from-amber-100 to-yellow-200' : 'from-indigo-950 via-slate-900 to-sky-950',
  }),
  1: () => ({
    label: 'Mainly Clear',
    image: '/cats/cat-partly-cloudy.png',
    mascot: 'Munimuni Mingming',
    quote: 'Chasing sunbeams between little clouds.',
    gradient: 'from-emerald-100 to-lime-100',
  }),
  2: () => ({
    label: 'Partly Cloudy',
    image: '/cats/cat-partly-cloudy.png',
    mascot: 'Munimuni Mingming',
    quote: 'A comfortable mix of sun and clouds.',
    gradient: 'from-emerald-100 to-lime-100',
  }),
  3: () => ({
    label: 'Overcast',
    image: '/cats/cat-cloudy.png',
    mascot: 'Loaf Cat',
    quote: 'Looks like a loaf-by-the-window kind of day.',
    gradient: 'from-slate-200 to-zinc-200',
  }),
  45: () => ({ label: 'Foggy', image: '/cats/cat-fog.png', mascot: 'Ulap Kuting', quote: "Can't see the laser pointer through this mist!", gradient: 'from-slate-200 to-gray-300' }),
  48: () => ({ label: 'Icy Fog', image: '/cats/cat-fog.png', mascot: 'Ulap Kuting', quote: 'Brrr, frosted whiskers.', gradient: 'from-slate-200 to-gray-300' }),
  51: () => ({ label: 'Light Drizzle', image: '/cats/cat-drizzle.png', mascot: 'Tampisaw Ming', quote: 'Just a light mist, but keep my paws dry!', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  53: () => ({ label: 'Drizzle', image: '/cats/cat-drizzle.png', mascot: 'Tampisaw Ming', quote: 'Steady drip-drip. Umbrella time.', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  55: () => ({ label: 'Dense Drizzle', image: '/cats/cat-drizzle.png', mascot: 'Tampisaw Ming', quote: 'Getting misty out there, ingat!', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  61: () => ({ label: 'Rainy', image: '/cats/cat-rain.png', mascot: 'Tampisaw Ming', quote: 'Basa ang paws! Magdala ng payong at mag-ingat sa baha.', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  63: () => ({ label: 'Moderate Rain', image: '/cats/cat-rain.png', mascot: 'Tampisaw Ming', quote: 'Water falling from sky. Displeased.', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  65: () => ({ label: 'Heavy Rain', image: '/cats/cat-heavy-rain.png', mascot: 'Tampisaw Ming', quote: 'Total soaking! Stay indoors and cuddle.', gradient: 'from-sky-300 via-blue-300 to-indigo-300' }),
  71: () => ({ label: 'Snow Flurries', image: '/cats/cat-snow.png', mascot: 'Nginig Kuting', quote: 'Snowflakes! Must pounce!', gradient: 'from-cyan-100 to-teal-100' }),
  73: () => ({ label: 'Snow', image: '/cats/cat-snow.png', mascot: 'Nginig Kuting', quote: 'Cold white stuff outside! Fetch the fireplace.', gradient: 'from-cyan-100 to-teal-100' }),
  75: () => ({ label: 'Heavy Snow', image: '/cats/cat-snow.png', mascot: 'Nginig Kuting', quote: 'Buried in snow, buried in blankets.', gradient: 'from-cyan-100 to-teal-100' }),
  80: () => ({ label: 'Rain Showers', image: '/cats/cat-rain.png', mascot: 'Tampisaw Ming', quote: 'Pop-up showers, grab that umbrella!', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  81: () => ({ label: 'Rain Showers', image: '/cats/cat-rain.png', mascot: 'Tampisaw Ming', quote: 'On-and-off na ulan today.', gradient: 'from-sky-200 via-blue-200 to-indigo-200' }),
  82: () => ({ label: 'Violent Showers', image: '/cats/cat-heavy-rain.png', mascot: 'Tampisaw Ming', quote: 'Sudden downpour! Everyone inside, meow!', gradient: 'from-sky-300 via-blue-300 to-indigo-300' }),
  85: () => ({ label: 'Snow Showers', image: '/cats/cat-snow.png', mascot: 'Nginig Kuting', quote: 'Flurries of fun, brrr!', gradient: 'from-cyan-100 to-teal-100' }),
  86: () => ({ label: 'Heavy Snow Showers', image: '/cats/cat-snow.png', mascot: 'Nginig Kuting', quote: 'Snowed in and cozy.', gradient: 'from-cyan-100 to-teal-100' }),
  95: () => ({ label: 'Thunderstorm', image: '/cats/cat-thunderstorm.png', mascot: 'Bagyo Box Cat', quote: 'Signal No. Meow! Stay safe indoors with emergency treats.', gradient: 'from-violet-200 via-purple-200 to-slate-300' }),
  96: () => ({ label: 'Thunderstorm w/ Hail', image: '/cats/cat-thunderstorm.png', mascot: 'Bagyo Box Cat', quote: 'Big sky boofs! Hiding under the bed!', gradient: 'from-violet-200 via-purple-200 to-slate-300' }),
  99: () => ({ label: 'Severe Thunderstorm', image: '/cats/cat-thunderstorm.png', mascot: 'Bagyo Box Cat', quote: 'Bagyo warning! Balikbayan box bunker activated.', gradient: 'from-violet-200 via-purple-200 to-slate-300' }),
};

const WIND_ALERT_KMH = 25;

/**
 * Resolve the full "Fore-cat" theme for the current conditions.
 * Priority: thunderstorm/rain codes always win (safety first),
 * then high wind override, then the plain WMO mapping.
 */
export function getCatWeather({ wmoCode, isDay = 1, windSpeedKmh = 0, temperatureC = null }) {
  const handler = WEATHER_CAT_MAP[wmoCode] || WEATHER_CAT_MAP[0];
  const base = handler(isDay);

  const isSevere = [65, 82, 95, 96, 99].includes(wmoCode);
  if (!isSevere && windSpeedKmh >= WIND_ALERT_KMH) {
    return {
      ...base,
      label: `${base.label} & Windy`,
      image: '/cats/cat-windy.png',
      mascot: 'Hangin Ming',
      quote: "Hold onto your whiskers, it's breezy!",
    };
  }

  return base;
}

/** Resolve the temperature-based theme band (used for the hero gradient/heat meter). */
export function getTempTheme(temperatureC) {
  if (temperatureC == null || Number.isNaN(temperatureC)) return TEMP_THEMES[1];
  return TEMP_THEMES.find((t) => temperatureC < t.max) || TEMP_THEMES[TEMP_THEMES.length - 1];
}

export const LOADING_CAT = {
  label: 'Sniffing the breeze…',
  image: '/cats/cat-loading.png',
  mascot: 'Loading Kuting',
  quote: 'Sniffing the weather breeze…',
};

export const ERROR_CAT = {
  label: 'City not found',
  image: '/cats/cat-error.png',
  mascot: 'Lost Ming',
  quote: "Oops! Cat couldn't find that city.",
};