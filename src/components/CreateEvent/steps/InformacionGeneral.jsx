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
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  NavigateNext as NextIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import Header from '../../Header';

const InformacionGeneral = ({ 
  eventFormData, 
  handleFormChange, 
  handleCloseForm, 
  handleNextStep, 
  isStep1Valid,
  uploadBanner,
  uploadStates 
}) => {
  // Registrar y configurar la localización en español
  registerLocale('es', es);
  setDefaultLocale('es');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Subir inmediatamente a Cloudinary
      uploadBanner(file);
    }
  };

  // Helper function para manejar fechas de manera consistente
  const parseDate = (dateString) => {
    console.log('🔍 parseDate - dateString recibido:', dateString);
    if (!dateString) {
      console.log('🔍 parseDate - dateString vacío, retornando null');
      return null;
    }
    // Si la fecha incluye tiempo (ISO format), extraer solo la parte de fecha
    if (typeof dateString === 'string' && dateString.includes('T')) {
      dateString = dateString.split('T')[0];
      console.log('🔍 parseDate - fecha después de split T:', dateString);
    }
    const parsedDate = dayjs(dateString).toDate();
    console.log('🔍 parseDate - fecha parseada:', parsedDate);
    return parsedDate;
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
            <IconButton onClick={handleCloseForm} sx={{ color: '#6B7280' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Stepper */}
          <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
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
              Información General
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
              {/* Nombre del evento */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Nombre de evento *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.nombreEvento}
                  onChange={(e) => handleFormChange('nombreEvento', e.target.value)}
                  placeholder="Escribir nombre de evento"
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px !important',
                      backgroundColor: '#FFFFFF !important',
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                      '& fieldset': {
                        border: 'none !important'
                      },
                      '&:hover': {
                        boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3) !important'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                        border: '2px solid #2E7CE4 !important'
                      }
                    }
                  }}
                />
              </Box>

              {/* Descripción */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Descripción del evento *
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.descripcion}
                  onChange={(e) => handleFormChange('descripcion', e.target.value)}
                  placeholder="Escribir descripción de evento"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px !important',
                      backgroundColor: '#FFFFFF !important',
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                      '& fieldset': {
                        border: 'none !important'
                      },
                      '&:hover': {
                        boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3) !important'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                        border: '2px solid #2E7CE4 !important'
                      }
                    }
                  }}
                />
              </Box>

              {/* Fecha y Horas */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Fecha evento
                  </Typography>
                  <DatePicker
                    selected={parseDate(eventFormData.fechaEvento)}
                    onChange={(date) => {
                      console.log('🗓️ DatePicker onChange - date recibido:', date);
                      if (date) {
                        // Usar UTC para evitar problemas de zona horaria
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const formattedDate = `${year}-${month}-${day}`;
                        console.log('🗓️ DatePicker onChange - fecha formateada:', formattedDate);
                        console.log('🗓️ DatePicker onChange - año:', year, 'mes:', month, 'día:', day);
                        handleFormChange('fechaEvento', formattedDate);
                      } else {
                        console.log('🗓️ DatePicker onChange - fecha vacía');
                        handleFormChange('fechaEvento', '');
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccione fecha"
                    className="custom-datepicker"
                    locale="es"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownScrollable={true}
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
                        placeholder="Seleccione fecha"
                      />
                    }
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Hora inicio
                  </Typography>
                  <DatePicker
                    selected={eventFormData.horaInicio ? new Date(`2024-01-01 ${eventFormData.horaInicio}`) : null}
                    onChange={(date) => {
                      const formattedTime = date ? dayjs(date).format('HH:mm') : '';
                      handleFormChange('horaInicio', formattedTime);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Seleccione hora"
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
                        placeholder="Seleccione hora"
                        readOnly
                      />
                    }
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Hora término
                  </Typography>
                  <DatePicker
                    selected={eventFormData.horaTermino ? new Date(`2024-01-01 ${eventFormData.horaTermino}`) : null}
                    onChange={(date) => {
                      const formattedTime = date ? dayjs(date).format('HH:mm') : '';
                      handleFormChange('horaTermino', formattedTime);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Seleccione hora"
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
                        placeholder="Seleccione hora"
                        readOnly
                      />
                    }
                  />
                </Box>
              </Box>

              {/* Lugar del evento */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Lugar del evento
                </Typography>
                <TextField
                  fullWidth
                  value={eventFormData.lugarEvento}
                  onChange={(e) => handleFormChange('lugarEvento', e.target.value)}
                  placeholder="Escribir ubicación del evento"
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px !important',
                      backgroundColor: '#FFFFFF !important',
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                      '& fieldset': {
                        border: 'none !important'
                      },
                      '&:hover': {
                        boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3) !important'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important',
                        border: '2px solid #2E7CE4 !important'
                      }
                    }
                  }}
                />
              </Box>

              {/* Banner promocional */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                  Banner promocional
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    border: uploadStates.banner.success ? '2px solid #4caf50' : 
                           uploadStates.banner.error ? '2px solid #f44336' : 
                           '2px dashed #D1D6DB',
                    borderRadius: '10px',
                    p: 1,
                    textAlign: 'center',
                    cursor: uploadStates.banner.loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: uploadStates.banner.success ? '#e8f5e8' :
                            uploadStates.banner.error ? '#ffebee' :
                            '#FFFFFF',
                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                      borderColor: uploadStates.banner.loading ? undefined : '#2E7CE4',
                      bgcolor: uploadStates.banner.loading ? undefined : '#F8F9FF',
                      boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                  onClick={() => !uploadStates.banner.loading && document.getElementById('banner-upload').click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="banner-upload"
                    disabled={uploadStates.banner.loading}
                  />
                  <Stack alignItems="center" spacing={2}>
                    {uploadStates.banner.loading ? (
                      <>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ color: 'primary.main', fontSize: '14px' }}>
                          Subiendo banner a Cloudinary...
                        </Typography>
                      </>
                    ) : (uploadStates.banner.success || eventFormData.bannerUrl) ? (
                      <>
                        {eventFormData.bannerUrl && (
                          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <img 
                              src={eventFormData.bannerUrl} 
                              alt="Banner promocional" 
                              style={{ 
                                maxWidth: '98%', 
                                maxHeight: '96px', 
                                width: 'auto',
                                height: 'auto',
                                borderRadius: '8px',
                                objectFit: 'contain',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                              }} 
                            />
                          </Box>
                        )}
                        <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
                        <Typography variant="body2" sx={{ color: 'success.main', fontSize: '14px' }}>
                          ✅ Banner {uploadStates.banner.success ? 'subido' : 'cargado'} exitosamente
                        </Typography>
                        {eventFormData.bannerPromocional && (
                          <Chip 
                            label={eventFormData.bannerPromocional.name}
                            color="success"
                            size="small"
                            sx={{ 
                              mt: 1,
                              bgcolor: '#E8F5E8',
                              color: '#2E7D32',
                              fontSize: '12px'
                            }}
                          />
                        )}
                        {eventFormData.bannerUrl && (
                          <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '11px', mt: 1 }}>
                            URL: {eventFormData.bannerUrl.substring(0, 50)}...
                          </Typography>
                        )}
                      </>
                    ) : uploadStates.banner.error ? (
                      <>
                        <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />
                        <Typography variant="body2" sx={{ color: 'error.main', fontSize: '14px' }}>
                          ❌ Error al subir banner
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'error.main', fontSize: '12px' }}>
                          {uploadStates.banner.error}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => document.getElementById('banner-upload').click()}
                          sx={{ mt: 1 }}
                        >
                          Reintentar
                        </Button>
                      </>
                    ) : (
                      <>
                        <UploadIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                        <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '14px' }}>
                          (Adjuntar archivo) ↓
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Paper>
              </Box>
                          </Stack>
            </CardContent>

          {/* Footer Actions */}
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: '0 0 12px 12px' }}>
            <Stack direction="row" justifyContent="space-between">
              <Button 
                onClick={handleCloseForm}
                variant="outlined"
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
                Cancelar
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={!isStep1Valid}
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
          </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(InformacionGeneral);
