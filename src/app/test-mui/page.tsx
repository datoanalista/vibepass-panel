'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardHeader, 
  CardContent,
  Stack
} from '@mui/material';

export default function TestMUI() {
  return (
    <Box 
      sx={{ 
        bgcolor: '#F5F7FA', 
        minHeight: '100vh', 
        p: 3,
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{
          fontSize: '24px !important',
          fontWeight: '600 !important', 
          color: '#374151 !important',
          mb: 3
        }}
      >
        Test MUI Styles
      </Typography>
      
      <Card 
        sx={{ 
          borderRadius: '12px !important',
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08) !important',
          border: '1px solid #F1F3F6 !important',
          maxWidth: 600
        }}
      >
        <CardHeader
          title="Test Card"
          sx={{
            bgcolor: '#2E7CE4 !important',
            color: 'white !important'
          }}
        />
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Test TextField"
              placeholder="Escribir algo aquí"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#ffffff !important',
                  borderRadius: '8px !important',
                  '& fieldset': {
                    borderColor: '#E4E8ED !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9AA5B1 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7CE4 !important',
                    borderWidth: '2px !important',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280 !important',
                  '&.Mui-focused': {
                    color: '#2E7CE4 !important',
                  }
                }
              }}
            />
            
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined"
                sx={{
                  borderRadius: '8px !important',
                  textTransform: 'none !important',
                  fontWeight: 500,
                  fontSize: '14px'
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained"
                sx={{
                  borderRadius: '8px !important',
                  textTransform: 'none !important',
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'linear-gradient(135deg, #2E7CE4 0%, #4A90E2 100%) !important',
                  boxShadow: 'none !important',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565C0 0%, #2E7CE4 100%) !important',
                    boxShadow: '0px 2px 8px rgba(46, 124, 228, 0.15) !important',
                  }
                }}
              >
                Enviar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: '8px' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Si ves este texto con estilos personalizados, MUI está funcionando correctamente:
        </Typography>
        <ul>
          <li>Fondo gris claro (#F5F7FA)</li>
          <li>Título en color gris oscuro (#374151)</li>
          <li>Card con esquinas redondeadas</li>
          <li>Header azul (#2E7CE4)</li>
          <li>TextField con bordes personalizados</li>
          <li>Botón con gradiente azul</li>
        </ul>
      </Box>
    </Box>
  );
}

