'use client';

import React, { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Stack,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Header from '../../Header';


const Actividades = ({ 
  eventFormData, 
  addActividad,
  updateActividad,
  deleteActividad,
  handleCloseForm, 
  handleNextStep,
  handlePrevStep,
  isStep4Valid,
  uploadActivityImage,
  uploadStates,
  canSaveDraft,
  saveAsDraft,
  draftSaveState
}) => {
  const router = useRouter();
  
  // Función para volver al panel de eventos
  const handleBackToEvents = () => {
    router.push('/events-overview');
  };
  // Registrar y configurar la localización en español
  registerLocale('es', es);
  setDefaultLocale('es');

  // Helper function para formatear números con puntos de miles
  const formatNumberWithThousands = (value) => {
    if (!value) return '';
    // Remover puntos existentes y formatear
    const cleanValue = value.toString().replace(/\./g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Helper function para limpiar números (remover puntos)
  const cleanNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\./g, '');
  };

  const handleFileChange = (actividadId, file) => {
    if (file) {
      // Subir inmediatamente a Cloudinary
      uploadActivityImage(actividadId, file);
    }
  };

  const steps = ['Información General', 'Configuración de Entradas', 'Alimentos y bebestibles', 'Actividades', 'Datos del Organizador'];

  return (
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
            <Tooltip title="Volver al panel de Eventos" arrow>
              <Button
                onClick={handleBackToEvents}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#6B7280',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    bgcolor: '#F9FAFB',
                    cursor: 'pointer'
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 2,
                  py: 1
                }}
              >
                Volver al panel de Eventos
              </Button>
            </Tooltip>
          </Stack>
          
          {/* Stepper */}
          <Stepper activeStep={3} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={index < 3}>
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
              Actividades
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
            {eventFormData.actividades.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  No hay actividades configuradas
                </Typography>
                <Button
                  onClick={addActividad}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ 
                    bgcolor: '#D9D9D9',
                    color: '#374151',
                    border: '1px solid #A3A3A3',
                    px: 3,
                    py: 1.5,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    '&:hover': {
                      bgcolor: '#C9C9C9',
                      borderColor: '#939393'
                    }
                  }}
                >
                  Agregar nueva entrada
                </Button>
              </Box>
            ) : (
              <Stack spacing={3}>
                {eventFormData.actividades.map((actividad) => (
                  <Paper key={actividad.id} elevation={1} sx={{ p: 3, bgcolor: '#D9D9D9', borderRadius: '10px' }}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
                      <IconButton 
                        onClick={() => deleteActividad(actividad.id)}
                        sx={{ color: '#d32f2f' }}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                    
                    {/* Primera fila: Nombre, Precio, Cupos, Hora inicio, Hora término */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 3 }}>
                      <Box sx={{ width: '28%' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Nombre de la actividad
                        </Typography>
                        <TextField
                          fullWidth
                          value={actividad.nombreActividad}
                          onChange={(e) => updateActividad(actividad.id, 'nombreActividad', e.target.value)}
                          placeholder="Toro mecánico"
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
                      
                      <Box sx={{ display: 'flex', gap: 2, width: '67%', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '18%' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                            Precio unitario (CLP)
                          </Typography>
                          <TextField
                            fullWidth
                            value={formatNumberWithThousands(actividad.precioUnitario)}
                            onChange={(e) => {
                              const cleanValue = cleanNumber(e.target.value);
                              updateActividad(actividad.id, 'precioUnitario', cleanValue);
                            }}
                            placeholder="3.000"
                            InputProps={{
                              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                            }}
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
                        
                        <Box sx={{ width: '28%' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                            Cupos Disponibles
                          </Typography>
                          <TextField
                            fullWidth
                            value={formatNumberWithThousands(actividad.cuposDisponibles)}
                            onChange={(e) => {
                              const cleanValue = cleanNumber(e.target.value);
                              updateActividad(actividad.id, 'cuposDisponibles', cleanValue);
                            }}
                            placeholder="100"
                            InputProps={{
                              endAdornment: <Typography sx={{ ml: 1, color: '#666' }}>unidades</Typography>
                            }}
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
                        
                        <Box sx={{ width: '18%' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                            Hora inicio
                          </Typography>
                          <DatePicker
                            selected={actividad.horaInicio ? new Date(`2024-01-01 ${actividad.horaInicio}`) : null}
                            onChange={(date) => {
                              const formattedTime = date ? dayjs(date).format('HH:mm') : '';
                              updateActividad(actividad.id, 'horaInicio', formattedTime);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Hora"
                            dateFormat="HH:mm"
                            placeholderText="Ingrese hora"
                            className="custom-timepicker"
                            locale="es"
                            customInput={
                              <input
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '10px',
                                  backgroundColor: '#FFFFFF',
                                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                  border: 'none',
                                  fontSize: '14px',
                                  color: '#374151',
                                  cursor: 'pointer'
                                }}
                                placeholder="Ingrese hora"
                              />
                            }
                          />
                        </Box>
                        
                        <Box sx={{ width: '18%' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                            Hora término
                          </Typography>
                          <DatePicker
                            selected={actividad.horaTermino ? new Date(`2024-01-01 ${actividad.horaTermino}`) : null}
                            onChange={(date) => {
                              const formattedTime = date ? dayjs(date).format('HH:mm') : '';
                              updateActividad(actividad.id, 'horaTermino', formattedTime);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Hora"
                            dateFormat="HH:mm"
                            placeholderText="Ingrese hora"
                            className="custom-timepicker"
                            locale="es"
                            customInput={
                              <input
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  borderRadius: '10px',
                                  backgroundColor: '#FFFFFF',
                                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                  border: 'none',
                                  fontSize: '14px',
                                  color: '#374151',
                                  cursor: 'pointer'
                                }}
                                placeholder="Ingrese hora"
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Segunda fila: Descripción */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                        Descripción
                      </Typography>
                      <TextField
                        fullWidth
                        value={actividad.descripcion}
                        onChange={(e) => updateActividad(actividad.id, 'descripcion', e.target.value)}
                        placeholder="1 intento por persona"
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
                          },
                          '& .MuiInputLabel-root': {
                            color: '#374151',
                            fontWeight: 500,
                            fontSize: '14px'
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Tercera fila: Imagen promocional */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                        Imagen promocional
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(actividad.id, e.target.files[0])}
                        style={{ display: 'none' }}
                        id={`actividad-image-${actividad.id}`}
                        disabled={uploadStates.actividades[actividad.id]?.loading}
                      />
                      <Stack spacing={1}>
                        {uploadStates.actividades[actividad.id]?.loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                            <CircularProgress size={24} />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              Subiendo...
                            </Typography>
                          </Box>
                        ) : uploadStates.actividades[actividad.id]?.success ? (
                          <Box>
                            {actividad.imagenPromocionalUrl && (
                              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                <img 
                                  src={actividad.imagenPromocionalUrl} 
                                  alt={`Imagen de ${actividad.nombre}`} 
                                  style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '120px', 
                                    width: 'auto',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    objectFit: 'contain',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                  }} 
                                />
                              </Box>
                            )}
                            <Button
                              variant="outlined"
                              startIcon={<CheckIcon />}
                              size="small"
                              fullWidth
                              color="success"
                              onClick={() => document.getElementById(`actividad-image-${actividad.id}`).click()}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '12px',
                              }}
                            >
                              Subida exitosa
                            </Button>
                            {actividad.imagenPromocional && (
                              <Chip 
                                label={actividad.imagenPromocional.name}
                                size="small"
                                color="success"
                                sx={{ fontSize: '0.75rem', mt: 0.5 }}
                              />
                            )}
                          </Box>
                        ) : uploadStates.actividades[actividad.id]?.error ? (
                          <Box>
                            <Button
                              variant="outlined"
                              startIcon={<ErrorIcon />}
                              size="small"
                              fullWidth
                              color="error"
                              onClick={() => document.getElementById(`actividad-image-${actividad.id}`).click()}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '12px',
                              }}
                            >
                              Error - Reintentar
                            </Button>
                            <Typography variant="caption" sx={{ display: 'block', color: 'error.main', fontSize: '0.7rem', mt: 0.5 }}>
                              {uploadStates.actividades[actividad.id].error}
                            </Typography>
                          </Box>
                        ) : (
                          <label htmlFor={`actividad-image-${actividad.id}`}>
                            <Paper
                              component="span"
                              sx={{
                                width: '100%',
                                height: '120px',
                                border: '2px dashed #D1D5DB',
                                borderRadius: '10px',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  borderColor: '#2E7CE4',
                                  backgroundColor: '#F8FAFC'
                                }
                              }}
                            >
                              <UploadIcon sx={{ fontSize: 40, color: '#9CA3AF', mb: 1 }} />
                              <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '14px' }}>
                                (Adjuntar archivo)
                              </Typography>
                            </Paper>
                          </label>
                        )}
                      </Stack>
                    </Box>
                    

                  </Paper>
                ))}
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    onClick={addActividad}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ 
                      bgcolor: '#D9D9D9',
                      color: '#374151',
                      border: '1px solid #A3A3A3',
                      px: 3,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '14px',
                      '&:hover': {
                        bgcolor: '#C9C9C9',
                        borderColor: '#939393'
                      }
                    }}
                  >
                    Agregar nueva entrada
                  </Button>
                </Box>
              </Stack>
            )}
          </CardContent>

          {/* Footer Actions */}
          <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: '0 0 12px 12px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button 
                onClick={handlePrevStep}
                variant="outlined"
                startIcon={<BackIcon />}
                sx={{ 
                  bgcolor: '#D9D9D9',
                  color: '#374151',
                  border: '1px solid #A3A3A3',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: '#C9C9C9',
                    borderColor: '#939393'
                  }
                }}
              >
                Anterior
              </Button>
              
              <Stack direction="row" spacing={2}>
                <Tooltip 
                  title={
                    !canSaveDraft 
                      ? "Debe al menos completar este formulario para poder guardarlo"
                      : draftSaveState.loading
                      ? "Guardando borrador..."
                      : draftSaveState.success
                      ? "¡Borrador guardado exitosamente!"
                      : draftSaveState.error
                      ? `Error: ${draftSaveState.error}`
                      : "Guardar borrador"
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <Button 
                      onClick={saveAsDraft}
                      disabled={!canSaveDraft || draftSaveState.loading}
                      variant="outlined"
                      startIcon={draftSaveState.loading ? <CircularProgress size={16} color="inherit" /> : null}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '14px',
                        px: 3,
                        py: 1,
                        color: canSaveDraft ? '#F59E0B' : '#9CA3AF',
                        borderColor: canSaveDraft ? '#F59E0B' : '#E5E7EB',
                        bgcolor: canSaveDraft ? 'transparent' : '#F9FAFB',
                        '&:hover': canSaveDraft ? {
                          borderColor: '#D97706',
                          bgcolor: '#FEF3C7'
                        } : {},
                        '&:disabled': {
                          color: '#9CA3AF',
                          borderColor: '#E5E7EB',
                          bgcolor: '#F9FAFB'
                        }
                      }}
                    >
                      {draftSaveState.loading ? 'Guardando...' : 'Guardar Borrador'}
                    </Button>
                  </span>
                </Tooltip>
                
                <Button 
                  onClick={handleNextStep}
                  disabled={!isStep4Valid}
                  variant="outlined"
                  endIcon={<NextIcon />}
                  sx={{ 
                    bgcolor: '#D9D9D9 !important',
                    color: '#374151 !important',
                    border: '1px solid #A3A3A3 !important',
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    '&:hover': {
                      bgcolor: '#C9C9C9 !important',
                      borderColor: '#939393 !important'
                    },
                    '&:disabled': {
                      bgcolor: '#B0B0B0 !important',
                      color: '#666666 !important'
                    }
                  }}
                >
                  Siguiente
                </Button>
              </Stack>
            </Stack>
          </Box>
          </Card>
        </Box>
      </Box>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={draftSaveState.showTooltip}
        autoHideDuration={draftSaveState.success ? 3000 : 5000}
        onClose={() => setDraftSaveState(prev => ({ ...prev, showTooltip: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setDraftSaveState(prev => ({ ...prev, showTooltip: false }))} 
          severity={draftSaveState.success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {draftSaveState.success 
            ? '¡Borrador guardado exitosamente!' 
            : draftSaveState.error
          }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default memo(Actividades);
