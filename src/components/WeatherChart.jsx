import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Box, Typography } from '@mui/material';

const WeatherChart = ({ forecastList }) => {
  if (!forecastList || !Array.isArray(forecastList)) return null;

  const chartData = forecastList.slice(0, 8).map((item, index) => ({
    id: index,
    label: item.dt_txt?.slice(11, 16),
    precipitation: Math.round((item.pop || 0) * 100),
    rainVolume: item.rain?.['3h'] || 0,
    snowVolume: item.snow?.['3h'] || 0,
  }));

  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.2)',
        p: 3,
        animation: 'fadeInUp 0.45s ease',
        mb: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Hourly Precipitation
      </Typography>

      <Box sx={{ width: '100%', height: 300, minHeight: 300 }}>
  <ResponsiveContainer width="100%" height={300} minHeight={300}>
          <AreaChart data={chartData}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
            />
            <YAxis
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
              }}
              formatter={(value, name, item) => {
                if (name === 'precipitation') {
                  return [`${value}%`, 'Precipitation chance'];
                }
                if (name === 'rainVolume') {
                  return [`${value} mm`, 'Rain (3h)'];
                }
                if (name === 'snowVolume') {
                  return [`${value} mm`, 'Snow (3h)'];
                }
                return [value, name];
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="precipitation"
              stroke="#7dd3fc"
              fill="rgba(125, 211, 252, 0.35)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WeatherChart;