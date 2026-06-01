import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  convertTemp,
  formatTime,
  getWindDir,
} from '../utils/weatherUtils';

const WeatherCard = ({ data, unit }) => {
  if (!data) return null;

  const description =
    data.weather?.[0]?.description
      ? data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1)
      : '';

  const humidity = data.main?.humidity ?? 0;
  const visibilityKm =
    typeof data.visibility === 'number'
      ? (data.visibility / 1000).toFixed(1)
      : '--';

  const weatherIconCode = data.weather?.[0]?.icon;
  const weatherIconUrl = weatherIconCode
    ? `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
    : '';

  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        animation: 'fadeInUp 0.45s ease',
        mb: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          {/* API key: data.weather[0].icon */}
          {weatherIconUrl && (
            <Box
              component="img"
              src={weatherIconUrl}
              alt={data.weather?.[0]?.description || 'Weather icon'}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.18))',
              }}
            />
          )}

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
              {/* API key: data.name */}
              {data.name}
              {/* API key: data.sys.country */}
              {data.sys?.country ? `, ${data.sys.country}` : ''}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mt: 0.75,
                fontWeight: 500,
              }}
            >
              {/* API key: data.weather[0].description */}
              {description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            className="temperature-value"
            sx={{
              fontSize: '6rem',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {/* API key: data.main.temp */}
            {convertTemp(data.main?.temp, unit)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: '12px',
          }}
        >
          <Box
            className="glass-card"
            sx={{
              p: 2,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              💧 Humidity
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.main.humidity */}
              {humidity}%
            </Typography>
            <Box className="humidity-bar" sx={{ mt: 1 }}>
              <Box
                className="humidity-fill"
                sx={{ width: `${Math.max(0, Math.min(humidity, 100))}%` }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              Relative humidity
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              💨 Wind
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.wind.speed */}
              {data.wind?.speed ?? '--'} m/s
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              {/* API key: data.wind.deg */}
              {getWindDir(data.wind?.deg)}
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              🌡️ Feels Like
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.main.feels_like */}
              {convertTemp(data.main?.feels_like, unit)}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              Perceived temperature
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              👁️ Visibility
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.visibility */}
              {visibilityKm} km
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              Horizontal visibility
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              🌅 Sunrise
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.sys.sunrise + data.timezone */}
              {formatTime(data.sys?.sunrise, data.timezone)}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              Local sunrise
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              🌇 Sunset
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.sys.sunset + data.timezone */}
              {formatTime(data.sys?.sunset, data.timezone)}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              Local sunset
            </Typography>
          </Box>

          <Box className="glass-card" sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', mb: 0.75 }}>
              🧭 Pressure
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
              {/* API key: data.main.pressure */}
              {data.main?.pressure ?? '--'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', mt: 0.75 }}>
              hPa
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;