# WeatherNow

A modern React weather forecasting app with real-time weather data, interactive forecast tools, and a dynamic Three.js background that reacts to both weather conditions and the searched city's real solar cycle.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange)
![MUI](https://img.shields.io/badge/MUI-v9-007FFF?logo=mui&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Latest-8884d8)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7)

---

## Description

WeatherNow is a React weather forecasting application that fetches real-time weather data from OpenWeatherMap and presents current conditions, a 5-day forecast, and temperature trends in a polished glassmorphism interface. The app is designed to combine accurate API-driven information with a clean, modern front-end experience suitable for desktop and mobile users.

A major visual feature of the project is the Three.js animated 3D background. It uses real Solar System Scope astronomical textures for the moon and sun, detects day and night accurately for the searched city by comparing OpenWeatherMap sunrise and sunset Unix timestamps against current UTC time, and changes the scene according to the weather condition by rendering rain particles, drifting snow, cloud formations, and thunderstorm lightning.

---

## Features

- Real-time current weather with temperature, humidity, wind speed, visibility, sunrise, and sunset
- Five-day forecast with clickable day cards that expand to show hourly 3-hour interval breakdown
- Celsius and Fahrenheit unit toggle persisted in `localStorage` so preference survives page refresh
- Geolocation button to fetch weather for the user's current GPS coordinates
- Recent search history dropdown showing last 5 unique cities from `localStorage` with clear history option
- Three.js animated background with Solar System Scope moon texture showing real crater detail, solar surface texture, and Milky Way star field photograph
- Weather-reactive Three.js scene with realistic rain line particles, snow sphere drift, cloud group formations, and thunderstorm lightning flash effect
- City-accurate day and night sky that uses the searched city's actual sunrise and sunset Unix timestamps from OpenWeatherMap rather than the user's device clock
- Recharts line chart showing temperature trend over the next 24 hours
- Glassmorphism frosted glass card design with shimmer animation and hover spring lift effect
- Staggered entrance animations using CSS keyframes with sequential delay classes
- Fully responsive layout working on desktop, tablet, and mobile
- Zero console errors or warnings in production

---

## Technologies

| Technology | Version | Purpose | Why Chosen |
|---|---|---|---|
| React | 18 | Component architecture, useState, useEffect, custom hooks | Required by assignment brief as the JavaScript front-end framework |
| OpenWeatherMap API | 2.5 | Real-time weather and 5-day forecast data | Specified in assignment requirements |
| Material UI (MUI) | v9 | UI component library: TextField, Card, IconButton, Alert, CircularProgress | Required styling solution compatible with React demonstrated by professor in class |
| Three.js | r128 | 3D WebGL animated background scene | Professor-suggested optional tool for creative visual enhancement |
| Recharts | latest | Temperature trend line chart | Professor-suggested optional creative feature satisfying Requirement 6 any other creative functionality |
| localStorage Web API | Browser native | Persist unit preference and recent search history | Browser-native JavaScript Web API requiring no additional library |
| Solar System Scope Textures | 2K resolution | Realistic moon, sun, and Milky Way photographic textures | Free astronomy textures used as Three.js texture maps for photorealistic celestial objects |

---

## Prerequisites

Before running the project, make sure you have:

- Node.js version 18 or higher
- Git
- An OpenWeatherMap free account and API key

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_URL
```

### 2. Enter the project folder

```bash
cd weather-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a .env file at the root level

```env
REACT_APP_WEATHER_KEY=your_openweathermap_api_key
```

### 5. Start the development server

```bash
npm start
```

### 6. Open the app in your browser

```
http://localhost:3000
```

---

## How to Get an OpenWeatherMap API Key

1. Register for a free account at https://openweathermap.org
2. Log in and go to the API keys section
3. Copy the default API key or create a new one
4. Paste it into your `.env` file as `REACT_APP_WEATHER_KEY=your_key`
5. Note that new API keys may take up to 2 hours to activate

---

## Project Structure

```
src/
├── components/
│   ├── ErrorMessage.jsx
│   ├── ForecastCard.jsx
│   ├── LoadingSpinner.jsx
│   ├── SearchBar.jsx
│   ├── ThreeBackground.jsx
│   ├── WeatherCard.jsx
│   └── WeatherChart.jsx
├── hooks/
│   └── useWeather.js
├── utils/
│   └── weatherUtils.js
├── styles/
│   └── App.css
└── App.jsx
```

### Folder Overview

**src/components** — Reusable UI and visualization components including search, weather cards, forecast cards, charts, loading and error states, and the Three.js background.

**src/hooks** — Contains the custom `useWeather` hook that handles all API requests and centralizes weather-related state.

**src/utils** — Helper functions for temperature conversion, wind direction formatting, date formatting, and forecast grouping logic.

**src/styles** — Global and component-related CSS including responsive layout, glassmorphism effects, shimmer animation, and entrance animations.

---

## Technical Decisions and Concepts Applied

### Optional chaining operator
The app uses expressions such as `weatherData?.weather?.[0]?.main` to prevent TypeError crashes when components render before API data arrives. React renders immediately on mount before any fetch completes, so defensive property access is necessary to avoid reading nested values from undefined or null.

### Promise.all for simultaneous API requests
`useWeather.js` sends the current weather request and the 5-day forecast request simultaneously using `Promise.all` instead of waiting for one request to finish before starting the other. This reduces total waiting time from the sum of both requests to roughly the duration of the slower request, improving perceived app performance.

### Array.reduce for forecast grouping
The OpenWeatherMap 5-day forecast endpoint returns 40 readings spaced 3 hours apart. The `groupForecastByDay` helper in `weatherUtils.js` uses `Array.reduce` to group these readings by calendar day and select the reading closest to 12:00 noon. This creates 5 daily summary cards based on the most representative daytime forecast point.

### try catch finally pattern
The `fetchWeather` function uses `try`, `catch`, and `finally` so that loading state always resets properly whether the request succeeds or fails. Without `finally`, a failed request could leave the loading spinner visible indefinitely.

### Custom hook encapsulation
All API logic lives inside `useWeather.js`, following the OOP encapsulation principle. UI components do not call `fetch` directly. Instead they only consume the hook's public interface: `weatherData`, `forecastData`, `loading`, `error`, and `fetchWeather`. This improves separation of concerns and makes components easier to maintain and test.

### MeshBasicMaterial over MeshPhongMaterial
In the Three.js scene, `MeshBasicMaterial` is used instead of `MeshPhongMaterial` for the sun and moon because `MeshPhongMaterial` requires light sources to illuminate textures. A `PointLight` placed near a sphere does not illuminate that sphere's own surface texture. `MeshBasicMaterial` renders the texture at full brightness without any lighting calculation, making celestial objects consistently visible.

### TextureLoader callback pattern
`THREE.TextureLoader.load` works asynchronously. Creating a mesh before the texture finishes loading results in a black or untextured object. The code creates and adds the sun and moon meshes inside the texture loader callback so the texture is guaranteed to be available when the material is created.

### City-accurate day and night detection
The Three.js background does not rely on the user's device clock alone. The component receives `sunrise` and `sunset` from OpenWeatherMap as Unix timestamps in UTC seconds. These are compared directly against `Math.floor(Date.now() / 1000)`, which is also UTC seconds. This comparison is timezone-independent and accurately reflects the searched city's solar cycle rather than the user's local time.

### .env file and REACT_APP_ prefix
Because the project uses Create React App conventions, browser-exposed environment variables must begin with `REACT_APP_`. The weather API key is stored as `REACT_APP_WEATHER_KEY` inside the `.env` file. The `.env` file is excluded from version control using `.gitignore` so the private API key is never pushed to GitHub.

---

## API Data Structure Reference

| OpenWeatherMap Field | Meaning |
|---|---|
| `data.main.temp` | Current temperature in Celsius |
| `data.main.feels_like` | Feels-like temperature |
| `data.main.humidity` | Humidity percentage |
| `data.wind.speed` | Wind speed in metres per second |
| `data.wind.deg` | Wind direction in degrees |
| `data.sys.sunrise` | Sunrise time as UTC Unix timestamp |
| `data.sys.sunset` | Sunset time as UTC Unix timestamp |
| `data.timezone` | City timezone offset in seconds from UTC |
| `data.weather[0].main` | Main weather condition string |
| `data.weather[0].icon` | Weather icon code for OpenWeatherMap icon URL |
| `data.visibility` | Visibility distance in metres |

---

## References and Sources

- https://react.dev — Official React documentation for hooks, components, and state management
- https://openweathermap.org/api — OpenWeatherMap API documentation for endpoint structure and JSON response format
- https://openweathermap.org/current — Current weather endpoint documentation
- https://openweathermap.org/forecast5 — 5-day forecast endpoint documentation
- https://mui.com/material-ui — MUI component library documentation for TextField, Card, IconButton, Alert, and all other MUI components used
- https://threejs.org/docs — Three.js documentation for Scene, Camera, Renderer, Geometry, Material, Mesh, PointsMaterial, BufferGeometry, TextureLoader, and animation loop
- https://recharts.org/en-US/api — Recharts documentation for ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, and Legend
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function — MDN reference for async and await syntax
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all — MDN reference for Promise.all simultaneous request pattern
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce — MDN reference for Array.reduce algorithm used in groupForecastByDay
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API — MDN reference for the Fetch API used in useWeather.js
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API — MDN reference for navigator.geolocation used in SearchBar.jsx
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage — MDN reference for localStorage used for unit preference and search history
- https://solarsystemscope.com/textures — Source for the 2K moon surface, solar surface, and Milky Way star field textures used in Three.js
- https://git-scm.com/docs/gitignore — Git documentation for .gitignore file to exclude .env from version control
- https://create-react-app.dev/docs/adding-custom-environment-variables — Documentation for REACT_APP_ prefix requirement for environment variables
- https://render.com/docs/static-sites — Render deployment documentation for build command and publish directory configuration

---

## Deployment

The app is deployed as a static site on Render.

**Build command:** `npm run build`

**Publish directory:** `build`

**Important:** The environment variable `REACT_APP_WEATHER_KEY` must be added in the Render dashboard under Environment so the app can access the OpenWeatherMap API in production.

---

## Links

**GitHub Repository:** YOUR_GITHUB_URL

**Live Demo:** https://weather-forecasting-app-eish.onrender.com