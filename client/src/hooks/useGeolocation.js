// useGeolocation.js
import { useState, useCallback } from 'react';

const MANILA_FALLBACK = { lat: 14.5995, lon: 120.9842, name: 'Manila' };

export function useGeolocation() {
  const [status, setStatus] = useState('idle'); // idle | locating | granted | denied
  const [coords, setCoords] = useState(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setCoords(MANILA_FALLBACK);
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setStatus('granted');
      },
      () => {
        setStatus('denied');
        setCoords(MANILA_FALLBACK);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { status, coords, locate, fallback: MANILA_FALLBACK };
}