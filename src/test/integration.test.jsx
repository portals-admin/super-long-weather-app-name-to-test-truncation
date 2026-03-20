import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the weather API module
vi.mock('../services/weatherApi', () => ({
  fetchWeatherByCity: vi.fn(),
  fetchWeatherByCoords: vi.fn(),
  fetchForecastByCity: vi.fn(),
  fetchForecastByCoords: vi.fn(),
  WeatherApiError: class WeatherApiError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
    }
  },
}));

import {
  fetchWeatherByCity,
  fetchForecastByCity,
} from '../services/weatherApi';

const mockWeatherResponse = {
  id: 2643743,
  city: 'London',
  country: 'GB',
  lat: 51.5,
  lon: -0.1,
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

const mockForecastResponse = [
  { dt: 1, date: 'Mon, Nov 18', tempMin: 10, tempMax: 16, icon: '01d', description: 'clear sky', humidity: 60, windSpeed: 3 },
];

beforeEach(() => {
  vi.clearAllMocks();
  // Clear localStorage between tests
  window.localStorage.clear();
});

describe('App integration', () => {
  it('renders search bar and header', () => {
    render(<App />);
    expect(screen.getByText('🌤️ Weather')).toBeTruthy();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('shows empty state on first load', () => {
    render(<App />);
    expect(screen.getByText(/Search for a city/)).toBeTruthy();
  });

  it('shows loading state while fetching', async () => {
    fetchWeatherByCity.mockImplementation(() => new Promise(() => {}));
    fetchForecastByCity.mockImplementation(() => new Promise(() => {}));

    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(screen.getByRole('search'));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeTruthy();
    });
  });

  it('displays weather data after successful fetch', async () => {
    fetchWeatherByCity.mockResolvedValue(mockWeatherResponse);
    fetchForecastByCity.mockResolvedValue(mockForecastResponse);

    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(screen.getByRole('search'));

    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toBeTruthy();
    });

    expect(screen.getByText('London')).toBeTruthy();
    expect(screen.getByText('15°')).toBeTruthy();
  });

  it('displays error on API failure', async () => {
    fetchWeatherByCity.mockRejectedValue(new Error('Location not found'));
    fetchForecastByCity.mockRejectedValue(new Error('Location not found'));

    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'xyzzy' } });
    fireEvent.submit(screen.getByRole('search'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });
  });

  it('adds city to location history after successful search', async () => {
    fetchWeatherByCity.mockResolvedValue(mockWeatherResponse);
    fetchForecastByCity.mockResolvedValue(mockForecastResponse);

    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(screen.getByRole('search'));

    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toBeTruthy();
    });

    // Go back to search
    fireEvent.click(screen.getByText('← Search another location'));

    // History should show London
    await waitFor(() => {
      expect(screen.getByText('London, GB')).toBeTruthy();
    });
  });

  it('can toggle favorite from weather card', async () => {
    fetchWeatherByCity.mockResolvedValue(mockWeatherResponse);
    fetchForecastByCity.mockResolvedValue(mockForecastResponse);

    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(screen.getByRole('search'));

    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toBeTruthy();
    });

    const favBtn = screen.getByLabelText('Add to favorites');
    fireEvent.click(favBtn);
    expect(screen.getByLabelText('Remove from favorites')).toBeTruthy();
  });

  it('shows unit toggle', () => {
    render(<App />);
    expect(screen.getByText('°C')).toBeTruthy();
    expect(screen.getByText('°F')).toBeTruthy();
  });
});
