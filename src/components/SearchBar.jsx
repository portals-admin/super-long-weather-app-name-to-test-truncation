import React from 'react';
import { useState, useRef, useEffect } from 'react';

export function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setQuery('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g. London, Tokyo)..."
          aria-label="Search for a city"
          className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/70 focus:bg-white/30 transition text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          aria-label="Search"
          className="px-5 py-3 rounded-xl bg-white/30 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition border border-white/30 text-sm"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          ) : (
            '🔍'
          )}
        </button>
      </div>
    </form>
  );
}
