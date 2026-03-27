import React from 'react';
import { WeatherIcon } from './WeatherIcon';

function getGradient(weatherMain) {
  const gradients = {
    Clear: 'from-sky-400 via-blue-400 to-indigo-500',
    Clouds: 'from-slate-400 via-gray-400 to-slate-500',
    Rain: 'from-slate-600 via-blue-700 to-slate-700',
    Drizzle: 'from-blue-400 via-slate-400 to-blue-500',
    Thunderstorm: 'from-gray-700 via-slate-800 to-gray-900',
    Snow: 'from-blue-100 via-indigo-200 to-sky-300',
    Mist: 'from-gray-400 via-slate-400 to-gray-500',
    Fog: 'from-gray-400 via-slate-400 to-gray-500',
    Haze: 'from-amber-300 via-yellow-300 to-orange-300',
    Smoke: 'from-gray-500 via-stone-400 to-gray-600',
    Dust: 'from-amber-400 via-yellow-400 to-orange-400',
    Sand: 'from-amber-400 via-yellow-400 to-orange-400',
    Tornado: 'from-gray-600 via-slate-600 to-gray-700',
  };
  return gradients[weatherMain] || gradients.Clear;
}

function WindDirection({ deg }) {
  const arrows = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dir = arrows[Math.round(deg / 45) % 8];
  return <span className="text-white/80 text-xs">{dir}</span>;
}

export function WeatherCard({ weather, onToggleFavorite, isFavorite }) {
  const gradient = getGradient(weather.weatherMain);
  const sunrise = new Date(weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      data-testid="weather-card"
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-2xl relative`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold leading-tight">
            {weather.city}
            <span className="text-sm font-normal text-white/70 ml-1">{weather.country}</span>
          </h2>
          <p className="text-white/70 text-xs capitalize mt-0.5">{weather.description}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="text-xl p-1 hover:scale-125 transition-transform"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="flex items-center justify-between my-3">
        <div>
          <div className="text-6xl font-thin">{weather.temp}°</div>
          <div className="text-sm text-white/80 mt-1">
            Feels like {weather.feelsLike}° · {weather.tempMin}° / {weather.tempMax}°
          </div>
        </div>
        <WeatherIcon icon={weather.icon} description={weather.description} size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <StatBadge label="Humidity" value={`${weather.humidity}%`} icon="💧" />
        <StatBadge label="Wind" value={<><span>{weather.windSpeed} m/s</span> <WindDirection deg={weather.windDeg} /></>} icon="💨" />
        <StatBadge label="Pressure" value={`${weather.pressure} hPa`} icon="🌡️" />
        {weather.visibility !== null && (
          <StatBadge label="Visibility" value={`${weather.visibility} km`} icon="👁️" />
        )}
        <StatBadge label="Sunrise" value={sunrise} icon="🌅" />
        <StatBadge label="Sunset" value={sunset} icon="🌇" />
      </div>
    </div>
  );
}

function StatBadge({ label, value, icon }) {
  return (
    <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <div>
        <div className="text-white/60 text-xs">{label}</div>
        <div className="text-white text-sm font-medium flex items-center gap-1">{value}</div>
      </div>
    </div>
  );
}
