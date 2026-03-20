import React from 'react';
export function LoadingSpinner({ message = 'Loading weather data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      <p className="text-white/70 text-sm">{message}</p>
    </div>
  );
}
