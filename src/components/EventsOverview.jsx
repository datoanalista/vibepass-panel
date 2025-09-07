"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import API_CONFIG from '../config/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Función para formatear fechas de manera consistente
const formatEventDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Parsear la fecha como local para evitar problemas de timezone
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const dayNum = date.getDate().toString().padStart(2, '0');
    const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
    const yearNum = date.getFullYear();
    
    return `${dayNum} de ${monthName}. ${yearNum}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Función para determinar el estado del evento según la hora actual
const getEventStatus = (event, currentTime) => {
  // Verificar si el evento está cancelado
  if (event?.informacionGeneral?.estado === 'cancelado') {
    return { status: 'cancelado', message: 'Evento cancelado', color: '#DC2626' };
  }
  
  if (!event?.informacionGeneral?.fechaEvento || !event?.informacionGeneral?.horaInicio || !event?.informacionGeneral?.horaTermino) {
    return { status: 'programado', message: 'Evento programado', color: '#3B82F6' };
  }

  const now = currentTime || new Date();
  
  // Crear fecha del evento en formato local (YYYY-MM-DD)
  const eventDateString = event.informacionGeneral.fechaEvento; // "2025-09-03"
  const [year, month, day] = eventDateString.split('-');
  const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Crear fecha de hoy en formato local (sin horas)
  const today = new Date(now);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  // Si no es el día del evento
  if (eventDateOnly.getTime() !== todayDate.getTime()) {
    if (eventDateOnly > todayDate) {
      return { status: 'programado', message: 'Evento programado', color: '#3B82F6' };
    } else {
      return { status: 'realizado', message: 'Evento realizado', color: '#6B7280' };
    }
  }

  // Es el día del evento, verificar horas
  const startTime = new Date(`${eventDateString}T${event.informacionGeneral.horaInicio}:00`);
  const endTime = new Date(`${eventDateString}T${event.informacionGeneral.horaTermino}:00`);

  if (now < startTime) {
    // Evento por comenzar - calcular tiempo restante
    const timeDiff = startTime - now;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    let message, timeText;
    if (minutes < 1 && hours === 0) {
      message = 'Evento comenzará en menos de 1 min.';
      timeText = 'menos de 1 min.';
    } else {
      timeText = `${hours}h ${minutes}m`;
      message = `Evento comenzará en ${timeText}`;
    }
    
    return {
      status: 'por_comenzar',
      message,
      timeText,
      color: '#EF4444',
      timeDiff
    };
  } else if (now >= startTime && now <= endTime) {
    return { status: 'en_curso', message: 'Evento en curso', color: '#10B981' };
  } else {
    return { status: 'finalizado', message: 'Evento finalizado', color: '#3B82F6' };
  }
};

// Función para calcular el estado automático de entradas, alimentos y actividades
const getAutomaticStatus = (event) => {
  if (!event || !event.informacionGeneral) {
    return { entrada: false, alimento: false, actividad: false };
  }

  // Si el evento está cancelado, todo está inactivo
  if (event.informacionGeneral.estado === 'cancelado') {
    return { entrada: false, alimento: false, actividad: false };
  }

  const today = new Date();
  const eventDate = new Date(event.informacionGeneral.fechaEvento);
  
  // Crear fechas solo con día, mes y año para comparación
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  // Si el evento es de un día pasado, todo está inactivo
  if (eventDateOnly < todayOnly) {
    return { entrada: false, alimento: false, actividad: false };
  }

  // Si el evento es de hoy, verificar horarios
  if (eventDateOnly.getTime() === todayOnly.getTime()) {
    const now = new Date();
    const startTime = event.informacionGeneral.horaInicio;
    const endTime = event.informacionGeneral.horaTermino;
    
    if (startTime && endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const eventStart = new Date(today);
      eventStart.setHours(startHour, startMin, 0, 0);
      
      const eventEnd = new Date(today);
      eventEnd.setHours(endHour, endMin, 0, 0);
      
      // Si estamos dentro del horario del evento, todo está activo
      if (now >= eventStart && now <= eventEnd) {
        return { entrada: true, alimento: true, actividad: true };
      }
      // Si el evento ya terminó, todo está inactivo
      else if (now > eventEnd) {
        return { entrada: false, alimento: false, actividad: false };
      }
      // Si el evento aún no comienza, todo está activo (para venta anticipada)
      else {
        return { entrada: true, alimento: true, actividad: true };
      }
    }
  }

  // Si el evento es futuro, todo está activo
  return { entrada: true, alimento: true, actividad: true };
};
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Header from './Header';

const EventsOverview = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({
    activos: false,
    programados: false,
    borradores: false,
    pasados: false,
    cancelados: false
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weekFilterActive, setWeekFilterActive] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
    draftId: null,
    draftName: ''
  });
  const [cancelConfirmModal, setCancelConfirmModal] = useState({
    open: false,
    eventId: null,
    eventName: ''
  });
  const [cancelSnackbar, setCancelSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });


  // Función para actualizar eventos programados que ya pasaron a "finalizado"
  const updateFinishedEvents = async () => {
    try {
      console.log('🔄 Verificando eventos programados que deben estar finalizados...');
      
      const today = new Date();
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Encontrar eventos programados que ya pasaron (fecha anterior a hoy)
      const eventsToFinish = events.filter(event => {
        if (event.informacionGeneral?.estado !== 'programado') return false;
        if (!event.informacionGeneral?.fechaEvento) return false;
        
        // Crear fecha del evento correctamente
        const eventDateString = event.informacionGeneral.fechaEvento; // "2025-09-06"
        const [year, month, day] = eventDateString.split('-');
        const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        
        console.log('🔍 Comparando fechas:', {
          evento: event.informacionGeneral?.nombreEvento,
          fechaEvento: eventDateString,
          eventDateOnly: eventDateOnly.toDateString(),
          todayOnly: todayOnly.toDateString(),
          esPasado: eventDateOnly < todayOnly
        });
        
        return eventDateOnly < todayOnly; // Evento fue ayer o antes
      });
      
      console.log(`📅 Eventos a finalizar: ${eventsToFinish.length}`, eventsToFinish.map(e => ({
        nombre: e.informacionGeneral?.nombreEvento,
        fecha: e.informacionGeneral?.fechaEvento
      })));
      
      // Actualizar cada evento en el backend (igual que cancelar evento)
      for (const event of eventsToFinish) {
        const eventId = event._id || event.id;
        
        try {
          const response = await fetch(API_CONFIG.ENDPOINTS.EVENT_BY_ID(eventId), {
            method: 'PUT',
            headers: API_CONFIG.REQUEST_CONFIG.headers,
            body: JSON.stringify({
              ...event,
              informacionGeneral: {
                ...event.informacionGeneral,
                estado: 'finalizado'
              },
              // Desactivar todas las entradas
              entradas: event.entradas?.map(entrada => ({
                ...entrada,
                activa: false
              })) || [],
              // Desactivar todos los alimentos y bebestibles
              alimentosBebestibles: event.alimentosBebestibles?.map(alimento => ({
                ...alimento,
                activo: false
              })) || [],
              // Desactivar todas las actividades
              actividades: event.actividades?.map(actividad => ({
                ...actividad,
                activa: false
              })) || []
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Evento "${event.informacionGeneral?.nombreEvento}" finalizado automáticamente`);
          } else {
            console.warn(`⚠️ Error al finalizar evento "${event.informacionGeneral?.nombreEvento}"`);
          }
        } catch (error) {
          console.error(`❌ Error al finalizar evento "${event.informacionGeneral?.nombreEvento}":`, error);
        }
      }
      
      return eventsToFinish.length > 0;
    } catch (error) {
      console.error('❌ Error al actualizar eventos finalizados:', error);
      return false;
    }
  };

  // Función para obtener eventos de la API
  const fetchEvents = async (checkFinished = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Primero verificar y actualizar eventos finalizados si se solicita
      if (checkFinished && events.length > 0) {
        await updateFinishedEvents();
      }
      
      const response = await fetch(`${API_CONFIG.ENDPOINTS.EVENTS}?limit=900`, API_CONFIG.REQUEST_CONFIG);
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
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

  // Función para obtener el rango de la semana actual (lunes a domingo)
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    
    // Calcular el lunes de esta semana
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Si es domingo, restar 6 días
    monday.setHours(0, 0, 0, 0);
    
    // Calcular el domingo de esta semana
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  // Función para verificar si un evento está en la semana actual
  const isEventInCurrentWeek = (event) => {
    if (!event.informacionGeneral?.fechaEvento) return false;
    
    const { monday, sunday } = getCurrentWeekRange();
    const eventDate = new Date(event.informacionGeneral.fechaEvento);
    
    return eventDate >= monday && eventDate <= sunday;
  };

  // Función para alternar el filtro de semana
  const toggleWeekFilter = () => {
    setWeekFilterActive(prev => !prev);
    console.log('📅 Filtro de semana:', weekFilterActive ? 'desactivado' : 'activado');
  };

  // Función de refresh manual
  const handleManualRefresh = async () => {
    if (isRefreshing) return; // Evitar múltiples refreshes simultáneos
    
    setIsRefreshing(true);
    console.log('🔄 Refresh manual iniciado...');
    
    try {
      await Promise.all([fetchEvents(true), fetchDrafts()]); // Verificar eventos finalizados al actualizar
      console.log('✅ Refresh manual completado');
    } catch (error) {
      console.error('❌ Error en refresh manual:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Función para obtener borradores de la API
  const fetchDrafts = async () => {
    try {
      setDraftsLoading(true);
      const response = await fetch(`${API_CONFIG.ENDPOINTS.DRAFTS}?limit=900`, API_CONFIG.REQUEST_CONFIG);
      const result = await response.json();
      
      if (result.status === 'success') {
        const rawDrafts = result.data.drafts || [];
        
        // Limpiar duplicados por nombre de evento
        const uniqueDrafts = rawDrafts.reduce((acc, draft) => {
          const existingDraft = acc.find(d => 
            d.informacionGeneral?.nombreEvento === draft.informacionGeneral?.nombreEvento
          );
          
          if (!existingDraft) {
            acc.push(draft);
          } else {
            console.warn('🚨 Duplicado detectado y eliminado:', {
              nombre: draft.informacionGeneral?.nombreEvento,
              idOriginal: existingDraft._id,
              idDuplicado: draft._id
            });
          }
          
          return acc;
        }, []);
        
        console.log('📋 Borradores cargados:', {
          total: rawDrafts.length,
          unicos: uniqueDrafts.length,
          duplicadosEliminados: rawDrafts.length - uniqueDrafts.length
        });
        
        setDrafts(uniqueDrafts);
      } else {
        console.error('❌ fetchDrafts - Error en response:', result.message);
      }
    } catch (err) {
      console.error('❌ fetchDrafts - Error de conexión:', err);
    } finally {
      setDraftsLoading(false);
    }
  };

  // Función helper para detectar si un evento es un borrador
  const esBorrador = (event) => {
    return event._id && event._id.startsWith('draft_') || 
           event.isDraft === true || 
           event.tipo === 'borrador' ||
           event.estado === 'borrador' ||
           event.draftId || // Si tiene draftId, es un borrador
           event.source === 'draft'; // Si viene del endpoint de borradores
  };

  // Función helper para verificar si un evento ya existe como borrador
  const existeComoBorrador = (event) => {
    const existe = drafts.some(draft => 
      draft._id === event._id || 
      draft.informacionGeneral?.nombreEvento === event.informacionGeneral?.nombreEvento
    );
    
    // Debug: mostrar cuando se detecta un duplicado
    if (existe) {
      console.log('🚨 Evento duplicado detectado:', {
        evento: event.informacionGeneral?.nombreEvento,
        eventId: event._id,
        drafts: drafts.map(d => ({ id: d._id, nombre: d.informacionGeneral?.nombreEvento }))
      });
    }
    
    return existe;
  };

  // Filtrar eventos activos (solo eventos de hoy) - Memoizado para performance
  const eventosActivos = useMemo(() => {
    return events.filter(event => {
      // Verificar que la fecha existe antes de procesarla
      if (!event.informacionGeneral?.fechaEvento) {
        return false;
      }
      
      // Excluir borradores y eventos que existen como borradores
      if (esBorrador(event) || existeComoBorrador(event)) {
        return false;
      }
      
      // Aplicar filtro de semana si está activo
      if (weekFilterActive && !isEventInCurrentWeek(event)) {
        return false;
      }
      
      // Crear fecha local para evitar problemas de zona horaria
      const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
      const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      // Comparar usando solo las fechas (sin horas) para evitar problemas de timezone
      const fechaEventoOnly = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
      const hoyOnly = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      
      // Solo eventos de hoy Y que no estén cancelados
      const esHoy = fechaEventoOnly.getTime() === hoyOnly.getTime();
      const noCancelado = event.informacionGeneral.estado !== 'cancelado';
      
      return esHoy && noCancelado;
    });
  }, [events, drafts.length, weekFilterActive]); // Incluir weekFilterActive en las dependencias

  // Filtrar eventos programados (fechaEvento > hoy) - Memoizado para performance
  const eventosProgramados = useMemo(() => {
    return events.filter(event => {
      // Verificar que la fecha existe antes de procesarla
      if (!event.informacionGeneral?.fechaEvento) {
        return false;
      }
      
      // Excluir borradores y eventos que existen como borradores
      if (esBorrador(event) || existeComoBorrador(event)) {
        return false;
      }
      
      // Aplicar filtro de semana si está activo
      if (weekFilterActive && !isEventInCurrentWeek(event)) {
        return false;
      }
      
      // Crear fecha local para evitar problemas de zona horaria
      const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
      const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      // Comparar usando solo las fechas (sin horas) para evitar problemas de timezone
      const fechaEventoOnly = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
      const hoyOnly = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      
      // Solo eventos futuros (después de hoy) Y que no estén cancelados
      const esFuturo = fechaEventoOnly > hoyOnly;
      const noCancelado = event.informacionGeneral.estado !== 'cancelado';
      
      return esFuturo && noCancelado;
    });
  }, [events, drafts.length, weekFilterActive]); // Incluir weekFilterActive en las dependencias

  // Filtrar eventos finalizados (fechaEvento < hoy O eventos del día actual que ya terminaron) - Memoizado
  const eventosPasados = useMemo(() => {
    return events.filter(event => {
      // Verificar que la fecha existe antes de procesarla
      if (!event.informacionGeneral?.fechaEvento) {
        return false;
      }
      
      // Excluir borradores y eventos que existen como borradores
      if (esBorrador(event) || existeComoBorrador(event)) {
        return false;
      }
      
      // Aplicar filtro de semana si está activo
      if (weekFilterActive && !isEventInCurrentWeek(event)) {
        return false;
      }
      
      // Crear fecha local para evitar problemas de zona horaria
      const [year, month, day] = event.informacionGeneral.fechaEvento.split('-');
      const fechaEvento = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      // Comparar usando solo las fechas (sin horas) para evitar problemas de timezone
      const fechaEventoOnly = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
      const hoyOnly = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      
      // Incluir eventos de días pasados O eventos del día actual que ya terminaron
      const esDiaPasado = fechaEventoOnly < hoyOnly;
      const eventStatus = getEventStatus(event, currentTime);
      const esFinalizado = eventStatus.status === 'finalizado';
      
      return esDiaPasado || esFinalizado;
    });
  }, [events, currentTime, weekFilterActive]); // Incluir weekFilterActive en las dependencias

  // Filtrar eventos cancelados - Memoizado para performance
  const eventosCancelados = useMemo(() => {
    return events.filter(event => {
      // Aplicar filtro de semana si está activo
      if (weekFilterActive && !isEventInCurrentWeek(event)) {
        return false;
      }
      
      return event.informacionGeneral.estado === 'cancelado';
    });
  }, [events, drafts.length, weekFilterActive]); // Incluir weekFilterActive en las dependencias

  useEffect(() => {
    setMounted(true);
    fetchEvents(true); // Verificar eventos finalizados al cargar la página
    fetchDrafts();
  }, []);

  // Event listeners de refresh eliminados - Solo se refresca al cargar la página inicialmente
  // Los refreshes automáticos molestos han sido removidos para mejorar la experiencia del usuario

  // useEffect para actualizar el tiempo de forma inteligente - OPTIMIZADO
  useEffect(() => {
    // Solo actualizar si hay eventos activos o por comenzar
    const hasActiveEvents = events.some(event => {
      if (!event.informacionGeneral?.fechaEvento || !event.informacionGeneral?.horaInicio) return false;
      
      const eventDateTime = new Date(`${event.informacionGeneral.fechaEvento}T${event.informacionGeneral.horaInicio}`);
      const now = new Date();
      const timeDiff = eventDateTime.getTime() - now.getTime();
      
      // Evento activo: ya comenzó pero no ha terminado (dentro de las próximas 24 horas)
      const isActive = timeDiff <= 0 && timeDiff >= -24 * 60 * 60 * 1000;
      // Evento por comenzar: comenzará en las próximas 24 horas
      const isUpcoming = timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;
      
      return isActive || isUpcoming;
    });
    
    // Si no hay eventos activos, no actualizar
    if (!hasActiveEvents) {
      console.log('⏸️ No hay eventos activos, pausando actualizaciones automáticas');
      return;
    }
    
    console.log('🔄 Eventos activos detectados, iniciando actualizaciones cada 60 segundos');
    
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdate > 50000) { // Solo actualizar si han pasado más de 50 segundos
        setCurrentTime(new Date());
        setLastUpdate(now);
      }
    }, 60000); // Cada 60 segundos

    return () => {
      clearInterval(timer);
      console.log('⏹️ Actualizaciones automáticas detenidas');
    };
  }, [events.length]); // Solo depende del número de eventos, no del contenido

  if (!mounted) {
    return null;
  }

  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  // Función para editar un borrador
  const handleEditDraft = (draft) => {
    // Navegar a create-event con el ID del borrador
    router.push(`/create-event?editDraft=${draft._id}`);
  };

  // Función para abrir modal de confirmación de eliminación
  const handleDeleteDraft = (draftId, draftName) => {
    setDeleteConfirmModal({
      open: true,
      draftId,
      draftName
    });
  };

  // Función para confirmar eliminación de borrador
  const confirmDeleteDraft = async () => {
    const { draftId } = deleteConfirmModal;
    
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.DRAFT_BY_ID(draftId), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        // Actualizar la lista de borradores
        setDrafts(prevDrafts => prevDrafts.filter(draft => draft._id !== draftId));
        
        // Cerrar modal
        setDeleteConfirmModal({ open: false, draftId: null, draftName: '' });
      } else {
        console.error('❌ Error al eliminar borrador:', result.message);
        alert(`Error al eliminar borrador: ${result.message || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('❌ Error al eliminar borrador:', err);
      alert(`Error al eliminar borrador: ${err.message}`);
    }
  };

  // Función para cancelar eliminación
  const cancelDeleteDraft = () => {
    setDeleteConfirmModal({ open: false, draftId: null, draftName: '' });
  };

  // Función para editar un evento - navega a la página de crear evento
  const handleEditEvent = (event) => {
    // Guardar el evento a editar en localStorage para que la página de crear evento pueda acceder a él
    localStorage.setItem('editingEvent', JSON.stringify(event));
    router.push('/create-event?mode=edit');
  };

  // Función para abrir modal de confirmación de cancelación
  const handleCancelEvent = (event) => {
    const eventId = event._id || event.id;
    if (!eventId) {
      alert('Error: No se pudo obtener el ID del evento');
      return;
    }
    
    setCancelConfirmModal({
      open: true,
      eventId: eventId,
      eventName: event.informacionGeneral?.nombreEvento || 'Evento sin nombre'
    });
  };

  // Función para confirmar cancelación de evento
  const confirmCancelEvent = async () => {
    const { eventId, eventName } = cancelConfirmModal;
    
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.EVENT_BY_ID(eventId), {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        // Actualizar el estado del evento a "cancelado" y desactivar todos los elementos
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.map(event => {
            if ((event._id || event.id) === eventId) {
              const updatedEvent = {
                ...event,
                informacionGeneral: {
                  ...event.informacionGeneral,
                  estado: 'cancelado'
                },
                // Desactivar todas las entradas
                entradas: event.entradas?.map(entrada => ({
                  ...entrada,
                  activa: false
                })) || [],
                // Desactivar todos los alimentos y bebestibles
                alimentosBebestibles: event.alimentosBebestibles?.map(alimento => ({
                  ...alimento,
                  activo: false
                })) || [],
                // Desactivar todas las actividades
                actividades: event.actividades?.map(actividad => ({
                  ...actividad,
                  activa: false
                })) || []
              };
              
              // Debug: verificar que se actualizó correctamente
              console.log('✅ Evento actualizado a cancelado:', {
                nombre: updatedEvent.informacionGeneral.nombreEvento,
                estado: updatedEvent.informacionGeneral.estado,
                id: updatedEvent._id || updatedEvent.id
              });
              
              return updatedEvent;
            }
            return event;
          });
          
          console.log('🔄 Eventos actualizados:', updatedEvents.map(e => ({
            nombre: e.informacionGeneral?.nombreEvento,
            estado: e.informacionGeneral?.estado
          })));
          
          return updatedEvents;
        });
        
        setCancelConfirmModal({ open: false, eventId: null, eventName: '' });
        setCancelSnackbar({
          open: true,
          message: result.message || `Evento "${eventName}" cancelado exitosamente`,
          severity: 'success'
        });
      } else {
        setCancelSnackbar({
          open: true,
          message: `Error al cancelar evento: ${result.message || 'Error desconocido'}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al cancelar evento:', error);
      setCancelSnackbar({
        open: true,
        message: `Error al cancelar evento: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Función para cancelar la cancelación
  const cancelCancelEvent = () => {
    setCancelConfirmModal({ open: false, eventId: null, eventName: '' });
  };

  // Función para cerrar el Snackbar de cancelación
  const handleCloseCancelSnackbar = () => {
    setCancelSnackbar({ open: false, message: '', severity: 'success' });
  };

  // Función para mostrar detalles del evento
  const handleViewEventDetails = (event) => {
    setSelectedEventForDetails(event);
    setDetailsModalOpen(true);
  };

  // Función para cerrar el modal de detalles
  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedEventForDetails(null);
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
    
    // Obtener estado dinámico del evento
    const eventStatus = getEventStatus(event, currentTime);
    
    return (
      <Card elevation={2} sx={{ 
        bgcolor: '#FFFFFF', 
        borderRadius: '12px', 
        mb: 2,
        '&:hover': {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)'
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Fila principal */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Puntito verde + Banner */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '80px' }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: eventStatus.color,
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
                {event.organizador?.correoElectronico || 'Sin correo'}
              </Typography>
            </Box>
            
            {/* Precio */}
            <Box sx={{ textAlign: 'left', minWidth: '80px', flex: '0 0 80px' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: '#2563EB',
                fontSize: '18px'
              }}>
                ${precioMinimo.toLocaleString()}
              </Typography>
            </Box>
            
            {/* Mensaje dinámico */}
            <Box sx={{ flex: '1 1 auto', minWidth: '200px', textAlign: 'center' }}>
              <Typography variant="body2" sx={{ 
                color: eventStatus.color,
                fontSize: eventStatus.status === 'en_curso' ? '18px' : '14px',
                fontWeight: eventStatus.status === 'en_curso' ? 700 : 500,
                wordBreak: 'break-word'
              }}>
                {eventStatus.status === 'por_comenzar' && eventStatus.timeText ? (
                  <>
                    Evento comenzará en <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{eventStatus.timeText}</span>
                  </>
                ) : (
                  eventStatus.message
                )}
              </Typography>
            </Box>
            
            {/* Asistentes */}
            <Box sx={{ flex: '0 0 140px', minWidth: '140px' }}>
              <Chip
                icon={<GroupsIcon />}
                label={`Asistentes ${totalAsistentes.toLocaleString()}`}
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
                    {event.organizador?.telefonoContacto || 'Sin teléfono'}
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
                    {event.organizador?.rutEmpresa || 'Sin RUT'}
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
                    {formatEventDate(event.informacionGeneral.fechaEvento)}
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
              <TableCell align="center">Horario</TableCell>
              <TableCell align="center">Entradas vendidas</TableCell>
              <TableCell align="center">Ingresos totales</TableCell>
              <TableCell align="center"></TableCell>
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
                  key={event.id || event._id || `event-${index}`}
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
                        {event.organizador?.nombreEmpresaColegio || 'Sin empresa'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Fecha */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {formatEventDate(event.informacionGeneral.fechaEvento)}
                    </Typography>
                  </TableCell>
                  
                  {/* Horario */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {event.informacionGeneral.horaInicio && event.informacionGeneral.horaTermino 
                        ? `${event.informacionGeneral.horaInicio} - ${event.informacionGeneral.horaTermino}`
                        : 'Sin horario'
                      }
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
                  
                  {/* Iconos de acción */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Cancelar evento" arrow>
                    <IconButton 
                      size="small"
                          onClick={() => handleCancelEvent(event)}
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
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Componente tabla para eventos finalizados (solo ver detalles)
  const EventTableFinalizados = ({ events }) => {
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
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => {
              const entradasVendidas = event.entradas?.reduce((total, entrada) => total + (entrada.entradasVendidas || 0), 0) || 0;
              const ingresosTotales = event.entradas?.reduce((total, entrada) => {
                const precio = parseFloat(entrada.precio || 0);
                const vendidas = parseInt(entrada.entradasVendidas || 0);
                return total + (precio * vendidas);
              }, 0) || 0;

              return (
                <TableRow key={event._id || `event-${index}`} sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                  {/* Avatar del evento */}
                  <TableCell>
                    <Avatar
                      src={event.informacionGeneral?.bannerPromocional}
                      alt={event.informacionGeneral?.nombreEvento || 'Evento'}
                      sx={{ width: 40, height: 40 }}
                    >
                      {!event.informacionGeneral?.bannerPromocional && (
                        <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600 }}>
                          {event.informacionGeneral?.nombreEvento?.charAt(0) || 'E'}
                        </Typography>
                      )}
                    </Avatar>
                  </TableCell>
                  
                  {/* Nombre del evento */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>
                        {event.informacionGeneral?.nombreEvento || 'Evento sin nombre'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                        {event.organizador?.nombreOrganizador || 'Organizador no especificado'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Fecha */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {formatEventDate(event.informacionGeneral?.fechaEvento)}
                    </Typography>
                  </TableCell>
                  
                  {/* Entradas vendidas */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {entradasVendidas}
                    </Typography>
                  </TableCell>
                  
                  {/* Ingresos totales */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#059669', fontWeight: 600 }}>
                      ${ingresosTotales.toLocaleString()} CLP
                    </Typography>
                  </TableCell>
                  
                                    {/* Iconos de acción */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Ver detalles del evento" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleViewEventDetails(event)}
                          sx={{ 
                            color: '#6B7280',
                            '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)' }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Componente tabla para eventos cancelados (solo ver detalles)
  const EventTableCancelados = ({ events }) => {
    return (
      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: '#F3F4F6', fontWeight: 600, fontSize: '14px', color: '#374151' } }}>
              <TableCell sx={{ width: '60px' }}></TableCell>
              <TableCell>Evento</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Horario</TableCell>
              <TableCell align="center">Entradas vendidas</TableCell>
              <TableCell align="center">Ingresos totales</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => {
              const entradasVendidas = event.entradas?.reduce((total, entrada) => total + (entrada.entradasVendidas || 0), 0) || 0;
              const ingresosTotales = event.entradas?.reduce((total, entrada) => {
                const precio = parseFloat(entrada.precio || 0);
                const vendidas = parseInt(entrada.entradasVendidas || 0);
                return total + (precio * vendidas);
              }, 0) || 0;

              return (
                <TableRow key={event._id || `event-${index}`} sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                  {/* Avatar del evento */}
                  <TableCell>
                    <Avatar
                      src={event.informacionGeneral?.bannerPromocional}
                      alt={event.informacionGeneral?.nombreEvento || 'Evento'}
                      sx={{ width: 40, height: 40 }}
                    >
                      {!event.informacionGeneral?.bannerPromocional && (
                        <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600 }}>
                          {event.informacionGeneral?.nombreEvento?.charAt(0) || 'E'}
                        </Typography>
                      )}
                    </Avatar>
                  </TableCell>
                  
                  {/* Nombre del evento */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>
                        {event.informacionGeneral?.nombreEvento || 'Evento sin nombre'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                        {event.organizador?.nombreOrganizador || 'Organizador no especificado'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Fecha */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {formatEventDate(event.informacionGeneral?.fechaEvento)}
                    </Typography>
                  </TableCell>
                  
                  {/* Horario */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {event.informacionGeneral?.horaInicio && event.informacionGeneral?.horaTermino 
                        ? `${event.informacionGeneral.horaInicio} - ${event.informacionGeneral.horaTermino}`
                        : 'Sin horario'
                      }
                    </Typography>
                  </TableCell>
                  
                  {/* Entradas vendidas */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {entradasVendidas}
                    </Typography>
                  </TableCell>
                  
                  {/* Ingresos totales */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#059669', fontWeight: 600 }}>
                      ${ingresosTotales.toLocaleString()} CLP
                    </Typography>
                  </TableCell>
                  
                  {/* Iconos de acción */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Ver detalles del evento" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleViewEventDetails(event)}
                          sx={{ 
                            color: '#6B7280',
                            '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)' }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Componente tabla para borradores
  const EventTableBorradores = ({ drafts }) => {
    return (
      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: '#F3F4F6', fontWeight: 600, fontSize: '14px', color: '#374151' } }}>
              <TableCell>Evento</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Entradas vendidas</TableCell>
              <TableCell align="center">Ingresos totales</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.map((draft, index) => {
              const ingresosTotales = draft.ingresosTotales || 0;
              const entradasVendidas = draft.entradas?.reduce((total, entrada) => total + (entrada.entradasVendidas || 0), 0) || 0;

              return (
                <TableRow 
                  key={draft._id || `draft-${index}`}
                  sx={{ 
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F3F4F6' },
                    '& td': { borderBottom: '1px solid #E5E7EB' }
                  }}
                >
                  {/* Imagen del evento */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={draft.informacionGeneral?.bannerPromocional}
                        sx={{ 
                          width: 48, 
                          height: 48,
                          bgcolor: '#E5E7EB'
                        }}
                      >
                        {draft.informacionGeneral?.nombreEvento?.charAt(0) || 'B'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                          {draft.informacionGeneral?.nombreEvento || 'Sin nombre'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
                          {draft.organizador?.nombreOrganizador || 'Sin organizador'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#374151' }}>
                      {formatEventDate(draft.informacionGeneral?.fechaEvento)}
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
                  
                  {/* Iconos de acción */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Continuar borrador" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleEditDraft(draft)}
                          sx={{ 
                            color: '#3B82F6',
                            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar borrador" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleDeleteDraft(draft._id, draft.informacionGeneral?.nombreEvento || 'Sin nombre')}
                          sx={{ 
                            color: '#EF4444',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };



  // Filtrar eventos activos por búsqueda
  const eventosActivosFiltrados = eventosActivos.filter(event => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const nombreEvento = event.informacionGeneral.nombreEvento.toLowerCase();
    const correoOrganizador = event.organizador?.correoElectronico?.toLowerCase() || '';
    const nombreEmpresa = event.organizador?.nombreEmpresaColegio?.toLowerCase() || '';
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
              variant={weekFilterActive ? "contained" : "outlined"}
              onClick={toggleWeekFilter}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                height: '32px',
                borderColor: weekFilterActive ? '#1F2937' : '#D1D5DB',
                color: weekFilterActive ? 'white' : '#374151',
                backgroundColor: weekFilterActive ? '#1F2937' : 'transparent',
                '&:hover': {
                  borderColor: weekFilterActive ? '#111827' : '#9CA3AF',
                  bgcolor: weekFilterActive ? '#111827' : '#F9FAFB'
                }
              }}
            >
              {weekFilterActive ? 'Ver todos' : 'Esta semana'}
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

          {/* Segunda fila: Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              startIcon={isRefreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 3,
                py: 1.5,
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#374151',
                  color: '#374151',
                }
              }}
            >
              {isRefreshing ? 'Actualizando...' : 'Actualizar estados'}
            </Button>
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

        {/* Indicador de filtro de semana */}
        {weekFilterActive && (
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            bgcolor: '#EFF6FF', 
            border: '1px solid #BFDBFE', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" sx={{ color: '#1E40AF', fontWeight: 500 }}>
              📅 Mostrando solo eventos de esta semana (lunes a domingo)
            </Typography>
          </Box>
        )}

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
                fontSize: '0.8rem',
                fontWeight: '700 !important',
                fontFamily: 'inherit',
                m: 0
              }}
            >
              Eventos Activos
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
                fontSize: '0.8rem',
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

        {/* Borradores */}
        <Box sx={{ mb: 4 }}>
          {/* Pestaña */}
          <Box sx={{ 
            bgcolor: '#F59E0B',
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
                fontSize: '0.8rem',
                fontWeight: '700 !important',
                fontFamily: 'inherit',
                m: 0
              }}
            >
              Borradores
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
              {draftsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body1" sx={{ ml: 2, color: '#6B7280' }}>
                    Cargando borradores...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
                    Error al cargar borradores: {error}
                  </Typography>
                  <Button 
                    onClick={fetchDrafts}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : drafts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '16px' }}>
                    No hay borradores guardados
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <EventTableBorradores drafts={expandedSections.borradores ? drafts : drafts.slice(0, 3)} />
                  {drafts.length > 3 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Button
                        onClick={() => toggleSectionExpansion('borradores')}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 3,
                          py: 1
                        }}
                      >
                        {expandedSections.borradores 
                          ? `Ver menos (${drafts.length - 3} menos)` 
                          : `Ver todos (${drafts.length - 3} más)`
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
                fontSize: '0.8rem',
                fontWeight: '700 !important',
                fontFamily: 'inherit',
                m: 0
              }}
            >
              Eventos Finalizados
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
                    No hay eventos finalizados
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <EventTableFinalizados events={expandedSections.pasados ? eventosPasados : eventosPasados.slice(0, 3)} />
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

        {/* Línea separadora */}
        <Box sx={{ 
          width: '100%', 
          height: '2px', 
          bgcolor: '#D9D9D9', 
          mb: 4,
          borderRadius: '1px'
        }} />

        {/* Eventos Cancelados */}
        <Box>
          {/* Pestaña */}
          <Box sx={{ 
            bgcolor: '#DC2626',
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
                fontSize: '0.8rem',
                fontWeight: '700 !important',
                fontFamily: 'inherit',
                m: 0
              }}
            >
              Eventos Cancelados
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
              ) : eventosCancelados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '16px' }}>
                    No hay eventos cancelados
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <EventTableCancelados events={expandedSections.cancelados ? eventosCancelados : eventosCancelados.slice(0, 3)} />
                  {eventosCancelados.length > 3 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Button
                        onClick={() => toggleSectionExpansion('cancelados')}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 3,
                          py: 1
                        }}
                      >
                        {expandedSections.cancelados 
                          ? `Ver menos (${eventosCancelados.length - 3} menos)` 
                          : `Ver todos (${eventosCancelados.length - 3} más)`
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

      {/* Modal de detalles del evento */}
      <Dialog 
        open={detailsModalOpen} 
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        {selectedEventForDetails && (
          <>
            <DialogTitle sx={{ 
              pb: 1,
              background: '#1B2735',
              color: 'white',
              borderRadius: '16px 16px 0 0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedEventForDetails.informacionGeneral?.bannerPromocional}
                  alt={selectedEventForDetails.informacionGeneral?.nombreEvento}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                    {selectedEventForDetails.informacionGeneral?.nombreEvento}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                    {selectedEventForDetails.organizador?.nombreOrganizador}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ 
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '0 0 16px 16px'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Información General */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                    📅 Información General
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Fecha del evento</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatEventDate(selectedEventForDetails.informacionGeneral?.fechaEvento)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Horario</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.informacionGeneral?.horaInicio} - {selectedEventForDetails.informacionGeneral?.horaTermino}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Ubicación</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.informacionGeneral?.lugarEvento || 'No especificada'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Estado</Typography>
                      <Chip 
                        label={getEventStatus(selectedEventForDetails, currentTime).message}
                        sx={{ 
                          bgcolor: getEventStatus(selectedEventForDetails, currentTime).color,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Organizador */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                    👤 Información del Organizador
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Nombre</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.organizador?.nombreOrganizador || 'No especificado'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Email</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.organizador?.correoElectronico || 'No especificado'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Teléfono</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.organizador?.telefonoContacto || 'No especificado'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Empresa</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.organizador?.nombreEmpresaColegio || 'No especificada'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>RUT Empresa</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.organizador?.rutEmpresa || 'No especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Configuración del Evento */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                    ⚙️ Configuración del Evento
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Permite Devolución</Typography>
                      <Chip 
                        label={selectedEventForDetails.configuracion?.permiteDevolucion ? 'Sí' : 'No'}
                        size="small"
                        sx={{ 
                          bgcolor: selectedEventForDetails.configuracion?.permiteDevolucion ? '#10B981' : '#EF4444',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Requiere Aprobación</Typography>
                      <Chip 
                        label={selectedEventForDetails.configuracion?.requiereAprobacion ? 'Sí' : 'No'}
                        size="small"
                        sx={{ 
                          bgcolor: selectedEventForDetails.configuracion?.requiereAprobacion ? '#F59E0B' : '#10B981',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Es Público</Typography>
                      <Chip 
                        label={selectedEventForDetails.configuracion?.esPublico ? 'Sí' : 'No'}
                        size="small"
                        sx={{ 
                          bgcolor: selectedEventForDetails.configuracion?.esPublico ? '#10B981' : '#6B7280',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Notificaciones</Typography>
                      <Chip 
                        label={selectedEventForDetails.configuracion?.notificacionesHabilitadas ? 'Habilitadas' : 'Deshabilitadas'}
                        size="small"
                        sx={{ 
                          bgcolor: selectedEventForDetails.configuracion?.notificacionesHabilitadas ? '#10B981' : '#EF4444',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>Límite Asistentes</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.configuracion?.limiteAsistentes || 'Sin límite'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Estado del Evento</Typography>
                      <Chip 
                        label={getEventStatus(selectedEventForDetails, currentTime).message}
                        size="small"
                        sx={{ 
                          bgcolor: getEventStatus(selectedEventForDetails, currentTime).color,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Entradas */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    🎫 Entradas
                  </Typography>
                  {selectedEventForDetails.entradas && selectedEventForDetails.entradas.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedEventForDetails.entradas.map((entrada, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Tipo</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {entrada.tipoEntrada || 'No especificado'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Precio</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#059669' }}>
                                ${parseFloat(entrada.precio || 0).toLocaleString()} CLP
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Vendidas</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {entrada.entradasVendidas || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Disponibles</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {entrada.cuposDisponibles || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Límite por Persona</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {entrada.limitePorPersona || 'Sin límite'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Estado</Typography>
                              <Chip 
                                label={getAutomaticStatus(selectedEventForDetails).entrada ? 'Activa' : 'Inactiva'}
                                size="small"
                                sx={{ 
                                  bgcolor: getAutomaticStatus(selectedEventForDetails).entrada ? '#10B981' : '#EF4444',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Box>
                          {entrada.fechasVenta && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #D1FAE5' }}>
                              <Typography variant="body2" sx={{ color: '#166534', mb: 1, fontWeight: 600 }}>
                                📅 Fechas de Venta
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#059669' }}>Inicio:</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {formatEventDate(entrada.fechasVenta.inicio)}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#059669' }}>Fin:</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {formatEventDate(entrada.fechasVenta.fin)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                      No hay entradas configuradas
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Alimentos y Bebestibles */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    🍕 Alimentos y Bebestibles
                  </Typography>
                  {selectedEventForDetails.alimentosBebestibles && selectedEventForDetails.alimentosBebestibles.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedEventForDetails.alimentosBebestibles.map((alimento, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: '#FEF3C7', border: '1px solid #FCD34D' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            {alimento.imagen && (
                              <Avatar
                                src={alimento.imagen}
                                alt={alimento.nombre}
                                sx={{ width: 48, height: 48 }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#92400E' }}>
                                {alimento.nombre}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#A16207', fontSize: '12px' }}>
                                {alimento.descripcion || 'Sin descripción'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#A16207', mb: 0.5 }}>Precio Unitario</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#92400E' }}>
                                ${parseFloat(alimento.precioUnitario || 0).toLocaleString()} CLP
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#A16207', mb: 0.5 }}>Stock Asignado</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {alimento.stockAsignado || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#A16207', mb: 0.5 }}>Stock Actual</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {alimento.stockActual || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#A16207', mb: 0.5 }}>Estado</Typography>
                              <Chip 
                                label={getAutomaticStatus(selectedEventForDetails).alimento ? 'Activo' : 'Inactivo'}
                                size="small"
                                sx={{ 
                                  bgcolor: getAutomaticStatus(selectedEventForDetails).alimento ? '#10B981' : '#EF4444',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                      No hay alimentos y bebestibles configurados
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Actividades */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    🎪 Actividades
                  </Typography>
                  {selectedEventForDetails.actividades && selectedEventForDetails.actividades.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedEventForDetails.actividades.map((actividad, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: '#EDE9FE', border: '1px solid #C4B5FD' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            {actividad.imagenPromocional && (
                              <Avatar
                                src={actividad.imagenPromocional}
                                alt={actividad.nombreActividad}
                                sx={{ width: 48, height: 48 }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#5B21B6' }}>
                                {actividad.nombreActividad}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7C3AED', fontSize: '12px' }}>
                                {actividad.descripcion || 'Sin descripción'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C3AED', mb: 0.5 }}>Precio Unitario</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#5B21B6' }}>
                                ${parseFloat(actividad.precioUnitario || 0).toLocaleString()} CLP
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C3AED', mb: 0.5 }}>Cupos Disponibles</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {actividad.cuposDisponibles || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C3AED', mb: 0.5 }}>Cupos Ocupados</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {actividad.cuposOcupados || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C3AED', mb: 0.5 }}>Horario</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {actividad.horaInicio} - {actividad.horaTermino}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C3AED', mb: 0.5 }}>Estado</Typography>
                              <Chip 
                                label={getAutomaticStatus(selectedEventForDetails).actividad ? 'Activa' : 'Inactiva'}
                                size="small"
                                sx={{ 
                                  bgcolor: getAutomaticStatus(selectedEventForDetails).actividad ? '#10B981' : '#EF4444',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                      No hay actividades configuradas
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Resumen de Ventas */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    📊 Resumen de Ventas
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
                    <Paper sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Total Entradas Vendidas</Typography>
                      <Typography variant="h6" sx={{ color: '#166534', fontWeight: 700 }}>
                        {selectedEventForDetails.entradas?.reduce((total, entrada) => total + (entrada.entradasVendidas || 0), 0) || 0}
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Total Entradas Disponibles</Typography>
                      <Typography variant="h6" sx={{ color: '#166534', fontWeight: 700 }}>
                        {selectedEventForDetails.entradas?.reduce((total, entrada) => total + (entrada.cuposDisponibles || 0), 0) || 0}
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Ingresos por Entradas</Typography>
                      <Typography variant="h6" sx={{ color: '#166534', fontWeight: 700 }}>
                        ${selectedEventForDetails.entradas?.reduce((total, entrada) => {
                          const precio = parseFloat(entrada.precio || 0);
                          const vendidas = parseInt(entrada.entradasVendidas || 0);
                          return total + (precio * vendidas);
                        }, 0).toLocaleString() || 0} CLP
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <Typography variant="body2" sx={{ color: '#166534', mb: 0.5 }}>Ingresos Totales del Evento</Typography>
                      <Typography variant="h6" sx={{ color: '#166534', fontWeight: 700 }}>
                        ${selectedEventForDetails.ingresosTotales?.toLocaleString() || 0} CLP
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                <Divider />

                {/* Usuarios Registrados */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    👥 Usuarios Registrados
                  </Typography>
                  {selectedEventForDetails.usuarios && selectedEventForDetails.usuarios.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedEventForDetails.usuarios.map((usuario, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#0369A1', mb: 0.5 }}>Nombre</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {usuario.nombre || 'No especificado'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#0369A1', mb: 0.5 }}>Email</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {usuario.email || 'No especificado'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#0369A1', mb: 0.5 }}>Teléfono</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {usuario.telefono || 'No especificado'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#0369A1', mb: 0.5 }}>Fecha Registro</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString('es-ES') : 'No especificada'}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                      No hay usuarios registrados para este evento
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Inventario del Evento */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    📦 Inventario del Evento
                  </Typography>
                  {selectedEventForDetails.inventario && selectedEventForDetails.inventario.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedEventForDetails.inventario.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            {item.imagen && (
                              <Avatar
                                src={item.imagen}
                                alt={item.nombre}
                                sx={{ width: 48, height: 48 }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
                                {item.nombre}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#15803D', fontSize: '12px' }}>
                                {item.categoria || 'Sin categoría'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#15803D', mb: 0.5 }}>Precio</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#166534' }}>
                                ${parseFloat(item.precio || 0).toLocaleString()} CLP
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#15803D', mb: 0.5 }}>Stock Inicial</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {item.stockInicial || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#15803D', mb: 0.5 }}>Stock Actual</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {item.stockActual || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#15803D', mb: 0.5 }}>Estado</Typography>
                              <Chip 
                                label={item.activo ? 'Activo' : 'Inactivo'}
                                size="small"
                                sx={{ 
                                  bgcolor: item.activo ? '#10B981' : '#EF4444',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                      No hay inventario asignado a este evento
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Metadata del Evento */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    📋 Información Técnica
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>ID del Evento</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '12px' }}>
                        {selectedEventForDetails._id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Slug</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '12px' }}>
                        {selectedEventForDetails.slug || 'No especificado'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Versión</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.metadata?.version || 'No especificada'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Creado Por</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.metadata?.creadoPor || 'No especificado'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Formulario Completo</Typography>
                      <Chip 
                        label={selectedEventForDetails.metadata?.formularioCompleto ? 'Sí' : 'No'}
                        size="small"
                        sx={{ 
                          bgcolor: selectedEventForDetails.metadata?.formularioCompleto ? '#10B981' : '#EF4444',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>Fecha de Creación</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedEventForDetails.createdAt ? new Date(selectedEventForDetails.createdAt).toLocaleDateString('es-ES') : 'No especificada'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={handleCloseDetailsModal}
                variant="contained"
                sx={{ 
                  bgcolor: '#6B7280',
                  '&:hover': { bgcolor: '#4B5563' },
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal de confirmación para eliminar borrador */}
      <Dialog
        open={deleteConfirmModal.open}
        onClose={cancelDeleteDraft}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          fontSize: '1.25rem', 
          fontWeight: 600,
          color: '#1F2937',
          textAlign: 'center'
        }}>
          ¿Eliminar borrador?
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ 
              color: '#6B7280',
              mb: 2,
              fontSize: '1rem'
            }}>
              ¿Estás seguro de que quieres eliminar el borrador
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#1F2937',
              fontWeight: 600,
              mb: 2,
              fontSize: '1.1rem'
            }}>
              "{deleteConfirmModal.draftName}"
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#EF4444',
              fontWeight: 500
            }}>
              Esta acción no se puede deshacer.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          justifyContent: 'center',
          gap: 2
        }}>
          <Button 
            onClick={cancelDeleteDraft}
            variant="outlined"
            sx={{ 
              borderColor: '#D1D5DB',
              color: '#6B7280',
              '&:hover': { 
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB'
              },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteDraft}
            variant="contained"
            sx={{ 
              bgcolor: '#EF4444',
              '&:hover': { bgcolor: '#DC2626' },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para cancelar evento */}
      <Dialog
        open={cancelConfirmModal.open}
        onClose={cancelCancelEvent}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          fontSize: '1.25rem', 
          fontWeight: 600,
          color: '#1F2937',
          textAlign: 'center'
        }}>
          ¿Cancelar evento?
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ 
              color: '#6B7280',
              mb: 2,
              fontSize: '1rem'
            }}>
              ¿Estás seguro de que quieres cancelar el evento
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#1F2937',
              fontWeight: 600,
              mb: 2,
              fontSize: '1.1rem'
            }}>
              "{cancelConfirmModal.eventName}"
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#DC2626',
              fontWeight: 500
            }}>
              El evento se moverá a la sección "Eventos cancelados".
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          justifyContent: 'center',
          gap: 2
        }}>
          <Button 
            onClick={cancelCancelEvent}
            variant="outlined"
            sx={{ 
              borderColor: '#D1D5DB',
              color: '#6B7280',
              '&:hover': { 
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB'
              },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmCancelEvent}
            variant="contained"
            sx={{ 
              bgcolor: '#DC2626',
              '&:hover': { bgcolor: '#B91C1C' },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Cancelar Evento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones de cancelación */}
      <Snackbar
        open={cancelSnackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseCancelSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseCancelSnackbar} 
          severity={cancelSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {cancelSnackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default EventsOverview;