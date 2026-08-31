// TemperatureToggle.jsx
export default function TemperatureToggle({ unit, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mb-2 flex items-center rounded-full border-2 border-amber-900/70 bg-white/80 text-xs font-bold overflow-hidden font-[Fredoka]"
      aria-label="Toggle temperature unit"
    >
      <span className={`px-2 py-1 ${unit === 'C' ? 'bg-amber-900 text-white' : 'text-amber-900'}`}>
        °C
      </span>
      <span className={`px-2 py-1 ${unit === 'F' ? 'bg-amber-900 text-white' : 'text-amber-900'}`}>
        °F
      </span>
    </button>
  );
}