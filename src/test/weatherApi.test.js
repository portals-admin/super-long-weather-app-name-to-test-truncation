import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  transformCurrentWeather,
  transformForecast,
  fetchWeatherByCity,
  fetchWeatherByCoords,
  WeatherApiError,
} from '../services/weatherApi';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        get: vi.fn(),
        defaults: { params: {} },
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      })),
    },
  };
});

const mockWeatherData = {
  id: 2643743,
  name: 'London',
  coord: { lat: 51.5085, lon: -0.1257 },
  sys: { country: 'GB', sunrise: 1700000000, sunset: 1700040000 },
  main: {
    temp: 15.4,
    feels_like: 14.2,
    temp_min: 12.0,
    temp_max: 18.0,
    humidity: 72,
    pressure: 1013,
  },
  wind: { speed: 5.2, deg: 270 },
  weather: [{ description: 'light rain', icon: '10d', main: 'Rain' }],
  visibility: 9000,
  timezone: 0,
};

const mockForecastData = {
  list: Array.from({ length: 10 }, (_, i) => ({
    dt: 1700000000 + i * 10800,
    main: { temp: 15 + i, humidity: 70 },
    weather: [{ description: 'clear sky', icon: '01d' }],
    wind: { speed: 4 },
  })),
};

describe('transformCurrentWeather', () => {
  it('transforms API data into app format', () => {
    const result = transformCurrentWeather(mockWeatherData);
    expect(result.city).toBe('London');
    expect(result.country).toBe('GB');
    expect(result.temp).toBe(15);
    expect(result.humidity).toBe(72);
    expect(result.weatherMain).toBe('Rain');
    expect(result.visibility).toBe(9);
    expect(result.windSpeed).toBe(5.2);
  });

  it('rounds temperature values', () => {
    const result = transformCurrentWeather(mockWeatherData);
    expect(Number.isInteger(result.temp)).toBe(true);
    expect(Number.isInteger(result.feelsLike)).toBe(true);
  });

  it('converts visibility from meters to km', () => {
    const result = transformCurrentWeather(mockWeatherData);
    expect(result.visibility).toBe(9);
  });

  it('handles missing visibility', () => {
    const data = { ...mockWeatherData, visibility: undefined };
    const result = transformCurrentWeather(data);
    expect(result.visibility).toBeNull();
  });

  it('converts sunrise/sunset to milliseconds', () => {
    const result = transformCurrentWeather(mockWeatherData);
    expect(result.sunrise).toBe(mockWeatherData.sys.sunrise * 1000);
    expect(result.sunset).toBe(mockWeatherData.sys.sunset * 1000);
  });
});

describe('transformForecast', () => {
  it('groups forecast items by day', () => {
    const result = transformForecast(mockForecastData);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('includes tempMin and tempMax for each day', () => {
    const result = transformForecast(mockForecastData);
    result.forEach((day) => {
      expect(day).toHaveProperty('tempMin');
      expect(day).toHaveProperty('tempMax');
      expect(day.tempMin).toBeLessThanOrEqual(day.tempMax);
    });
  });

  it('includes date, icon, description for each day', () => {
    const result = transformForecast(mockForecastData);
    result.forEach((day) => {
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('icon');
      expect(day).toHaveProperty('description');
    });
  });
});

describe('WeatherApiError', () => {
  it('creates error with message and code', () => {
    const error = new WeatherApiError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.code).toBe(404);
    expect(error.name).toBe('WeatherApiError');
    expect(error instanceof Error).toBe(true);
  });
});
