import React from 'react';
import { WeatherIcon } from './WeatherIcon';

export function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
      <h3 className="text-white/80 text-sm font-semibold mb-3 uppercase tracking-wide">5-Day Forecast</h3>
      <div className="space-y-2">
        {forecast.map((day) => (
          <div
            key={day.dt}
            className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2"
          >
            <span className="text-white text-sm w-24">{day.date}</span>
            <div className="flex items-center gap-1">
              <WeatherIcon icon={day.icon} description={day.description} size="sm" />
              <span className="text-white/70 text-xs capitalize hidden sm:block w-20">{day.description}</span>
            </div>
            <div className="text-right">
              <span className="text-white font-semibold text-sm">{day.tempMax}°</span>
              <span className="text-white/50 text-sm ml-1">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
