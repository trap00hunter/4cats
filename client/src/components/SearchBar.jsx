// SearchBar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCity } from '../services/openMeteoApi';

export default function SearchBar({ onSelectCity, onUseLocation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const runSearch = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const matches = await searchCity(q, 6);
      setResults(matches);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(place) {
    setQuery(`${place.name}${place.admin1 ? ', ' + place.admin1 : ''}`);
    setOpen(false);
    onSelectCity?.(place);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto font-[Fredoka]">
      <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur border-4 border-amber-900/80 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.6)]">
        <span className="text-xl" aria-hidden="true">🐾</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search a city…"
          className="flex-1 bg-transparent outline-none text-amber-950 placeholder-amber-700/60 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={onUseLocation}
          title="Use my location"
          className="text-lg hover:scale-110 transition-transform"
          aria-label="Use my current location"
        >
          📍
        </button>
      </div>

      {open && (
        <div className="absolute mt-2 w-full rounded-2xl bg-white border-4 border-amber-900/80 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.6)] overflow-hidden z-20">
          {loading && (
            <div className="px-4 py-3 text-sm text-amber-700">Sniffing for cities…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-amber-700">No matches yet — keep typing!</div>
          )}
          {!loading &&
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2 hover:bg-amber-100 transition-colors text-sm text-amber-950"
              >
                <span className="font-semibold">{r.name}</span>
                {r.admin1 ? `, ${r.admin1}` : ''}
                <span className="text-amber-600"> · {r.country}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}