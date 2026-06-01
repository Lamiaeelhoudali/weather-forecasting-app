import React from 'react';
import { Alert, Button, Box } from '@mui/material';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box
      sx={{
        mb: 3,
        animation: 'fadeInUp 0.45s ease',
      }}
    >
      <Alert
        severity="error"
        sx={{
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#fff',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
          alignItems: 'center',
          '& .MuiAlert-icon': {
            color: '#fff',
          },
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        action={
          <Button
            onClick={onRetry}
            color="inherit"
            size="small"
            sx={{ color: '#fff' }}
          >
            Try Again
          </Button>
        }
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;