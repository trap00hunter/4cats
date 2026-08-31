import { useEffect, useMemo, useState, useRef } from "react";
import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { PH_CITIES, searchCity } from "./services/openMeteoApi";
import { CONDITION_EMOJIS } from "./utils/weatherTransformer";

const THEMES = {
  chill: {
    label: "Baguio Chill / Malamig",
    range: "< 22°C",
    gradient: "from-chill-50 via-chill-100 to-chill-200",
    text: "text-chill-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.chill.shadow)]",
    mascot: "Nginig Kuting",
    emoji: "🧣",
    line: "“Nangangatog ang whiskers ko! Sarap mag-kape sa Session Road.”",
  },
  presko: {
    label: "Tropical Presko",
    range: "22°C – 28°C",
    gradient: "from-presko-50 via-presko-100 to-presko-200",
    text: "text-presko-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.presko.shadow)]",
    mascot: "Munimuni Mingming",
    emoji: "🍃",
    line: "“Purr-fect na panahon! Presko ang simoy ng hangin.”",
  },
  sunny: {
    label: "Sunny / Maaliwalas",
    range: "29°C – 33°C",
    gradient: "from-sunny-50 via-sunny-100 to-sunny-200",
    text: "text-sunny-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.sunny.shadow)]",
    mascot: "Sunny Pusa",
    emoji: "🕶️",
    line: "“Mainit-init pero keri! Mag-apply ng sunblock bago maglakwatsa.”",
  },
  meowinit: {
    label: "“Meow-init!” Heat Alert",
    range: "≥ 34°C",
    gradient: "from-meowinit-50 via-rose-100 to-meowinit-200",
    text: "text-meowinit-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.meowinit.shadow)]",
    mascot: "Meow-init",
    emoji: "🥵",
    line: "“Sobrang init meow! Painumin ng tubig ang sarili at mga alagang pusa!”",
  },
  habagat: {
    label: "Habagat Monsoon / Rain",
    range: "Rainy",
    gradient: "from-habagat-50 via-habagat-100 to-habagat-200",
    text: "text-habagat-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.habagat.shadow)]",
    mascot: "Tampisaw",
    emoji: "☔",
    line: "“Basa ang paws! Magdala ng payong at mag-ingat sa baha.”",
  },
  bagyo: {
    label: "Typhoon / Bagyo Warning",
    range: "Storm",
    gradient: "from-bagyo-50 via-bagyo-100 to-bagyo-200",
    text: "text-bagyo-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.bagyo.shadow)]",
    mascot: "Bagyo Box Cat",
    emoji: "📦",
    line: "“Signal No. Meow! Stay safe indoors with emergency treats.”",
  },
  midnight: {
    label: "Night Star-gaze",
    range: "Clear Night",
    gradient: "from-midnight-200 via-midnight-100 to-midnight-50",
    text: "text-midnight-text",
    shadow: "shadow-[6px_6px_0px_0px_theme(colors.midnight.shadow)]",
    mascot: "Meowdnight",
    emoji: "🌙",
    line: "“Matulog nang mahimbing, gising ang mga pusa sa gabi.”",
    dark: true,
  },
};

const ISLAND_GROUPS = ["All", "Luzon", "Visayas", "Mindanao", "Hotspots"];

function resolveThemeKey({ tempC, condition, hour, isDay }) {
  if (condition === "storm") return "bagyo";
  if (condition === "rain") return "habagat";
  const isNight = isDay === 0 || hour >= 19 || hour < 5;
  if (isNight && (condition === "clear" || condition === "cloudy")) return "midnight";
  if (tempC >= 34) return "meowinit";
  if (tempC >= 29) return "sunny";
  if (tempC >= 22) return "presko";
  return "chill";
}

function getPhTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}

