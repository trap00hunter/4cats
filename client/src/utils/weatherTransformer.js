export function getConditionFromWmo(code) {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55].includes(code)) return 'rain';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'clear';
}

export const CONDITION_EMOJIS = {
  clear: '☀️',
  cloudy: '⛅',
  rain: '🌧️',
  storm: '⛈️',
  fog: '🌫️',
  snow: '❄️',
};

export function calculateHeatIndex(tempC, humidity) {
  if (tempC < 27 || humidity < 40) {
    return {
      heatIndexC: Math.round(tempC),
      level: 'Safe',
      tagalogLevel: 'Presko / Ligtas',
      advice: 'Chill.',
      percentage: Math.min(100, Math.max(0, ((tempC - 20) / (45 - 20)) * 100)),
    };
  }

  const T = (tempC * 9) / 5 + 32; // temp in Fahrenheit
  const R = humidity;

  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  const heatIndexC = Math.round(((HI - 32) * 5) / 9);
  const percentage = Math.min(100, Math.max(0, ((heatIndexC - 24) / (52 - 24)) * 100));

  if (heatIndexC < 33) {
    return {
      heatIndexC,
      level: 'Caution',
      tagalogLevel: 'Ingat / Mainit-init',
      advice: 'Mainit-init pero keri! Mag-apply ng sunblock bago lumabas.',
      percentage,
    };
  }
  if (heatIndexC < 42) {
    return {
      heatIndexC,
      level: 'Extreme Caution',
      tagalogLevel: 'Sobrang Ingat / Meow-init',
      advice: 'Meow-init! Uminom ng malamig na tubig at magpayong.',
      percentage,
    };
  }
  if (heatIndexC < 52) {
    return {
      heatIndexC,
      level: 'Danger',
      tagalogLevel: 'Panganib / Sobrang Init',
      advice: 'Danger: Sobrang Meow-init! Don`t forget to have your cats drink water too.',
      percentage,
    };
  }
  return {
    heatIndexC,
    level: 'Extreme Danger',
    tagalogLevel: 'Matinding Panganib',
    advice: 'Danger: Ultra Giga Extreme Heat! Don`t let your cats outside your airconditioned homes.',
    percentage,
  };
}

/**
 * Transform Open-Meteo raw payload into clean application state.
 */
export function transformWeatherData(raw) {
  if (!raw || !raw.current) return null;

  const current = raw.current;
  const hourly = raw.hourly || {};
  const daily = raw.daily || {};

  // Current weather
  const currentTemp = Math.round(current.temperature_2m);
  const apparentTemp = Math.round(current.apparent_temperature ?? current.temperature_2m);
  const humidity = Math.round(current.relative_humidity_2m ?? 70);
  const windSpeed = Math.round(current.wind_speed_10m ?? 0);
  const weatherCode = current.weather_code ?? 0;
  const isDay = current.is_day ?? 1;
  const condition = getConditionFromWmo(weatherCode);
  const precipitation = current.precipitation ?? 0;

  // Find index of today in daily array (usually at index 3 when past_days=3)
  const todayDateStr = new Date().toISOString().split('T')[0];
  let todayIndex = daily.time ? daily.time.findIndex((t) => t.startsWith(todayDateStr)) : -1;
  if (todayIndex === -1 && daily.time) {
    todayIndex = Math.min(3, daily.time.length - 1);
  }

  const todayUv = daily.uv_index_max?.[todayIndex] != null ? Math.round(daily.uv_index_max[todayIndex]) : 7;
  const todayRainChance =
    daily.precipitation_probability_max?.[todayIndex] != null
      ? Math.round(daily.precipitation_probability_max[todayIndex])
      : 20;
  const sunriseStr = daily.sunrise?.[todayIndex]
    ? new Date(daily.sunrise[todayIndex]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '5:45 AM';
  const sunsetStr = daily.sunset?.[todayIndex]
    ? new Date(daily.sunset[todayIndex]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '6:15 PM';

  // Heat Index
  const heatIndex = calculateHeatIndex(currentTemp, humidity);

  // Hourly (next 24 hours from current time)
  const now = new Date();
  const currentIsoHour = `${now.toISOString().slice(0, 13)}:00`;
  let startHourlyIdx = hourly.time ? hourly.time.findIndex((t) => t >= currentIsoHour) : 0;
  if (startHourlyIdx < 0) startHourlyIdx = 0;

  const next24Hours = (hourly.time || []).slice(startHourlyIdx, startHourlyIdx + 24).map((timeStr, idx) => {
    const originalIdx = startHourlyIdx + idx;
    const dateObj = new Date(timeStr);
    const code = hourly.weather_code?.[originalIdx] ?? 0;
    return {
      time: timeStr,
      hour: dateObj.getHours(),
      tempC: Math.round(hourly.temperature_2m?.[originalIdx] ?? 28),
      weatherCode: code,
      condition: getConditionFromWmo(code),
      rainChance: Math.round(hourly.precipitation_probability?.[originalIdx] ?? 0),
      windSpeed: Math.round(hourly.wind_speed_10m?.[originalIdx] ?? 0),
    };
  });

  // Timeline (Past 3 days + Today + Future 7 days)
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesTagalog = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];
  const pastLabels = ['3 Araw Nakaraan', 'Kamakalawa', 'Kahapon'];

  const pastDays = [];
  const futureDays = [];

  if (daily.time && todayIndex >= 0) {
    // Past days (up to 3 days before today)
    const pastStart = Math.max(0, todayIndex - 3);
    for (let i = pastStart; i < todayIndex; i++) {
      const d = new Date(daily.time[i]);
      const code = daily.weather_code?.[i] ?? 0;
      const labelIdx = 3 - (todayIndex - i);
      pastDays.push({
        date: daily.time[i],
        label: pastLabels[labelIdx] || dayNamesTagalog[d.getDay()],
        short: dayNamesShort[d.getDay()],
        tempHigh: Math.round(daily.temperature_2m_max?.[i] ?? 31),
        tempLow: Math.round(daily.temperature_2m_min?.[i] ?? 25),
        weatherCode: code,
        condition: getConditionFromWmo(code),
      });
    }

    // Future days (up to 7 days after today)
    for (let i = todayIndex + 1; i < Math.min(daily.time.length, todayIndex + 8); i++) {
      const d = new Date(daily.time[i]);
      const diff = i - todayIndex;
      const code = daily.weather_code?.[i] ?? 0;
      const label = diff === 1 ? 'Bukas' : diff === 7 ? '+7' : dayNamesTagalog[d.getDay()];
      futureDays.push({
        date: daily.time[i],
        label,
        short: dayNamesShort[d.getDay()],
        tempHigh: Math.round(daily.temperature_2m_max?.[i] ?? 32),
        tempLow: Math.round(daily.temperature_2m_min?.[i] ?? 25),
        weatherCode: code,
        condition: getConditionFromWmo(code),
      });
    }
  }

  return {
    current: {
      tempC: currentTemp,
      apparentTempC: apparentTemp,
      humidity,
      windSpeedKmh: windSpeed,
      weatherCode,
      isDay,
      condition,
      precipitation,
      uvIndex: todayUv,
      rainChance: todayRainChance,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      heatIndex,
    },
    hourly: next24Hours,
    pastDays,
    futureDays,
    raw,
  };
}
