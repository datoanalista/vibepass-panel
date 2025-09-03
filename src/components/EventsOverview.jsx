"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  Container,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Header from './Header';

const EventsOverview = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({
    activos: false,
    programados: false,
    pasados: false
  });


  // Función para obtener eventos de la API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/events');
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        console.log('📥 fetchEvents - eventos recibidos del backend:', result.data.events);
        // Log específico para el evento que acabamos de crear
        const nuevoEvento = result.data.events.find(event => event.informacionGeneral.nombreEvento === 'Evento Testing 5');
        if (nuevoEvento) {
          console.log('📥 fetchEvents - Evento Testing 5 encontrado:', nuevoEvento);
          console.log('📥 fetchEvents - fechaEvento del backend:', nuevoEvento.informacionGeneral.fechaEvento);
        }
        setEvents(result.data.events || []);
      } else {
        throw new Error(result.message || 'Error al cargar eventos');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchEvents();
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  // Función para editar un evento - navega a la página de crear evento
  const handleEditEvent = (event) => {
    // Guardar el evento a editar en localStorage para que la página de crear evento pueda acceder a él
    localStorage.setItem('editingEvent', JSON.stringify(event));
    router.push('/create-event?mode=edit');
  };

  // Función para toggle de expansión
  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // Función para toggle de secciones
  const toggleSectionExpansion = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Componente para cada card de evento
  const EventCard = ({ event }) => {
    const totalAsistentes = event.totalCuposDisponibles || 0;
    const precioMinimo = event.entradas && event.entradas.length > 0 
      ? Math.min(...event.entradas.map(e => e.precio || 0))
      : 0;
    const isExpanded = expandedEvents.has(event.id);
    
    // Formatear periodo de tiempo
    const periodo = `${event.informacionGeneral.horaInicio} a ${event.informacionGeneral.horaTermino}`;
    
    return (
      <Card elevation={2} sx={{ 
        bgcolor: '#FFFFFF', 
        borderRadius: '12px', 
        mb: 2,
        '&:hover': {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Fila principal */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Puntito verde + Banner */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: '80px' }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#10B981',
                flexShrink: 0
              }} />
              
              <Avatar
                src={event.imagenPrincipal}
                sx={{ 
                  width: 60, 
                  height: 60,
                  borderRadius: '8px'
                }}
              />
            </Box>
            
            {/* Información del evento */}
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                fontSize: '16px',
                color: '#374151',
                mb: 0.5
              }}>
                {event.informacionGeneral.nombreEvento}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#6B7280',
                fontSize: '14px'
              }}>
                {event.organizador.correoElectronico}
              </Typography>
            </Box>
            
            {/* Precio */}
            <Box sx={{ textAlign: 'center', minWidth: '100px', flex: '0 0 100px' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: '#2563EB',
                fontSize: '18px'
              }}>
                ${precioMinimo.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#6B7280',
                fontSize: '12px'
              }}>
                activo
              </Typography>
            </Box>
            
            {/* Asistentes */}
            <Box sx={{ flex: '0 0 140px', minWidth: '140px' }}>
              <Chip
                icon={<GroupsIcon />}
                label={`Asistentes ${totalAsistentes}`}
                sx={{
                  bgcolor: '#3B82F6',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '12px',
                  width: '100%'
                }}
              />
            </Box>
            
            {/* Iconos de acción */}
            <Box sx={{ display: 'flex', gap: 1, flex: '0 0 auto' }}>
              <Tooltip title="Cancelar evento" arrow>
                <IconButton 
                  size="small"
                  sx={{ 
                    color: '#EF4444',
                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Editar evento" arrow>
                <IconButton 
                  size="small"
                  onClick={() => handleEditEvent(event)}
                  sx={{ 
                    color: '#3B82F6',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <IconButton 
                size="small"
                onClick={() => toggleEventExpansion(event.id)}
                sx={{ 
                  color: '#6B7280',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)' }
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Información expandida */}
          {isExpanded && (
            <Box sx={{ 
              mt: 3, 
              pt: 3, 
              borderTop: '1px solid #E5E7EB',
              bgcolor: '#F9FAFB',
              borderRadius: '8px',
              p: 3
            }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Lugar */}
                <Box sx={{ flex: '0 0 20%', width: '20%' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontSize: '12px',
                    mb: 0.5
                  }}>
                    Lugar
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {event.informacionGeneral.lugarEvento}
                  </Typography>
                </Box>
                
                {/* Teléfono */}
                <Box sx={{ flex: '0 0 20%', width: '20%' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontSize: '12px',
                    mb: 0.5
                  }}>
                    Teléfono
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {event.organizador.telefonoContacto}
                  </Typography>
                </Box>
                
                {/* RUT */}
                <Box sx={{ flex: '0 0 20%', width: '20%' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontSize: '12px',
                    mb: 0.5
                  }}>
                    Rut
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {event.organizador.rutEmpresa}
                  </Typography>
                </Box>
                
                {/* Fecha */}
                <Box sx={{ flex: '0 0 20%', width: '20%' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontSize: '12px',
                    mb: 0.5
                  }}>
                    Fecha
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {new Date(event.informacionGeneral.fechaEvento).toLocaleDateString('es-CL')}
                  </Typography>
                </Box>
                
                {/* Periodo */}
                <Box sx={{ flex: '0 0 20%', width: '20%' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontSize: '12px',
                    mb: 0.5
                  }}>
                    Periodo
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {periodo}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Componente tabla para eventos pasados
  const EventTable = ({ events }) => {
    return (
      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: '#F3F4F6', fontWeight: 600, fontSize: '14px', color: '#374151' } }}>
              <TableCell sx={{ width: '60px' }}></TableCell>
              <TableCell>Evento</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Entradas vendidas</TableCell>
              <TableCell align="center">Ingresos totales</TableCell>
              <TableCell align="center">Ver más</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              const precioMinimo = event.entradas && event.entradas.length > 0 
                ? Math.min(...event.entradas.map(e => e.precio || 0))
                : 0;
              const ingresosTotales = event.ingresosTotales || 0;
              const entradasVendidas = event.totalEntradasVendidas || 0;

              return (
                <TableRow 
                  key={event.id}
                  sx={{ 
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F3F4F6' },
                    '& td': { borderBottom: '1px solid #E5E7EB' }
                  }}
                >
                  {/* Imagen del evento */}
                  <TableCell>
                    <Avatar
                      src={event.imagenPrincipal}
                      sx={{ 
                        width: 50, 
                        height: 50,
                        borderRadius: '8px'
                      }}
                    />
                  </TableCell>
                  
                  {/* Información del evento */}
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        fontSize: '14px',
                        color: '#374151',
                        mb: 0.5
                      }}>
                        {event.informacionGeneral.nombreEvento}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#6B7280',
                        fontSize: '12px'
                      }}>
                        {event.organizador.nombreEmpresaColegio}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Fecha */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {new Date(event.informacionGeneral.fechaEvento).toLocaleDateString('es-CL')}
                    </Typography>
                  </TableCell>
                  
                  {/* Entradas vendidas */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>
                      {entradasVendidas}
                    </Typography>
                  </TableCell>
                  
                  {/* Ingresos totales */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#059669', fontWeight: 600 }}>
                      ${ingresosTotales.toLocaleString()} CLP
                    </Typography>
                  </TableCell>
                  
                  {/* Ver más */}
                  <TableCell align="center">
                    <IconButton 
                      size="small"
                      sx={{ 
                        color: '#06B6D4',
                        '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Filtrar eventos activos (fechaEvento >= hoy y <= 7 días)
  const eventosActivos = events.filter(event => {
    // Crear fecha local para evitar problemas de zona horaria
    const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
    const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const sieteDias = new Date();
    sieteDias.setDate(hoy.getDate() + 7);
    sieteDias.setHours(23, 59, 59, 999);
    
    // Log para debuggear el filtrado
    if (event.informacionGeneral.nombreEvento === 'Evento Testing 5') {
      console.log('🔍 eventosActivos - Evento Testing 5:');
      console.log('🔍 eventosActivos - fechaEvento string:', event.informacionGeneral.fechaEvento);
      console.log('🔍 eventosActivos - fechaEvento Date object (LOCAL):', fechaEvento);
      console.log('🔍 eventosActivos - hoy:', hoy);
      console.log('🔍 eventosActivos - sieteDias:', sieteDias);
      console.log('🔍 eventosActivos - fechaEvento >= hoy:', fechaEvento >= hoy);
      console.log('🔍 eventosActivos - fechaEvento <= sieteDias:', fechaEvento <= sieteDias);
      console.log('🔍 eventosActivos - resultado final:', fechaEvento >= hoy && fechaEvento <= sieteDias);
    }
    
    return fechaEvento >= hoy && fechaEvento <= sieteDias;
  });

  // Filtrar eventos programados (fechaEvento > 7 días en el futuro)
  const eventosProgramados = events.filter(event => {
    // Crear fecha local para evitar problemas de zona horaria
    const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
    const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const sieteDias = new Date();
    sieteDias.setDate(hoy.getDate() + 7);
    sieteDias.setHours(23, 59, 59, 999);
    return fechaEvento > sieteDias;
  });

  // Filtrar eventos pasados (fechaEvento < hoy)
  const eventosPasados = events.filter(event => {
    // Crear fecha local para evitar problemas de zona horaria
    const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
    const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Log para debuggear el filtrado
    if (event.informacionGeneral.nombreEvento === 'Evento Testing 5') {
      console.log('🔍 eventosPasados - Evento Testing 5:');
      console.log('🔍 eventosPasados - fechaEvento string:', event.informacionGeneral.fechaEvento);
      console.log('🔍 eventosPasados - fechaEvento Date object (LOCAL):', fechaEvento);
      console.log('🔍 eventosPasados - hoy:', hoy);
      console.log('🔍 eventosPasados - fechaEvento < hoy:', fechaEvento < hoy);
      console.log('🔍 eventosPasados - resultado final:', fechaEvento < hoy);
    }
    
    return fechaEvento < hoy;
  });

  // Filtrar eventos activos por búsqueda
  const eventosActivosFiltrados = eventosActivos.filter(event => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const nombreEvento = event.informacionGeneral.nombreEvento.toLowerCase();
    const correoOrganizador = event.organizador.correoElectronico.toLowerCase();
    const nombreEmpresa = event.organizador.nombreEmpresaColegio.toLowerCase();
    const lugarEvento = event.informacionGeneral.lugarEvento.toLowerCase();
    
    return nombreEvento.includes(query) || 
           correoOrganizador.includes(query) || 
           nombreEmpresa.includes(query) ||
           lugarEvento.includes(query);
  });

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
                {/* Header Section */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          {/* Primera fila: Buscador + Esta semana + Rango de fechas */}
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Buscador */}
            <TextField
                placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '400px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  height: '32px',
                  '& fieldset': {
                    borderColor: '#D1D5DB'
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#374151 !important',
                    borderWidth: '1px !important'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6B7280' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Esta semana */}
            <Button
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                height: '32px',
                borderColor: '#D1D5DB',
                color: '#374151',
                '&:hover': {
                  borderColor: '#9CA3AF',
                  bgcolor: '#F9FAFB'
                }
              }}
            >
              Esta semana
            </Button>

            {/* Selector de rango de fechas */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              px: 1,
              height: '32px'
            }}>
              <IconButton size="small" sx={{ color: '#6B7280', p: 0.5 }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                px: 2,
                minWidth: '180px'
              }}>
                <CalendarIcon sx={{ color: '#6B7280', fontSize: '18px' }} />
                <Typography sx={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  fontWeight: 500
                }}>
                  1 Abr 2025 - 1 May 2025
                </Typography>
              </Box>
              
              <IconButton size="small" sx={{ color: '#6B7280', p: 0.5 }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>

          {/* Segunda fila: Solo Crear nuevo evento */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              sx={{
                background: 'linear-gradient(135deg, #1E293B 0%, #374151 100%) !important',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 3,
                py: 1.5,
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                color: 'white !important',
                border: 'none !important',
                '&.MuiButton-contained': {
                  background: 'linear-gradient(135deg, #1E293B 0%, #374151 100%) !important',
                  color: 'white !important'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #0F172A 0%, #1F2937 100%) !important',
                  boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              Crear nuevo evento
            </Button>
          </Box>
        </Stack>

        {/* Eventos Activos */}
        <Box sx={{ mb: 4 }}>
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
              Eventos activos
            </Typography>
          </Box>
          
          {/* Cuerpo del box */}
          <Card elevation={3} sx={{ 
            borderRadius: '0 12px 12px 12px', 
            bgcolor: '#D9D9D9',
            mt: -1,
            position: 'relative',
            zIndex: 1
          }}>
            <CardContent sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body1" sx={{ ml: 2, color: '#6B7280' }}>
                    Cargando eventos...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
                    Error al cargar eventos: {error}
                  </Typography>
                  <Button 
                    onClick={fetchEvents}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : eventosActivosFiltrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '16px' }}>
                    {searchQuery.trim() ? 'No se encontraron eventos que coincidan con la búsqueda' : 'No hay eventos activos'}
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {(expandedSections.activos ? eventosActivosFiltrados : eventosActivosFiltrados.slice(0, 3)).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  {eventosActivosFiltrados.length > 3 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Button
                        onClick={() => toggleSectionExpansion('activos')}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 3,
                          py: 1
                        }}
                      >
                        {expandedSections.activos 
                          ? `Ver menos (${eventosActivosFiltrados.length - 3} menos)` 
                          : `Ver todos (${eventosActivosFiltrados.length - 3} más)`
                        }
                      </Button>
                    </Box>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Línea separadora */}
        <Box sx={{ 
          width: '100%', 
          height: '2px', 
          bgcolor: '#D9D9D9', 
          mb: 4,
          borderRadius: '1px'
        }} />

        {/* Eventos Programados */}
        <Box sx={{ mb: 4 }}>
          {/* Pestaña */}
          <Box sx={{ 
            bgcolor: '#4B5563',
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
              Eventos Programados
            </Typography>
          </Box>
          
          {/* Cuerpo del box */}
          <Card elevation={3} sx={{ 
            borderRadius: '0 12px 12px 12px', 
            bgcolor: '#D9D9D9',
            mt: -1,
            position: 'relative',
            zIndex: 1
          }}>
            <CardContent sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body1" sx={{ ml: 2, color: '#6B7280' }}>
                    Cargando eventos...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
                    Error al cargar eventos: {error}
                  </Typography>
                  <Button 
                    onClick={fetchEvents}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : eventosProgramados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '16px' }}>
                    No hay eventos programados
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <EventTable events={expandedSections.programados ? eventosProgramados : eventosProgramados.slice(0, 3)} />
                  {eventosProgramados.length > 3 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Button
                        onClick={() => toggleSectionExpansion('programados')}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 3,
                          py: 1
                        }}
                      >
                        {expandedSections.programados 
                          ? `Ver menos (${eventosProgramados.length - 3} menos)` 
                          : `Ver todos (${eventosProgramados.length - 3} más)`
                        }
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Línea separadora */}
        <Box sx={{ 
          width: '100%', 
          height: '2px', 
          bgcolor: '#D9D9D9', 
          mb: 4,
          borderRadius: '1px'
        }} />

        {/* Eventos Pasados */}
        <Box>
          {/* Pestaña */}
          <Box sx={{ 
            bgcolor: '#6B7280',
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
              Lista de eventos pasados
            </Typography>
          </Box>
          
          {/* Cuerpo del box */}
          <Card elevation={3} sx={{ 
            borderRadius: '0 12px 12px 12px', 
            bgcolor: '#D9D9D9',
            mt: -1,
            position: 'relative',
            zIndex: 1
          }}>
            <CardContent sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body1" sx={{ ml: 2, color: '#6B7280' }}>
                    Cargando eventos...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
                    Error al cargar eventos: {error}
                  </Typography>
                  <Button 
                    onClick={fetchEvents}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : eventosPasados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '16px' }}>
                    No hay eventos pasados
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <EventTable events={expandedSections.pasados ? eventosPasados : eventosPasados.slice(0, 3)} />
                  {eventosPasados.length > 3 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Button
                        onClick={() => toggleSectionExpansion('pasados')}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 3,
                          py: 1
                        }}
                      >
                        {expandedSections.pasados 
                          ? `Ver menos (${eventosPasados.length - 3} menos)` 
                          : `Ver todos (${eventosPasados.length - 3} más)`
                        }
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>


    </Box>
  );
};

export default EventsOverview;