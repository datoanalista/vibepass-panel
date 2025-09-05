"use client";
import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const Inventario = ({ onAddInventory, onEditInventory, selectedEventId }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedItemName, setDeletedItemName] = useState('');

  // Función para obtener inventario de la API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si no hay evento seleccionado, mostrar estado vacío sin hacer petición
      if (!selectedEventId) {
        setInventoryItems([]);
        setError('No hay evento seleccionado');
        setLoading(false);
        return;
      }
      
      // Construir URL con filtro por evento
      const url = `${API_CONFIG.ENDPOINTS.INVENTORY}?eventoId=${selectedEventId}`;
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        setInventoryItems(result.data.items || []);
        setError(null);
      } else {
        // No lanzar error, solo mostrar estado vacío
        setInventoryItems([]);
        setError('No hay productos en el inventario para este evento');
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setInventoryItems([]);
      setError('No hay productos en el inventario para este evento');
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar modal de confirmación
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Función para eliminar inventario
  const deleteInventoryItem = async () => {
    if (!itemToDelete) return;

    try {
      setDeletingItemId(itemToDelete.id || itemToDelete._id);
      setShowDeleteModal(false);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.INVENTORY_BY_ID(itemToDelete.id || itemToDelete._id), {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        console.log('✅ Producto eliminado exitosamente');
        // Guardar nombre del producto eliminado
        setDeletedItemName(itemToDelete.nombre || itemToDelete.nombreProducto);
        // Recargar la lista de inventario
        fetchInventory();
        // Mostrar modal de éxito
        setShowDeleteSuccessModal(true);
      } else {
        throw new Error(result.message || 'Error al eliminar el producto');
      }
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      console.error('Error al eliminar producto:', error.message);
    } finally {
      setDeletingItemId(null);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedEventId]); // Recargar cuando cambie el evento seleccionado

  // Filtrar items por categoría
  const itemsPorCategoria = {
    Tickets: inventoryItems.filter(item => item.categoria === 'Tickets'),
    Alimento: inventoryItems.filter(item => item.categoria === 'Alimento'),
    Bebida: inventoryItems.filter(item => item.categoria === 'Bebida'),
    Agendables: inventoryItems.filter(item => item.categoria === 'Agendables')
  };

  // Componente para cada item de inventario
  const InventoryItem = ({ item }) => {
    const stockActual = item.stock?.actual || item.stockActual || 0;
    const stockInicial = item.stock?.inicial || item.stockInicial || 1;
    const porcentajeStock = item.stock?.porcentaje || Math.round((stockActual / stockInicial) * 100);
    
    const stockColor = porcentajeStock > 50 ? '#10B981' : 
                      porcentajeStock > 20 ? '#F59E0B' : '#EF4444';
    
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
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            {/* Información del producto */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                fontSize: '16px',
                color: '#374151',
                mb: 0.5
              }}>
                {item.nombre || item.nombreProducto}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#6B7280',
                fontSize: '14px'
              }}>
                ${(item.precio || item.precioVenta || 0).toLocaleString()}
              </Typography>
              <Chip 
                label={item.categoria} 
                size="small" 
                sx={{ 
                  mt: 1,
                  bgcolor: '#E5E7EB', 
                  color: '#374151',
                  fontSize: '12px'
                }}
              />
            </Box>
            
            {/* SKU */}
            <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
              <Typography variant="caption" sx={{ 
                color: '#6B7280',
                fontSize: '12px',
                display: 'block'
              }}>
                Sku
              </Typography>
              <Chip
                label={item.sku}
                sx={{
                  bgcolor: '#3B82F6',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '12px'
                }}
              />
            </Box>
            
            {/* Stock */}
            <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
              <Typography variant="caption" sx={{ 
                color: '#6B7280',
                fontSize: '12px',
                display: 'block'
              }}>
                Stock
              </Typography>
              <Chip
                label={stockActual}
                sx={{
                  bgcolor: stockColor,
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '12px'
                }}
              />
              {porcentajeStock <= 20 && (
                <Typography variant="caption" sx={{ 
                  color: '#EF4444',
                  fontSize: '11px',
                  display: 'block',
                  mt: 0.5
                }}>
                  Últimas unidades ({porcentajeStock}%)
                </Typography>
              )}
            </Box>
            
            {/* Botones de acción */}
            <Stack direction="row" spacing={1}>
              <IconButton 
                size="small"
                onClick={() => onEditInventory && onEditInventory(item)}
                sx={{ 
                  color: '#3B82F6',
                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small"
                onClick={() => handleDeleteClick(item)}
                disabled={deletingItemId === (item.id || item._id)}
                sx={{ 
                  color: '#EF4444',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                  '&:disabled': { color: '#9CA3AF' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente para cada sección
  const InventorySection = ({ title, items, emoji }) => (
    <Box sx={{ mb: 4 }}>
      {/* Pestaña de sección */}
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
          {emoji} {title}
        </Typography>
      </Box>
      
      {/* Cuerpo de la sección */}
      <Card elevation={3} sx={{ 
        bgcolor: '#D9D9D9',
        borderRadius: '0 12px 12px 12px',
        mt: -1,
        position: 'relative',
        zIndex: 1
      }}>
        <CardContent sx={{ p: 3 }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                No hay productos en esta categoría
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {items.map((item) => (
                <InventoryItem key={item.id || item._id} item={item} />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header con botón Añadir inventario */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddInventory}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 3,
              py: 1.5,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)'
              }
            }}
          >
            📦 Añadir inventario
          </Button>
        </Box>

        {/* Loading/Error States */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="h6" sx={{ ml: 2, color: '#6B7280' }}>
              Cargando inventario...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
              📦 {error === 'No hay evento seleccionado' 
                ? 'Selecciona un evento para ver el inventario' 
                : 'No hay productos en el inventario'
              }
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
              {error === 'No hay evento seleccionado' 
                ? 'Elige un evento desde el selector superior' 
                : 'Comienza agregando productos a tu inventario'
              }
            </Typography>
          </Box>
        ) : (
          <Stack spacing={4}>
            {/* Sección Tickets */}
            <InventorySection 
              title="Tickets" 
              items={itemsPorCategoria.Tickets} 
              emoji="🎫"
            />
            
            {/* Sección Alimentos */}
            <InventorySection 
              title="Alimentos" 
              items={itemsPorCategoria.Alimento} 
              emoji="🍔"
            />
            
            {/* Sección Bebidas */}
            <InventorySection 
              title="Bebidas" 
              items={itemsPorCategoria.Bebida} 
              emoji="🥤"
            />
            
            {/* Sección Agendables */}
            <InventorySection 
              title="Agendables" 
              items={itemsPorCategoria.Agendables} 
              emoji="📅"
            />
          </Stack>
        )}
      </Container>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>
          ⚠️ Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            ¿Estás seguro de que quieres eliminar el producto "{itemToDelete?.nombre || itemToDelete?.nombreProducto}" del inventario?
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
            onClick={deleteInventoryItem}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminación Exitosa */}
      <Dialog
        open={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main', fontWeight: 600 }}>
          🗑️ ¡Producto eliminado exitosamente!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            El producto "{deletedItemName}" ha sido eliminado del inventario correctamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowDeleteSuccessModal(false)}
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
    </Box>
  );
};

export default Inventario;