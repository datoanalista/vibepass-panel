"use client";
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
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
  // Función simple para manejar cambios en el RUT - sin validación
  const handleRUTChange = (value) => {
    handleUserFormChange('rutOId', value);
  };
  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '14px' }}>
            Completa la información y define nivel de acceso en la plataforma
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
              {isEditing ? 'Editar Usuario' : 'Datos del Organizador'}
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
                {/* Nombre completo del usuario */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Nombre completo del usuario
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

                {/* Seleccionar rol */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Seleccionar rol
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={userFormData.rol}
                      onChange={(e) => handleUserFormChange('rol', e.target.value)}
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
                    >
                      <MenuItem value="Administrador">Administrador</MenuItem>
                      <MenuItem value="Organizador">Organizador</MenuItem>
                      <MenuItem value="Validador">Validador</MenuItem>
                      <MenuItem value="Comprador">Comprador</MenuItem>
                    </Select>
                  </FormControl>
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