export default function App() {
  const [activeGroup, setActiveGroup] = useState("All");
  const [unit, setUnit] = useState("C"); // 'C' | 'F'
  const [phTime, setPhTime] = useState(getPhTime);

  // Default initial city is Manila
  const defaultCity = PH_CITIES[0];
  const {
    weather,
    place,
    isLoading,
    isError,
    error,
    loadByCoords,
    refresh,
  } = useWeather({
    lat: defaultCity.latitude,
    lon: defaultCity.longitude,
    place: defaultCity,
  });

  const { locate, status: geoStatus, coords: geoCoords } = useGeolocation();

  // Tick clock every second
  useEffect(() => {
    const id = setInterval(() => setPhTime(getPhTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // When GPS detects location, fetch weather
  useEffect(() => {
    if (geoCoords && geoStatus === "granted") {
      loadByCoords(geoCoords.lat, geoCoords.lon, {
        name: "My Location",
        admin1: "GPS",
        latitude: geoCoords.lat,
        longitude: geoCoords.lon,
      });
    }
  }, [geoCoords, geoStatus, loadByCoords]);

  // Temperature display converter helper
  const formatTemp = (tempC) => {
    if (tempC == null || Number.isNaN(tempC)) return "--";
    if (unit === "F") return Math.round((tempC * 9) / 5 + 32);
    return Math.round(tempC);
  };

  const currentCondition = weather?.current?.condition || "clear";
  const currentTemp = weather?.current?.tempC ?? 30;
  const isDay = weather?.current?.isDay ?? 1;

  const themeKey = useMemo(
    () =>
      resolveThemeKey({
        tempC: currentTemp,
        condition: currentCondition,
        hour: phTime.getHours(),
        isDay,
      }),
    [currentTemp, currentCondition, phTime, isDay]
  );
  const theme = THEMES[themeKey] || THEMES.sunny;

  const filteredCities = PH_CITIES.filter(
    (c) => activeGroup === "All" || c.group === activeGroup
  );

  const isStorm =
    currentCondition === "storm" ||
    weather?.current?.weatherCode === 95 ||
    weather?.current?.weatherCode === 96 ||
    weather?.current?.weatherCode === 99;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.gradient} transition-colors duration-700 ${
        theme.dark ? "text-white" : "text-ink"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Header
          phTime={phTime}
          onSelectPlace={(p) => loadByCoords(p.latitude, p.longitude, p)}
          onUseLocation={locate}
          geoStatus={geoStatus}
          unit={unit}
          onToggleUnit={() => setUnit((u) => (u === "C" ? "F" : "C"))}
          dark={theme.dark}
        />

        {isStorm && <TyphoonAlertBanner city={place?.name || "Pilipinas"} />}

        <IslandGroupTabs
          groups={ISLAND_GROUPS}
          active={activeGroup}
          onChange={setActiveGroup}
          dark={theme.dark}
        />

        <QuickPillCities
          cities={filteredCities}
          activePlace={place}
          onSelect={(c) => loadByCoords(c.latitude, c.longitude, c)}
          dark={theme.dark}
        />

        {isLoading && !weather && (
          <div className="cartoon-card mt-8 p-12 text-center">
            <div className="text-5xl animate-bounce">🐾</div>
            <p className="mt-4 font-display text-xl font-semibold">
              Sniffing live weather data from Open-Meteo…
            </p>
            <p className="mt-1 text-sm text-ink-soft">Loading…</p>
          </div>
        )}

        {isError && (
          <div className="cartoon-card mt-8 border-meowinit-shadow bg-rose-50 p-8 text-center text-ink">
            <div className="text-5xl">😿</div>
            <p className="mt-3 font-display text-xl font-semibold">
              Oops! Hindi ma-fetch ang live weather.
            </p>
            <p className="mt-1 text-sm text-ink-soft">{error || "Please check your network connection."}</p>
            <button
              onClick={refresh}
              className="mt-4 rounded-full border-3 border-ink bg-paw-yellow px-5 py-2 text-sm font-bold shadow-pop-sm hover:-translate-y-0.5"
            >
              Subukan Ulit (Retry) 🐾
            </button>
          </div>
        )}

        {weather && (
          <>
            <LiveHeroCard
              place={place}
              weather={weather}
              theme={theme}
              phTime={phTime}
              formatTemp={formatTemp}
              unit={unit}
            />

            <HourlyScroller
              hours={weather.hourly}
              formatTemp={formatTemp}
            />

            <WeatherTimeline
              past={weather.pastDays}
              today={weather.current}
              future={weather.futureDays}
              formatTemp={formatTemp}
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <MeowInitMeter heatIndex={weather.current.heatIndex} formatTemp={formatTemp} unit={unit} />
              </div>
              <div className="lg:col-span-3">
                <CatMetricsGrid current={weather.current} />
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}

/* --------------------------------- Header -------------------------------- */
function Header({ phTime, onSelectPlace, onUseLocation, geoStatus, unit, onToggleUnit, dark }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  const timeStr = phTime.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = phTime.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const matches = await searchCity(val, 6);
        setResults(matches);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-ink bg-white text-3xl shadow-pop animate-float">
          🐾
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold leading-none sm:text-3xl">
            4cats Pinas
          </h1>
          <p className={`text-xs font-medium sm:text-sm ${dark ? "text-white/70" : "text-ink-soft"}`}>
            {dateStr} • {timeStr} PST
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div ref={searchRef} className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search city…"
            className="w-full rounded-full border-3 border-ink bg-white px-4 py-2.5 pr-10 font-medium text-ink shadow-pop-sm outline-none placeholder:text-ink-soft/60 focus:shadow-pop"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg">
            🐾
          </span>
          {(results.length > 0 || isSearching) && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border-3 border-ink bg-white shadow-pop">
              {isSearching && (
                <li className="px-4 py-3 text-sm text-ink-soft">Naghahanap ng lugar…</li>
              )}
              {!isSearching &&
                results.map((c) => (
                  <li key={`${c.latitude}-${c.longitude}-${c.name}`}>
                    <button
                      onClick={() => {
                        onSelectPlace(c);
                        setSearch("");
                        setResults([]);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left font-medium hover:bg-paw-yellow/30"
                    >
                      <span className="truncate">
                        {c.name}
                        {c.admin1 ? `, ${c.admin1}` : ""}
                      </span>
                      <span className="text-xs text-ink-soft shrink-0 ml-2">{c.country_code || c.country}</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* GPS location button */}
        <button
          onClick={onUseLocation}
          title="Use my GPS location"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-white text-lg shadow-pop-sm hover:-translate-y-0.5 transition-transform"
        >
          {geoStatus === "locating" ? "⏳" : "📍"}
        </button>

        {/* Temperature unit toggle */}
        <button
          onClick={onToggleUnit}
          title="Toggle Celsius / Fahrenheit"
          className="flex h-11 shrink-0 items-center overflow-hidden rounded-full border-3 border-ink bg-white text-xs font-bold shadow-pop-sm"
        >
          <span className={`px-2.5 py-1.5 ${unit === "C" ? "bg-ink text-paper" : "text-ink"}`}>°C</span>
          <span className={`px-2.5 py-1.5 ${unit === "F" ? "bg-ink text-paper" : "text-ink"}`}>°F</span>
        </button>
      </div>
    </header>
  );
}

/* ---------------------------- Typhoon banner ------------------------------ */
function TyphoonAlertBanner({ city }) {
  return (
    <div
      role="alert"
      className="mt-6 flex items-center gap-3 rounded-2xl border-3 border-ink bg-bagyo-200 px-4 py-3 font-semibold text-bagyo-text shadow-pop-sm"
    >
      <span className="text-2xl">⛈️</span>
      <p className="text-sm sm:text-base">
        Signal No. Meow! {city} is under a Bagyo / Heavy Rain advisory — {THEMES.bagyo.line}
      </p>
    </div>
  );
}

/* --------------------------- Island group tabs ----------------------------- */
function IslandGroupTabs({ groups, active, onChange, dark }) {
  return (
    <nav
      className={`mt-6 flex w-full gap-2 overflow-x-auto rounded-full border-3 border-ink p-1.5 shadow-pop-sm cat-scroll ${
        dark ? "bg-white/10" : "bg-white/70"
      }`}
    >
      {groups.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === g
              ? "bg-ink text-paper"
              : dark
              ? "text-white/80 hover:bg-white/20"
              : "text-ink-soft hover:bg-ink/5"
          }`}
        >
          {g}
        </button>
      ))}
    </nav>
  );
}

/* ----------------------------- Quick city pills ---------------------------- */
function QuickPillCities({ cities, activePlace, onSelect, dark }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {cities.map((c) => {
        const isSelected = activePlace?.name === c.name;
        return (
          <button
            key={c.name}
            onClick={() => onSelect(c)}
            className={`paw-pill transition-transform hover:-translate-y-0.5 ${
              isSelected ? "bg-paw-yellow" : dark ? "bg-white/90" : "bg-white"
            }`}
          >
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------- Hero card --------------------------------- */
function LiveHeroCard({ place, weather, theme, phTime, formatTemp, unit }) {
  const current = weather.current;
  const conditionEmoji = CONDITION_EMOJIS[current.condition] || "☀️";

  return (
    <section
      className={`cat-ears cartoon-card mt-8 grid gap-6 overflow-hidden p-6 sm:grid-cols-[auto_1fr] sm:p-8 ${theme.shadow}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-3 border-ink bg-white text-6xl shadow-pop-sm animate-float sm:h-36 sm:w-36 sm:text-7xl">
          {theme.emoji}
        </div>
        <p className="mt-2 font-display text-sm font-semibold">{theme.mascot}</p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="paw-pill w-fit bg-white">{theme.label} · {theme.range}</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-6xl font-semibold leading-none sm:text-7xl">
            {formatTemp(current.tempC)}°{unit}
          </span>
          <span className="mb-2 text-lg font-medium text-ink-soft">
            {conditionEmoji} {place?.name || "Manila"}{place?.admin1 ? `, ${place.admin1}` : ""}
          </span>
        </div>
        <p className={`mt-3 max-w-md font-medium ${theme.text}`}>{theme.line}</p>
        <p className="mt-2 text-xs text-ink-soft">
          Feels like {formatTemp(current.apparentTempC)}°{unit} · Live as of {phTime.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })} PST
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Hourly scroller ----------------------------- */
function HourlyScroller({ hours, formatTemp }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 font-display text-lg font-semibold">24-Oras na Live Forecast</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 cat-scroll">
        {hours.map((h, i) => (
          <div
            key={`${h.time}-${i}`}
            className="flex min-w-[80px] shrink-0 flex-col items-center gap-1 rounded-2xl border-3 border-ink bg-white px-3 py-3 shadow-pop-sm"
          >
            <span className="text-xs font-semibold text-ink-soft">
              {String(h.hour).padStart(2, "0")}:00
            </span>
            <span className="text-2xl">{CONDITION_EMOJIS[h.condition] || "⛅"}</span>
            <span className="font-display font-semibold">{formatTemp(h.tempC)}°</span>
            {h.rainChance > 0 && (
              <span className="text-[10px] font-bold text-sky-600">💧 {h.rainChance}%</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Weather timeline ---------------------------- */
function WeatherTimeline({ past, today, future, formatTemp }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-lg font-semibold">Nakaraan → Ngayon → Susunod na 7 Araw</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 cat-scroll">
        {past.map((d) => (
          <DayCard key={d.date} day={d} variant="past" formatTemp={formatTemp} />
        ))}
        
        {/* Today Live Marker */}
        <div className="flex min-w-[104px] shrink-0 flex-col items-center justify-center rounded-2xl border-3 border-ink bg-ink px-4 py-4 text-paper shadow-pop-sm">
          <span className="text-xs font-bold uppercase tracking-wide">Live</span>
          <span className="mt-1 text-2xl">{CONDITION_EMOJIS[today.condition] || "☀️"}</span>
          <span className="text-xs font-bold">Ngayon</span>
          <span className="mt-1 font-display text-sm font-semibold text-paper">
            {formatTemp(today.tempC)}°
          </span>
        </div>

        {future.map((d) => (
          <DayCard key={d.date} day={d} variant="future" formatTemp={formatTemp} />
        ))}
      </div>
    </section>
  );
}

function DayCard({ day, variant, formatTemp }) {
  return (
    <div
      className={`flex min-w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border-3 border-ink px-3 py-4 shadow-pop-sm ${
        variant === "past" ? "bg-white/60" : "bg-white"
      }`}
    >
      <span className="text-[11px] font-semibold text-ink-soft">{day.short}</span>
      <span className="text-2xl">{CONDITION_EMOJIS[day.condition] || "⛅"}</span>
      <span className="text-center text-xs font-medium leading-tight">{day.label}</span>
      <span className="font-display text-sm font-semibold">
        {formatTemp(day.tempHigh)}° <span className="text-ink-soft">{formatTemp(day.tempLow)}°</span>
      </span>
    </div>
  );
}

/* ------------------------------ Meow-init meter ------------------------------ */
function MeowInitMeter({ heatIndex, formatTemp, unit }) {
  const hiC = heatIndex?.heatIndexC ?? 30;
  const pct = heatIndex?.percentage ?? 40;
  const isAlert = hiC >= 34;

  return (
    <section className="cartoon-card h-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Meow-init Meter</h2>
          <p className="text-xs text-ink-soft">PAGASA Heat Index: {formatTemp(hiC)}°{unit}</p>
        </div>
        <span className="paw-pill bg-white text-xs">{heatIndex?.tagalogLevel || "Presko"}</span>
      </div>

      <div className="mt-5 h-4 w-full overflow-hidden rounded-full border-3 border-ink bg-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-presko-200 via-sunny-200 to-meowinit-200 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className={`mt-4 font-semibold ${isAlert ? "text-meowinit-text" : "text-presko-text"}`}>
        {heatIndex?.advice || "😺 Chill lang, keri ang labas."}
      </p>
    </section>
  );
}

/* ------------------------------- Metrics grid -------------------------------- */
function CatMetricsGrid({ current }) {
  const metrics = [
    { label: "Humidity", value: `${current.humidity}%`, emoji: "💧" },
    { label: "Wind Speed", value: `${current.windSpeedKmh} km/h`, emoji: "🌬️" },
    { label: "UV Index", value: `${current.uvIndex} max`, emoji: "🕶️" },
    { label: "Rain Chance", value: `${current.rainChance}%`, emoji: "🌦️" },
    { label: "Precipitation", value: `${current.precipitation} mm`, emoji: "🌧️" },
    { label: "Sunrise / Sunset", value: `${current.sunrise}`, emoji: "🌅" },
  ];

  return (
    <section className="grid h-full grid-cols-2 gap-3 sm:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="cartoon-card cartoon-card-hover flex flex-col items-center justify-center gap-1 p-4 text-center"
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="font-display text-lg font-semibold">{m.value}</span>
          <span className="text-xs text-ink-soft">{m.label}</span>
        </div>
      ))}
    </section>
  );
}

/* ---------------------------------- Footer ----------------------------------- */
function Footer() {
  return (
    <footer className="stitch-divider mt-12 flex flex-col items-center gap-2 pt-6 text-center text-sm text-ink-soft">
      <p>
        Weather data live via <span className="font-semibold text-ink">Open-Meteo</span> · Advisories inspired by{" "}
        <span className="font-semibold text-ink">PAGASA</span>
      </p>
    </footer>
  );
}
