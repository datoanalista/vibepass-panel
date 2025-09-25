"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API_CONFIG from '../config/api';
import useAuth from '../hooks/useAuth';

// Función para determinar el estado del evento según la hora actual
const getEventStatus = (event) => {
  if (!event?.informacionGeneral?.fechaEvento || !event?.informacionGeneral?.horaInicio || !event?.informacionGeneral?.horaTermino) {
    return { status: 'programado', message: 'Evento programado', color: '#3B82F6' };
  }

  const now = new Date();
  
  // Crear fecha del evento en formato local (YYYY-MM-DD)
  const eventDateString = event.informacionGeneral.fechaEvento; // "2025-09-03"
  const [year, month, day] = eventDateString.split('-');
  const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Crear fecha de hoy en formato local (sin horas)
  const today = new Date();
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
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  Chip,
  Menu
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import Usuarios from './Usuarios';
import AddUserForm from './AddUserForm';
import Inventario from './Inventario';
import AddInventoryForm from './AddInventoryForm';

const CalendarComponent = ({ selectedEventId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventDate, setEventDate] = useState(null);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventDate();
    }
  }, [selectedEventId]);

  const fetchEventDate = async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.EVENT_BY_ID(selectedEventId), API_CONFIG.REQUEST_CONFIG);
      const eventData = await response.json();
      
      const actualEventData = eventData.data?.event || eventData.data || eventData;
      
      let eventDateString = null;
      
      if (actualEventData.informacionGeneral) {
        eventDateString = actualEventData.informacionGeneral.fechaEvento;
      }
      
      if (!eventDateString) {
        eventDateString = actualEventData.informacionGeneral?.fechaInicio || 
                         actualEventData.informacionGeneral?.fecha || 
                         actualEventData.fechaInicio || 
                         actualEventData.fecha;
      }
      
      if (eventDateString) {
        // Corregir parsing de fecha para evitar problemas de zona horaria
        // Si la fecha viene en formato YYYY-MM-DD, agregar tiempo local
        let eventDateObj;
        if (eventDateString.includes('T')) {
          // Ya tiene información de tiempo
          eventDateObj = new Date(eventDateString);
        } else {
          // Solo fecha, agregar tiempo local para evitar desfase UTC
          eventDateObj = new Date(eventDateString + 'T00:00:00');
        }
        setEventDate(eventDateObj);
        setCurrentDate(eventDateObj);
      }
    } catch (error) {
      console.error('Error fetching event date:', error);
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isEventDay: false
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const isEventDay = eventDate && 
        dayDate.getDate() === eventDate.getDate() &&
        dayDate.getMonth() === eventDate.getMonth() &&
        dayDate.getFullYear() === eventDate.getFullYear();
      
      days.push({
        day,
        isCurrentMonth: true,
        isEventDay
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isEventDay: false
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <IconButton onClick={() => navigateMonth(-1)} size="small" sx={{ p: 0.5 }}>
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography variant="body1" sx={{ color: '#374151', fontWeight: 600, fontSize: '14px' }}>
          {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </Typography>
        <IconButton onClick={() => navigateMonth(1)} size="small" sx={{ p: 0.5 }}>
          <ChevronRightIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>

      <Stack direction="row" sx={{ mb: 1 }}>
        {dayNames.map((day) => (
          <Box key={day} sx={{ flex: 1, textAlign: 'center', py: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, fontSize: '12px' }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: 0.5,
        pb: 3
      }}>
        {days.map((dayData, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              cursor: 'pointer',
              bgcolor: dayData.isEventDay ? '#3B82F6' : 'transparent',
              color: dayData.isEventDay ? 'white' : 
                     dayData.isCurrentMonth ? '#374151' : '#9CA3AF',
              fontWeight: dayData.isEventDay ? 700 : 400,
              width: 22, // Ancho fijo para círculo perfecto
              height: 22, // Alto fijo para círculo perfecto
              minHeight: 22, // Reducido 30% (32 * 0.7 = 22.4 ≈ 22)
              '&:hover': {
                bgcolor: dayData.isEventDay ? '#2563EB' : '#F3F4F6'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '14px' }}>
              {dayData.day}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const EventAdminDashboard = () => {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [organizadores, setOrganizadores] = useState([]);
  const [selectedOrganizadorId, setSelectedOrganizadorId] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditInventoryForm, setShowEditInventoryForm] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [userFormData, setUserFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    rutOId: '',
    telefonoContacto: '',
    rol: 'Validador',
    password: ''
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [showUserSuccessModal, setShowUserSuccessModal] = useState(false);
  const [createdUserName, setCreatedUserName] = useState('');
  const [showUserErrorModal, setShowUserErrorModal] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState('');
  

  const [inventoryFormData, setInventoryFormData] = useState({
    nombreProducto: '',
    categoria: '',
    descripcion: '',
    skuCodigoInterno: '',
    precioVenta: '',
    stockInicialDisponible: '',
    imagenProducto: null
  });
  const [createInventoryLoading, setCreateInventoryLoading] = useState(false);

  // Función para obtener lista de organizadores (solo para admins)
  const fetchOrganizadores = async () => {
    if (!isAdmin()) return;
    
    try {
      const token = sessionStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(API_CONFIG.ENDPOINTS.ADMIN_ORGANIZADORES, {
        headers
      });
      
      if (response.ok) {
        const result = await response.json();
        setOrganizadores(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching organizadores:', error);
    }
  };

  const fetchEvents = async (organizadorId = null) => {
    try {
      setEventsLoading(true);
      
      let url = `${API_CONFIG.ENDPOINTS.DASHBOARD_EVENTS}?limit=500&page=1`;
      
      // Si es admin y se seleccionó un organizador específico, filtrar por organizador
      if (isAdmin() && organizadorId) {
        url += `&organizadorId=${organizadorId}`;
      }
      
      // Agregar token de autorización
      const token = sessionStorage.getItem('authToken');
      const headers = {
        ...API_CONFIG.REQUEST_CONFIG.headers,
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(url, {
        ...API_CONFIG.REQUEST_CONFIG,
        headers
      });
      
      // Manejar diferentes tipos de respuesta
      let result = null;
      if (response.status === 204) {
        // No Content - no hay eventos
        result = { status: 'success', data: { events: [] } };
      } else if (response.headers.get('content-type')?.includes('application/json')) {
        result = await response.json();
      } else {
        // Si no es JSON, asumir que no hay eventos
        result = { status: 'success', data: { events: [] } };
      }
      
      if (response.ok) {
        // Intentar diferentes estructuras de respuesta
        let eventsList = [];
        
        if (result.status === 'success' && result.data?.events) {
          eventsList = result.data.events;
        } else if (result.data && Array.isArray(result.data)) {
          eventsList = result.data;
        } else if (Array.isArray(result)) {
          eventsList = result;
        } else if (result.events && Array.isArray(result.events)) {
          eventsList = result.events;
        }
        
        setEvents(eventsList);
        
        // Siempre seleccionar el primer evento de la nueva lista
        // Esto asegura que cuando cambian los eventos (ej: cambio de organizador)
        // se seleccione un evento válido de la lista actual
        if (eventsList.length > 0) {
          setSelectedEventId(eventsList[0]._id);
        } else {
          // Si no hay eventos, limpiar la selección
          setSelectedEventId('');
        }
      } else {
        console.error('❌ API Error:', result?.message || 'Error desconocido');
        setEvents([]);
        setSelectedEventId('');
      }
    } catch (err) {
      console.error('💥 Error fetching events:', err);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };


  const handleUserFormChange = (field, value) => {
    setUserFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const createUser = async () => {
    try {
      setCreateUserLoading(true);
      

      const userDataWithEvent = {
        ...userFormData,
        eventoId: selectedEventId
      };
      
      const response = await fetch(API_CONFIG.ENDPOINTS.USERS, {
        method: 'POST',
        headers: {
          ...API_CONFIG.REQUEST_CONFIG.headers,
        },
        body: JSON.stringify(userDataWithEvent),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        setCreatedUserName(userFormData.nombreCompleto);
        setUserFormData({
          nombreCompleto: '',
          correoElectronico: '',
          rutOId: '',
          telefonoContacto: '',
          rol: 'Validador',
          password: ''
        });
        setShowAddUserForm(false);
        setShowUserSuccessModal(true);
      } else {
        // Manejar diferentes tipos de errores
        if (response.status === 400) {
          // Error 400: Errores de validación (RUT duplicado, datos inválidos, etc.)
          console.log('ℹ️ Validación del servidor:', result.message || 'Datos inválidos');
          setUserErrorMessage(result.message || 'Los datos ingresados no son válidos. Por favor, revise la información.');
        } else if (response.status >= 500) {
          // Error 500+: Errores del servidor
          console.error('❌ Error del servidor:', result.message || 'Error interno del servidor');
          setUserErrorMessage('Error interno del servidor. Por favor, intente nuevamente más tarde.');
        } else {
          // Otros errores
          console.warn('⚠️ Error inesperado:', result.message || 'Error desconocido');
          setUserErrorMessage(result.message || 'Error al crear el usuario. Por favor, intente nuevamente.');
        }
        setShowUserErrorModal(true);
      }
    } catch (error) {
      // Errores de red o conexión
      console.error('❌ Error de conexión:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setUserErrorMessage('Error de conexión. Por favor, verifique su conexión a internet.');
      } else {
        setUserErrorMessage('Error inesperado. Por favor, intente nuevamente.');
      }
      setShowUserErrorModal(true);
    } finally {
      setCreateUserLoading(false);
    }
  };


  const handleEditUser = (usuario) => {
    setEditingUser(usuario);
    setUserFormData({
      nombreCompleto: usuario.nombreCompleto || '',
      correoElectronico: usuario.correoElectronico || '',
      rutOId: usuario.rutOId || '',
      telefonoContacto: usuario.telefonoContacto || '',
      rol: usuario.rol || 'Validador',
      password: usuario.password || ''
    });
    setShowEditUserForm(true);
  };


  const updateUser = async () => {
    try {
      setCreateUserLoading(true);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.USER_BY_ID(editingUser._id || editingUser.id), {
        method: 'PUT',
        headers: {
          ...API_CONFIG.REQUEST_CONFIG.headers,
        },
        body: JSON.stringify(userFormData),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        setUserFormData({
          nombreCompleto: '',
          correoElectronico: '',
          rutOId: '',
          telefonoContacto: '',
          rol: 'Validador',
          password: ''
        });
        setShowEditUserForm(false);
        setEditingUser(null);
        setShowUserSuccessModal(true);
        setCreatedUserName(userFormData.nombreCompleto);
      } else {
        // Manejar diferentes tipos de errores
        if (response.status === 400) {
          // Error 400: Errores de validación (RUT duplicado, datos inválidos, etc.)
          console.log('ℹ️ Validación del servidor:', result.message || 'Datos inválidos');
          setUserErrorMessage(result.message || 'Los datos ingresados no son válidos. Por favor, revise la información.');
        } else if (response.status >= 500) {
          // Error 500+: Errores del servidor
          console.error('❌ Error del servidor:', result.message || 'Error interno del servidor');
          setUserErrorMessage('Error interno del servidor. Por favor, intente nuevamente más tarde.');
        } else {
          // Otros errores
          console.warn('⚠️ Error inesperado:', result.message || 'Error desconocido');
          setUserErrorMessage(result.message || 'Error al actualizar el usuario. Por favor, intente nuevamente.');
        }
        setShowUserErrorModal(true);
      }
    } catch (error) {
      // Errores de red o conexión
      console.error('❌ Error de conexión:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setUserErrorMessage('Error de conexión. Por favor, verifique su conexión a internet.');
      } else {
        setUserErrorMessage('Error inesperado. Por favor, intente nuevamente.');
      }
      setShowUserErrorModal(true);
    } finally {
      setCreateUserLoading(false);
    }
  };


  const handleInventoryFormChange = (field, value) => {
    setInventoryFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleEditInventory = (item) => {
    setEditingInventory(item);
    setInventoryFormData({
      nombreProducto: item.nombre || item.nombreProducto || '',
      categoria: item.categoria || '',
      descripcion: item.descripcion || '',
      skuCodigoInterno: item.sku || '',
      precioVenta: item.precio || item.precioVenta || '',
      stockInicialDisponible: item.stock?.actual || item.stockActual || '',
      imagenProducto: item.imagen ? { name: 'imagen_actual.jpg', url: item.imagen } : null
    });
    setShowEditInventoryForm(true);
  };


  const updateInventory = async () => {
    try {
      setCreateInventoryLoading(true);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.INVENTORY_BY_ID(editingInventory.id || editingInventory._id), {
        method: 'PUT',
        headers: {
          ...API_CONFIG.REQUEST_CONFIG.headers,
        },
        body: JSON.stringify({
          nombreProducto: inventoryFormData.nombreProducto,
          categoria: inventoryFormData.categoria,
          descripcion: inventoryFormData.descripcion,
          sku: inventoryFormData.skuCodigoInterno,
          precioVenta: parseInt(inventoryFormData.precioVenta) || 0,
          stockInicial: parseInt(inventoryFormData.stockInicialDisponible) || 0,
          imagen: inventoryFormData.imagenProducto?.url || null
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        
        setInventoryFormData({
          nombreProducto: '',
          categoria: '',
          descripcion: '',
          skuCodigoInterno: '',
          precioVenta: '',
          stockInicialDisponible: '',
          imagenProducto: null
        });
        
        setShowEditInventoryForm(false);
        setEditingInventory(null);
        

      } else {
        throw new Error(result.message || 'Error al actualizar el producto');
      }
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      console.error('Error al actualizar producto:', error.message);
    } finally {
      setCreateInventoryLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchEvents();
    if (isAdmin()) {
      fetchOrganizadores();
    }
  }, []);

  // Efecto para filtrar eventos cuando cambia el organizador seleccionado
  useEffect(() => {
    if (mounted && isAdmin() && selectedOrganizadorId !== '') {
      fetchEvents(selectedOrganizadorId || null);
    }
  }, [selectedOrganizadorId, mounted]);

  // Cerrar menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return null;
  }


  const selectedEvent = events.find(event => event._id === selectedEventId);
  const selectedEventName = selectedEvent?.informacionGeneral?.nombreEvento || 'Seleccionar evento';
  
  // Formatear el nombre del evento seleccionado con fecha
  const getSelectedEventDisplayName = () => {
    if (!selectedEvent) return 'Seleccionar evento';
    
    const eventName = selectedEvent.informacionGeneral?.nombreEvento || 'Evento sin nombre';
    const eventDate = selectedEvent.informacionGeneral?.fechaEvento;
    
    if (eventDate) {
      try {
        // Parsear la fecha como local para evitar problemas de timezone
        const [year, month, day] = eventDate.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const dayNum = date.getDate();
        const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
        const yearNum = date.getFullYear();
        const formattedDate = `${dayNum} de ${monthName} de ${yearNum}`;
        return `${eventName} / ${formattedDate}`;
      } catch (error) {
        console.error('Error formatting selected event date:', error);
        return eventName;
      }
    }
    
    return eventName;
  };

  // Componente Header limpio con Material-UI
  const Header = () => (
    <Box sx={{
      width: '100%',
      bgcolor: '#1B2735',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)'
    }}>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2
      }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}>
              <img 
                src="/vibepass-panel/vibepass.svg" 
                alt="VibePass" 
                style={{ 
                  height: '32px', 
                  width: 'auto'
                }} 
              />
            </Box>
          </Link>
          

          <Tabs 
            value={activeView} 
            onChange={(e, newValue) => {
              // Solo permitir cambio a usuarios o inventario si hay eventos disponibles
              if (newValue === 'usuarios' || newValue === 'inventario') {
                if (selectedEventId && events.length > 0) {
                  setActiveView(newValue);
                }
              } else {
                setActiveView(newValue);
              }
            }}
            sx={{
              '& .MuiTab-root': {
                color: '#B0BEC5',
                textTransform: 'none',
                fontWeight: 500,
                minHeight: '48px',
                '&.Mui-selected': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab 
              value="dashboard" 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DashboardIcon fontSize="small" />
                  Dashboard
                </Box>
              }
            />
            <Tab 
              value="usuarios" 
              disabled={!selectedEventId || events.length === 0}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: (!selectedEventId || events.length === 0) ? '#6B7280' : 'inherit'
                }}>
                  <PeopleIcon fontSize="small" />
                  Usuarios
                </Box>
              }
            />
            <Tab 
              value="inventario" 
              disabled={!selectedEventId || events.length === 0}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: (!selectedEventId || events.length === 0) ? '#6B7280' : 'inherit'
                }}>
                  <InventoryIcon fontSize="small" />
                  Inventario
                </Box>
              }
            />
          </Tabs>
        </Box>


        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}>
            <SearchIcon />
          </IconButton>

          <IconButton sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}>
            <NotificationsIcon />
          </IconButton>

          {user && (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: user.tipo === 'admin' ? '#EF4444' : '#10B981',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                {user.nombreCompleto?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}>
                  {user.nombreCompleto}
                </Typography>
                <Typography sx={{
                  color: '#B0BEC5',
                  fontSize: '12px',
                  lineHeight: 1.2
                }}>
                  {user.tipo === 'admin' ? 'Administrador' : 'Organizador'}
                </Typography>
              </Box>
            </Stack>
          )}

          <IconButton 
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{ 
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Menu del usuario */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                minWidth: '160px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                mt: 1
              }
            }}
          >
            <MenuItem onClick={logout} sx={{ gap: 1, color: '#EF4444' }}>
              <ExitToAppIcon fontSize="small" />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );

  // Custom Event Dropdown Component
  const EventDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Filter events based on search term
    const filteredEvents = events.filter(event => {
      const eventName = event.informacionGeneral?.nombreEvento || '';
      const eventDate = event.informacionGeneral?.fechaEvento || '';
      return eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             eventDate.includes(searchTerm);
    });

    // Sort events by status priority: activo > programado > borrador > finalizado > cancelado
    const sortedEvents = filteredEvents.sort((a, b) => {
      const getStatusPriority = (event) => {
        const estado = (event.informacionGeneral?.estado || event.estado || 'programado').toLowerCase();
        switch(estado) {
          case 'activo': return 1;
          case 'programado': return 2;
          case 'borrador': return 3;
          case 'finalizado': return 4;
          case 'cancelado': return 5;
          default: return 6;
        }
      };
      
      const priorityA = getStatusPriority(a);
      const priorityB = getStatusPriority(b);
      
      // Si tienen la misma prioridad, ordenar por nombre
      if (priorityA === priorityB) {
        const nameA = a.informacionGeneral?.nombreEvento || '';
        const nameB = b.informacionGeneral?.nombreEvento || '';
        return nameA.localeCompare(nameB);
      }
      
      return priorityA - priorityB;
    });


    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEventSelect = (eventId) => {
      setSelectedEventId(eventId);
      setIsOpen(false);
      setSearchTerm('');
    };

    const getEventDisplayInfo = (event) => {
      const eventName = event.informacionGeneral?.nombreEvento || 'Evento sin nombre';
      const eventDate = event.informacionGeneral?.fechaEvento;
      
      let formattedDate = '';
      if (eventDate) {
        try {
          const [year, month, day] = eventDate.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const dayNum = date.getDate();
          const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
          const yearNum = date.getFullYear();
          formattedDate = `${dayNum} de ${monthName} de ${yearNum}`;
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }
      
      const displayText = formattedDate ? `${eventName} / ${formattedDate}` : eventName;
      
      // Usar el campo "estado" de informacionGeneral
      const estado = event.informacionGeneral?.estado || event.estado || 'programado';
      const status = {
        status: estado,
        color: (() => {
          switch(estado.toLowerCase()) {
            case 'programado': return '#3B82F6'; // Azul
            case 'activo': return '#EF4444'; // Rojo
            case 'borrador': return '#F59E0B'; // Amarillo/Naranja
            case 'finalizado': return '#059669'; // Verde oscuro
            case 'cancelado': return '#6B7280'; // Gris
            default: return '#6B7280';
          }
        })(),
        message: (() => {
          switch(estado.toLowerCase()) {
            case 'programado': return 'Evento programado';
            case 'activo': return 'Evento activo';
            case 'borrador': return 'Borrador';
            case 'finalizado': return 'Evento finalizado';
            case 'cancelado': return 'Evento cancelado';
            default: return 'Estado desconocido';
          }
        })()
      };
      
      return { displayText, status };
    };
                  
                  return (
      <Box sx={{ position: 'relative', minWidth: 380 }} ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <Box
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            minWidth: 380,
            height: 40,
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#D1D5DB'
            }
          }}
        >
          <Typography sx={{
            color: '#374151',
            fontSize: '14px',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {selectedEvent ? getEventDisplayInfo(selectedEvent).displayText : 'Seleccionar evento'}
          </Typography>
          <KeyboardArrowDownIcon 
            sx={{ 
              color: '#6B7280', 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </Box>

        {/* Dropdown Menu */}
        {isOpen && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            {/* Search Input */}
            <Box sx={{ p: 2, borderBottom: '1px solid #F3F4F6' }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                px: 2,
                py: 1
              }}>
                <SearchIcon sx={{ color: '#6B7280', fontSize: '18px', mr: 1 }} />
                <input
                  type="text"
                  placeholder="Buscar evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#374151',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                />
              </Box>
            </Box>

            {/* Events List */}
            <Box sx={{
              maxHeight: '400px', // Aumentado para mostrar más eventos
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
                borderRadius: '2px',
                '&:hover': {
                  backgroundColor: 'rgba(156, 163, 175, 0.7)'
                }
              }
            }}>
              {eventsLoading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
                    Cargando eventos...
                  </Typography>
                </Box>
              ) : sortedEvents.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
                    {searchTerm ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
                  </Typography>
                </Box>
              ) : (
                sortedEvents.map((event) => {
                  const { displayText, status } = getEventDisplayInfo(event);
                  const isSelected = event._id === selectedEventId;
                  
                  return (
                    <Box
                      key={event._id} 
                      onClick={() => handleEventSelect(event._id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        px: 2.5,
                        py: 2,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#F0F9FF' : 'transparent',
                        borderLeft: isSelected ? '3px solid #3B82F6' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isSelected ? '#F0F9FF' : '#F8FAFC',
                          borderLeft: '3px solid #E5E7EB'
                        }
                      }}
                    >
                      {/* Event Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography sx={{
                            fontSize: '14px',
                            fontWeight: isSelected ? 600 : 500,
                            color: '#374151',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.4,
                            flex: 1,
                            mr: 1
                          }}>
                            {displayText}
                          </Typography>
                          
                          {/* Status Badge - Más pequeño y proporcional */}
                          <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: status.color,
                            color: 'white',
                            px: 0.3,
                            py: 0.1,
                            borderRadius: '10px',
                            flexShrink: 0,
                            minWidth: 'fit-content'
                          }}>
                            <Typography sx={{
                              fontSize: '10px',
                              fontWeight: 400,
                              letterSpacing: '0.005em',
                              textTransform: 'capitalize',
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                              fontStyle: 'italic',
                              color: 'white !important',
                              lineHeight: 1,
                              transform: 'scale(0.6)',
                              transformOrigin: 'center'
                            }}>
                              {status.status === 'programado' && 'Programado'}
                              {status.status === 'activo' && 'Activo'}
                              {status.status === 'borrador' && 'Borrador'}
                              {status.status === 'finalizado' && 'Finalizado'}
                              {status.status === 'cancelado' && 'Cancelado'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              )}
        </Box>
      </Box>
        )}
      </Box>
    );
  };

  // Componente Event Selector (debajo del header) - Con nuevo dropdown
  const EventSelector = () => (
    <Box sx={{
      width: '100%',
      bgcolor: '#F5F7FA',
      borderBottom: '1px solid #E5E7EB',
      px: 3,
      py: 2
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#374151'
          }}>
            Evento - <em>{selectedEvent?.informacionGeneral?.nombreEvento || 'Seleccione un evento...'}</em>
          </Typography>

        </Box>

        <EventDropdown />
      </Box>
    </Box>
  );

    const DashboardView = () => {
         const [dashboardData, setDashboardData] = useState({
      totalVentas: 0,
      ventasDelDia: 0,
      ticketsVendidos: 0,
      ventasDetalle: [],
      eventoActivo: 'programado'
    });
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [showAllAgendables, setShowAllAgendables] = useState(false);
    
    // Estados para modal de ventas
    const [showSalesModal, setShowSalesModal] = useState(false);
    const [salesData, setSalesData] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesPage, setSalesPage] = useState(1);
    const [salesHasMore, setSalesHasMore] = useState(true);
    const [salesTotal, setSalesTotal] = useState(0);
    const [expandedSales, setExpandedSales] = useState(new Set());

    // Función para obtener las ventas del evento con paginación
    const fetchSalesData = async (page = 1, append = false) => {
      if (!selectedEventId) {
        console.log('🚫 DEBUG: No selectedEventId, aborting fetchSalesData');
        return;
      }
      
      console.log('🚀 DEBUG: Starting fetchSalesData for eventId:', selectedEventId, 'page:', page);
      
      try {
        setSalesLoading(true);
        const url = `${API_CONFIG.ENDPOINTS.SALES_BY_EVENT(selectedEventId)}?page=${page}&limit=10`;
        console.log('📡 DEBUG: Fetching URL:', url);
        
        const response = await fetch(url, API_CONFIG.REQUEST_CONFIG);
        console.log('📥 DEBUG: Response status:', response.status);
        console.log('📥 DEBUG: Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const salesResult = await response.json();
        console.log('📊 DEBUG: Raw API response:', salesResult);
        
        // Manejar diferentes estructuras de respuesta
        const sales = salesResult.data?.sales || salesResult.data || salesResult.sales || salesResult || [];
        const pagination = salesResult.data?.pagination || {};
        
        console.log('🔍 DEBUG: Extracted sales:', sales);
        console.log('🔍 DEBUG: Pagination info:', pagination);
        
        const finalSales = Array.isArray(sales) ? sales : [];
        
        if (append) {
          setSalesData(prevData => [...prevData, ...finalSales]);
        } else {
          setSalesData(finalSales);
        }
        
        // Actualizar información de paginación
        setSalesTotal(pagination.total || finalSales.length);
        setSalesHasMore(pagination.hasNext || false);
        setSalesPage(page);
        
        console.log('✅ DEBUG: Final sales data length:', finalSales.length);
        console.log('✅ DEBUG: Has more pages:', pagination.hasNext);
      } catch (error) {
        console.error('❌ DEBUG: Error fetching sales data:', error);
        console.error('❌ DEBUG: Error message:', error.message);
        if (!append) setSalesData([]);
      } finally {
        setSalesLoading(false);
        console.log('🏁 DEBUG: fetchSalesData completed');
      }
    };

    // Función para abrir modal de ventas
    const handleOpenSalesModal = () => {
      console.log('🎯 DEBUG: Opening sales modal for event:', selectedEventId);
      console.log('🎯 DEBUG: Selected event object:', selectedEvent);
      console.log('🎯 DEBUG: Event name:', selectedEvent?.informacionGeneral?.nombreEvento);
      
      // Reset estados
      setSalesData([]);
      setSalesPage(1);
      setSalesHasMore(true);
      setSalesTotal(0);
      setExpandedSales(new Set());
      
      setShowSalesModal(true);
      fetchSalesData(1, false);
    };

    // Función para cargar más ventas
    const loadMoreSales = () => {
      if (salesHasMore && !salesLoading) {
        fetchSalesData(salesPage + 1, true);
      }
    };

    // Función para toggle colapso de venta
    const toggleSaleExpanded = (saleIndex) => {
      setExpandedSales(prev => {
        const newSet = new Set(prev);
        if (newSet.has(saleIndex)) {
          newSet.delete(saleIndex);
        } else {
          newSet.add(saleIndex);
        }
        return newSet;
      });
    };

    // Removed automatic time updates to prevent API spam

    useEffect(() => {
      if (selectedEventId) {
        fetchDashboardData();
      } else {
        // Si no hay evento seleccionado, detener el loading
        setLoading(false);
      }
    }, [selectedEventId]);

    // Efecto para mantener la vista en dashboard cuando no hay eventos
    useEffect(() => {
      if ((!selectedEventId || events.length === 0) && (activeView === 'usuarios' || activeView === 'inventario')) {
        setActiveView('dashboard');
      }
    }, [selectedEventId, events.length, activeView]);

    // Removed time-based status updates to prevent API spam

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Solo obtener inventario para la sección de productos agendables
        const inventoryResponse = await fetch(`${API_CONFIG.ENDPOINTS.INVENTORY}?eventoId=${selectedEventId}`);
        const inventoryData = await inventoryResponse.json();
        
        const inventoryArray = Array.isArray(inventoryData) ? inventoryData : (inventoryData.data?.items || inventoryData.inventory || inventoryData.data || []);
        setInventory(inventoryArray);
        
        // Determinar el estado del evento usando la nueva función
        const eventStatus = getEventStatus(selectedEvent);
         
         // Inicializar con valores por defecto - se calcularán después de procesar las tablas
         setDashboardData({
           totalVentas: 0,
           ventasDelDia: 0,
           ticketsVendidos: 0,
           eventoActivo: eventStatus.status,
           eventStatus: eventStatus
         });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
                 setDashboardData({
           totalVentas: 0,
           ventasDelDia: 0,
           ticketsVendidos: 0,
           eventoActivo: 'programado',
           eventStatus: { status: 'programado', message: 'Evento programado', color: '#3B82F6' }
         });
      } finally {
        setLoading(false);
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(amount);
    };

    // Función para calcular los valores de las cards desde las tablas
    const calculateCardValues = () => {
      if (!selectedEvent) return { totalVentas: 0, ticketsVendidos: 0, ventasDelDia: 0 };

      // 1. Calcular total de tickets vendidos desde la tabla Tickets
      let ticketsVendidos = 0;
      if (selectedEvent.entradas) {
        ticketsVendidos = selectedEvent.entradas.reduce((total, entrada) => {
          return total + (entrada.entradasVendidas || 0);
        }, 0);
      }

      // 2. Calcular total de ventas sumando los totales de cada sección
      
      // 2.1 Total ventas de Tickets
      let totalVentasTickets = 0;
      if (selectedEvent.entradas) {
        totalVentasTickets = selectedEvent.entradas.reduce((total, entrada) => {
          return total + ((entrada.precio || 0) * (entrada.entradasVendidas || 0));
        }, 0);
      }

      // 2.2 Total ventas de Alimentos y Bebidas
      let totalVentasAlimentos = 0;
      if (selectedEvent.alimentosBebestibles) {
        totalVentasAlimentos = selectedEvent.alimentosBebestibles.reduce((total, item) => {
          const vendidos = (item.stockAsignado || 0) - (item.stockActual || 0);
          return total + ((item.precioUnitario || 0) * vendidos);
        }, 0);
      }

      // 2.3 Total ventas de Actividades
      let totalVentasActividades = 0;
      if (selectedEvent.actividades) {
        totalVentasActividades = selectedEvent.actividades.reduce((total, actividad) => {
          return total + ((actividad.precioUnitario || 0) * (actividad.cuposOcupados || 0));
        }, 0);
      }

      // 3. Sumar todos los totales
      const totalVentas = totalVentasTickets + totalVentasAlimentos + totalVentasActividades;

      // 4. Ventas del día = Total de ventas (temporalmente)
      const ventasDelDia = totalVentas;

      return {
        totalVentas,
        ticketsVendidos,
        ventasDelDia
      };
    };

    // Calcular valores de las cards desde las tablas
    const cardValues = calculateCardValues();

    // Mostrar loading mientras se cargan los datos
    if (loading) {
      // Usar la variable selectedEvent que ya existe y está correctamente definida
      const selectedEventName = selectedEvent?.informacionGeneral?.nombreEvento || 'evento';
      
      return (
        <Box sx={{ 
          bgcolor: '#F5F7FA', 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              mb: 3,
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
            <Typography variant="h6" sx={{ 
              color: '#374151', 
              fontWeight: 600,
              fontSize: '18px'
            }}>
              Cargando datos de {selectedEventName}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6B7280', 
              mt: 1,
              fontSize: '14px'
            }}>
              Por favor espera un momento...
            </Typography>
          </Box>
        </Box>
      );
    }

    // Mostrar mensaje cuando no hay eventos
    if (!selectedEventId || events.length === 0) {
      return (
        <Box sx={{ 
          bgcolor: '#F5F7FA', 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              bgcolor: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <Typography sx={{ 
                fontSize: '32px',
                color: '#9CA3AF'
              }}>
                📅
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              color: '#374151', 
              fontWeight: 600,
              fontSize: '18px',
              mb: 1
            }}>
              No hay eventos disponibles
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6B7280', 
              fontSize: '14px',
              mb: 3
            }}>
              {isAdmin() 
                ? 'No se encontraron eventos en el sistema. Los organizadores pueden crear eventos desde el panel de creación.'
                : 'No tienes eventos creados. Ve a "Crear Evento" para comenzar.'
              }
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/create-event')}
              sx={{
                color: '#1B2735',
                backgroundColor: 'transparent',
                border: '1px solid #9CA3AF',
                borderRadius: '100px',
                textTransform: 'none',
                px: 3,
                py: 1,
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(27, 39, 53, 0.05)',
                  borderColor: '#6B7280'
                }
              }}
            >
              Crear Evento
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        bgcolor: '#F5F7FA', 
        minHeight: 'calc(100vh - 80px)',
        p: 4
      }}>

        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: dashboardData.eventStatus?.color || '#3B82F6'
            }} />
            <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
              {dashboardData.eventStatus?.status === 'por_comenzar' && dashboardData.eventStatus?.timeText ? (
                <>
                  Evento comenzará en <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{dashboardData.eventStatus.timeText}</span>
                </>
              ) : (
                dashboardData.eventStatus?.message || 'Evento programado'
              )}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button 
              variant="contained" 
              startIcon={<ShareIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%) !important',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%) !important'
                },
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(30, 41, 59, 0.3)',
                color: 'white !important',
                fontWeight: 500,
                px: 3,
                py: 1,
                '&.MuiButton-root': {
                  background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%) !important',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%) !important'
                  }
                }
              }}
            >
              Compartir
            </Button>
          </Stack>
        </Box>


        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>

          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AttachMoneyIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Total de ventas
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#374151', fontWeight: 700 }}>
                  {formatCurrency(cardValues.totalVentas)}
                </Typography>
              </Box>
            </Stack>
          </Paper>


          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <DescriptionIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Ventas atribuibles del día
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#374151', fontWeight: 700 }}>
                  {formatCurrency(cardValues.ventasDelDia)}
                </Typography>
              </Box>
            </Stack>
          </Paper>


          <Paper 
            onClick={handleOpenSalesModal}
            sx={{ 
              flex: 1, 
              p: 3, 
              borderRadius: '12px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
                bgcolor: '#F8FAFC'
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <PersonIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Tickets vendidos
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#374151', fontWeight: 700 }}>
                  {cardValues.ticketsVendidos}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ 
                  color: '#6B7280', 
                  fontSize: '20px',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': { color: '#3B82F6' }
                }} />
                <Typography variant="caption" sx={{ 
                  color: '#6B7280', 
                  fontSize: '10px',
                  textAlign: 'center',
                  lineHeight: 1
                }}>
                  Ver registros
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>


         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
             <Typography variant="h6" sx={{ color: '#374151', mb: 2, fontWeight: 600 }}>
               Detalle ventas
             </Typography>
             <Paper sx={{ 
               width: 800,
               minHeight: 320,
               p: 3, 
               borderRadius: '12px',
               boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
               display: 'flex',
               flexDirection: 'column'
             }}>
               {/* Sección Tickets */}
               <Box sx={{ mb: 4 }}>
                 <Box sx={{ mb: 2 }}>
                   <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, fontSize: '16px' }}>
                     🎫 Tickets
                   </Typography>
                 </Box>
                 
                 {selectedEvent?.entradas && selectedEvent.entradas.length > 0 ? (
                   <Box sx={{ 
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     overflow: 'hidden'
                   }}>
                     {/* Header */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.9fr',
                       gap: 1,
                       bgcolor: '#F9FAFB',
                       p: 2,
                       borderBottom: '1px solid #E5E7EB'
                     }}>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px' }}>Evento</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Tipo entrada</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Total Tickets</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Vendidos</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Disponibles</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Valor</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Total venta</Typography>
                     </Box>
                     
                     {/* Rows */}
                     {selectedEvent.entradas.map((entrada, index) => {
                       const cuposDisponibles = entrada.cuposDisponibles || 0;
                       const entradasVendidas = entrada.entradasVendidas || 0;
                       const disponibles = cuposDisponibles - entradasVendidas;
                       const precio = entrada.precio || 0;
                       const totalVenta = precio * entradasVendidas;
                       
                       // Función para enmascarar tipos de entrada
                       const getTipoEntradaDisplay = (tipoOriginal) => {
                         const tipo = (tipoOriginal || '').toLowerCase();
                         if (tipo.includes('general')) return 'General';
                         if (tipo.includes('vip')) return 'VIP';
                         if (tipo.includes('estudiante')) return 'Estudiante';
                         if (tipo.includes('tercera') || tipo.includes('edad') || tipo.includes('adulto')) return 'Tercera Edad';
                         if (tipo.includes('profesor') || tipo.includes('docente')) return 'Profesores';
                         return 'General'; // Default
                       };
                       
                       return (
                         <Box key={index} sx={{ 
                           display: 'grid', 
                           gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.9fr',
                           gap: 1,
                           p: 2,
                           borderBottom: index < selectedEvent.entradas.length - 1 ? '1px solid #F3F4F6' : 'none',
                           '&:hover': { bgcolor: '#F9FAFB' }
                         }}>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151' }}>
                             {selectedEvent.informacionGeneral?.nombreEvento || 'Evento'}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {getTipoEntradaDisplay(entrada.tipoEntrada)}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {cuposDisponibles.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {entradasVendidas.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                             {disponibles.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {formatCurrency(precio)}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {formatCurrency(totalVenta)}
                           </Typography>
                         </Box>
                       );
                     })}
                     
                     {/* Fila de Resumen */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.9fr',
                       gap: 1,
                       p: 2,
                       borderTop: '2px solid #E5E7EB',
                       bgcolor: '#F9FAFB',
                       fontWeight: 600
                     }}>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700 }}>
                         Resumen
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                         -
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalTickets = selectedEvent.entradas.reduce((total, entrada) => {
                             return total + (entrada.cuposDisponibles || 0);
                           }, 0);
                           return totalTickets.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalVendidos = selectedEvent.entradas.reduce((total, entrada) => {
                             return total + (entrada.entradasVendidas || 0);
                           }, 0);
                           return totalVendidos.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalDisponibles = selectedEvent.entradas.reduce((total, entrada) => {
                             const disponibles = (entrada.cuposDisponibles || 0) - (entrada.entradasVendidas || 0);
                             return total + disponibles;
                           }, 0);
                           return totalDisponibles.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                         -
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalVentas = selectedEvent.entradas.reduce((total, entrada) => {
                             return total + ((entrada.precio || 0) * (entrada.entradasVendidas || 0));
                           }, 0);
                           return formatCurrency(totalVentas);
                         })()}
                       </Typography>
                     </Box>
                   </Box>
                 ) : (
                   <Box sx={{ 
                     p: 3, 
                     textAlign: 'center',
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     bgcolor: '#F9FAFB'
                   }}>
                     <Typography variant="body2" sx={{ color: '#6B7280' }}>
                       No hay información de tickets disponible
                     </Typography>
                   </Box>
                 )}
               </Box>

               {/* Sección Alimentos y Bebidas */}
               <Box sx={{ mb: 4 }}>
                 <Box sx={{ mb: 2 }}>
                   <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, fontSize: '16px' }}>
                     🍔 Alimentos y Bebidas
                   </Typography>
                 </Box>
                 
                 {selectedEvent?.alimentosBebestibles && selectedEvent.alimentosBebestibles.length > 0 ? (
                   <Box sx={{ 
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     overflow: 'hidden'
                   }}>
                     {/* Header */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                       gap: 1,
                       bgcolor: '#F9FAFB',
                       p: 2,
                       borderBottom: '1px solid #E5E7EB'
                     }}>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px' }}>Producto</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Precio</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Stock</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Disponibles</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Vendidos</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Total venta</Typography>
                     </Box>
                     
                     {/* Rows */}
                     {selectedEvent.alimentosBebestibles.map((item, index) => {
                       const precioUnitario = item.precioUnitario || 0;
                       const stockAsignado = item.stockAsignado || 0;
                       const stockActual = item.stockActual || 0;
                       const vendidos = stockAsignado - stockActual;
                       const totalVentas = precioUnitario * vendidos;
                       
                       return (
                         <Box key={index} sx={{ 
                           display: 'grid', 
                           gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                           gap: 1,
                           p: 2,
                           borderBottom: index < selectedEvent.alimentosBebestibles.length - 1 ? '1px solid #F3F4F6' : 'none',
                           '&:hover': { bgcolor: '#F9FAFB' }
                         }}>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151' }}>
                             {item.nombre || item.nombreProducto || 'Producto'}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {formatCurrency(precioUnitario)}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {stockAsignado.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {(stockAsignado - vendidos).toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {vendidos.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {formatCurrency(totalVentas)}
                           </Typography>
                         </Box>
                       );
                     })}
                     
                     {/* Fila de Resumen */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                       gap: 1,
                       p: 2,
                       borderTop: '2px solid #E5E7EB',
                       bgcolor: '#F9FAFB',
                       fontWeight: 600
                     }}>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700 }}>
                         Resumen
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                         -
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalStock = selectedEvent.alimentosBebestibles.reduce((total, item) => {
                             return total + (item.stockAsignado || 0);
                           }, 0);
                           return totalStock.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalDisponibles = selectedEvent.alimentosBebestibles.reduce((total, item) => {
                             const stockAsignado = item.stockAsignado || 0;
                             const vendidos = stockAsignado - (item.stockActual || 0);
                             return total + (stockAsignado - vendidos);
                           }, 0);
                           return totalDisponibles.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalVendidos = selectedEvent.alimentosBebestibles.reduce((total, item) => {
                             const vendidos = (item.stockAsignado || 0) - (item.stockActual || 0);
                             return total + vendidos;
                           }, 0);
                           return totalVendidos.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalVentas = selectedEvent.alimentosBebestibles.reduce((total, item) => {
                             const vendidos = (item.stockAsignado || 0) - (item.stockActual || 0);
                             return total + ((item.precioUnitario || 0) * vendidos);
                           }, 0);
                           return formatCurrency(totalVentas);
                         })()}
                       </Typography>
                     </Box>
                   </Box>
                 ) : (
                   <Box sx={{ 
                     p: 3, 
                     textAlign: 'center',
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     bgcolor: '#F9FAFB'
                   }}>
                     <Typography variant="body2" sx={{ color: '#6B7280' }}>
                       No hay información de alimentos y bebidas disponible
                     </Typography>
                   </Box>
                 )}
               </Box>

               {/* Sección Actividades */}
               <Box>
                 <Box sx={{ mb: 2 }}>
                   <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, fontSize: '16px' }}>
                     🎯 Actividades
                   </Typography>
                 </Box>
                 
                 {selectedEvent?.actividades && selectedEvent.actividades.length > 0 ? (
                   <Box sx={{ 
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     overflow: 'hidden'
                   }}>
                     {/* Header */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                       gap: 1,
                       bgcolor: '#F9FAFB',
                       p: 2,
                       borderBottom: '1px solid #E5E7EB'
                     }}>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px' }}>Actividad</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Precio</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Cupos</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Disponibles</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Vendidos</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#6B7280', fontSize: '11px', textAlign: 'center' }}>Total venta</Typography>
                     </Box>
                     
                     {/* Rows */}
                     {selectedEvent.actividades.map((actividad, index) => {
                       const precioUnitario = actividad.precioUnitario || 0;
                       const cuposDisponibles = actividad.cuposDisponibles || 0;
                       const cuposOcupados = actividad.cuposOcupados || 0;
                       const disponibles = cuposDisponibles - cuposOcupados;
                       const totalVentas = precioUnitario * cuposOcupados;
                       
                       return (
                         <Box key={index} sx={{ 
                           display: 'grid', 
                           gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                           gap: 1,
                           p: 2,
                           borderBottom: index < selectedEvent.actividades.length - 1 ? '1px solid #F3F4F6' : 'none',
                           '&:hover': { bgcolor: '#F9FAFB' }
                         }}>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151' }}>
                             {actividad.nombreActividad || 'Actividad'}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {formatCurrency(precioUnitario)}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                             {cuposDisponibles.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                             {disponibles.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {cuposOcupados.toLocaleString()}
                           </Typography>
                           <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textAlign: 'center' }}>
                             {formatCurrency(totalVentas)}
                           </Typography>
                         </Box>
                       );
                     })}
                     
                     {/* Fila de Resumen */}
                     <Box sx={{ 
                       display: 'grid', 
                       gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
                       gap: 1,
                       p: 2,
                       borderTop: '2px solid #E5E7EB',
                       bgcolor: '#F9FAFB',
                       fontWeight: 600
                     }}>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700 }}>
                         Resumen
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                         -
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#374151', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalCupos = selectedEvent.actividades.reduce((total, actividad) => {
                             return total + (actividad.cuposDisponibles || 0);
                           }, 0);
                           return totalCupos.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalDisponibles = selectedEvent.actividades.reduce((total, actividad) => {
                             const disponibles = (actividad.cuposDisponibles || 0) - (actividad.cuposOcupados || 0);
                             return total + disponibles;
                           }, 0);
                           return totalDisponibles.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalOcupados = selectedEvent.actividades.reduce((total, actividad) => {
                             return total + (actividad.cuposOcupados || 0);
                           }, 0);
                           return totalOcupados.toLocaleString();
                         })()}
                       </Typography>
                       <Typography variant="body2" sx={{ fontSize: '12px', color: '#10B981', fontWeight: 700, textAlign: 'center' }}>
                         {(() => {
                           const totalVentas = selectedEvent.actividades.reduce((total, actividad) => {
                             return total + ((actividad.precioUnitario || 0) * (actividad.cuposOcupados || 0));
                           }, 0);
                           return formatCurrency(totalVentas);
                         })()}
                       </Typography>
                     </Box>
                   </Box>
                 ) : (
                   <Box sx={{ 
                     p: 3, 
                     textAlign: 'center',
                     border: '1px solid #E5E7EB',
                     borderRadius: '8px',
                     bgcolor: '#F9FAFB'
                   }}>
                     <Typography variant="body2" sx={{ color: '#6B7280' }}>
                       No hay información de actividades disponible
                     </Typography>
                   </Box>
                 )}
               </Box>
             </Paper>
           </Box>


           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <Typography variant="h6" sx={{ color: '#374151', mb: 2, fontWeight: 600, textAlign: 'center' }}>
               Calendario
             </Typography>
             <Paper sx={{ 
               width: 337,
               height: 320,
               p: 2, 
               borderRadius: '10px',
               boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
               display: 'flex',
               flexDirection: 'column'
             }}>
               <CalendarComponent selectedEventId={selectedEventId} />
             </Paper>
                      </Box>
         </Box>


         <Box sx={{ mt: 4 }}>
           <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
               Productos Agendables
             </Typography>
             <Button 
               variant="contained" 
               startIcon={<AddIcon />}
               sx={{ 
                 background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%) !important',
                 '&:hover': { 
                   background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%) !important'
                 },
                 textTransform: 'none',
                 borderRadius: '8px',
                 boxShadow: '0px 2px 4px rgba(30, 41, 59, 0.3)',
                 color: 'white !important',
                 fontWeight: 500,
                 '&.MuiButton-root': {
                   background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%) !important',
                   '&:hover': {
                     background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%) !important'
                   }
                 }
               }}
             >
               Crear agendamiento
             </Button>
           </Stack>

           <Paper sx={{ 
             p: 3, 
             borderRadius: '12px',
             boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
           }}>
             <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 60px',
               gap: '16px 24px',
               alignItems: 'center',
               mb: 2,
               pb: 2,
               borderBottom: '1px solid #E5E7EB',
               bgcolor: '#F9FAFB',
               borderRadius: '8px 8px 0 0',
               px: 2,
               py: 1.5
             }}>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Tipo
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>
                 Cupos en total
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>
                 Cupos usados
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>
                 Cupos validados
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>
                 Cupos sin usar
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, textAlign: 'right' }}>
                 Anulados
               </Typography>
               <Box></Box>
             </Box>


             {inventory && inventory.length > 0 ? (showAllAgendables ? inventory : inventory.slice(0, 3)).map((item, index) => (
               <Box key={item.id || index} sx={{ 
                 display: 'grid', 
                 gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 60px',
                 gap: '16px 24px',
                 alignItems: 'center',
                 py: 2,
                 borderBottom: index < inventory.length - 1 ? '1px solid #F3F4F6' : 'none'
               }}>
                 <Typography variant="body1" sx={{ color: '#374151' }}>
                   {item.nombreProducto || item.nombre || 'Sin nombre'}
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#374151', fontWeight: 600, textAlign: 'right' }}>
                   {item.stockInicial || 0}
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#3B82F6', textDecoration: 'underline', textAlign: 'right' }}>
                   0
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#3B82F6', textDecoration: 'underline', textAlign: 'right' }}>
                   0
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#374151', textAlign: 'right' }}>
                   {item.stockInicial || 0}
                 </Typography>
                 <Typography variant="body1" sx={{ color: '#374151', textAlign: 'right' }}>
                   0
                 </Typography>
                 <IconButton size="small" sx={{ color: '#6B7280' }}>
                   <EditIcon fontSize="small" />
                 </IconButton>
               </Box>
             )) : (
               <Box sx={{ 
                 display: 'flex', 
                 justifyContent: 'center', 
                 alignItems: 'center', 
                 py: 4,
                 color: '#6B7280'
               }}>
                 <Typography variant="body2">
                   No hay productos agendables disponibles
                 </Typography>
               </Box>
             )}

             {inventory && inventory.length > 3 && (
               <Button 
                 variant="text" 
                 endIcon={showAllAgendables ? <KeyboardArrowDownIcon sx={{ transform: 'rotate(180deg)' }} /> : <KeyboardArrowDownIcon />}
                 onClick={() => setShowAllAgendables(!showAllAgendables)}
                 sx={{ 
                   mt: 2, 
                   color: '#6B7280',
                   textTransform: 'none'
                 }}
               >
                 {showAllAgendables ? 'Ver menos' : `Ver todos los agendables (${inventory.length})`}
               </Button>
             )}
           </Paper>
         </Box>


         <Box sx={{ mt: 4 }}>
           <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
               Historial de eventos pasados
             </Typography>
           </Stack>

           <Paper sx={{ 
             p: 3, 
             borderRadius: '12px',
             boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
           }}>
             <Box sx={{ 
               display: 'grid', 
               gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
               gap: '16px 24px',
               alignItems: 'center',
               mb: 2,
               pb: 2,
               borderBottom: '1px solid #E5E7EB',
               bgcolor: '#F9FAFB',
               borderRadius: '8px 8px 0 0',
               px: 2,
               py: 1.5
             }}>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Cliente
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Rut de empresa
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Nombre
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Correo
               </Typography>
               <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                 Fecha
               </Typography>
               <Box></Box>
             </Box>

             <Box sx={{ 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               py: 6,
               color: '#6B7280'
             }}>
               <Typography variant="body1">
                 No hay registros disponibles
               </Typography>
             </Box>

             <Button 
               variant="text" 
               endIcon={<KeyboardArrowDownIcon />}
               sx={{ 
                 mt: 2, 
                 color: '#6B7280',
                 textTransform: 'none'
               }}
             >
               Ver todos los eventos
             </Button>
           </Paper>
         </Box>

         {/* Modal de Ventas de Tickets */}
       <Dialog 
         open={showSalesModal} 
         onClose={() => setShowSalesModal(false)}
         maxWidth="lg"
         fullWidth
       >
         <DialogTitle sx={{ 
           bgcolor: '#F9FAFB', 
           borderBottom: '1px solid #E5E7EB',
           display: 'flex',
           alignItems: 'center',
           gap: 1
         }}>
           <PersonIcon sx={{ color: '#3B82F6' }} />
           <Typography component="span" variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
             Registros de Tickets Vendidos
           </Typography>
           {selectedEvent && (
             <Typography component="span" variant="body2" sx={{ color: '#6B7280', ml: 'auto' }}>
               {selectedEvent.informacionGeneral?.nombreEvento}
             </Typography>
           )}
         </DialogTitle>
         
         <DialogContent sx={{ p: 0 }}>
           {salesLoading ? (
             <Box sx={{ 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               minHeight: 200,
               flexDirection: 'column',
               gap: 2
             }}>
               <Box sx={{ 
                 width: 40, 
                 height: 40, 
                 border: '3px solid #E5E7EB',
                 borderTop: '3px solid #3B82F6',
                 borderRadius: '50%',
                 animation: 'spin 1s linear infinite',
                 '@keyframes spin': {
                   '0%': { transform: 'rotate(0deg)' },
                   '100%': { transform: 'rotate(360deg)' }
                 }
               }} />
               <Typography variant="body2" sx={{ color: '#6B7280' }}>
                 Cargando registros de ventas...
               </Typography>
             </Box>
           ) : salesData.length === 0 ? (
             <Box sx={{ 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               minHeight: 200,
               flexDirection: 'column',
               gap: 1
             }}>
               <PersonIcon sx={{ fontSize: 48, color: '#D1D5DB' }} />
               <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 500 }}>
                 No hay registros de ventas
               </Typography>
               <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                 Aún no se han registrado ventas de tickets para este evento
               </Typography>
             </Box>
           ) : (
             <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
               {salesData.map((sale, saleIndex) => {
                 const isExpanded = expandedSales.has(saleIndex);
                 
                 return (
                   <Box key={saleIndex} sx={{ mb: 2, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                     
                     {/* Header de la Venta - Clickeable */}
                     <Box 
                       onClick={() => toggleSaleExpanded(saleIndex)}
                       sx={{ 
                         bgcolor: '#F9FAFB', 
                         p: 2, 
                         borderBottom: isExpanded ? '1px solid #E5E7EB' : 'none',
                         cursor: 'pointer',
                         '&:hover': { bgcolor: '#F3F4F6' },
                         transition: 'background-color 0.2s'
                       }}
                     >
                       <Stack direction="row" justifyContent="space-between" alignItems="center">
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                           {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                           <Box>
                             <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', fontSize: '16px' }}>
                               Venta #{sale.saleNumber || `VTA-${saleIndex + 1}`}
                             </Typography>
                             <Typography variant="body2" sx={{ color: '#6B7280' }}>
                               {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('es-CL') : 
                                sale.timestamp ? new Date(sale.timestamp).toLocaleDateString('es-CL') : 
                                sale.fecha ? new Date(sale.fecha).toLocaleDateString('es-CL') : '-'}
                             </Typography>
                           </Box>
                         </Box>
                         <Box sx={{ textAlign: 'center' }}>
                           <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                             {sale.attendees?.[0]?.datosPersonales?.nombreCompleto || 
                              sale.cliente?.nombre || 
                              sale.nombreCliente || 'Cliente'}
                           </Typography>
                           <Typography variant="caption" sx={{ color: '#6B7280' }}>
                             {sale.attendees?.[0]?.datosPersonales?.correo || 
                              sale.cliente?.email || 
                              sale.emailCliente || ''}
                           </Typography>
                         </Box>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                           <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981' }}>
                             {formatCurrency(sale.totals?.total || 0)}
                           </Typography>
                           <Box sx={{
                             display: 'inline-block',
                             px: 2,
                             py: 0.5,
                             borderRadius: '12px',
                             fontSize: '12px',
                             fontWeight: 500,
                             bgcolor: (sale.status || 'completed').toLowerCase() === 'completed' ? '#DCFCE7' : '#FEF3C7',
                             color: (sale.status || 'completed').toLowerCase() === 'completed' ? '#166534' : '#92400E'
                           }}>
                             {(sale.status || 'completed') === 'completed' ? 'Pagado' : 
                              (sale.status || 'Pagado').charAt(0).toUpperCase() + (sale.status || 'Pagado').slice(1)}
                           </Box>
                         </Box>
                       </Stack>
                     </Box>

                   {/* Contenido detallado - Solo visible cuando está expandido */}
                   {isExpanded && (
                     <Box sx={{ p: 2 }}>
                       
                       {/* Sección Tickets */}
                       {sale.tickets?.items && sale.tickets.items.length > 0 && (
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                           🎫 Tickets
                           <Typography component="span" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                             (Subtotal: {formatCurrency(sale.tickets.subtotal || 0)})
                           </Typography>
                         </Typography>
                         <TableContainer>
                           <Table size="small">
                             <TableHead>
                               <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Tipo</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Cantidad</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Precio Unit.</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Subtotal</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {sale.tickets.items.map((ticket, ticketIndex) => (
                                 <TableRow key={ticketIndex}>
                                   <TableCell sx={{ fontSize: '12px' }}>{ticket.tipoEntrada || 'General'}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{ticket.cantidad}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{formatCurrency(ticket.precio)}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center', fontWeight: 600, color: '#10B981' }}>
                                     {formatCurrency(ticket.subtotal)}
                                   </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
                         </TableContainer>
                       </Box>
                     )}

                     {/* Sección Alimentos y Bebidas */}
                     {sale.food?.items && sale.food.items.length > 0 && (
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                           🍔 Alimentos y Bebidas
                           <Typography component="span" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                             (Subtotal: {formatCurrency(sale.food.subtotal || 0)})
                           </Typography>
                         </Typography>
                         <TableContainer>
                           <Table size="small">
                             <TableHead>
                               <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Producto</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Cantidad</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Precio Unit.</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Subtotal</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {sale.food.items.map((food, foodIndex) => (
                                 <TableRow key={foodIndex}>
                                   <TableCell sx={{ fontSize: '12px' }}>{food.nombre}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{food.cantidad}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{formatCurrency(food.precio)}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center', fontWeight: 600, color: '#10B981' }}>
                                     {formatCurrency(food.subtotal)}
                                   </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
                         </TableContainer>
                       </Box>
                     )}

                     {/* Sección Actividades */}
                     {sale.activities?.items && sale.activities.items.length > 0 && (
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                           🎯 Actividades
                           <Typography component="span" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                             (Subtotal: {formatCurrency(sale.activities.subtotal || 0)})
                           </Typography>
                         </Typography>
                         <TableContainer>
                           <Table size="small">
                             <TableHead>
                               <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Actividad</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Cantidad</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Precio Unit.</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Subtotal</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {sale.activities.items.map((activity, activityIndex) => (
                                 <TableRow key={activityIndex}>
                                   <TableCell sx={{ fontSize: '12px' }}>{activity.nombreActividad}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{activity.cantidad}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>{formatCurrency(activity.precio)}</TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center', fontWeight: 600, color: '#10B981' }}>
                                     {formatCurrency(activity.subtotal)}
                                   </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
                         </TableContainer>
                       </Box>
                     )}

                     {/* Sección Asistentes */}
                     {sale.attendees && sale.attendees.length > 0 && (
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                           👥 Asistentes
                           <Typography component="span" sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
                             ({sale.attendees.length} persona{sale.attendees.length !== 1 ? 's' : ''})
                           </Typography>
                         </Typography>
                         <TableContainer>
                           <Table size="small">
                             <TableHead>
                               <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Nombre Completo</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>RUT</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Email</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Teléfono</TableCell>
                                 <TableCell sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Tipo Entrada</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {sale.attendees.map((attendee, attendeeIndex) => (
                                 <TableRow key={attendeeIndex}>
                                   <TableCell sx={{ fontSize: '12px' }}>
                                     <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                                       {attendee.datosPersonales?.nombreCompleto || 'N/A'}
                                     </Typography>
                                   </TableCell>
                                   <TableCell sx={{ fontSize: '12px' }}>
                                     {attendee.datosPersonales?.rut || 'N/A'}
                                   </TableCell>
                                   <TableCell sx={{ fontSize: '12px' }}>
                                     <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                       {attendee.datosPersonales?.correo || 'N/A'}
                                     </Typography>
                                   </TableCell>
                                   <TableCell sx={{ fontSize: '12px' }}>
                                     {attendee.datosPersonales?.telefono || 'N/A'}
                                   </TableCell>
                                   <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>
                                     <Box sx={{
                                       display: 'inline-block',
                                       px: 1.5,
                                       py: 0.5,
                                       borderRadius: '8px',
                                       fontSize: '11px',
                                       fontWeight: 500,
                                       bgcolor: '#EBF8FF',
                                       color: '#1E40AF'
                                     }}>
                                       {attendee.tipoEntrada || 'General'}
                                     </Box>
                                   </TableCell>
                                 </TableRow>
                               ))}
                             </TableBody>
                           </Table>
                         </TableContainer>
                       </Box>
                     )}

                     {/* Total de la Venta */}
                     <Box sx={{ 
                       bgcolor: '#F9FAFB', 
                       p: 2, 
                       borderRadius: '8px',
                       border: '1px solid #E5E7EB'
                     }}>
                       <Stack direction="row" justifyContent="space-between" alignItems="center">
                         <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>
                           Total de la Venta
                         </Typography>
                         <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
                           {formatCurrency(sale.totals?.total || 0)}
                         </Typography>
                       </Stack>
                     </Box>

                     </Box>
                   )}
                   </Box>
                 );
               })}
               
               {/* Botón Cargar Más */}
               {salesHasMore && (
                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                   <Button
                     onClick={loadMoreSales}
                     disabled={salesLoading}
                     variant="outlined"
                     sx={{
                       borderColor: '#3B82F6',
                       color: '#3B82F6',
                       '&:hover': {
                         borderColor: '#2563EB',
                         bgcolor: '#EBF8FF'
                       },
                       textTransform: 'none',
                       fontWeight: 500,
                       px: 4,
                       py: 1
                     }}
                   >
                     {salesLoading ? 'Cargando...' : `Cargar más registros (${salesData.length} de ${salesTotal})`}
                   </Button>
                 </Box>
               )}
             </Box>
           )}
         </DialogContent>
         
         <DialogActions sx={{ p: 2, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
           <Typography variant="body2" sx={{ color: '#6B7280', mr: 'auto' }}>
             Mostrando {salesData.length} de {salesTotal} registros
             {salesHasMore && (
               <Typography component="span" sx={{ color: '#3B82F6', ml: 1 }}>
                 • Página {salesPage}
               </Typography>
             )}
           </Typography>
           <Button 
             onClick={() => setShowSalesModal(false)}
             variant="contained"
             sx={{
               bgcolor: '#3B82F6',
               '&:hover': { bgcolor: '#2563EB' },
               textTransform: 'none',
               fontWeight: 500
             }}
           >
             Cerrar
           </Button>
         </DialogActions>
       </Dialog>
       </Box>
     );
   };

  // Header extendido para Dashboard que incluye la navegación
  const DashboardHeader = () => (
    <Box sx={{
      width: '100%',
      height: '85px',
      bgcolor: '#1B2735',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
      position: 'relative'
    }}>
      {/* Left side - Logo y Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', gap: 3 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}>
            <img 
              src="/vibepass-panel/vibepass.svg" 
              alt="VibePass" 
              style={{ 
                height: '32px', 
                width: 'auto'
              }} 
            />
          </Box>
        </Link>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            variant={activeView === 'dashboard' ? 'contained' : 'text'}
            onClick={() => setActiveView('dashboard')}
            startIcon={<DashboardIcon />}
            sx={{
              color: activeView === 'dashboard' ? 'white' : '#B0BEC5',
              backgroundColor: activeView === 'dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Dashboard
          </Button>

          <Button
            variant={activeView === 'usuarios' ? 'contained' : 'text'}
            onClick={() => {
              if (selectedEventId && events.length > 0) {
                setActiveView('usuarios');
              }
            }}
            disabled={!selectedEventId || events.length === 0}
            startIcon={<PeopleIcon />}
            sx={{
              color: (!selectedEventId || events.length === 0) ? '#6B7280' : (activeView === 'usuarios' ? 'white' : '#B0BEC5'),
              backgroundColor: activeView === 'usuarios' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: (!selectedEventId || events.length === 0) ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
              },
              '&:disabled': {
                color: '#6B7280',
                cursor: 'not-allowed'
              },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Usuarios
          </Button>

          <Button
            variant={activeView === 'inventario' ? 'contained' : 'text'}
            onClick={() => {
              if (selectedEventId && events.length > 0) {
                setActiveView('inventario');
              }
            }}
            disabled={!selectedEventId || events.length === 0}
            startIcon={<InventoryIcon />}
            sx={{
              color: (!selectedEventId || events.length === 0) ? '#6B7280' : (activeView === 'inventario' ? 'white' : '#B0BEC5'),
              backgroundColor: activeView === 'inventario' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: (!selectedEventId || events.length === 0) ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
              },
              '&:disabled': {
                color: '#6B7280',
                cursor: 'not-allowed'
              },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Inventario
          </Button>
        </Stack>
      </Box>

      {/* Right side - User info and icons (igual que Header.jsx) */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: '0 0 auto' }}>
        {/* Search Icon */}
        <IconButton sx={{ 
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}>
          <SearchIcon />
        </IconButton>

        {/* Notifications Icon */}
        <IconButton sx={{ 
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}>
          <NotificationsIcon />
        </IconButton>

        {/* User Info */}
        {user && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: user.tipo === 'admin' ? '#EF4444' : '#10B981',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              {user.nombreCompleto?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.2
              }}>
                {user.nombreCompleto}
              </Typography>
              <Typography sx={{
                color: '#B0BEC5',
                fontSize: '12px',
                lineHeight: 1.2
              }}>
                {user.tipo === 'admin' ? 'Administrador' : 'Organizador'}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Menu Dropdown Personalizado */}
        <Box sx={{ position: 'relative' }} ref={userMenuRef}>
          <IconButton 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            sx={{ 
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Dropdown Menu */}
          {userMenuOpen && (
            <Box sx={{
              position: 'absolute',
              top: '100%',
              right: 0,
              mt: 1,
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              minWidth: '160px',
              overflow: 'hidden'
            }}>
              <Box
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  color: '#EF4444',
                  '&:hover': {
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                <ExitToAppIcon fontSize="small" />
                <Typography sx={{ fontSize: '14px' }}>
                  Cerrar sesión
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <DashboardHeader />
      <EventSelector />
      
      {showAddInventoryForm ? (
        <AddInventoryForm 
          inventoryFormData={inventoryFormData}
          handleInventoryFormChange={handleInventoryFormChange}
          onCancel={() => {
            setShowAddInventoryForm(false);
            // Limpiar el formulario al cancelar
            setInventoryFormData({
              nombreProducto: '',
              categoria: '',
              descripcion: '',
              skuCodigoInterno: '',
              precioVenta: '',
              stockInicialDisponible: '',
              imagenProducto: null
            });
          }}
          selectedEventId={selectedEventId}
        />
      ) : showEditInventoryForm ? (
        <AddInventoryForm 
          inventoryFormData={inventoryFormData}
          handleInventoryFormChange={handleInventoryFormChange}
          createInventory={updateInventory}
          createInventoryLoading={createInventoryLoading}
          onCancel={() => {
            setShowEditInventoryForm(false);
            setEditingInventory(null);
            setInventoryFormData({
              nombreProducto: '',
              categoria: '',
              descripcion: '',
              skuCodigoInterno: '',
              precioVenta: '',
              stockInicialDisponible: '',
              imagenProducto: null
            });
          }}
          isEditing={true}
          selectedEventId={selectedEventId}
        />
      ) : showAddUserForm ? (
        <AddUserForm 
          userFormData={userFormData}
          handleUserFormChange={handleUserFormChange}
          createUser={createUser}
          createUserLoading={createUserLoading}
          onCancel={() => setShowAddUserForm(false)}
        />
      ) : showEditUserForm ? (
        <AddUserForm 
          userFormData={userFormData}
          handleUserFormChange={handleUserFormChange}
          createUser={updateUser}
          createUserLoading={createUserLoading}
          onCancel={() => {
            setShowEditUserForm(false);
            setEditingUser(null);
            setUserFormData({
              nombreCompleto: '',
              correoElectronico: '',
              rutOId: '',
              telefonoContacto: '',
              rol: 'Administrador'
            });
          }}
          isEditing={true}
        />
      ) : (
        <>
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'usuarios' && <Usuarios onAddUser={() => {
            // Limpiar el formulario antes de abrirlo
            setUserFormData({
              nombreCompleto: '',
              correoElectronico: '',
              rutOId: '',
              telefonoContacto: '',
              rol: 'Administrador'
            });
            setShowAddUserForm(true);
          }} onEditUser={handleEditUser} selectedEventId={selectedEventId} />}
          {activeView === 'inventario' && <Inventario onAddInventory={() => {
            // Limpiar el formulario antes de abrirlo
            setInventoryFormData({
              nombreProducto: '',
              categoria: '',
              descripcion: '',
              skuCodigoInterno: '',
              precioVenta: '',
              stockInicialDisponible: '',
              imagenProducto: null
            });
            setShowAddInventoryForm(true);
          }} onEditInventory={handleEditInventory} selectedEventId={selectedEventId} />}
        </>
      )}


      <Dialog
        open={showUserSuccessModal}
        onClose={() => setShowUserSuccessModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main', fontWeight: 600 }}>
          🎉 ¡Usuario creado exitosamente!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            El usuario "{createdUserName}" ha sido creado correctamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowUserSuccessModal(false)}
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


      <Dialog
        open={showUserErrorModal}
        onClose={() => setShowUserErrorModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'error.main', fontWeight: 600 }}>
          ❌ Error al crear usuario
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            {userErrorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowUserErrorModal(false)}
            variant="contained"
            color="error"
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
    </Box>
  );
};

export default EventAdminDashboard;