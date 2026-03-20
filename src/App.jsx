import React from 'react';
import { useCallback, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { LocationHistory } from './components/LocationHistory';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { UnitToggle } from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import { useLocationHistory } from './hooks/useLocationHistory';

export default function App() {
  const { weather, forecast, loading, error, loadByCity, loadByCoords, clear } = useWeather();
  const { history, favorites, unit, setUnit, addToHistory, removeFromHistory, toggleFavorite, isFavorite } =
    useLocationHistory();
  const [geoError, setGeoError] = useState(null);

  const handleSearch = useCallback(
    async (city) => {
      setGeoError(null);
      const result = await loadByCity(city);
      if (result) addToHistory(result.city + ', ' + result.country);
    },
    [loadByCity, addToHistory]
  );

  const handleSelect = useCallback(
    (location) => {
      const city = location.split(',')[0].trim();
      handleSearch(city);
    },
    [handleSearch]
  );

  const handleRemoveHistory = useCallback(
    (loc) => removeFromHistory(loc),
    [removeFromHistory]
  );

  const handleRemoveFavorite = useCallback(
    (loc) => toggleFavorite(loc),
    [toggleFavorite]
  );

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const result = await loadByCoords(coords.latitude, coords.longitude);
        if (result) addToHistory(result.city + ', ' + result.country);
      },
      () => setGeoError('Unable to get your location. Please search manually.')
    );
  }, [loadByCoords, addToHistory]);

  const handleFavoriteToggle = useCallback(() => {
    if (weather) toggleFavorite(weather.city + ', ' + weather.country);
  }, [weather, toggleFavorite]);

  const currentLabel = weather ? weather.city + ', ' + weather.country : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4 py-6">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-2xl font-bold text-white">🌤️ Weather</h1>
          <p className="text-white/50 text-xs mt-1">Real-time forecasts anywhere</p>
        </header>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
          <button
            onClick={handleLocate}
            aria-label="Use my location"
            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition"
            title="Use my location"
          >
            📍
          </button>
        </div>

        {/* Unit toggle */}
        <div className="flex justify-end">
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>

        {/* Errors */}
        <ErrorMessage message={error || geoError} onDismiss={error ? clear : () => setGeoError(null)} />

        {/* Location history & favorites */}
        {!loading && !weather && (
          <LocationHistory
            history={history}
            favorites={favorites}
            onSelect={handleSelect}
            onRemove={(loc, isFav) => (isFav ? handleRemoveFavorite(loc) : handleRemoveHistory(loc))}
          />
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Weather results */}
        {!loading && weather && (
          <>
            <WeatherCard
              weather={weather}
              onToggleFavorite={handleFavoriteToggle}
              isFavorite={isFavorite(currentLabel)}
            />
            {forecast && <ForecastCard forecast={forecast} />}
            <button
              onClick={clear}
              className="w-full py-2 text-white/50 hover:text-white text-sm transition"
            >
              ← Search another location
            </button>
          </>
        )}

        {/* Empty state */}
        {!loading && !weather && !error && !geoError && history.length === 0 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🌍</div>
            <p className="text-white/60 text-sm">Search for a city or use your location</p>
          </div>
        )}

        {/* API key notice if not set */}
        {!import.meta.env.VITE_OPENWEATHER_API_KEY && (
          <p className="text-center text-amber-300/70 text-xs bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            ⚙️ Set <code>VITE_OPENWEATHER_API_KEY</code> in your <code>.env</code> file to enable live data.
          </p>
        )}

        <footer className="text-center text-white/30 text-xs pt-2">
          Powered by OpenWeatherMap
        </footer>
      </div>
    </div>
  );
}
