import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX_HISTORY = 5;

export function useLocationHistory() {
  const [history, setHistory] = useLocalStorage('weather_location_history', []);
  const [favorites, setFavorites] = useLocalStorage('weather_favorites', []);
  const [unit, setUnit] = useLocalStorage('weather_unit', 'metric');

  const addToHistory = useCallback((locationName) => {
    setHistory((prev) => {
      const filtered = prev.filter((l) => l.toLowerCase() !== locationName.toLowerCase());
      return [locationName, ...filtered].slice(0, MAX_HISTORY);
    });
  }, [setHistory]);

  const removeFromHistory = useCallback((locationName) => {
    setHistory((prev) => prev.filter((l) => l !== locationName));
  }, [setHistory]);

  const toggleFavorite = useCallback((locationName) => {
    setFavorites((prev) => {
      if (prev.includes(locationName)) return prev.filter((l) => l !== locationName);
      return [locationName, ...prev].slice(0, MAX_HISTORY);
    });
  }, [setFavorites]);

  const isFavorite = useCallback((locationName) => favorites.includes(locationName), [favorites]);

  return {
    history,
    favorites,
    unit,
    setUnit,
    addToHistory,
    removeFromHistory,
    toggleFavorite,
    isFavorite,
  };
}
