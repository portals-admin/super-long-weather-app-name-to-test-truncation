import React from 'react';
export function UnitToggle({ unit, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/20 rounded-full p-1">
      <button
        onClick={() => onChange('metric')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
          unit === 'metric' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onChange('imperial')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
          unit === 'imperial' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
        }`}
      >
        °F
      </button>
    </div>
  );
}
