import React from 'react';
export function LocationHistory({ history, favorites, onSelect, onRemove }) {
  if (history.length === 0 && favorites.length === 0) return null;

  return (
    <div className="space-y-3">
      {favorites.length > 0 && (
        <section>
          <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Favorites ★</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((loc) => (
              <LocationChip key={loc} label={loc} onSelect={() => onSelect(loc)} onRemove={() => onRemove(loc, true)} starred />
            ))}
          </div>
        </section>
      )}
      {history.length > 0 && (
        <section>
          <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Recent</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((loc) => (
              <LocationChip key={loc} label={loc} onSelect={() => onSelect(loc)} onRemove={() => onRemove(loc, false)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function LocationChip({ label, onSelect, onRemove, starred }) {
  return (
    <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-white text-xs transition">
      <button onClick={onSelect} className="flex items-center gap-1">
        {starred && <span>★</span>}
        {label}
      </button>
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="ml-1 text-white/50 hover:text-white transition"
      >
        ×
      </button>
    </div>
  );
}
