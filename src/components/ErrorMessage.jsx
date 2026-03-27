import React from 'react';
export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-white text-sm flex items-start justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-white/60 hover:text-white transition flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  );
}
