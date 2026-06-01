import React, { useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import {
  groupForecastByDay,
  convertTemp,
  formatDay,
  formatTime,
} from '../utils/weatherUtils';

const ForecastCard = ({ forecastList, unit }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  if (!forecastList || !Array.isArray(forecastList) || forecastList.length === 0) {
    return null;
  }

  const dailyForecast = groupForecastByDay(forecastList);

  const selectedDayItems = selectedDay
    ? forecastList.filter((item) => item.dt_txt?.slice(0, 10) === selectedDay)
    : [];

  const selectedDayLabel =
    selectedDayItems.length > 0
      ? new Date(selectedDayItems[0].dt_txt.replace(' ', 'T')).toLocaleDateString(
          'en-US',
          {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }
        )
      : '';

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          fontWeight: 700,
          mb: 2,
        }}
      >
        5-Day Forecast
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          pb: 1,
          scrollbarWidth: 'thin',
        }}
      >
        {dailyForecast.map((item) => {
          const itemDate = item.dt_txt?.slice(0, 10);
          const isSelected = selectedDay === itemDate;

          return (
            <Paper
              key={item.dt_txt}
              className="forecast-day-card"
              onClick={() => setSelectedDay(itemDate)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDay(itemDate);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Show hourly forecast for ${formatDay(item.dt_txt)}`}
              sx={{
                background: isSelected
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '16px',
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                minWidth: '100px',
                color: '#fff',
                border: isSelected
                  ? '1px solid rgba(255,255,255,0.5)'
                  : '1px solid rgba(255,255,255,0.12)',
                transition: 'all 0.25s ease',
                flexShrink: 0,
                outline: 'none',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                {formatDay(item.dt_txt)}
              </Typography>

              <Box
                component="img"
                src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}@2x.png`}
                alt={item.weather?.[0]?.description || 'Forecast icon'}
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: 'contain',
                  display: 'block',
                  mx: 'auto',
                  mb: 1,
                }}
              />

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {convertTemp(item.main?.temp_max, unit)}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {convertTemp(item.main?.temp_min, unit)}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {selectedDay && (
        <Box className="animate-2" sx={{ mt: 2 }}>
          <Divider
            sx={{
              borderColor: 'rgba(255,255,255,0.18)',
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 700,
              mb: 2,
            }}
          >
            {selectedDayLabel}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              pb: 1,
              scrollbarWidth: 'thin',
            }}
          >
            {selectedDayItems.map((item) => (
              <Paper
                key={item.dt_txt}
                sx={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  p: 1.5,
                  textAlign: 'center',
                  minWidth: '80px',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.75)',
                    mb: 0.5,
                    fontWeight: 600,
                  }}
                >
                  {item.dt_txt?.slice(11, 16)}
                </Typography>

                <Box
                  component="img"
                  src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}@2x.png`}
                  alt={item.weather?.[0]?.description || 'Hourly forecast icon'}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                    display: 'block',
                    mx: 'auto',
                    mb: 0.5,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {convertTemp(item.main?.temp, unit)}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ForecastCard;