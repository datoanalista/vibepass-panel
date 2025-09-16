"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      if (requireAdmin && !isAdmin()) {
        router.push('/home');
        return;
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1B2735'
      }}>
        <CircularProgress sx={{ color: '#01A8E2', marginBottom: 2 }} />
        <Typography sx={{
          color: '#FFF',
          fontFamily: 'Inter',
          fontSize: '14px'
        }}>
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (requireAdmin && !isAdmin()) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
