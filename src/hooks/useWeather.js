import { useState } from 'react';

const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);

    const apiKey = process.env.REACT_APP_WEATHER_KEY;

    let weatherUrl = '';
    let forecastUrl = '';

    if (typeof query === 'string') {
      const city = encodeURIComponent(query.trim());
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    } else if (
      query &&
      typeof query === 'object' &&
      typeof query.lat === 'number' &&
      typeof query.lon === 'number'
    ) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${apiKey}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${query.lat}&lon=${query.lon}&appid=${apiKey}&units=metric`;
    } else {
      setError('Please enter a valid city name or location.');
      setLoading(false);
      return;
    }

    /* JavaScript Foundations: try/catch/finally
       This demonstrates structured error handling.
       - try: runs code that may fail
       - catch: handles failures gracefully
       - finally: runs cleanup logic no matter what happens
       This is important in apps so the UI does not get stuck in a loading state. */
    try {
      /* JavaScript Foundations: Promise.all
         This demonstrates concurrency with promises.
         Instead of waiting for the current weather request and then the forecast request one after another,
         Promise.all starts both requests at the same time, which improves performance. */
      const [weatherResponse, forecastResponse] = await Promise.all([
        /* JavaScript Foundations: async/await
           This demonstrates asynchronous programming in a readable style.
           fetch() returns a Promise, and await pauses inside the async function until the Promise resolves. */
        fetch(weatherUrl),
        /* JavaScript Foundations: async/await
           This is another awaited async operation running as part of Promise.all,
           showing how multiple asynchronous tasks can be coordinated together. */
        fetch(forecastUrl),
      ]);

      if (!weatherResponse.ok) {
        /* JavaScript Foundations: throw
           This demonstrates creating and throwing custom errors manually.
           We throw an Error so execution jumps to catch, allowing one centralized place
           to decide what message should be shown to the user. */
        if (weatherResponse.status === 404) {
          throw new Error('City not found. Try a different spelling.');
        }
        if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Check your .env file.');
        }
        throw new Error('Server error. Please try again.');
      }

      if (!forecastResponse.ok) {
        /* JavaScript Foundations: throw
           This again uses manual error throwing for API response validation.
           Even if the fetch request itself succeeds technically, a non-OK HTTP status still represents an application error. */
        if (forecastResponse.status === 404) {
          throw new Error('City not found. Try a different spelling.');
        }
        if (forecastResponse.status === 401) {
          throw new Error('Invalid API key. Check your .env file.');
        }
        throw new Error('Server error. Please try again.');
      }

      /* JavaScript Foundations: async/await
         response.json() is also asynchronous and returns a Promise.
         await lets us turn the resolved JSON body into usable JavaScript objects. */
      const weatherJson = await weatherResponse.json();

      /* JavaScript Foundations: async/await
         This is the second asynchronous JSON parsing step,
         showing that API responses must often be awaited more than once:
         first for the network response, then for the JSON body. */
      const forecastJson = await forecastResponse.json();

      setWeatherData(weatherJson);
      setForecastData(forecastJson);
      setError(null);
    } catch (err) {
      /* JavaScript Foundations: catch
         This demonstrates centralized error handling.
         Any thrown error from fetch, Promise.all, response checks, or JSON parsing
         will be handled here so the UI can show a friendly message instead of crashing. */
      if (
        err.message === 'City not found. Try a different spelling.' ||
        err.message === 'Invalid API key. Check your .env file.' ||
        err.message === 'Server error. Please try again.'
      ) {
        setError(err.message);
      } else {
        setError('No internet connection. Check your network.');
      }

      setWeatherData(null);
      setForecastData(null);
    } finally {
      /* JavaScript Foundations: finally
         This demonstrates guaranteed cleanup logic.
         No matter whether the request succeeds, fails, or throws an error,
         loading is always reset so the interface remains accurate. */
      setLoading(false);
    }
  };

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
  };
};

export default useWeather;