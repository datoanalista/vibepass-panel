"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import API_CONFIG from '../config/api';

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
  Tab
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
  Add as AddIcon
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
        const eventDateObj = new Date(eventDateString);
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
              minHeight: 32,
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
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
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
    rol: 'Administrador'
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


  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      
      // Agregar parámetros para obtener más eventos
      const url = `${API_CONFIG.ENDPOINTS.EVENTS}?limit=500&page=1`;
      const response = await fetch(url, API_CONFIG.REQUEST_CONFIG);
      const result = await response.json();
      
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
        
        // Log temporal para ver la estructura de los eventos
        if (eventsList.length > 0) {
          console.log('📊 Estructura del primer evento:', eventsList[0]);
          console.log('📊 Estado en informacionGeneral:', eventsList[0].informacionGeneral?.estado);
          console.log('📊 Estado directo:', eventsList[0].estado);
        }
        
        setEvents(eventsList);
        
        if (eventsList.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsList[0].id);
        }
      } else {
        console.error('❌ API Error:', result.message || 'Error desconocido');
        setEvents([]);
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
          rol: 'Administrador'
        });
        setShowAddUserForm(false);
        setShowUserSuccessModal(true);
      } else {
        throw new Error(result.message || 'Error al crear el usuario');
      }
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      setUserErrorMessage(error.message);
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
      rol: usuario.rol || 'Administrador'
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
          rol: 'Administrador'
        });
        setShowEditUserForm(false);
        setEditingUser(null);
      } else {
        throw new Error(result.message || 'Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      setUserErrorMessage(error.message);
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
  }, []);

  if (!mounted) {
    return null;
  }


  const selectedEvent = events.find(event => event.id === selectedEventId);
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
            onChange={(e, newValue) => setActiveView(newValue)}
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
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon fontSize="small" />
                  Usuarios
                </Box>
              }
            />
            <Tab 
              value="inventario" 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: '#00BCD4',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              JO
            </Avatar>
            <Box>
              <Typography sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.2
              }}>
                José Ortiz
              </Typography>
              <Typography sx={{
                color: '#B0BEC5',
                fontSize: '12px',
                lineHeight: 1.2
              }}>
                Administrador
              </Typography>
            </Box>
          </Stack>

          <IconButton sx={{ 
            color: 'white',
            ml: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}>
            <MenuIcon />
          </IconButton>
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
                  const isSelected = event.id === selectedEventId;
                  
                  return (
                    <Box
                      key={event.id} 
                      onClick={() => handleEventSelect(event.id)}
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
        <Typography sx={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#374151'
        }}>
          Evento - "{getSelectedEventDisplayName()}"
        </Typography>

        <EventDropdown />
      </Box>
    </Box>
  );

    const DashboardView = () => {
         const [dashboardData, setDashboardData] = useState({
      totalVentas: 0,
      ventasDelDia: 0,
      registradosNuevos: 0,
      ventasDetalle: [],
      eventoActivo: 'programado'
    });
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [showAllAgendables, setShowAllAgendables] = useState(false);

    // Removed automatic time updates to prevent API spam

    useEffect(() => {
      if (selectedEventId) {
        fetchDashboardData();
      }
    }, [selectedEventId]);

    // Removed time-based status updates to prevent API spam

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const usersResponse = await fetch(`${API_CONFIG.ENDPOINTS.USERS}?eventoId=${selectedEventId}`);
        const usersData = await usersResponse.json();
        
        const users = Array.isArray(usersData) ? usersData : (usersData.data?.users || usersData.data?.items || usersData.users || usersData.data || []);
        
        const inventoryResponse = await fetch(`${API_CONFIG.ENDPOINTS.INVENTORY}?eventoId=${selectedEventId}`);
        const inventoryData = await inventoryResponse.json();
        
        const inventoryArray = Array.isArray(inventoryData) ? inventoryData : (inventoryData.data?.items || inventoryData.inventory || inventoryData.data || []);
        setInventory(inventoryArray);
        
        const registradosNuevos = users.length;
        
        const totalVentas = inventoryArray.reduce((total, item) => {
          return total + (item.precioVenta * (item.stockInicial - item.stockActual));
        }, 0);
        
        const ventasDelDia = Math.floor(totalVentas * 0.9);
        
        const ventasDetalle = inventoryArray.reduce((acc, item) => {
          const ventasItem = item.precioVenta * (item.stockInicial - item.stockActual);
          const categoria = item.categoria;
          
          if (acc[categoria]) {
            acc[categoria] += ventasItem;
          } else {
            acc[categoria] = ventasItem;
          }
          
          return acc;
        }, {});
        
        const ventasDetalleArray = Object.entries(ventasDetalle).map(([categoria, monto]) => ({
          categoria,
          monto
        }));
        
        // Determinar el estado del evento usando la nueva función
        const eventStatus = getEventStatus(selectedEvent);
         
         setDashboardData({
           totalVentas,
           ventasDelDia,
           registradosNuevos,
           ventasDetalle: ventasDetalleArray,
           eventoActivo: eventStatus.status,
           eventStatus: eventStatus
         });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
                 setDashboardData({
           totalVentas: 0,
           ventasDelDia: 0,
           registradosNuevos: 0,
           ventasDetalle: [],
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
                  {formatCurrency(dashboardData.totalVentas)}
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
                  {formatCurrency(dashboardData.ventasDelDia)}
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
                  <PersonIcon sx={{ color: '#6B7280', fontSize: '20px' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Usuarios registrados
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#374151', fontWeight: 700 }}>
                  {dashboardData.registradosNuevos}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>


         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
             <Typography variant="h6" sx={{ color: '#374151', mb: 2, fontWeight: 600 }}>
               Ventas del día
             </Typography>
             <Paper sx={{ 
               width: 800,
               height: 320,
               p: 3, 
               borderRadius: '12px',
               boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between'
             }}>
               {dashboardData.ventasDetalle.length > 0 ? (
                 <Stack spacing={2}>
                   {dashboardData.ventasDetalle.map((item, index) => (
                     <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                       <Typography variant="body1" sx={{ color: '#374151' }}>
                         {item.categoria}
                       </Typography>
                       <Typography variant="body1" sx={{ color: '#374151', fontWeight: 600 }}>
                         {formatCurrency(item.monto)}
                       </Typography>
                     </Stack>
                   ))}
                 </Stack>
               ) : (
                 <Box sx={{ 
                   display: 'flex', 
                   flexDirection: 'column',
                   alignItems: 'center', 
                   justifyContent: 'center',
                   flex: 1,
                   py: 4
                 }}>
                   <Typography variant="h6" sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}>
                     📊 No hay ventas aún
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
                     Las ventas del día aparecerán aquí cuando se registren transacciones
                   </Typography>
                 </Box>
               )}
               {dashboardData.ventasDetalle.length > 0 && (
                 <Button 
                   variant="text" 
                   endIcon={<KeyboardArrowDownIcon />}
                   sx={{ 
                     color: '#6B7280',
                     textTransform: 'none',
                     alignSelf: 'center'
                   }}
                 >
                   Ver todas las ventas del día
                 </Button>
               )}
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
       </Box>
     );
   };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <Header />
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