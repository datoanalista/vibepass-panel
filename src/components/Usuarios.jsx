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

const Usuarios = ({ onAddUser, onEditUser, selectedEventId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Función para obtener usuarios de la API
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [DEBUG] fetchUsuarios iniciado');
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
      console.log('🏁 [DEBUG] fetchUsuarios finalizado, loading: false');
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
    console.log('🔄 [DEBUG] useEffect ejecutado, selectedEventId:', selectedEventId);
    
    // Ejecutar diagnóstico solo una vez al montar el componente
    if (selectedEventId) {
      diagnosticarConfiguracion();
    }
    
    fetchUsuarios();
  }, [selectedEventId]); // Recargar cuando cambie el evento seleccionado

  const tabs = ['Todos', 'Organizadores', 'Validadores', 'Compradores', 'Administradores'];

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

  // Filtrar usuarios por tab activo
  const usuariosPorTab = usuarios.filter(usuario => {
    if (activeTab === 0) return true; // "Todos"
    
    const rol = usuario.rol?.toLowerCase() || '';
    switch (activeTab) {
      case 1: // "Organizadores"
        return rol === 'organizador';
      case 2: // "Validadores"
        return rol === 'validador';
      case 3: // "Compradores"
        return rol === 'comprador' || rol === 'visitante';
      case 4: // "Administradores"
        return rol === 'administrador';
      default:
        return true;
    }
  });

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
                px: 3
              },
              '& .Mui-selected': {
                color: '#FFFFFF !important',
                bgcolor: '#3B82F6',
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

          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onAddUser}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 3,
              py: 1,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)'
              }
            }}
          >
            Añadir rol de usuario
          </Button>
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
                    <TableCell>Cuentas</TableCell>
                    <TableCell align="center">Rut</TableCell>
                    <TableCell align="center">Correo</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">QR</TableCell>
                    <TableCell align="center">Rol</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={32} />
                        <Typography variant="body1" sx={{ ml: 2, color: '#6B7280', display: 'inline' }}>
                          Cargando usuarios...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
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
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
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
                        {/* Cuentas */}
                        <TableCell>
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
                        </TableCell>
                        
                        {/* Rut */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ 
                            fontSize: '14px', 
                            color: '#2563EB',
                            fontWeight: 500
                          }}>
                            {usuario.rutOId}
                          </Typography>
                        </TableCell>
                        
                        {/* Correo */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ 
                            fontSize: '14px', 
                            color: '#2563EB'
                          }}>
                            {usuario.correoElectronico}
                          </Typography>
                        </TableCell>
                        
                        {/* Fecha */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ 
                            fontSize: '14px', 
                            color: '#374151'
                          }}>
                            {usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-CL') : '-'}
                          </Typography>
                        </TableCell>
                        
                        {/* QR */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ 
                            fontSize: '14px', 
                            color: '#6B7280'
                          }}>
                            -
                          </Typography>
                        </TableCell>
                        
                        {/* Rol */}
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ 
                            fontSize: '14px', 
                            color: '#374151',
                            fontWeight: 500
                          }}>
                            {usuario.rol}
                          </Typography>
                        </TableCell>

                        {/* Acciones */}
                        <TableCell align="center">
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
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
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
