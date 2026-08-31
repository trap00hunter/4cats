// ForecastCard.jsx
import { getCatWeather } from '../constants/weatherMap';

export default function ForecastCard({ dateLabel, wmoCode, tempMax, tempMin, unit, isToday, isPast }) {
  const theme = getCatWeather({ wmoCode, isDay: 1 });

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border-4 px-3 py-4 min-w-[92px] shrink-0 shadow-[3px_3px_0px_0px_rgba(120,53,15,0.5)] transition-transform hover:-translate-y-1
        ${isToday ? 'border-amber-900 bg-amber-100' : 'border-amber-900/60 bg-white/80'}
        ${isPast ? 'opacity-70' : ''}`}
    >
      <span className="text-[11px] uppercase tracking-wide font-semibold text-amber-800 font-[Fredoka]">
        {isToday ? 'Today' : dateLabel}
      </span>
      <img
        src={theme.image}
        alt={theme.label}
        className="w-12 h-12 object-contain my-2"
        draggable={false}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/cats/cat-error.png';
        }}
      />
      <span className="text-sm font-bold text-amber-950">
        {Math.round(tempMax)}°<span className="text-amber-700 font-medium">/{Math.round(tempMin)}°{unit}</span>
      </span>
    </div>
  );
}