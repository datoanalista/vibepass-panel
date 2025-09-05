// Configuración centralizada de la API
// Este archivo centraliza todas las URLs y configuraciones de la API

const API_CONFIG = {
  // URL base del API
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  
  // Entorno actual
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  
  // Configuración de la aplicación
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'VibePass Panel',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Endpoints específicos
  ENDPOINTS: {
    // Eventos
    EVENTS: process.env.NEXT_PUBLIC_API_EVENTS_URL || 'http://localhost:3001/api/events',
    EVENT_BY_ID: (id) => `${API_CONFIG.BASE_URL}/api/events/${id}`,
    
    // Borradores
    DRAFTS: process.env.NEXT_PUBLIC_API_DRAFTS_URL || 'http://localhost:3001/api/drafts',
    DRAFT_BY_ID: (id) => `${API_CONFIG.BASE_URL}/api/drafts/${id}`,
    DRAFT_SAVE: process.env.NEXT_PUBLIC_API_DRAFT_SAVE_URL || 'http://localhost:3001/api/drafts/save',
    
    // Usuarios
    USERS: process.env.NEXT_PUBLIC_API_USERS_URL || 'http://localhost:3001/api/users',
    USER_BY_ID: (id) => `${API_CONFIG.BASE_URL}/api/users/${id}`,
    
    // Inventario
    INVENTORY: process.env.NEXT_PUBLIC_API_INVENTORY_URL || 'http://localhost:3001/api/inventory',
    INVENTORY_BY_ID: (id) => `${API_CONFIG.BASE_URL}/api/inventory/${id}`,
    
    // Uploads
    UPLOAD_BANNER: process.env.NEXT_PUBLIC_API_UPLOAD_BANNER_URL || 'http://localhost:3001/api/upload/banner',
    UPLOAD_PRODUCTS: process.env.NEXT_PUBLIC_API_UPLOAD_PRODUCTS_URL || 'http://localhost:3001/api/upload/products',
    UPLOAD_ACTIVITIES: process.env.NEXT_PUBLIC_API_UPLOAD_ACTIVITIES_URL || 'http://localhost:3001/api/upload/activities',
  },
  
  // Configuración de requests
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
  },
  
  // Configuración de uploads
  UPLOAD_CONFIG: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Reemplazar parámetros en la URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Función helper para hacer requests
export const apiRequest = async (url, options = {}) => {
  const config = {
    ...API_CONFIG.REQUEST_CONFIG,
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_CONFIG;

