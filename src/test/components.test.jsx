import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UnitToggle } from '../components/UnitToggle';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastCard } from '../components/ForecastCard';
import { LocationHistory } from '../components/LocationHistory';

const mockWeather = {
  city: 'London',
  country: 'GB',
  temp: 15,
  feelsLike: 14,
  tempMin: 12,
  tempMax: 18,
  humidity: 72,
  pressure: 1013,
  windSpeed: 5.2,
  windDeg: 270,
  visibility: 9,
  description: 'light rain',
  icon: '10d',
  weatherMain: 'Rain',
  sunrise: 1700000000000,
  sunset: 1700040000000,
  timezone: 0,
  updatedAt: Date.now(),
};

const mockForecast = [
  { dt: 1, date: 'Mon, Nov 18', tempMin: 10, tempMax: 16, icon: '01d', description: 'clear sky', humidity: 60, windSpeed: 3 },
  { dt: 2, date: 'Tue, Nov 19', tempMin: 8, tempMax: 14, icon: '02d', description: 'few clouds', humidity: 65, windSpeed: 4 },
];

describe('SearchBar', () => {
  it('renders search input and button', () => {
    render(<SearchBar onSearch={() => {}} loading={false} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('calls onSearch with trimmed query on submit', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  Paris  ' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).toHaveBeenCalledWith('Paris');
  });

  it('does not submit empty query', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('disables input while loading', () => {
    render(<SearchBar onSearch={() => {}} loading={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

describe('ErrorMessage', () => {
  it('renders nothing when no message', () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(<ErrorMessage message="Error" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss error'));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Loading weather data...')).toBeTruthy();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Fetching..." />);
    expect(screen.getByText('Fetching...')).toBeTruthy();
  });
});

describe('UnitToggle', () => {
  it('renders both unit buttons', () => {
    render(<UnitToggle unit="metric" onChange={() => {}} />);
    expect(screen.getByText('°C')).toBeTruthy();
    expect(screen.getByText('°F')).toBeTruthy();
  });

  it('calls onChange when imperial button clicked', () => {
    const onChange = vi.fn();
    render(<UnitToggle unit="metric" onChange={onChange} />);
    fireEvent.click(screen.getByText('°F'));
    expect(onChange).toHaveBeenCalledWith('imperial');
  });

  it('calls onChange when metric button clicked', () => {
    const onChange = vi.fn();
    render(<UnitToggle unit="imperial" onChange={onChange} />);
    fireEvent.click(screen.getByText('°C'));
    expect(onChange).toHaveBeenCalledWith('metric');
  });
});

describe('WeatherCard', () => {
  it('renders city name and country', () => {
    render(<WeatherCard weather={mockWeather} onToggleFavorite={() => {}} isFavorite={false} />);
    expect(screen.getByText('London')).toBeTruthy();
    expect(screen.getByText('GB')).toBeTruthy();
  });

  it('renders temperature', () => {
    render(<WeatherCard weather={mockWeather} onToggleFavorite={() => {}} isFavorite={false} />);
    expect(screen.getByText('15°')).toBeTruthy();
  });

  it('shows favorite star button', () => {
    const toggle = vi.fn();
    render(<WeatherCard weather={mockWeather} onToggleFavorite={toggle} isFavorite={false} />);
    const btn = screen.getByLabelText('Add to favorites');
    fireEvent.click(btn);
    expect(toggle).toHaveBeenCalled();
  });

  it('shows filled star when favorited', () => {
    render(<WeatherCard weather={mockWeather} onToggleFavorite={() => {}} isFavorite={true} />);
    expect(screen.getByLabelText('Remove from favorites')).toBeTruthy();
  });
});

describe('ForecastCard', () => {
  it('renders nothing when no forecast', () => {
    const { container } = render(<ForecastCard forecast={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders forecast days', () => {
    render(<ForecastCard forecast={mockForecast} />);
    expect(screen.getByText('5-Day Forecast')).toBeTruthy();
    expect(screen.getByText('Mon, Nov 18')).toBeTruthy();
    expect(screen.getByText('Tue, Nov 19')).toBeTruthy();
  });

  it('shows high and low temps', () => {
    render(<ForecastCard forecast={mockForecast} />);
    expect(screen.getByText('16°')).toBeTruthy();
    expect(screen.getByText('10°')).toBeTruthy();
  });
});

describe('LocationHistory', () => {
  it('renders nothing when empty', () => {
    const { container } = render(
      <LocationHistory history={[]} favorites={[]} onSelect={() => {}} onRemove={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders history chips', () => {
    render(
      <LocationHistory history={['London, GB', 'Paris, FR']} favorites={[]} onSelect={() => {}} onRemove={() => {}} />
    );
    expect(screen.getByText('London, GB')).toBeTruthy();
    expect(screen.getByText('Paris, FR')).toBeTruthy();
  });

  it('calls onSelect when chip clicked', () => {
    const onSelect = vi.fn();
    render(
      <LocationHistory history={['Tokyo, JP']} favorites={[]} onSelect={onSelect} onRemove={() => {}} />
    );
    fireEvent.click(screen.getByText('Tokyo, JP'));
    expect(onSelect).toHaveBeenCalledWith('Tokyo, JP');
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    render(
      <LocationHistory history={['Berlin, DE']} favorites={[]} onSelect={() => {}} onRemove={onRemove} />
    );
    fireEvent.click(screen.getByLabelText('Remove Berlin, DE'));
    expect(onRemove).toHaveBeenCalledWith('Berlin, DE', false);
  });
});
