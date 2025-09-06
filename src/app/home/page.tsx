"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Grid
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const HomePage = () => {
  const router = useRouter();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#1E293B',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 0
      }}>
        <Container maxWidth="lg" sx={{ py: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              color: '#F8FAFC', 
              fontWeight: 600
            }}>
              VibePass
            </Typography>
            
            <img 
              src="/vibepass-panel/vibepass.svg" 
              alt="VibePass" 
              style={{ width: 60, height: 60 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', pt: '100px' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {/* Title */}
            <Typography variant="h2" sx={{
              color: '#F8FAFC',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              lineHeight: 1.2
            }}>
              Sistema de Gestión de Eventos
            </Typography>
            
            <Typography variant="h5" sx={{
              color: '#FFFFFF',
              mb: 6,
              maxWidth: '500px',
              mx: 'auto',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.6
            }}>
              Plataforma profesional para la gestión integral de eventos, inventarios y usuarios
            </Typography>

            {/* Options */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap',
              maxWidth: '800px',
              mx: 'auto'
            }}>
              <Card sx={{
                width: { xs: '100%', sm: '300px' },
                maxWidth: '300px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#3B82F6',
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }} onClick={() => router.push('/dashboard')}>
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <DashboardIcon sx={{ fontSize: 32, color: '#60A5FA' }} />
                  </Box>
                  
                  <Typography variant="h5" sx={{
                    color: '#F8FAFC',
                    fontWeight: 600,
                    mb: 2
                  }}>
                    Dashboard
                  </Typography>
                  
                  <Typography variant="body2" sx={{
                    color: '#CBD5E1',
                    mb: 3,
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    Panel que gestiona el inventario, tickets y usuarios por cada evento
                  </Typography>
                  
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: '#3B82F6',
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#2563EB'
                      }
                    }}
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card sx={{
                width: { xs: '100%', sm: '300px' },
                maxWidth: '300px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#10B981',
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }} onClick={() => router.push('/events-overview')}>
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <EventIcon sx={{ fontSize: 32, color: '#34D399' }} />
                  </Box>
                  
                  <Typography variant="h5" sx={{
                    color: '#F8FAFC',
                    fontWeight: 600,
                    mb: 2
                  }}>
                    Eventos
                  </Typography>
                  
                  <Typography variant="body2" sx={{
                    color: '#CBD5E1',
                    mb: 3,
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    Crea y administra cualquier evento
                  </Typography>
                  
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: '#10B981',
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#059669'
                      }
                    }}
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        py: 3
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{
            color: '#94A3B8',
            textAlign: 'center'
          }}>
            © 2024 VibePass. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
