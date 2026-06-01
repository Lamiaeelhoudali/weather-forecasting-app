import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        animation: 'fadeInUp 0.45s ease',
      }}
    >
      <CircularProgress
        size={50}
        sx={{ color: '#fff' }}
      />
      <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
        Loading weather...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;