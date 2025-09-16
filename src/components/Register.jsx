"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ErrorModal from './ErrorModal';
import API_CONFIG from '../config/api';

const Register = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    rut: '',
    email: '',
    organizacion: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  // Estilos comunes para los campos
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      borderRadius: '12px',
      '& input': {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '14px',
        padding: '12px 16px'
      },
      '&:hover': {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
      },
      '&.Mui-focused': {
        boxShadow: '0px 2px 12px rgba(1,168,226,0.2)'
      }
    }
  };

  const labelStyles = {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '100%',
    color: '#333',
    marginBottom: '8px'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para validar si el formulario está completo
  const isFormValid = () => {
    const { nombreCompleto, rut, email, organizacion, telefono, password, confirmPassword } = formData;
    
    // Verificar que todos los campos estén llenos
    const allFieldsFilled = nombreCompleto && rut && email && organizacion && telefono && password && confirmPassword;
    
    // Verificar que las contraseñas coincidan
    const passwordsMatch = password === confirmPassword;
    
    return allFieldsFilled && passwordsMatch;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Preparar datos para enviar (sin confirmPassword)
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.AUTH_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          nombreCompleto: '',
          rut: '',
          email: '',
          organizacion: '',
          telefono: '',
          password: '',
          confirmPassword: ''
        });
        // Volver al login después de 2 segundos
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Error de registro:', error);
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: '#1B2735',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Box sx={{
          width: '400px',
          padding: '40px',
          borderRadius: '10px',
          background: '#D9D9D9CC',
          boxShadow: '0px 4px 4px 0px #00000040',
          textAlign: 'center'
        }}>
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '100%',
            color: '#000',
            marginBottom: '20px'
          }}>
            ¡Cuenta creada exitosamente!
          </Typography>
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '100%',
            color: '#000'
          }}>
            Redirigiendo al login...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#1B2735',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Botón Volver fuera del formulario */}
      <Box sx={{
        position: 'absolute',
        top: '10px',
        left: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <IconButton
          onClick={onBack}
          sx={{
            padding: '12px',
            color: '#FFF',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Image 
            src="/images/volver_circle.png" 
            alt="Volver" 
            width={24} 
            height={24}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </IconButton>
        <Typography sx={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: '14px',
          color: '#FFF',
          cursor: 'pointer'
        }}
        onClick={onBack}
        >
          Volver a login
        </Typography>
      </Box>

      {/* Icono de la compañía */}

      {/* Formulario de Registro */}
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          width: '100%',
          maxWidth: '900px',
          height: '75vh',
          padding: '30px 60px',
          borderRadius: '20px',
          background: '#D9D9D9CC',
          boxShadow: '0px 8px 32px 0px #00000040',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '0px'
        }}>
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '60px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000',
            marginBottom: '12px'
          }}>
            ¡Bienvenido a vibepass!
          </Typography>
          
          <Typography sx={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#666'
          }}>
            Crea tu cuenta de organizador
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: '20px',
          flex: 1,
          alignItems: 'start',
          paddingBottom: '20px'
        }}>
          <Box>
            <Typography sx={labelStyles}>
              Nombre Completo
            </Typography>
            <TextField
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              placeholder="Juan Pérez González"
              required
              fullWidth
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
              RUT
            </Typography>
            <TextField
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
              placeholder="12.345.678-9"
              required
              fullWidth
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
              Correo Electrónico
            </Typography>
            <TextField
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="juan@empresa.com"
              required
              fullWidth
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
              Organización o Empresa
            </Typography>
            <TextField
              name="organizacion"
              value={formData.organizacion}
              onChange={handleInputChange}
              placeholder="Mi Empresa Ltda."
              required
              fullWidth
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
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
                      size="medium"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
              Teléfono
            </Typography>
            <TextField
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="+56912345678"
              required
              fullWidth
              sx={fieldStyles}
            />
          </Box>

          <Box>
            <Typography sx={labelStyles}>
              Confirmar Contraseña
            </Typography>
            <TextField
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="medium"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={fieldStyles}
            />
        </Box>

          {/* Botón Crear Cuenta alineado con Confirmar Contraseña */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography sx={labelStyles}>
              &nbsp;
            </Typography>
          <Button
            type="submit"
              disabled={loading || !isFormValid()}
            fullWidth
            sx={{
                ...fieldStyles,
              background: 'linear-gradient(90deg, #01A8E2 0%, #99B7DB 100%)',
                boxShadow: '0px 4px 16px 0px #00000020',
                borderRadius: '12px',
                minHeight: '48px',
              '&:hover': {
                background: 'linear-gradient(90deg, #0191C7 0%, #8AA5C9 100%)',
                  boxShadow: '0px 6px 20px 0px #00000030',
                  transform: 'translateY(-2px)'
              },
              '&:disabled': {
                  opacity: 0.7,
                  background: '#ccc'
                },
                transition: 'all 0.3s ease',
                '& .MuiOutlinedInput-root': {
                  border: 'none'
              }
            }}
          >
            <Typography sx={{
              fontFamily: 'Inter',
              fontWeight: 700,
                fontSize: '16px',
              lineHeight: '100%',
              textAlign: 'center',
              color: '#FFF',
              textTransform: 'none'
            }}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Typography>
          </Button>
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

export default Register;
