// WeatherDetails.jsx
export default function WeatherDetails({ current, todayDaily, unit }) {
  if (!current) return null;

  const items = [
    { label: 'Humidity', value: `${Math.round(current.relative_humidity_2m)}%`, icon: '💧' },
    { label: 'Wind', value: `${Math.round(current.wind_speed_10m)} km/h`, icon: '🌬️' },
    {
      label: 'Feels Like',
      value: `${Math.round(current.apparent_temperature)}°${unit}`,
      icon: '🐾',
    },
    {
      label: 'UV Index',
      value: todayDaily?.uv_index_max != null ? Math.round(todayDaily.uv_index_max) : '—',
      icon: '🔆',
    },
    {
      label: 'Rain Chance',
      value: todayDaily?.precipitation_probability_max != null
        ? `${Math.round(todayDaily.precipitation_probability_max)}%`
        : '—',
      icon: '☔',
    },
    { label: 'Precipitation', value: `${current.precipitation ?? 0} mm`, icon: '🌧️' },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 font-[Fredoka]">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border-4 border-amber-900/70 bg-white/85 px-4 py-3 text-center shadow-[3px_3px_0px_0px_rgba(120,53,15,0.5)]"
        >
          <div className="text-2xl">{item.icon}</div>
          <div className="text-lg font-bold text-amber-950">{item.value}</div>
          <div className="text-xs uppercase tracking-wide text-amber-700">{item.label}</div>
        </div>
      ))}
    </section>
  );
}