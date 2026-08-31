// CurrentWeather.jsx
import { getCatWeather } from '../constants/weatherMap';
import CatDisplay from './CatDisplay';
import TemperatureToggle from './TemperatureToggle';

export default function CurrentWeather({ place, current, unit, onToggleUnit, displayTemp }) {
  if (!current) return null;

  const theme = getCatWeather({
    wmoCode: current.weather_code,
    isDay: current.is_day,
    windSpeedKmh: current.wind_speed_10m,
    temperatureC: current.temperature_2m,
  });

  return (
    <section
      className={`relative rounded-[2rem] border-4 border-amber-900/80 bg-gradient-to-br ${theme.gradient} px-6 py-8 sm:px-10 sm:py-10 shadow-[6px_6px_0px_0px_rgba(120,53,15,0.6)] overflow-hidden`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <p className="uppercase tracking-widest text-xs sm:text-sm font-semibold text-amber-900/70 font-[Fredoka]">
            {place ? `${place.name}${place.admin1 ? ', ' + place.admin1 : ''}` : 'Loading location…'}
          </p>
          <div className="mt-2 flex items-end justify-center sm:justify-start gap-2">
            <span className="text-6xl sm:text-7xl font-bold text-amber-950 font-[Fredoka] leading-none">
              {Math.round(displayTemp)}°
            </span>
            <TemperatureToggle unit={unit} onToggle={onToggleUnit} />
          </div>
          <p className="mt-1 text-amber-900 font-semibold">{theme.label}</p>
          <p className="text-amber-900/80 text-sm">
            Feels like {Math.round(current.apparent_temperature)}°{unit}
          </p>

          <div className="mt-4 inline-block bg-white/70 border-2 border-amber-900/60 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs">
            <p className="text-sm text-amber-950 italic">"{theme.quote}"</p>
            <p className="text-xs text-amber-700 mt-1">— {theme.mascot}</p>
          </div>
        </div>

        <CatDisplay image={theme.image} alt={theme.mascot} animated />
      </div>
    </section>
  );
}