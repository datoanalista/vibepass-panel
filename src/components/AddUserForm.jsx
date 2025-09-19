"use client";
import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Container
} from '@mui/material';

const AddUserForm = ({ 
  userFormData, 
  handleUserFormChange, 
  createUser, 
  createUserLoading, 
  onCancel,
  isEditing = false
}) => {
  // Función para generar contraseña automáticamente basada en el RUT
  const generatePasswordFromRUT = (rut) => {
    if (!rut) return '';
    // Remover puntos y guión del RUT
    const cleanRUT = rut.replace(/[.-]/g, '');
    // Tomar los primeros 6 dígitos
    return cleanRUT.substring(0, 6);
  };

  // Función para manejar cambios en el RUT y generar contraseña automáticamente
  const handleRUTChange = (value) => {
    handleUserFormChange('rutOId', value);
    // Generar contraseña automáticamente
    const password = generatePasswordFromRUT(value);
    handleUserFormChange('password', password);
  };

  // Establecer rol como "Validador" por defecto al montar el componente
  useEffect(() => {
    if (!isEditing && userFormData.rol !== 'Validador') {
      handleUserFormChange('rol', 'Validador');
    }
  }, [isEditing, userFormData.rol, handleUserFormChange]);
  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '14px' }}>
            Completa la información para crear un nuevo validador
          </Typography>
        </Box>

        <Box>
          {/* Pestaña */}
          <Box sx={{ 
            bgcolor: '#374151',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: '12px 12px 0 0',
            width: '30%',
            zIndex: 0,
            position: 'relative'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white !important',
                fontSize: '1rem',
                fontWeight: '700 !important',
                fontFamily: 'inherit',
                m: 0
              }}
            >
              {isEditing ? 'Editar Usuario' : 'Datos del Validador'}
            </Typography>
          </Box>
          
          {/* Cuerpo del card */}
          <Card elevation={3} sx={{ 
            bgcolor: '#D9D9D9',
            borderRadius: '0 12px 12px 12px',
            mt: -1,
            position: 'relative',
            zIndex: 1
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Nombre completo del validador */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Nombre completo del validador
                  </Typography>
                  <TextField
                    fullWidth
                    value={userFormData.nombreCompleto}
                    onChange={(e) => handleUserFormChange('nombreCompleto', e.target.value)}
                    placeholder="Juan Pérez"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover': {
                          boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                          border: '2px solid #2E7CE4'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Correo electrónico */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Correo electrónico
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    value={userFormData.correoElectronico}
                    onChange={(e) => handleUserFormChange('correoElectronico', e.target.value)}
                    placeholder="camila@colegio.cl"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover': {
                          boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                          border: '2px solid #2E7CE4'
                        }
                      }
                    }}
                  />
                </Box>

                {/* RUT */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    RUT
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    value={userFormData.rutOId}
                    onChange={(e) => handleRUTChange(e.target.value)}
                    placeholder="12.345.678-9"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover': {
                          boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                          border: '2px solid #2E7CE4'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Teléfono de contacto */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Teléfono de contacto
                  </Typography>
                  <TextField
                    fullWidth
                    type="tel"
                    value={userFormData.telefonoContacto}
                    onChange={(e) => handleUserFormChange('telefonoContacto', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover': {
                          boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                          border: '2px solid #2E7CE4'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Contraseña generada automáticamente */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Contraseña (generada automáticamente)
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    value={userFormData.password || ''}
                    placeholder="Se generará automáticamente con el RUT"
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#F3F4F6',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#F3F4F6',
                          color: '#6B7280'
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px', mt: 0.5, display: 'block' }}>
                    La contraseña se genera automáticamente con los primeros 6 dígitos del RUT
                  </Typography>
                </Box>

                {/* Rol fijo como Validador - Campo oculto */}
                <Box sx={{ display: 'none' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Rol: Validador
                  </Typography>
                </Box>
              </Stack>
            </CardContent>

            {/* Botones de acción */}
            <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: '0 0 12px 12px' }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ 
                    color: '#6B7280',
                    borderColor: '#E4E8ED',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 3,
                    '&:hover': {
                      borderColor: '#9AA5B1',
                      bgcolor: '#f8f9fa'
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained"
                  onClick={createUser}
                  disabled={createUserLoading}
                  sx={{ 
                    bgcolor: '#3B82F6',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#2563EB'
                    }
                  }}
                >
                  {createUserLoading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear')}
                </Button>
              </Stack>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AddUserForm;
