import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

const api = axios.create({
  baseURL: BASE_URL,
  params: { appid: API_KEY, units: 'metric' },
  timeout: 10000,
});

const geoApi = axios.create({
  baseURL: GEO_URL,
  params: { appid: API_KEY },
  timeout: 10000,
});

export class WeatherApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
  }
}

function handleApiError(error) {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) throw new WeatherApiError('Invalid API key. Please check your configuration.', 401);
    if (status === 404) throw new WeatherApiError('Location not found. Please try a different search.', 404);
    if (status === 429) throw new WeatherApiError('Too many requests. Please wait a moment.', 429);
    throw new WeatherApiError(data?.message || 'Weather service error.', status);
  }
  if (error.request) throw new WeatherApiError('Network error. Check your connection.', 0);
  throw new WeatherApiError('Unexpected error occurred.', -1);
}

export function transformCurrentWeather(data) {
  return {
    id: data.id,
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    weatherMain: data.weather[0].main,
    sunrise: data.sys.sunrise * 1000,
    sunset: data.sys.sunset * 1000,
    timezone: data.timezone,
    updatedAt: Date.now(),
  };
}

export function transformForecast(data) {
  const dailyMap = new Map();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        dt: item.dt,
        temps: [],
        icons: [],
        descriptions: [],
        humidity: [],
        windSpeed: [],
      });
    }
    const day = dailyMap.get(date);
    day.temps.push(item.main.temp);
    day.icons.push(item.weather[0].icon);
    day.descriptions.push(item.weather[0].description);
    day.humidity.push(item.main.humidity);
    day.windSpeed.push(item.wind.speed);
  });

  return Array.from(dailyMap.values())
    .slice(0, 5)
    .map((day) => ({
      date: day.date,
      dt: day.dt,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      icon: day.icons[Math.floor(day.icons.length / 2)],
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round((day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length) * 10) / 10,
    }));
}

export async function fetchWeatherByCity(city) {
  try {
    const response = await api.get('/weather', { params: { q: city } });
    return transformCurrentWeather(response.data);
  } catch (error) {
    handleApiError(error);
  }
}

export async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await api.get('/weather', { params: { lat, lon } });
    return transformCurrentWeather(response.data);
  } catch (error) {
    handleApiError(error);
  }
}

export async function fetchForecastByCity(city) {
  try {
    const response = await api.get('/forecast', { params: { q: city } });
    return transformForecast(response.data);
  } catch (error) {
    handleApiError(error);
  }
}

export async function fetchForecastByCoords(lat, lon) {
  try {
    const response = await api.get('/forecast', { params: { lat, lon } });
    return transformForecast(response.data);
  } catch (error) {
    handleApiError(error);
  }
}

export async function geocodeLocation(query) {
  try {
    const response = await geoApi.get('/direct', { params: { q: query, limit: 5 } });
    return response.data.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
      label: [item.name, item.state, item.country].filter(Boolean).join(', '),
    }));
  } catch (error) {
    handleApiError(error);
  }
}
