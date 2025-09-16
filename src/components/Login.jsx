"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import Image from 'next/image';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Register from './Register';
import ErrorModal from './ErrorModal';
import API_CONFIG from '../config/api';

const Login = () => {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'same-origin'
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        let token, user;
        
        if (data.status === 'success' && data.data) {
          token = data.data.token;
          user = data.data.user;
        } else if (data.token && data.user) {
          token = data.token;
          user = data.user;
        } else if (data.success && data.token) {
          token = data.token;
          user = data.user || data.data;
        } else {
          setError('Error en la respuesta del servidor');
          return;
        }
        
        if (token && user) {
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('userData', JSON.stringify(user));
          router.push('/home');
        } else {
          setError('Datos de autenticación incompletos');
        }
      } else {
        setError(data.message || data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Timeout: El servidor tardó demasiado en responder.');
      } else if (error.message.includes('fetch')) {
        setError('Error de conexión: No se puede conectar al servidor.');
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#1B2735',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '30px'
    }}>
      {/* Logo centrado arriba */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image 
          src="/logo_icon_vibepass.png" 
          alt="Vibepass" 
          width={120} 
          height={120}
          priority
        />
      </Box>

      {/* Formulario de Login */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '400px',
          height: '75vh',
          margin: '0 auto',
          padding: '40px',
          borderRadius: '10px',
          background: '#D9D9D9CC',
          boxShadow: '0px 4px 4px 0px #00000040',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Header */}
        <Box>
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000',
            marginBottom: '8px'
          }}>
            ¡Bienvenido a Vibepass Dashboard!
          </Typography>
          
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000',
            marginBottom: '30px'
          }}>
            Aquí podrás organizar tu propio evento!
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box>
            <Typography sx={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              color: '#000',
              marginBottom: '8px'
            }}>
              Correo
            </Typography>
            <TextField
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="juan@gmail.com"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '& input': {
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    padding: '12px 14px'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography sx={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              color: '#000',
              marginBottom: '8px'
            }}>
              Contraseña
            </Typography>
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '& input': {
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    padding: '12px 14px'
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
            <Link
              href="#"
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '11px',
                lineHeight: '100%',
                color: '#000',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{
                  width: 25,
                  height: 25,
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  boxShadow: '0px 4px 4px 0px #00000040',
                  '&.Mui-checked': {
                    backgroundColor: 'transparent',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: 'transparent',
                    outline: 'none',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  }
                }}
              />
            }
            label={
              <Typography sx={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '11px',
                lineHeight: '100%',
                color: '#000',
                marginLeft: '8px'
              }}>
                Recordar cuenta
              </Typography>
            }
          />
        </Box>

        {/* Footer */}
        <Box>
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            sx={{
              width: '50%',
              margin: '0 auto',
              display: 'block',
              background: 'linear-gradient(90deg, #01A8E2 0%, #99B7DB 100%)',
              boxShadow: '0px 4px 4px 0px #00000040',
              borderRadius: '100px',
              padding: '12px 0',
              marginBottom: '20px',
              '&:hover': {
                background: 'linear-gradient(90deg, #0191C7 0%, #8AA5C9 100%)',
              },
              '&:disabled': {
                opacity: 0.7
              }
            }}
          >
            <Typography sx={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '13px',
              lineHeight: '100%',
              textAlign: 'center',
              color: '#FFF',
              textTransform: 'none'
            }}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Typography>
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography component="span" sx={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              color: '#000'
            }}>
              ¿No tienes cuenta?{' '}
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => setShowRegister(true)}
              sx={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '100%',
                color: '#000',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Crear Cuenta Organizador
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Modal de Error */}
      <ErrorModal
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </Box>
  );
};

export default Login;
