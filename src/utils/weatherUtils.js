/**
 * OOP Encapsulation:
 * This function hides the temperature conversion logic inside a single reusable unit.
 * Other parts of the app do not need to know how the conversion works—they only pass
 * the input temperature and desired unit, and receive a formatted result back.
 */
export const convertTemp = (celsius, unit) => {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) {
    return '--°';
  }

  if (unit === 'imperial') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }

  return `${Math.round(celsius)}°`;
};

/**
 * Algorithm Concept:
 * This function transforms raw Unix timestamp data into a human-readable local time.
 * It uses timestamp arithmetic by converting seconds to milliseconds and applying the
 * timezone offset so the displayed time matches the weather location instead of the user's local machine.
 */
export const formatTime = (unix, tzOffset = 0) => {
  if (typeof unix !== 'number' || Number.isNaN(unix)) {
    return '--:--';
  }

  const date = new Date((unix + tzOffset) * 1000);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
};

/**
 * Algorithm Concept:
 * This function parses a date string into a Date object, then maps it to a short weekday name.
 * This is a common example of data transformation: converting raw API data into display-friendly UI text.
 */
export const formatDay = (dtStr) => {
  if (!dtStr || typeof dtStr !== 'string') {
    return '';
  }

  const date = new Date(dtStr.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Algorithm Concept:
 * This function uses range mapping to convert a degree measurement into one of the
 * eight main compass directions. It works by dividing the full 360° circle into equal sectors.
 */
export const getWindDir = (deg) => {
  if (typeof deg !== 'number' || Number.isNaN(deg)) {
    return '';
  }

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const normalizedDeg = ((deg % 360) + 360) % 360;
  const index = Math.round(normalizedDeg / 45) % 8;

  return directions[index];
};

/**
 * OOP Encapsulation:
 * This function encapsulates the mapping between weather condition names and emojis.
 * The rest of the app only asks for the emoji by condition name, without needing to know the mapping details.
 */
export const getWeatherEmoji = (main) => {
  const emojiMap = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Snow: '❄️',
  Thunderstorm: '⛈️',
  Drizzle: '🌦️',
  Mist: '🌫️',
  Haze: '🌫️',
  Fog: '🌫️',
  Dust: '🌪️',
  Sand: '🌪️',
  Ash: '🌋',
  Squall: '💨',
  Tornado: '🌪️',

  };

  return emojiMap[main] || '🌈';
};

/**
 * Algorithm Lesson: Grouping forecast data by day with Array.reduce()
 *
 * We receive a forecast list from the weather API. Usually this list contains about 40 readings,
 * spaced every 3 hours over 5 days.
 *
 * Our goal:
 * 1. Group readings by calendar day.
 * 2. For each day, keep only one "best" reading.
 * 3. Define "best" as the reading closest to 12:00 PM (noon), because noon often gives
 *    a good summary of daytime conditions.
 *
 * Why use reduce()?
 * - reduce() is useful when we want to process an array into a single accumulated result.
 * - Instead of creating multiple loops, we iterate once and build an object step by step.
 *
 * How the reduce algorithm works here:
 *
 * Step 1:
 * - Start with an empty object: {}.
 * - This object will store one selected forecast item per day.
 *
 * Step 2:
 * - For each forecast item in the list:
 *   - Read its datetime string, such as "2024-01-15 12:00:00".
 *   - Extract the date portion only: "2024-01-15".
 *   - This date becomes the grouping key.
 *
 * Step 3:
 * - Determine how close the reading's hour is to noon.
 *   - Example:
 *     - 12:00 => distance 0
 *     - 09:00 => distance 3
 *     - 15:00 => distance 3
 * - The smaller the distance, the better the reading for that day.
 *
 * Step 4:
 * - If the day is not yet in the accumulator, store this item immediately.
 *
 * Step 5:
 * - If the day already has a saved item:
 *   - Compare the current item's distance from noon
 *   - With the saved item's distance from noon
 * - Replace the saved item only if the current one is closer to noon.
 *
 * Step 6:
 * - After reduce() finishes, the accumulator object contains one chosen forecast item per day.
 *
 * Step 7:
 * - Convert the object values into an array using Object.values()
 * - Return only the first 5 days, which matches the typical 5-day forecast UI.
 */
export const groupForecastByDay = (list) => {
  if (!Array.isArray(list)) {
    return [];
  }

  const grouped = list.reduce((acc, item) => {
    if (!item || !item.dt_txt) {
      return acc;
    }

    const [datePart, timePart = '00:00:00'] = item.dt_txt.split(' ');
    const hour = parseInt(timePart.split(':')[0], 10);

    if (Number.isNaN(hour)) {
      return acc;
    }

    const currentDistanceFromNoon = Math.abs(hour - 12);

    if (!acc[datePart]) {
      acc[datePart] = item;
      return acc;
    }

    const existingItem = acc[datePart];
    const [, existingTimePart = '00:00:00'] = existingItem.dt_txt.split(' ');
    const existingHour = parseInt(existingTimePart.split(':')[0], 10);
    const existingDistanceFromNoon = Math.abs(existingHour - 12);

    if (currentDistanceFromNoon < existingDistanceFromNoon) {
      acc[datePart] = item;
    }

    return acc;
  }, {});

  return Object.values(grouped).slice(0, 5);
};