import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false,
  overlay = false 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 40;
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
    }),
    ...(overlay && {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 10,
    }),
  };

  return (
    <Box data-testid="loading-spinner" style={containerStyle}>
      <CircularProgress size={getSize()} />
      {message && (
        <Typography 
          variant="body2" 
          style={{ 
            color: overlay ? 'rgba(255,255,255,0.9)' : 'inherit',
            marginTop: 1 
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
