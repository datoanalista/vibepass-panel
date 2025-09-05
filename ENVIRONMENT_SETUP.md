# Configuración de Variables de Entorno - VibePass Panel

## 📋 Descripción

Este proyecto utiliza variables de entorno para configurar las URLs de la API y otros parámetros de configuración. Esto permite una fácil configuración para diferentes entornos (desarrollo, producción, etc.).

## 🔧 Archivos de Configuración

### `.env.local` (Desarrollo)
```bash
# URL del API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Entorno actual
NEXT_PUBLIC_ENVIRONMENT=development

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=VibePass Panel
NEXT_PUBLIC_APP_VERSION=1.0.0

# URLs de endpoints específicos
NEXT_PUBLIC_API_EVENTS_URL=http://localhost:3001/api/events
NEXT_PUBLIC_API_USERS_URL=http://localhost:3001/api/users
NEXT_PUBLIC_API_INVENTORY_URL=http://localhost:3001/api/inventory
NEXT_PUBLIC_API_UPLOAD_BANNER_URL=http://localhost:3001/api/upload/banner
NEXT_PUBLIC_API_UPLOAD_PRODUCTS_URL=http://localhost:3001/api/upload/products
NEXT_PUBLIC_API_UPLOAD_ACTIVITIES_URL=http://localhost:3001/api/upload/activities
```

### `.env.production` (Producción)
```bash
# URL del API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Entorno actual
NEXT_PUBLIC_ENVIRONMENT=production

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=VibePass Panel
NEXT_PUBLIC_APP_VERSION=1.0.0

# URLs de endpoints específicos
NEXT_PUBLIC_API_EVENTS_URL=http://localhost:3001/api/events
NEXT_PUBLIC_API_USERS_URL=http://localhost:3001/api/users
NEXT_PUBLIC_API_INVENTORY_URL=http://localhost:3001/api/inventory
NEXT_PUBLIC_API_UPLOAD_BANNER_URL=http://localhost:3001/api/upload/banner
NEXT_PUBLIC_API_UPLOAD_PRODUCTS_URL=http://localhost:3001/api/upload/products
NEXT_PUBLIC_API_UPLOAD_ACTIVITIES_URL=http://localhost:3001/api/upload/activities
```

## 🚀 Configuración Inicial

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edita las variables según tu entorno:**
   - Cambia `NEXT_PUBLIC_API_BASE_URL` por la URL de tu API
   - Ajusta `NEXT_PUBLIC_ENVIRONMENT` según el entorno

3. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 📁 Estructura de Configuración

### `src/config/api.js`
Archivo centralizado que contiene:
- Configuración de URLs de la API
- Endpoints específicos
- Configuración de requests
- Funciones helper para construir URLs

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API | `http://localhost:3001` |
| `NEXT_PUBLIC_ENVIRONMENT` | Entorno actual | `development` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `VibePass Panel` |
| `NEXT_PUBLIC_APP_VERSION` | Versión de la aplicación | `1.0.0` |

## 🔄 Migración Completada

Se han reemplazado todas las URLs hardcodeadas en los siguientes archivos:

- ✅ `src/components/EventAdminDashboard.jsx`
- ✅ `src/components/CreateEvent/hooks/useEventForm.js`
- ✅ `src/components/Usuarios.jsx`
- ✅ `src/components/Inventario.jsx`
- ✅ `src/components/AddInventoryForm.jsx`
- ✅ `src/components/EventsOverview.jsx`

## 🎯 Beneficios

1. **Mantenibilidad**: Cambios de URL centralizados
2. **Flexibilidad**: Fácil configuración para diferentes entornos
3. **Seguridad**: Variables sensibles fuera del código
4. **Escalabilidad**: Fácil migración a diferentes servidores

## 📝 Notas Importantes

- Las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente
- Reinicia el servidor después de cambiar variables de entorno
- No commitees archivos `.env.local` al repositorio
- Usa `.env.example` como plantilla para otros desarrolladores

