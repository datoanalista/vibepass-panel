'use client';

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Tema simplificado - los estilos están en mui-override.css
const figmaTheme = createTheme({
  palette: {
    primary: {
      main: '#2E7CE4',
      light: '#4A90E2',
      dark: '#1565C0',
    },
    secondary: {
      main: '#28C76F',
    },
    success: {
      main: '#28C76F',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#374151',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  return (
    <ThemeProvider theme={figmaTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
