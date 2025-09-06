"use client";
import React, { useState } from 'react';
import API_CONFIG from '../config/api';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Container,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const AddInventoryForm = ({ 
  inventoryFormData,
  handleInventoryFormChange,
  createInventory,
  createInventoryLoading,
  onCancel,
  isEditing = false,
  selectedEventId
}) => {
  // Si no se pasan las props, usar estado local (para crear)
  const [localFormData, setLocalFormData] = useState({
    nombreProducto: '',
    categoria: '',
    descripcion: '',
    skuCodigoInterno: '',
    precioVenta: '',
    stockInicialDisponible: '',
    imagenProducto: null
  });
  
  const [localCreateLoading, setLocalCreateLoading] = useState(false);
  
  const formData = inventoryFormData || localFormData;
  const handleFormChange = handleInventoryFormChange || ((field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
  });

  // Función para formatear precio con puntos decimales
  const formatPrice = (value) => {
    // Remover caracteres no numéricos excepto puntos
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Si está vacío, retornar vacío
    if (!numericValue) return '';
    
    // Convertir a número y formatear con puntos
    const number = parseInt(numericValue);
    return number.toLocaleString('es-CL');
  };

  // Función para manejar cambios en el precio
  const handlePriceChange = (value) => {
    const formattedValue = formatPrice(value);
    handleFormChange('precioVenta', formattedValue);
  };

  // Función para manejar cambios en el stock
  const handleStockChange = (value) => {
    const formattedValue = formatPrice(value);
    handleFormChange('stockInicialDisponible', formattedValue);
  };
  const loading = createInventoryLoading !== undefined ? createInventoryLoading : localCreateLoading;
  const [uploadState, setUploadState] = useState({
    loading: false,
    error: null,
    success: false,
    url: ''
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProductName, setCreatedProductName] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  // Función para manejar upload de imagen
  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploadState({ loading: true, error: null, success: false, url: '' });

      const formData = new FormData();
      formData.append('images', file); // El endpoint espera 'images'

      const response = await fetch(API_CONFIG.ENDPOINTS.UPLOAD_PRODUCTS, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success' && result.data.productos.length > 0) {
        const productUrl = result.data.productos[0].url; // Tomamos el primer (y único) producto

        setUploadState({ 
          loading: false, 
          error: null, 
          success: true, 
          url: productUrl 
        });
        handleFormChange('imagenProducto', {
          name: file.name,
          url: productUrl
        });

        console.log('✅ Imagen de producto subida exitosamente:', productUrl);
      } else {
        throw new Error(result.message || 'Error al subir imagen del producto');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadState({ 
        loading: false, 
        error: error.message, 
        success: false, 
        url: '' 
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Función local para crear inventario (solo cuando no se pasa como prop)
  const localCreateInventory = async () => {
    try {
      setLocalCreateLoading(true);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.INVENTORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreProducto: formData.nombreProducto,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          sku: formData.skuCodigoInterno,
          precioVenta: parseInt(formData.precioVenta.replace(/\./g, '')) || 0,
          stockInicial: parseInt(formData.stockInicialDisponible.replace(/\./g, '')) || 0,
          imagen: formData.imagenProducto?.url || null,
          eventoId: selectedEventId
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        console.log('✅ Producto creado exitosamente:', result);
        
        // Guardar nombre del producto creado
        setCreatedProductName(formData.nombreProducto);
        
        // Limpiar formulario
        setLocalFormData({
          nombreProducto: '',
          categoria: '',
          descripcion: '',
          skuCodigoInterno: '',
          precioVenta: '',
          stockInicialDisponible: '',
          imagenProducto: null
        });
        setUploadState({ loading: false, error: null, success: false, url: '' });
        
        // Mostrar modal de éxito
        setShowSuccessModal(true);
      } else {
        throw new Error(result.message || 'Error al crear el producto');
      }
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      // Limpiar el mensaje de error para mostrar solo información útil
      let cleanMessage = error.message;
      if (cleanMessage.includes('Validation error:')) {
        cleanMessage = cleanMessage.replace('Validation error: ', '');
      }
      if (cleanMessage.includes('Error al crear producto:')) {
        cleanMessage = cleanMessage.replace('Error al crear producto: ', '');
      }
      setErrorMessage(cleanMessage);
      setShowErrorModal(true);
    } finally {
      setLocalCreateLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '14px' }}>
            Completa la siguiente información para registrar un nuevo producto
          </Typography>
        </Box>

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
              Formulario de producto
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
                {/* Nombre del producto */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Nombre del producto
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.nombreProducto}
                    onChange={(e) => handleFormChange('nombreProducto', e.target.value)}
                    placeholder="Hamburguesa simple"
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

                {/* Categoría */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Categoría
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.categoria}
                      onChange={(e) => handleFormChange('categoria', e.target.value)}
                      displayEmpty
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
                      <MenuItem value="" disabled>Selecciona una categoría</MenuItem>
                      <MenuItem value="Alimento">Alimento</MenuItem>
                      <MenuItem value="Bebida">Bebida</MenuItem>
                      <MenuItem value="Tickets">Tickets</MenuItem>
                      <MenuItem value="Agendables">Agendables</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Descripción */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Descripción
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => handleFormChange('descripcion', e.target.value)}
                    placeholder="Hamburguesa con pan, carne y queso cheddar"
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

                {/* SKU o Código interno */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    SKU o Código interno
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.skuCodigoInterno}
                    onChange={(e) => handleFormChange('skuCodigoInterno', e.target.value)}
                    placeholder="HAM-001"
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

                {/* Fila: Precio y Stock */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Precio de venta */}
                  <Box sx={{ flex: '1 1 50%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                      Precio de venta (CLP)
                    </Typography>
                    <TextField
                      fullWidth
                      type="text"
                      value={formData.precioVenta}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="2.500"
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

                  {/* Stock inicial disponible */}
                  <Box sx={{ flex: '1 1 50%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                      Stock inicial disponible
                    </Typography>
                    <TextField
                      fullWidth
                      type="text"
                      value={formData.stockInicialDisponible}
                      onChange={(e) => handleStockChange(e.target.value)}
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
                </Box>

                {/* Imagen del producto */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                    Imagen del producto
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="product-image-upload"
                    disabled={uploadState.loading}
                  />
                  <Stack spacing={1}>
                    {uploadState.loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          Subiendo imagen...
                        </Typography>
                      </Box>
                    ) : uploadState.success ? (
                      <Box>
                        <Button
                          variant="outlined"
                          startIcon={<CheckIcon />}
                          size="small"
                          fullWidth
                          color="success"
                          onClick={() => document.getElementById('product-image-upload').click()}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '12px',
                          }}
                        >
                          Imagen subida exitosamente
                        </Button>
                        {formData.imagenProducto && (
                          <Chip 
                            label={formData.imagenProducto.name}
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.75rem', mt: 0.5 }}
                          />
                        )}
                      </Box>
                    ) : uploadState.error ? (
                      <Box>
                        <Button
                          variant="outlined"
                          startIcon={<ErrorIcon />}
                          size="small"
                          fullWidth
                          color="error"
                          onClick={() => document.getElementById('product-image-upload').click()}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '12px',
                          }}
                        >
                          Error al subir - Reintentar
                        </Button>
                        <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                          {uploadState.error}
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => document.getElementById('product-image-upload').click()}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '12px',
                          py: 2,
                          borderStyle: 'dashed',
                          borderColor: '#D1D5DB',
                          color: '#6B7280',
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            bgcolor: '#F9FAFB'
                          }
                        }}
                      >
                        📁 Adjuntar archivo
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>

            {/* Botones de acción */}
            <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: '0 0 12px 12px' }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ 
                    color: '#6B7280',
                    borderColor: '#E4E8ED',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 3,
                    '&:hover': {
                      borderColor: '#9AA5B1',
                      bgcolor: '#f8f9fa'
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained"
                  onClick={createInventory || localCreateInventory}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#3B82F6',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#2563EB'
                    }
                  }}
                >
                  {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear')}
                </Button>
              </Stack>
            </Box>
          </Card>
        </Box>
      </Container>

      {/* Modal de Éxito */}
      <Dialog
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onCancel();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main', fontWeight: 600 }}>
          🎉 ¡Producto creado exitosamente!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
            El producto "{createdProductName}" ha sido agregado al inventario correctamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => {
              setShowSuccessModal(false);
              onCancel();
            }}
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

      {/* Modal*/}
      <Dialog 
        open={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          border: 'none',
          overflow: 'hidden'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ErrorIcon sx={{ fontSize: 32, color: 'white !important' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'white !important' }}>
                Error al Crear Producto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'white !important' }}>
                Se produjo un error durante la creación del producto
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, pt: 6 }}>
          <Box sx={{ 
            p: 2, 
            mt: 2,
            bgcolor: '#FEF2F2', 
            borderRadius: '8px',
            border: '1px solid #FECACA'
          }}>
            <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 600, mb: 1 }}>
              ⚠️ Importante!
            </Typography>
            <Typography variant="body2" sx={{ color: '#7F1D1D', fontSize: '14px' }}>
              • Verifica que la descripción tenga entre 5 y 1000 caracteres
              • Asegúrate de que todos los campos requeridos estén completos
              • Revisa que la imagen sea válida y no exceda el tamaño permitido
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowErrorModal(false)}
            variant="contained"
            sx={{ 
              bgcolor: '#0F172A',
              '&:hover': { bgcolor: '#1E293B' },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddInventoryForm;
