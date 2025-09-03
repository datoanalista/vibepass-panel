'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore as BackIcon
} from '@mui/icons-material';
import Header from '../../Header';


const DatosOrganizador = ({ 
  eventFormData, 
  handleFormChange,
  handleCloseForm, 
  handlePrevStep,
  isStep5Valid,
  generateEventJSON,
  createEvent,
  createEventState,
  closeSuccessModal,
  resetCreateEventError
}) => {
  const router = useRouter();
  const steps = ['Información General', 'Configuración de Entradas', 'Alimentos y bebestibles', 'Actividades', 'Datos del Organizador'];

  // Función para manejar éxito y navegación
  const handleSuccessAndNavigate = () => {
    closeSuccessModal();
    router.push('/events-overview');
  };

  return (
    <>
      <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh' }}>
        {/* Header */}
        <Header />
        
        <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>
              Crear Nuevo Evento
            </Typography>
            <IconButton onClick={handleCloseForm} sx={{ color: '#6B7280' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Stepper */}
          <Stepper activeStep={4} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={index < 4}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Main Card */}
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
              Datos del Organizador
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
              {/* Nombre del organizador */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Nombre del organizador *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.nombreOrganizador}
                  onChange={(e) => handleFormChange('nombreOrganizador', e.target.value)}
                  placeholder="Juan Pérez"
                  variant="outlined"
                  required
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
                  Correo electrónico *
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={eventFormData.correoElectronico}
                  onChange={(e) => handleFormChange('correoElectronico', e.target.value)}
                  placeholder="juan.perez@colegio.cl"
                  variant="outlined"
                  required
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
                  Teléfono de contacto *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.telefonoContacto}
                  onChange={(e) => handleFormChange('telefonoContacto', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  variant="outlined"
                  required
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

              {/* Nombre de la empresa o colegio */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Nombre de la Empresa o Colegio *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.nombreEmpresaColegio}
                  onChange={(e) => handleFormChange('nombreEmpresaColegio', e.target.value)}
                  placeholder="Colegio San Patricio"
                  variant="outlined"
                  required
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

              {/* RUT de la empresa */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  RUT de la Empresa *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.rutEmpresa}
                  onChange={(e) => handleFormChange('rutEmpresa', e.target.value)}
                  placeholder="77.012.456-1"
                  variant="outlined"
                  required
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

              {/* Divider */}
              <Divider sx={{ my: 2 }} />

              {/* Opción del evento */}
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#374151' }}>
                  Opción del evento
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: '#6B7280' }}>
                    ¿Se permite devolución?
                  </Typography>
                  
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant={eventFormData.permiteDevolucion === true ? "contained" : "outlined"}
                      onClick={() => handleFormChange('permiteDevolucion', true)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '14px',
                        px: 3,
                        ...(eventFormData.permiteDevolucion === true ? {
                          background: 'linear-gradient(135deg, #28C76F 0%, #48DA89 100%)',
                          color: 'white',
                          border: 'none',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #20A85A 0%, #3BC470 100%)',
                          }
                        } : {
                          borderColor: '#D1D5DB',
                          backgroundColor: '#FFFFFF',
                          color: '#6B7280',
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            backgroundColor: '#F9FAFB'
                          }
                        })
                      }}
                    >
                      Sí
                    </Button>
                    
                    <Button
                      variant={eventFormData.permiteDevolucion === false ? "contained" : "outlined"}
                      onClick={() => handleFormChange('permiteDevolucion', false)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '14px',
                        px: 3,
                        ...(eventFormData.permiteDevolucion === false ? {
                          background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                          color: 'white',
                          border: 'none',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                          }
                        } : {
                          borderColor: '#D1D5DB',
                          backgroundColor: '#FFFFFF',
                          color: '#6B7280',
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            backgroundColor: '#F9FAFB'
                          }
                        })
                      }}
                    >
                      No
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </CardContent>

          {/* Footer Actions */}
          <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: '0 0 12px 12px' }}>
            <Stack direction="row" justifyContent="space-between">
              <Button 
                onClick={handlePrevStep}
                variant="outlined"
                startIcon={<BackIcon />}
                sx={{ 
                  color: '#6B7280',
                  borderColor: '#E4E8ED',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    borderColor: '#9AA5B1',
                    bgcolor: '#f8f9fa'
                  }
                }}
              >
                Anterior
              </Button>
              <Button 
                onClick={createEvent}
                disabled={!isStep5Valid || createEventState.loading}
                variant="contained"
                size="large"
                color="success"
                sx={{ 
                  px: 4,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px'
                }}
                startIcon={createEventState.loading && <CircularProgress size={20} color="inherit" />}
              >
                {createEventState.loading ? 'Creando Evento...' : 'Crear Evento'}
              </Button>
            </Stack>
          </Box>
          </Card>
        </Box>
      </Box>
    </Box>

      {/* Modal de Éxito */}
      <Dialog
        open={createEventState.showSuccessModal}
        onClose={handleSuccessAndNavigate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main', fontWeight: 600 }}>
          🎉 ¡Evento creado exitosamente!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            El evento "{eventFormData.nombreEvento}" ha sido creado correctamente.
            Serás redirigido a la vista principal de eventos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleSuccessAndNavigate}
            variant="contained"
            color="success"
            size="large"
            sx={{
              px: 4,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Error (opcional) */}
      {createEventState.error && (
        <Dialog
          open={!!createEventState.error}
          onClose={resetCreateEventError}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', color: 'error.main', fontWeight: 600 }}>
            ❌ Error al crear evento
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
              {createEventState.error}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              onClick={resetCreateEventError}
              variant="outlined"
              color="error"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default memo(DatosOrganizador);
