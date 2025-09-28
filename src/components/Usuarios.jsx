"use client";
import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const Usuarios = ({ onAddUser, onEditUser, selectedEventId, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Función para obtener compradores de la API
  const fetchCompradores = async () => {
    try {
      console.log('🛒 [DEBUG] fetchCompradores iniciado - selectedEventId:', selectedEventId);
      
      const baseUrl = API_CONFIG.BASE_URL;
      const apiUrl = `${baseUrl}/api/sales?eventold=${selectedEventId}`;
      
      console.log('🌐 [DEBUG] Llamando API:', apiUrl);
      
      const headers = {
        ...API_CONFIG.REQUEST_CONFIG.headers,
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
      };
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers
      });
      
      console.log('📥 [DEBUG] Status respuesta:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('📥 [DEBUG] Respuesta compradores completa:', result);
        console.log('📥 [DEBUG] result.status:', result.status);
        console.log('📥 [DEBUG] result.data:', result.data);
        
        if (result.status === 'success') {
          console.log('📊 [DEBUG] Procesando respuesta - result.data:', result.data);
          
          const compradoresList = [];
          
          if (result.data && result.data.sales && Array.isArray(result.data.sales)) {
            const salesList = result.data.sales;
            console.log('📊 [DEBUG] Encontradas', salesList.length, 'ventas');
            
            salesList.forEach((sale, saleIndex) => {
              // Filtrar por evento seleccionado
              const saleEventId = sale.eventoId?._id || sale.eventoId;
              console.log(`📊 [DEBUG] Sale ${saleIndex} - saleEventId: ${saleEventId}, selectedEventId: ${selectedEventId}`);
              
              if (saleEventId === selectedEventId) {
                console.log(`✅ [DEBUG] Sale ${saleIndex} coincide con evento seleccionado`);
                
                if (sale.attendees && Array.isArray(sale.attendees)) {
                  console.log(`📊 [DEBUG] Sale ${saleIndex} tiene ${sale.attendees.length} attendees`);
                  
                  sale.attendees.forEach((attendee) => {
                    const compradorData = {
                      _id: attendee._id,
                      nombreCompleto: attendee.datosPersonales?.nombreCompleto,
                      telefono: attendee.datosPersonales?.telefono,
                      rut: attendee.datosPersonales?.rut,
                      correo: attendee.datosPersonales?.correo,
                      tipoEntrada: attendee.tipoEntrada,
                      saleId: sale._id,
                      saleNumber: sale.saleNumber,
                      eventoNombre: sale.eventoId?.informacionGeneral?.nombreEvento || 'Sin nombre'
                    };
                    
                    compradoresList.push(compradorData);
                  });
                } else {
                  console.log(`⚠️ [DEBUG] Sale ${saleIndex} no tiene attendees`);
                }
              } else {
                console.log(`❌ [DEBUG] Sale ${saleIndex} NO coincide con evento seleccionado - filtrando`);
              }
            });
          } else {
            console.log('⚠️ [DEBUG] No hay sales en la respuesta');
          }
          
          console.log('✅ [DEBUG] Total compradores procesados:', compradoresList.length);
          setUsuarios(compradoresList);
          setError(null);
        } else {
          console.log('❌ [DEBUG] result.status no es success:', result.status);
          setUsuarios([]);
          setError('No hay compradores registrados para este evento');
        }
      } else {
        console.log('❌ [DEBUG] Response no es ok:', response.status);
        const errorText = await response.text();
        console.log('❌ [DEBUG] Error response text:', errorText);
        setUsuarios([]);
        setError('No hay compradores registrados para este evento');
      }
    } catch (err) {
      console.error('💥 [DEBUG] Error fetching compradores:', err);
      console.error('💥 [DEBUG] Error details:', err.message);
      console.error('💥 [DEBUG] Error stack:', err.stack);
      setUsuarios([]);
      setError('No hay compradores registrados para este evento');
    }
  };

  // Función para obtener organizadores de la API
  const fetchOrganizadores = async () => {
    try {
      console.log('👥 [DEBUG] fetchOrganizadores iniciado');
      
      const baseUrl = API_CONFIG.BASE_URL;
      const apiUrl = `${baseUrl}/api/dashboard/auth/admin/users?tipo=organizador`;
      
      console.log('🌐 [DEBUG] URL organizadores:', apiUrl);
      console.log('🌐 [DEBUG] baseUrl:', baseUrl);
      
      const headers = {
        ...API_CONFIG.REQUEST_CONFIG.headers,
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
      };
      
      console.log('🔐 [DEBUG] Headers organizadores:', headers);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers
      });
      
      console.log('📥 [DEBUG] Status organizadores:', response.status);
      console.log('📥 [DEBUG] Response headers organizadores:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('📥 [DEBUG] Respuesta organizadores completa:', result);
        console.log('📥 [DEBUG] result.status:', result.status);
        console.log('📥 [DEBUG] result.data:', result.data);
        
        if (result.status === 'success') {
          const organizadoresList = result.data.users || [];
          console.log('📊 [DEBUG] organizadoresList length:', organizadoresList.length);
          console.log('📊 [DEBUG] organizadoresList:', organizadoresList);
          
          // Obtener información de eventos para cada organizador
          console.log('🎪 [DEBUG] Obteniendo información de eventos...');
          const eventosResponse = await fetch(`${baseUrl}/api/events`, {
            method: 'GET',
            headers: headers
          });
          
          console.log('🎪 [DEBUG] Status eventos:', eventosResponse.status);
          
          if (eventosResponse.ok) {
            const eventosResult = await eventosResponse.json();
            console.log('🎪 [DEBUG] Respuesta eventos:', eventosResult);
            
            const eventos = eventosResult.data?.events || [];
            console.log('🎪 [DEBUG] eventos length:', eventos.length);
            console.log('🎪 [DEBUG] eventos:', eventos);
            
            // Mapear eventos por ID para fácil acceso
            const eventosMap = {};
            eventos.forEach(evento => {
              eventosMap[evento._id] = {
                nombre: evento.informacionGeneral?.nombreEvento,
                fecha: evento.informacionGeneral?.fechaEvento,
                estado: evento.informacionGeneral?.estado,
                banner: evento.informacionGeneral?.bannerPromocional
              };
            });
            
            console.log('🗺️ [DEBUG] eventosMap:', eventosMap);
            
            // Agregar información del evento a cada organizador
            organizadoresList.forEach((organizador, index) => {
              console.log(`👤 [DEBUG] Procesando organizador ${index}:`, organizador);
              console.log(`👤 [DEBUG] organizador.eventoId:`, organizador.eventoId);
              
              // Buscar el evento que creó este organizador (por createdBy)
              let eventoInfo = {};
              if (organizador.eventoId) {
                eventoInfo = eventosMap[organizador.eventoId] || {};
              } else {
                // Si no tiene eventoId, buscar por createdBy
                const eventoDelOrganizador = eventos.find(evento => 
                  evento.createdBy?.$oid === organizador._id || evento.createdBy === organizador._id
                );
                if (eventoDelOrganizador) {
                  eventoInfo = {
                    nombre: eventoDelOrganizador.informacionGeneral?.nombreEvento,
                    fecha: eventoDelOrganizador.informacionGeneral?.fechaEvento,
                    estado: eventoDelOrganizador.informacionGeneral?.estado,
                    banner: eventoDelOrganizador.informacionGeneral?.bannerPromocional
                  };
                  organizador.eventoId = eventoDelOrganizador._id;
                }
              }
              
              console.log(`🎪 [DEBUG] eventoInfo para organizador ${index}:`, eventoInfo);
              
              // Mapear los campos correctos según la estructura de la API
              organizador.nombreCompleto = organizador.nombreCompleto;
              organizador.correoElectronico = organizador.email;
              organizador.rutOId = organizador.rut;
              organizador.telefonoContacto = organizador.telefono;
              organizador.rol = organizador.tipo;
              organizador.eventoNombre = eventoInfo.nombre;
              organizador.eventoFecha = eventoInfo.fecha;
              organizador.eventoEstado = eventoInfo.estado;
              organizador.eventoBanner = eventoInfo.banner;
              
              console.log(`✅ [DEBUG] Organizador ${index} actualizado:`, organizador);
            });
          } else {
            console.log('❌ [DEBUG] Error obteniendo eventos:', eventosResponse.status);
            const errorText = await eventosResponse.text();
            console.log('❌ [DEBUG] Error eventos text:', errorText);
          }
          
          console.log('✅ [DEBUG] Organizadores procesados:', organizadoresList.length);
          console.log('✅ [DEBUG] Lista final de organizadores:', organizadoresList);
          setUsuarios(organizadoresList);
          setError(null);
        } else {
          console.log('❌ [DEBUG] result.status no es success para organizadores:', result.status);
          setUsuarios([]);
          setError('No hay organizadores registrados');
        }
      } else {
        console.log('❌ [DEBUG] Response no es ok para organizadores:', response.status);
        const errorText = await response.text();
        console.log('❌ [DEBUG] Error response text organizadores:', errorText);
        setUsuarios([]);
        setError('No hay organizadores registrados');
      }
    } catch (err) {
      console.error('💥 [DEBUG] Error fetching organizadores:', err);
      console.error('💥 [DEBUG] Error details organizadores:', err.message);
      console.error('💥 [DEBUG] Error stack organizadores:', err.stack);
      setUsuarios([]);
      setError('No hay organizadores registrados');
    }
  };

  // Función para obtener usuarios generales (validadores, etc.)
  const fetchUsuariosGenerales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [DEBUG] fetchUsuariosGenerales iniciado');
      console.log('🔍 [DEBUG] selectedEventId:', selectedEventId);
      
      // Logs de configuración de entorno
      console.log('🌍 [DEBUG] Entorno actual:', process.env.NODE_ENV);
      console.log('🌍 [DEBUG] NEXT_PUBLIC_ENVIRONMENT:', process.env.NEXT_PUBLIC_ENVIRONMENT);
      console.log('🌍 [DEBUG] API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
      console.log('🌍 [DEBUG] NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
      
      // Verificar token de autenticación
      const authToken = sessionStorage.getItem('authToken');
      const userData = sessionStorage.getItem('userData');
      console.log('🔐 [DEBUG] Token de autenticación:', authToken ? 'Presente' : 'Ausente');
      console.log('👤 [DEBUG] Datos de usuario:', userData ? JSON.parse(userData) : 'Ausente');
      
      // Si no hay evento seleccionado, mostrar estado vacío sin hacer petición
      if (!selectedEventId) {
        console.log('⚠️ [DEBUG] No hay evento seleccionado');
        setUsuarios([]);
        setError('No hay evento seleccionado');
        setLoading(false);
        return;
      }
      
      // Construir URL con filtro por evento
      // Intentar primero con el endpoint de dashboard si existe
      const baseUrl = API_CONFIG.BASE_URL;
      const dashboardUsersUrl = `${baseUrl}/api/dashboard/users?eventoId=${selectedEventId}`;
      const regularUsersUrl = `${API_CONFIG.ENDPOINTS.USERS}?eventoId=${selectedEventId}`;
      
      console.log('🌐 [DEBUG] URL de petición (dashboard):', dashboardUsersUrl);
      console.log('🌐 [DEBUG] URL de petición (regular):', regularUsersUrl);
      console.log('🌐 [DEBUG] API_CONFIG.ENDPOINTS.USERS:', API_CONFIG.ENDPOINTS.USERS);
      
      let finalUrl, finalRegularUrl;
      
      // Verificar si la URL base es válida
      if (!baseUrl || baseUrl.includes('@') || baseUrl === 'undefined') {
        console.error('💥 [DEBUG] URL base inválida:', baseUrl);
        console.error('💥 [DEBUG] Esto indica un problema con las variables de entorno en producción');
        
        // Fallback para GitHub Pages - usar una URL por defecto
        const fallbackBaseUrl = 'https://tu-servidor-api.com'; // Cambiar por tu URL real
        console.log('🔄 [DEBUG] Usando URL de fallback:', fallbackBaseUrl);
        
        finalUrl = `${fallbackBaseUrl}/api/dashboard/users?eventoId=${selectedEventId}`;
        finalRegularUrl = `${fallbackBaseUrl}/api/users?eventoId=${selectedEventId}`;
        
        console.log('🌐 [DEBUG] URL de fallback (dashboard):', finalUrl);
        console.log('🌐 [DEBUG] URL de fallback (regular):', finalRegularUrl);
      } else {
        // Usar el endpoint de dashboard primero
        finalUrl = dashboardUsersUrl;
        finalRegularUrl = regularUsersUrl;
      }
        
      // Headers con autenticación
      const headers = {
        ...API_CONFIG.REQUEST_CONFIG.headers,
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
      };
      
      console.log('🔐 [DEBUG] Headers enviados:', headers);
      
      let response = await fetch(finalUrl, {
        method: 'GET',
        headers: headers
      });
      console.log('📥 [DEBUG] Status de respuesta (dashboard):', response.status);
      
      // Si falla el endpoint de dashboard, probar el endpoint regular
      if (!response.ok) {
        console.log('⚠️ [DEBUG] Endpoint de dashboard falló, probando endpoint regular');
        response = await fetch(finalRegularUrl, {
          method: 'GET',
          headers: headers
        });
        console.log('📥 [DEBUG] Status de respuesta (regular):', response.status);
        
        // Si también falla el endpoint regular, probar URLs alternativas
        if (!response.ok) {
          console.log('⚠️ [DEBUG] Endpoint regular también falló, probando URLs alternativas');
          
          // Probar con localhost (por si acaso en producción está mal configurado)
          const localhostUrl = `http://localhost:3001/api/dashboard/users?eventoId=${selectedEventId}`;
          console.log('🌐 [DEBUG] Probando localhost:', localhostUrl);
          
          try {
            response = await fetch(localhostUrl, {
              method: 'GET',
              headers: headers
            });
            console.log('📥 [DEBUG] Status de respuesta (localhost):', response.status);
          } catch (localhostError) {
            console.log('❌ [DEBUG] Localhost también falló:', localhostError);
          }
        }
      }
      
      console.log('📥 [DEBUG] Headers de respuesta:', Object.fromEntries(response.headers.entries()));
      
      let result;
      try {
        result = await response.json();
        console.log('📥 [DEBUG] Respuesta completa del servidor:', result);
      } catch (jsonError) {
        console.error('💥 [DEBUG] Error al parsear JSON:', jsonError);
        const textResponse = await response.text();
        console.log('📥 [DEBUG] Respuesta como texto:', textResponse);
        result = { status: 'error', message: 'Respuesta no válida del servidor' };
      }
      
      if (response.ok && result.status === 'success') {
        const usersList = result.data.users || [];
        console.log('✅ [DEBUG] Usuarios obtenidos exitosamente:', usersList.length);
        console.log('👥 [DEBUG] Lista de usuarios:', usersList);
        setUsuarios(usersList);
        setError(null);
      } else {
        console.log('❌ [DEBUG] Error en la respuesta:', result);
        // No lanzar error, solo mostrar estado vacío
        setUsuarios([]);
        setError('No hay usuarios registrados para este evento');
      }
    } catch (err) {
      console.error('💥 [DEBUG] Error fetching users:', err);
      setUsuarios([]);
      setError('No hay usuarios registrados para este evento');
    } finally {
      setLoading(false);
      console.log('🏁 [DEBUG] fetchUsuariosGenerales finalizado, loading: false');
    }
  };


  // Función principal para obtener usuarios según la pestaña activa
  const fetchUsuarios = async () => {
    setLoading(true);
    
    const currentTab = tabs[activeTab];
    console.log('🎯 [DEBUG] ===== INICIANDO fetchUsuarios =====');
    console.log('🎯 [DEBUG] activeTab:', activeTab);
    console.log('🎯 [DEBUG] tabs:', tabs);
    console.log('🎯 [DEBUG] currentTab:', currentTab);
    console.log('🎯 [DEBUG] selectedEventId:', selectedEventId);
    
    if (currentTab === 'Asistentes') {
      console.log('🛒 [DEBUG] Ejecutando fetchCompradores...');
      await fetchCompradores();
    } else if (currentTab === 'Organizadores') {
      console.log('👥 [DEBUG] Ejecutando fetchOrganizadores...');
      await fetchOrganizadores();
    } else {
      console.log('👤 [DEBUG] Ejecutando fetchUsuariosGenerales...');
      await fetchUsuariosGenerales();
    }
    
    console.log('🎯 [DEBUG] ===== FINALIZANDO fetchUsuarios =====');
    setLoading(false);
  };

  // Función para obtener las columnas de la tabla según la pestaña activa
  const getTableColumns = () => {
    const currentTab = tabs[activeTab];
    
    if (currentTab === 'Asistentes') {
      return [
        { key: 'nombreCompleto', label: 'Nombre completo', align: 'left' },
        { key: 'rut', label: 'RUT', align: 'center' },
        { key: 'telefono', label: 'Teléfono', align: 'center' },
        { key: 'correo', label: 'Correo', align: 'center' },
        { key: 'tipoEntrada', label: 'Tipo de entrada', align: 'center' },
        { key: 'eventoNombre', label: 'Evento', align: 'center' }
      ];
    } else if (currentTab === 'Organizadores') {
      return [
        { key: 'eventoBanner', label: '', align: 'left' },
        { key: 'nombreCompleto', label: 'Nombre completo', align: 'left' },
        { key: 'correoElectronico', label: 'Correo', align: 'center' },
        { key: 'rutOId', label: 'RUT', align: 'center' },
        { key: 'telefonoContacto', label: 'Contacto', align: 'center' },
        { key: 'eventoNombre', label: 'Evento', align: 'center' },
        { key: 'eventoFecha', label: 'Fecha', align: 'center' },
        { key: 'eventoEstado', label: 'Estado', align: 'center' }
      ];
    } else {
      // Tabla estándar para Validadores
      return [
        { key: 'nombreCompleto', label: 'Cuentas', align: 'left' },
        { key: 'rutOId', label: 'Rut', align: 'center' },
        { key: 'correoElectronico', label: 'Correo', align: 'center' },
        { key: 'createdAt', label: 'Fecha', align: 'center' },
        { key: 'qr', label: 'QR', align: 'center' },
        { key: 'rol', label: 'Rol', align: 'center' },
        { key: 'actions', label: 'Acciones', align: 'center' }
      ];
    }
  };

  // Función para renderizar el contenido de una celda según la columna
  const renderCellContent = (usuario, column) => {
    const currentTab = tabs[activeTab];
    
    switch (column.key) {
      case 'nombreCompleto':
        if (currentTab === 'Compradores') {
          return (
            <Typography variant="body1" sx={{ 
              fontWeight: 500, 
              fontSize: '14px',
              color: '#374151'
            }}>
              {usuario.nombreCompleto}
            </Typography>
          );
        } else if (currentTab === 'Organizadores') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {usuario.eventoBanner ? (
                <Avatar 
                  src={usuario.eventoBanner}
                  sx={{ width: 32, height: 32 }}
                  alt={usuario.eventoNombre}
                />
              ) : (
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: '#6B7280',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {getInitials(usuario.eventoNombre || 'E')}
                </Avatar>
              )}
              <Typography variant="body1" sx={{ 
                fontWeight: 500, 
                fontSize: '14px',
                color: '#374151'
              }}>
                {usuario.nombreCompleto}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: '#6B7280',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {getInitials(usuario.nombreCompleto || 'NN')}
              </Avatar>
              <Typography variant="body1" sx={{ 
                fontWeight: 500, 
                fontSize: '14px',
                color: '#374151'
              }}>
                {usuario.nombreCompleto}
              </Typography>
            </Box>
          );
        }
      
      case 'telefono':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151'
          }}>
            {usuario.telefono}
          </Typography>
        );
      
      case 'rut':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#2563EB',
            fontWeight: 500
          }}>
            {usuario.rut}
          </Typography>
        );
      
      case 'rutOId':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#2563EB',
            fontWeight: 500
          }}>
            {usuario.rutOId}
          </Typography>
        );
      
      case 'correo':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#2563EB'
          }}>
            {usuario.correo}
          </Typography>
        );
      
      case 'correoElectronico':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#2563EB'
          }}>
            {usuario.correoElectronico}
          </Typography>
        );
      
      case 'telefonoContacto':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151'
          }}>
            {usuario.telefonoContacto}
          </Typography>
        );
      
      case 'tipoEntrada':
        return (
          <Chip 
            label={usuario.tipoEntrada}
            size="small"
            sx={{
              bgcolor: '#EFF6FF',
              color: '#1E40AF',
              fontWeight: 500,
              fontSize: '12px'
            }}
          />
        );
      
      case 'eventoNombre':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151',
            fontWeight: 500
          }}>
            {usuario.eventoNombre || '-'}
          </Typography>
        );
      
      case 'eventoFecha':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151'
          }}>
            {usuario.eventoFecha || '-'}
          </Typography>
        );
      
      case 'eventoEstado':
        return (
          <Chip 
            label={usuario.eventoEstado || 'Sin estado'}
            size="small"
            sx={{
              bgcolor: usuario.eventoEstado === 'activo' ? '#DCFCE7' : '#FEF3C7',
              color: usuario.eventoEstado === 'activo' ? '#166534' : '#92400E',
              fontWeight: 500,
              fontSize: '12px'
            }}
          />
        );
      
      case 'eventoNombre':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151',
            fontWeight: 500
          }}>
            {usuario.eventoNombre || '-'}
          </Typography>
        );
      
      case 'createdAt':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151'
          }}>
            {usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-CL') : '-'}
          </Typography>
        );
      
      case 'qr':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#6B7280'
          }}>
            -
          </Typography>
        );
      
      case 'rol':
        return (
          <Typography variant="body2" sx={{ 
            fontSize: '14px', 
            color: '#374151',
            fontWeight: 500
          }}>
            {usuario.rol}
          </Typography>
        );
      
      case 'actions':
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton 
              size="small"
              onClick={() => onEditUser && onEditUser(usuario)}
              sx={{ 
                color: '#3B82F6',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small"
              onClick={() => handleDeleteClick(usuario)}
              disabled={deletingUserId === (usuario.id || usuario._id)}
              sx={{ 
                color: '#EF4444',
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                '&:disabled': { color: '#9CA3AF' }
              }}
            >
              {deletingUserId === (usuario.id || usuario._id) ? (
                <CircularProgress size={16} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
        );
      
      default:
        return '-';
    }
  };

  // Función para mostrar modal de confirmación
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Función para eliminar usuario (soft delete)
  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUserId(userToDelete.id || userToDelete._id);
      setShowDeleteModal(false);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.USER_BY_ID(userToDelete.id || userToDelete._id), {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        console.log('✅ Usuario desactivado exitosamente');
        // Recargar la lista de usuarios
        fetchUsuarios();
      } else {
        throw new Error(result.message || 'Error al desactivar el usuario');
      }
    } catch (error) {
      console.error('❌ Error al desactivar usuario:', error);
      console.error('Error al desactivar usuario:', error.message);
    } finally {
      setDeletingUserId(null);
      setUserToDelete(null);
    }
  };



  // Función de diagnóstico de configuración
  const diagnosticarConfiguracion = () => {
    console.log('🔧 [DIAGNOSTICO] === DIAGNÓSTICO DE CONFIGURACIÓN ===');
    console.log('🔧 [DIAGNOSTICO] NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 [DIAGNOSTICO] NEXT_PUBLIC_ENVIRONMENT:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('🔧 [DIAGNOSTICO] NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log('🔧 [DIAGNOSTICO] API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('🔧 [DIAGNOSTICO] API_CONFIG.ENDPOINTS.USERS:', API_CONFIG.ENDPOINTS.USERS);
    console.log('🔧 [DIAGNOSTICO] window.location.hostname:', window.location.hostname);
    console.log('🔧 [DIAGNOSTICO] window.location.origin:', window.location.origin);
    console.log('🔧 [DIAGNOSTICO] window.location.pathname:', window.location.pathname);
    console.log('🔧 [DIAGNOSTICO] window.location.href:', window.location.href);
    
    // Verificar si estamos en GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    console.log('🔧 [DIAGNOSTICO] ¿Es GitHub Pages?:', isGitHubPages);
    
    if (isGitHubPages) {
      console.log('🔧 [DIAGNOSTICO] ⚠️ Detectado GitHub Pages - las URLs de API pueden estar mal configuradas');
    }
    
    console.log('🔧 [DIAGNOSTICO] === FIN DIAGNÓSTICO ===');
  };

  useEffect(() => {
    console.log('🔄 [DEBUG] useEffect ejecutado, selectedEventId:', selectedEventId, 'activeTab:', activeTab);
    console.log('🔄 [DEBUG] tabs disponibles:', tabs);
    console.log('🔄 [DEBUG] pestaña actual:', tabs[activeTab]);
    
    // Ejecutar diagnóstico solo una vez al montar el componente
    if (selectedEventId && activeTab === 0) {
      diagnosticarConfiguracion();
    }
    
    fetchUsuarios();
  }, [selectedEventId, activeTab]); // Recargar cuando cambie el evento seleccionado o la pestaña activa

  // Determinar las pestañas disponibles según el tipo de usuario
  const getUserTabs = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const userType = userData.tipo || userData.type || 'organizador';

    console.log('👤 [DEBUG] getUserTabs ejecutado');
    console.log('👤 [DEBUG] userData:', userData);
    console.log('👤 [DEBUG] Tipo de usuario detectado:', userType);
    
    if (userType.toLowerCase() === 'admin') {
      const tabs = ['Organizadores', 'Validadores', 'Asistentes'];
      console.log('👤 [DEBUG] Tabs para admin:', tabs);
      return tabs;
    } else {
      // Organizadores pueden ver Validadores y Asistentes (pero no otros organizadores)
      const tabs = ['Validadores', 'Asistentes'];
      console.log('👤 [DEBUG] Tabs para organizador:', tabs);
      return tabs;
    }
  };
  
  const tabs = getUserTabs();

  // Notificar al componente padre cuando cambie la pestaña activa
  useEffect(() => {
    if (onTabChange) {
      const currentTab = tabs[activeTab];
      onTabChange(currentTab);
    }
  }, [activeTab, tabs, onTabChange]);

  // Efecto para ajustar la pestaña activa según el tipo de usuario (solo al montar el componente)
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const userType = userData.tipo || userData.type || 'organizador';
    
    // Solo ajustar si el activeTab está fuera del rango de pestañas disponibles
    if (activeTab >= tabs.length) {
      setActiveTab(0); // Cambiar a la primera pestaña disponible
    }
  }, [tabs.length]); // Solo ejecutar cuando cambie la cantidad de pestañas

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Función para generar iniciales del avatar
  const getInitials = (nombre) => {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filtrar usuarios por tab activo (simplificado porque cada pestaña tiene su propio endpoint)
  const usuariosPorTab = usuarios.filter(usuario => {
    const currentTab = tabs[activeTab];
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const userType = userData.tipo || userData.type || 'organizador';
    const rol = usuario.rol?.toLowerCase() || '';
    
    console.log('🔍 [DEBUG] Filtrando usuario:', usuario);
    console.log('🔍 [DEBUG] currentTab:', currentTab);
    console.log('🔍 [DEBUG] userType:', userType);
    console.log('🔍 [DEBUG] rol:', rol);
    
    // Para pestañas con endpoints específicos, no filtrar (ya vienen filtrados del backend)
    if (currentTab === 'Asistentes' || currentTab === 'Organizadores') {
      console.log('✅ [DEBUG] Usuario incluido (endpoint específico)');
        return true;
    }
    
    // Solo para "Validadores" aplicar filtros adicionales
    if (currentTab === 'Validadores') {
      const include = rol === 'validador';
      console.log('✅ [DEBUG] Usuario incluido en Validadores:', include);
      return include;
    }
    
    console.log('✅ [DEBUG] Usuario incluido (default)');
    return true;
  });

  // Logs de debug para el estado actual
  console.log('📊 [DEBUG] ===== ESTADO ACTUAL =====');
  console.log('📊 [DEBUG] usuarios:', usuarios);
  console.log('📊 [DEBUG] usuarios.length:', usuarios.length);
  console.log('📊 [DEBUG] activeTab:', activeTab);
  console.log('📊 [DEBUG] tabs:', tabs);
  console.log('📊 [DEBUG] currentTab:', tabs[activeTab]);
  console.log('📊 [DEBUG] loading:', loading);
  console.log('📊 [DEBUG] error:', error);
  console.log('📊 [DEBUG] searchQuery:', searchQuery);

  // Filtrar usuarios por búsqueda (aplicado después del filtro de tab)
  const usuariosFiltrados = usuariosPorTab.filter(usuario => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const nombre = (usuario.nombreCompleto || '').toLowerCase();
    const correo = (usuario.correoElectronico || '').toLowerCase();
    const rut = (usuario.rutOId || '').toLowerCase();
    
    return nombre.includes(query) || 
           correo.includes(query) || 
           rut.includes(query);
  });

  // Logs de debug para el renderizado
  console.log('🎨 [DEBUG] Renderizando Usuarios component');
  console.log('🎨 [DEBUG] Estado actual:', { 
    loading, 
    error, 
    usuarios: usuarios.length, 
    selectedEventId,
    activeTab,
    searchQuery,
    usuariosPorTab: usuariosPorTab.length,
    usuariosFiltrados: usuariosFiltrados.length
  });

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Tabs y botón Añadir */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                minHeight: '40px',
                px: 3,
                backgroundColor: 'transparent',
                color: '#1B2735',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                marginRight: 1,
                '&:hover': {
                  backgroundColor: 'rgba(27, 39, 53, 0.05)',
                  borderColor: '#374151'
                }
              },
              '& .Mui-selected': {
                color: '#1B2735 !important',
                backgroundColor: 'rgba(27, 39, 53, 0.1) !important',
                borderColor: '#374151 !important',
                borderRadius: '8px'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>

          {/* Mostrar botón solo en la pestaña Validadores */}
          {tabs[activeTab] === 'Validadores' && (
          <Button
              variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={onAddUser}
            sx={{
                backgroundColor: 'transparent',
                color: '#1B2735',
                border: '1px solid #6B7280',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 3,
              py: 1,
              '&:hover': {
                  backgroundColor: 'rgba(27, 39, 53, 0.05)',
                  borderColor: '#374151'
              }
            }}
          >
              Añadir Validador
          </Button>
          )}
        </Stack>

        {/* Sección Miembros con búsqueda y filtro */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: '16px', 
            color: '#374151', 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            👥 Miembros ({usuariosPorTab.length})
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            {/* Buscador */}
            <TextField
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '300px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
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
                    <SearchIcon sx={{ color: '#6B7280', fontSize: '18px' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>

        {/* Tabla de usuarios */}
        <Card elevation={3} sx={{ borderRadius: '12px', bgcolor: '#FFFFFF' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    '& th': { 
                      bgcolor: '#F3F4F6', 
                      fontWeight: 600, 
                      fontSize: '14px', 
                      color: '#374151',
                      py: 2,
                      borderBottom: '1px solid #E5E7EB'
                    } 
                  }}>
                    {getTableColumns().map((column, index) => (
                      <TableCell key={index} align={column.align}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={getTableColumns().length} sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={32} />
                        <Typography variant="body1" sx={{ ml: 2, color: '#6B7280', display: 'inline' }}>
                          Cargando usuarios...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={getTableColumns().length} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: '#6B7280' }}>
                          {error === 'No hay evento seleccionado' 
                            ? 'Selecciona un evento para ver los usuarios' 
                            : 'No hay registros disponibles'
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : usuariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={getTableColumns().length} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: '#6B7280' }}>
                          {searchQuery.trim() ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuariosFiltrados.map((usuario) => (
                      <TableRow 
                        key={usuario.id || usuario._id}
                        sx={{ 
                          '&:hover': { bgcolor: '#F9FAFB' },
                          '& td': { 
                            borderBottom: '1px solid #E5E7EB',
                            py: 2
                          }
                        }}
                      >
                        {getTableColumns().map((column, index) => (
                          <TableCell key={index} align={column.align}>
                            {renderCellContent(usuario, column)}
                        </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>
          ⚠️ Confirmar desactivación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            ¿Estás seguro de que quieres desactivar al usuario "{userToDelete?.nombreCompleto}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button 
            onClick={() => setShowDeleteModal(false)}
            variant="outlined"
            sx={{
              borderColor: '#D1D5DB',
              color: '#6B7280',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={deleteUser}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Usuarios;
