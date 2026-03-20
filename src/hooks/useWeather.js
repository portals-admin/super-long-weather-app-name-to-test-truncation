import { useState, useCallback } from 'react';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
} from '../services/weatherApi';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [w, f] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      setWeather(w);
      setForecast(f);
      return w;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [w, f] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      setWeather(w);
      setForecast(f);
      return w;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setWeather(null);
    setForecast(null);
    setError(null);
  }, []);

  return { weather, forecast, loading, error, loadByCity, loadByCoords, clear };
}
