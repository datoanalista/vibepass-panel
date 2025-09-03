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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import Header from '../../Header';


const ConfiguracionEntradas = ({ 
  eventFormData, 
  addEntrada,
  updateEntrada,
  deleteEntrada,
  handleCloseForm, 
  handleNextStep,
  handlePrevStep,
  isStep2Valid 
}) => {
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

  // Helper function para manejar fechas de manera consistente
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Si la fecha incluye tiempo (ISO format), extraer solo la parte de fecha
    if (typeof dateString === 'string' && dateString.includes('T')) {
      dateString = dateString.split('T')[0];
    }
    return dayjs(dateString).toDate();
  };

  const handleEntradaChange = (entradaId, field, value) => {
    if (field.includes('.')) {
      const [mainField, subField] = field.split('.');
      const entrada = eventFormData.entradas.find(e => e.id === entradaId);
      const updatedValue = { ...entrada[mainField], [subField]: value };
      updateEntrada(entradaId, mainField, updatedValue);
    } else {
      updateEntrada(entradaId, field, value);
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
            <IconButton onClick={handleCloseForm} sx={{ color: '#6B7280' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Stepper */}
          <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={index === 0}>
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
              Configuración de Entradas
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
            {eventFormData.entradas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  No hay entradas configuradas
                </Typography>
                <Button
                  onClick={addEntrada}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{
                    bgcolor: '#D9D9D9',
                    color: '#374151',
                    border: '1px solid #A3A3A3',
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
                {eventFormData.entradas.map((entrada, index) => (
                  <Paper key={entrada.id} elevation={1} sx={{ p: 3, bgcolor: '#D9D9D9' }}>
                    {/* Layout: Una fila con todos los campos usando flexbox */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {/* Tipo de entrada - MÁS ANCHO */}
                      <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Tipo de entrada
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            value={entrada.tipoEntrada}
                            displayEmpty
                            onChange={(e) => handleEntradaChange(entrada.id, 'tipoEntrada', e.target.value)}
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
                            <MenuItem value="" disabled>
                              Seleccione...
                            </MenuItem>
                            <MenuItem value="general">General</MenuItem>
                            <MenuItem value="vip">VIP</MenuItem>
                            <MenuItem value="estudiante">Estudiante</MenuItem>
                            <MenuItem value="tercera_edad">Tercera Edad</MenuItem>
                            <MenuItem value="profesores">Profesores</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      
                      {/* Precio - COMPACTO */}
                      <Box sx={{ flex: '0 0 120px', minWidth: '120px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Precio (CLP$)
                        </Typography>
                        <TextField
                          fullWidth
                          value={formatNumberWithThousands(entrada.precio)}
                          onChange={(e) => {
                            const cleanValue = cleanNumber(e.target.value);
                            handleEntradaChange(entrada.id, 'precio', cleanValue);
                          }}
                          placeholder="5.000"
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
                      
                      {/* Cupos Disponibles */}
                      <Box sx={{ flex: '0 0 150px', minWidth: '150px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Cupos Disponibles
                        </Typography>
                        <TextField
                          fullWidth
                          value={formatNumberWithThousands(entrada.cuposDisponibles)}
                          onChange={(e) => {
                            const cleanValue = cleanNumber(e.target.value);
                            handleEntradaChange(entrada.id, 'cuposDisponibles', cleanValue);
                          }}
                          placeholder="1.500"
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
                      
                      {/* Límite por persona */}
                      <Box sx={{ flex: '0 0 120px', minWidth: '120px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Límite por persona
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          value={entrada.limitePorPersona}
                          onChange={(e) => handleEntradaChange(entrada.id, 'limitePorPersona', e.target.value)}
                          placeholder="Sin límite"
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
                      
                      {/* Fecha inicio venta */}
                      <Box sx={{ flex: '0 0 180px', minWidth: '180px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Fecha inicio venta
                        </Typography>
                        <DatePicker
                          selected={parseDate(entrada.fechasVenta.inicio)}
                          onChange={(date) => {
                            if (date) {
                              // Usar UTC para evitar problemas de zona horaria
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const formattedDate = `${year}-${month}-${day}`;
                              handleEntradaChange(entrada.id, 'fechasVenta.inicio', formattedDate);
                            } else {
                              handleEntradaChange(entrada.id, 'fechasVenta.inicio', '');
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
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                              placeholder="Seleccione fecha"
                            />
                          }
                        />
                      </Box>
                      
                      {/* Fecha fin venta */}
                      <Box sx={{ flex: '0 0 180px', minWidth: '180px' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                          Fecha fin venta
                        </Typography>
                        <DatePicker
                          selected={parseDate(entrada.fechasVenta.fin)}
                          onChange={(date) => {
                            if (date) {
                              // Usar UTC para evitar problemas de zona horaria
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const formattedDate = `${year}-${month}-${day}`;
                              handleEntradaChange(entrada.id, 'fechasVenta.fin', formattedDate);
                            } else {
                              handleEntradaChange(entrada.id, 'fechasVenta.fin', '');
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
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                              placeholder="Seleccione fecha"
                            />
                          }
                        />
                      </Box>
                      
                      {/* Botón de eliminar */}
                      <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', pb: 0.5 }}>
                        <IconButton 
                          onClick={() => deleteEntrada(entrada.id)}
                          sx={{ 
                            color: '#d32f2f',
                            p: 0.5,
                            '&:hover': {
                              bgcolor: 'rgba(211, 47, 47, 0.1)'
                            }
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    

                  </Paper>
                ))}
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    onClick={addEntrada}
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
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: '0 0 12px 12px' }}>
            <Stack direction="row" justifyContent="space-between">
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
              <Button 
                onClick={handleNextStep}
                disabled={!isStep2Valid}
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

export default memo(ConfiguracionEntradas);
