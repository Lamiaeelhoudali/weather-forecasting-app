import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ThreeBackground from './components/ThreeBackground';
import WeatherChart from './components/WeatherChart';
import useWeather from './hooks/useWeather';
import './styles/App.css';

const App = () => {
  const [searchedCity, setSearchedCity] = useState('');
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather-unit') || 'metric';
  });

  const { weatherData, forecastData, loading, error, fetchWeather } = useWeather();

  const handleSearch = (city) => {
    setSearchedCity(city);
    fetchWeather(city);
  };

  const handleGeoSearch = ({ lat, lon }) => {
    fetchWeather({ lat, lon });
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  useEffect(() => {
    localStorage.setItem('weather-unit', unit);
  }, [unit]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      document.body.className = 'morning';
    } else if (hour >= 12 && hour < 18) {
      document.body.className = 'afternoon';
    } else if (hour >= 18 && hour < 21) {
      document.body.className = 'evening';
    } else {
      document.body.className = 'night';
    }
  }, []);

  useEffect(() => {
    if (weatherData?.weather?.[0]?.main) {
      const condition = weatherData.weather[0].main;
      document.body.classList.add(`weather-${condition}`);
      return () => {
        document.body.classList.remove(`weather-${condition}`);
      };
    }
  }, [weatherData]);

  return (
    <>
      <ThreeBackground
        weatherMain={weatherData?.weather?.[0]?.main}
        timezoneOffset={weatherData?.timezone}
        sunrise={weatherData?.sys?.sunrise}
        sunset={weatherData?.sys?.sunset}
      />
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">WeatherNow</h1>
          <button
            type="button"
            className="unit-btn"
            onClick={toggleUnit}
            aria-label={
              unit === 'metric'
                ? 'Switch temperature unit to Fahrenheit'
                : 'Switch temperature unit to Celsius'
            }
          >
            {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
          </button>
        </header>
        <div className="animate-1">
          <SearchBar
            onSearch={handleSearch}
            onGeoSearch={handleGeoSearch}
            loading={loading}
          />
        </div>
        <div aria-live="polite" aria-atomic="true">
          {loading && <LoadingSpinner />}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {error && !loading && (
            <div className="animate-2">
              <ErrorMessage
                message={error}
                onRetry={() => {
                  if (searchedCity) fetchWeather(searchedCity);
                }}
              />
            </div>
          )}
        </div>
        {weatherData && !loading && !error && (
          <div className="animate-2">
            <WeatherCard data={weatherData} unit={unit} />
          </div>
        )}
        {forecastData && !loading && !error && (
          <div className="animate-3">
            <ForecastCard forecastList={forecastData.list} unit={unit} />
          </div>
        )}
        {forecastData && !loading && !error && (
          <div className="animate-4">
            <WeatherChart forecastList={forecastData.list} unit={unit} />
          </div>
        )}
      </div>
    </>
  );
};

export default App;