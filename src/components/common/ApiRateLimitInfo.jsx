import React from 'react';
import { Box, Typography, Alert, AlertTitle } from '@mui/material';

export const ApiRateLimitInfo = ({ variant = 'info', showDetails = false }) => {
  const getAlertSeverity = () => {
    switch (variant) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTitle = () => {
    switch (variant) {
      case 'warning':
        return 'Limitation de l\'API CoinGecko';
      case 'error':
        return 'Erreur de limitation de l\'API';
      default:
        return 'Informations sur l\'API';
    }
  };

  const getMessage = () => {
    switch (variant) {
      case 'warning':
        return 'L\'API CoinGecko a des limitations de fréquence. Veuillez patienter quelques secondes.';
      case 'error':
        return 'Limite de requêtes dépassée. Veuillez attendre avant de réessayer.';
      default:
        return 'Les données sont mises à jour toutes les 30 secondes.';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Alert 
      severity={getAlertSeverity()} 
      icon={<span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>}
      sx={{ 
        marginBottom: 2,
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      <AlertTitle>{getTitle()}</AlertTitle>
      <Typography variant="body2" component="div">
        {getMessage()}
      </Typography>
      
      {showDetails && (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
            Limites de l'API CoinGecko :
          </Typography>
          <Typography variant="caption" component="div" sx={{ marginTop: 0.5 }}>
            • Mise à jour toutes les 30 secondes pour tous les plans API
          </Typography>
          <Typography variant="caption" component="div">
            • Données du jour précédent disponibles 10 minutes après minuit UTC
          </Typography>
          <Typography variant="caption" component="div">
            • Retry automatique en cas d'erreur de limitation
          </Typography>
        </Box>
      )}
    </Alert>
  );
};
