import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchForecast, fetchForecastByCity } from '../services/openMeteoApi';
import { transformWeatherData } from '../utils/weatherTransformer';

export function useWeather(initialCoords = null) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [rawForecast, setRawForecast] = useState(null);
  const requestId = useRef(0);
  const lastTarget = useRef(null);

  const loadByCoords = useCallback(async (lat, lon, placeInfo = null) => {
    const id = ++requestId.current;
    lastTarget.current = { type: 'coords', lat, lon, placeInfo };
    setStatus('loading');
    setError(null);
    try {
      const data = await fetchForecast(lat, lon);
      if (id !== requestId.current) return; // stale response, ignore
      const structured = transformWeatherData(data);
      setRawForecast(data);
      setWeather(structured);
      if (placeInfo) {
        setPlace(placeInfo);
      } else {
        setPlace((prev) => prev || { name: 'Current Location', latitude: lat, longitude: lon });
      }
      setStatus('success');
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || 'Failed to load weather');
      setStatus('error');
    }
  }, []);

  const loadByCity = useCallback(async (cityName) => {
    const id = ++requestId.current;
    lastTarget.current = { type: 'city', cityName };
    setStatus('loading');
    setError(null);
    try {
      const { place: p, forecast: f } = await fetchForecastByCity(cityName);
      if (id !== requestId.current) return;
      const structured = transformWeatherData(f);
      setRawForecast(f);
      setWeather(structured);
      setPlace(p);
      setStatus('success');
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message === 'CITY_NOT_FOUND' ? 'CITY_NOT_FOUND' : 'Failed to load weather');
      setStatus('error');
    }
  }, []);

  const refresh = useCallback(() => {
    if (!lastTarget.current) return;
    if (lastTarget.current.type === 'coords') {
      loadByCoords(lastTarget.current.lat, lastTarget.current.lon, lastTarget.current.placeInfo);
    } else if (lastTarget.current.type === 'city') {
      loadByCity(lastTarget.current.cityName);
    }
  }, [loadByCoords, loadByCity]);

  useEffect(() => {
    if (initialCoords) {
      loadByCoords(initialCoords.lat, initialCoords.lon, initialCoords.place || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    error,
    place,
    weather,
    rawForecast,
    loadByCoords,
    loadByCity,
    refresh,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}
