import { useState, useCallback, useMemo, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import API_CONFIG from '../../../config/api';

export const useEventForm = () => {
  const { user } = useAuth(); // Obtener usuario autenticado
  const [createEventStep, setCreateEventStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  
  const [uploadStates, setUploadStates] = useState({
    banner: { loading: false, error: null, success: false },
    productos: {}, 
    actividades: {} 
  });

  const [createEventState, setCreateEventState] = useState({
    loading: false,
    error: null,
    success: false,
    showSuccessModal: false
  });

  const [draftSaveState, setDraftSaveState] = useState({
    loading: false,
    success: false,
    error: null,
    showTooltip: false
  });

  const [formLoadingState, setFormLoadingState] = useState({
    loading: false,
    message: ''
  });
  const [eventFormData, setEventFormData] = useState({
    nombreEvento: '',
    descripcion: '',
    fechaEvento: '',
    horaInicio: '',
    horaTermino: '',
    lugarEvento: '',
    bannerPromocional: null,
    bannerUrl: '',    
    entradas: [],
    alimentosBebestibles: [],
    actividades: [],
    nombreOrganizador: '',
    correoElectronico: '',
    telefonoContacto: '',
    nombreEmpresaColegio: '',
    rutEmpresa: '',
    permiteDevolucion: null
  });

  // Auto-llenar datos del organizador cuando el usuario esté disponible
  useEffect(() => {
    if (user && !eventFormData.nombreOrganizador) {
      console.log('🔄 Auto-llenando datos del organizador:', user);
      setEventFormData(prev => ({
        ...prev,
        nombreOrganizador: user.nombreCompleto || '',
        correoElectronico: user.email || '',
        telefonoContacto: user.telefono || '',
        nombreEmpresaColegio: user.organizacion || '',
        rutEmpresa: user.rut || ''
      }));
    }
  }, [user, eventFormData.nombreOrganizador]);

  // Función optimizada para mapear entradas
  const mapEntradas = useCallback((entradas) => {
    if (!entradas || !Array.isArray(entradas)) return [];
    return entradas.map(entrada => ({
      id: entrada.id,
      tipoEntrada: entrada.tipoEntrada || '',
      precio: entrada.precio || '',
      cuposDisponibles: entrada.cuposDisponibles || '',
      limitePorPersona: entrada.limitePorPersona || '',
      fechasVenta: {
        inicio: entrada.fechasVenta?.inicio || '',
        fin: entrada.fechasVenta?.fin || ''
      },
      entradasVendidas: entrada.entradasVendidas || 0,
      activa: entrada.activa !== undefined ? entrada.activa : true
    }));
  }, []);

  // Función optimizada para mapear alimentos y bebestibles
  const mapAlimentosBebestibles = useCallback((alimentos) => {
    if (!alimentos || !Array.isArray(alimentos)) return [];
    return alimentos.map(alimento => ({
      id: alimento.id,
      nombre: alimento.nombre || '',
      precioUnitario: alimento.precioUnitario || '',
      stockAsignado: alimento.stockAsignado || '',
      descripcion: alimento.descripcion || '',
      imagen: null,
      imagenUrl: alimento.imagen || ''
    }));
  }, []);

  // Función optimizada para mapear actividades
  const mapActividades = useCallback((actividades) => {
    if (!actividades || !Array.isArray(actividades)) return [];
    return actividades.map(actividad => ({
      id: actividad.id,
      nombreActividad: actividad.nombreActividad || '',
      precioUnitario: actividad.precioUnitario || '',
      cuposDisponibles: actividad.cuposDisponibles || '',
      horaInicio: actividad.horaInicio || '',
      horaTermino: actividad.horaTermino || '',
      descripcion: actividad.descripcion || '',
      imagenPromocional: null,
      imagenPromocionalUrl: actividad.imagenPromocional || ''
    }));
  }, []);

  // useEffect para cargar datos del evento en modo edición o borrador
  useEffect(() => {
    const loadEventData = async () => {
      try {
        // Verificar si estamos en modo edición o borrador
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const editDraftId = urlParams.get('editDraft');
        
        // Si hay datos para cargar, mostrar estado de carga
        if (mode === 'edit' || editDraftId) {
          setFormLoadingState({
            loading: true,
            message: mode === 'edit' ? 'Cargando evento...' : 'Cargando borrador...'
          });
        }
        
        if (mode === 'edit') {
          const editingEventData = localStorage.getItem('editingEvent');
          
          if (editingEventData) {
            const eventData = JSON.parse(editingEventData);
            
            // Debug: ver la estructura del eventData
            console.log('🔍 DEBUG - eventData completo:', eventData);
            console.log('🔍 DEBUG - eventData._id:', eventData._id);
            console.log('🔍 DEBUG - tipo de _id:', typeof eventData._id);
            
            // Extraer el ID correctamente, manejando tanto string como objeto $oid
            let eventId;
            if (typeof eventData._id === 'string') {
              eventId = eventData._id;
            } else if (eventData._id && eventData._id.$oid) {
              eventId = eventData._id.$oid;
            } else if (eventData._id && typeof eventData._id === 'object') {
              // Si es un objeto pero no tiene $oid, intentar convertir a string
              eventId = eventData._id.toString();
            } else {
              console.error('❌ No se pudo extraer el ID del evento:', eventData._id);
              eventId = null;
            }
            
            console.log('🔍 DEBUG - eventId extraído:', eventId);
            
            setIsEditMode(true);
            setEditingEventId(eventId);
            
            // Cargar datos del evento en el formulario (optimizado)
            console.log('⚡ Iniciando carga optimizada del evento...');
            
            const formData = {
              nombreEvento: eventData.informacionGeneral?.nombreEvento || '',
              descripcion: eventData.informacionGeneral?.descripcion || '',
              fechaEvento: eventData.informacionGeneral?.fechaEvento ? 
                (typeof eventData.informacionGeneral.fechaEvento === 'string' && eventData.informacionGeneral.fechaEvento.includes('T') 
                  ? eventData.informacionGeneral.fechaEvento.split('T')[0] 
                  : eventData.informacionGeneral.fechaEvento) || '' : '',
              horaInicio: eventData.informacionGeneral?.horaInicio || '',
              horaTermino: eventData.informacionGeneral?.horaTermino || '',
              lugarEvento: eventData.informacionGeneral?.lugarEvento || '',
              bannerPromocional: null,
              bannerUrl: eventData.informacionGeneral?.bannerPromocional || eventData.imagenPrincipal || '',
              entradas: mapEntradas(eventData.entradas),
              alimentosBebestibles: mapAlimentosBebestibles(eventData.alimentosBebestibles),
              actividades: mapActividades(eventData.actividades),
              nombreOrganizador: eventData.organizador?.nombreOrganizador || '',
              correoElectronico: eventData.organizador?.correoElectronico || '',
              telefonoContacto: eventData.organizador?.telefonoContacto || '',
              nombreEmpresaColegio: eventData.organizador?.nombreEmpresaColegio || '',
              rutEmpresa: eventData.organizador?.rutEmpresa || '',
              permiteDevolucion: eventData.configuracion?.permiteDevolucion || null
            };
            
            console.log('⚡ Evento optimizado preparado, aplicando...');
            setEventFormData(formData);
            console.log('✅ Evento cargado exitosamente');
            
            // Cerrar estado de carga
            setFormLoadingState({ loading: false, message: '' });
          }
        } else if (editDraftId) {
          // Cargar borrador desde la API
          console.log('📝 Cargando borrador para editar:', editDraftId);
          
          try {
            const response = await fetch(API_CONFIG.ENDPOINTS.DRAFT_BY_ID(editDraftId), API_CONFIG.REQUEST_CONFIG);
            const result = await response.json();
            
            console.log('📥 Respuesta del borrador:', result);
            
            if (result.status === 'success' && result.data.draft) {
              const draftData = result.data.draft;
              
              console.log('🔍 DraftData completo:', draftData);
              console.log('🔍 DraftData._id:', draftData._id);
              console.log('🔍 DraftData.id:', draftData.id);
              console.log('🔍 Claves del draftData:', Object.keys(draftData));
              
              console.log('📋 Datos del borrador cargados:', {
                id: draftData._id,
                nombre: draftData.informacionGeneral?.nombreEvento,
                organizador: draftData.organizador,
                configuracion: draftData.configuracion
              });
              
              // Para borradores, NO estamos en modo edición, solo cargamos el borrador
              setIsEditMode(false);
              setEditingEventId(null);
              
              // Usar el ID del borrador de la URL si draftData._id no está disponible
              const finalDraftId = draftData._id || draftData.id || editDraftId;
              setDraftId(finalDraftId);
              
              console.log('✅ DraftId establecido:', finalDraftId);
              console.log('🔍 Origen del DraftId:', {
                'draftData._id': draftData._id,
                'draftData.id': draftData.id,
                'editDraftId': editDraftId,
                'finalDraftId': finalDraftId
              });
              
              // Cargar datos del borrador en el formulario (optimizado)
              console.log('⚡ Iniciando carga optimizada del formulario...');
              
              const formData = {
                nombreEvento: draftData.informacionGeneral?.nombreEvento || '',
                descripcion: draftData.informacionGeneral?.descripcion || '',
                fechaEvento: draftData.informacionGeneral?.fechaEvento ? 
                  (typeof draftData.informacionGeneral.fechaEvento === 'string' && draftData.informacionGeneral.fechaEvento.includes('T') 
                    ? draftData.informacionGeneral.fechaEvento.split('T')[0] 
                    : draftData.informacionGeneral.fechaEvento) || '' : '',
                horaInicio: draftData.informacionGeneral?.horaInicio || '',
                horaTermino: draftData.informacionGeneral?.horaTermino || '',
                lugarEvento: draftData.informacionGeneral?.lugarEvento || '',
                bannerPromocional: null,
                bannerUrl: draftData.informacionGeneral?.bannerPromocional || '',
                entradas: mapEntradas(draftData.entradas),
                alimentosBebestibles: mapAlimentosBebestibles(draftData.alimentosBebestibles),
                actividades: mapActividades(draftData.actividades),
                nombreOrganizador: draftData.organizador?.nombreOrganizador || '',
                correoElectronico: draftData.organizador?.correoElectronico || '',
                telefonoContacto: draftData.organizador?.telefonoContacto || '',
                nombreEmpresaColegio: draftData.organizador?.nombreEmpresaColegio || '',
                rutEmpresa: draftData.organizador?.rutEmpresa || '',
                permiteDevolucion: draftData.configuracion?.permiteDevolucion || null
              };
              
              console.log('⚡ Formulario optimizado preparado, aplicando...');
              setEventFormData(formData);
              console.log('✅ Formulario cargado exitosamente');
              
              // Cerrar estado de carga
              setFormLoadingState({ loading: false, message: '' });

              // Actualizar estados de upload para imágenes existentes
              const newUploadStates = { ...uploadStates };
              
              // Actualizar estado de banner si existe
              if (draftData.informacionGeneral?.bannerPromocional) {
                newUploadStates.banner = {
                  loading: false,
                  error: null,
                  success: true,
                  url: draftData.informacionGeneral.bannerPromocional
                };
              }
              
              // Actualizar estados de imágenes de productos
              if (draftData.alimentosBebestibles) {
                draftData.alimentosBebestibles.forEach(alimento => {
                  if (alimento.imagen) {
                    newUploadStates.productos[alimento.id] = {
                      loading: false,
                      error: null,
                      success: true,
                      url: alimento.imagen
                    };
                  }
                });
              }
              
              // Actualizar estados de imágenes de actividades
              if (draftData.actividades) {
                draftData.actividades.forEach(actividad => {
                  if (actividad.imagenPromocional) {
                    newUploadStates.actividades[actividad.id] = {
                      loading: false,
                      error: null,
                      success: true,
                      url: actividad.imagenPromocional
                    };
                  }
                });
              }
              
              setUploadStates(newUploadStates);
            } else {
              console.error('❌ Error al cargar borrador:', result.message);
            }
          } catch (err) {
            console.error('❌ Error de conexión al cargar borrador:', err);
          }
        }
      } catch (error) {
        console.error('Error loading event data:', error);
      }
    };

    loadEventData();
  }, []);

  // Debug: monitorear cambios en draftId
  useEffect(() => {
    console.log('🔄 DraftId cambió:', draftId);
  }, [draftId]);

  const handleFormChange = useCallback((field, value) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNextStep = useCallback(() => {
    setCreateEventStep(prev => prev < 5 ? prev + 1 : prev);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCreateEventStep(prev => prev > 1 ? prev - 1 : prev);
  }, []);

  const handleCloseForm = useCallback(() => {
    setCreateEventStep(1);
    setEventFormData({
      nombreEvento: '',
      descripcion: '',
      fechaEvento: '',
      horaInicio: '',
      horaTermino: '',
      lugarEvento: '',
      bannerPromocional: null,
      entradas: [],
      alimentosBebestibles: [],
      actividades: [],
      nombreOrganizador: '',
      correoElectronico: '',
      telefonoContacto: '',
      nombreEmpresaColegio: '',
      rutEmpresa: '',
      permiteDevolucion: null
    });
  }, []);

  const isStep1Valid = useMemo(() => {
    return eventFormData.nombreEvento && 
           eventFormData.descripcion && 
           eventFormData.fechaEvento && 
           eventFormData.horaInicio &&
           eventFormData.horaTermino &&
           eventFormData.lugarEvento &&
           eventFormData.bannerUrl;
  }, [
    eventFormData.nombreEvento,
    eventFormData.descripcion,
    eventFormData.fechaEvento,
    eventFormData.horaInicio,
    eventFormData.horaTermino,
    eventFormData.lugarEvento,
    eventFormData.bannerUrl
  ]);

  // Validación para habilitar el botón "Guardar Borrador" (misma validación que "Siguiente")
  const canSaveDraft = useMemo(() => {
    return isStep1Valid;
  }, [isStep1Valid]);

  const isStep2Valid = useMemo(() => {
    return eventFormData.entradas.length > 0;
  }, [eventFormData.entradas.length]);

  const isStep3Valid = useMemo(() => {
    return true;
  }, []);

  const isStep4Valid = useMemo(() => {
    return true; // Las actividades son opcionales
  }, []);

  const isStep5Valid = useMemo(() => {
    return eventFormData.nombreOrganizador && 
           eventFormData.correoElectronico && 
           eventFormData.telefonoContacto && 
           eventFormData.nombreEmpresaColegio && 
           eventFormData.rutEmpresa &&
           eventFormData.permiteDevolucion !== null;
  }, [
    eventFormData.nombreOrganizador,
    eventFormData.correoElectronico,
    eventFormData.telefonoContacto,
    eventFormData.nombreEmpresaColegio,
    eventFormData.rutEmpresa,
    eventFormData.permiteDevolucion
  ]);

  const addEntrada = useCallback(() => {
    const newEntrada = {
      id: Date.now(),
      tipoEntrada: '',
      precio: '',
      cuposDisponibles: '',
      limitePorPersona: '',
      fechasVenta: {
        inicio: '',
        fin: ''
      }
    };
    setEventFormData(prev => ({
      ...prev,
      entradas: [...prev.entradas, newEntrada]
    }));
  }, []);

  const updateEntrada = useCallback((id, field, value) => {
    setEventFormData(prev => {
      const newEntradas = prev.entradas.map(entrada => 
        entrada.id === id ? { ...entrada, [field]: value } : entrada
      );
      return { ...prev, entradas: newEntradas };
    });
  }, []);

  const deleteEntrada = useCallback((id) => {
    setEventFormData(prev => ({
      ...prev,
      entradas: prev.entradas.filter(entrada => entrada.id !== id)
    }));
  }, []);

  // CRUD para Alimentos y Bebestibles optimizado con useCallback
  const addAlimento = useCallback(() => {
    const newAlimento = {
      id: Date.now(),
      nombre: '',
      precioUnitario: '',
      stockAsignado: '',
      descripcion: '',
      imagen: null,
      imagenUrl: ''
    };
    setEventFormData(prev => ({
      ...prev,
      alimentosBebestibles: [...prev.alimentosBebestibles, newAlimento]
    }));
  }, []);

  const updateAlimento = useCallback((id, field, value) => {
    setEventFormData(prev => {
      const newAlimentos = prev.alimentosBebestibles.map(alimento => 
        alimento.id === id ? { ...alimento, [field]: value } : alimento
      );
      return { ...prev, alimentosBebestibles: newAlimentos };
    });
  }, []);

  const deleteAlimento = useCallback((id) => {
    setEventFormData(prev => ({
      ...prev,
      alimentosBebestibles: prev.alimentosBebestibles.filter(alimento => alimento.id !== id)
    }));
  }, []);

  const addActividad = useCallback(() => {
    const newActividad = {
      id: Date.now(),
      nombreActividad: '',
      precioUnitario: '',
      cuposDisponibles: '',
      horaInicio: '',
      horaTermino: '',
      descripcion: '',
      imagenPromocional: null,
      imagenPromocionalUrl: ''
    };
    setEventFormData(prev => ({
      ...prev,
      actividades: [...prev.actividades, newActividad]
    }));
  }, []);

  const updateActividad = useCallback((id, field, value) => {
    setEventFormData(prev => {
      const newActividades = prev.actividades.map(actividad => 
        actividad.id === id ? { ...actividad, [field]: value } : actividad
      );
      return { ...prev, actividades: newActividades };
    });
  }, []);

  const deleteActividad = useCallback((id) => {
    setEventFormData(prev => ({
      ...prev,
      actividades: prev.actividades.filter(actividad => actividad.id !== id)
    }));
  }, []);

  const generateEventJSON = useCallback(() => {
    // Función para generar URL de Cloudinary (no se usa actualmente)
    // const generateCloudinaryUrl = (file, type = 'events') => {
    //   if (!file) return null;
    //   const timestamp = Date.now();
    //   const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
    //   return `https://res.cloudinary.com/tu-cloud-name/image/upload/v${timestamp}/${type}/${cleanName}`;
    // };

    
    const eventData = {
      informacionGeneral: {
        nombreEvento: eventFormData.nombreEvento,
        descripcion: eventFormData.descripcion,
        fechaEvento: eventFormData.fechaEvento,
        horaInicio: eventFormData.horaInicio,
        horaTermino: eventFormData.horaTermino,
        lugarEvento: eventFormData.lugarEvento,
        bannerPromocional: eventFormData.bannerUrl || null,
        fechaCreacion: new Date().toISOString(),
        estado: 'programado'
      },

      // CRÍTICO: Asignar el creador del evento
      createdBy: user?._id || null,

      entradas: eventFormData.entradas.map(entrada => ({
        id: entrada.id,
        tipoEntrada: entrada.tipoEntrada,
        precio: parseInt(entrada.precio) || 0,
        cuposDisponibles: parseInt(entrada.cuposDisponibles) || 0,
        limitePorPersona: parseInt(entrada.limitePorPersona) || null,
        fechasVenta: {
          inicio: entrada.fechasVenta.inicio,
          fin: entrada.fechasVenta.fin
        },
        entradasVendidas: 0,
        activa: true
      })),

      alimentosBebestibles: eventFormData.alimentosBebestibles.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        precioUnitario: parseInt(producto.precioUnitario) || 0,
        stockAsignado: parseInt(producto.stockAsignado) || 0,
        stockActual: parseInt(producto.stockAsignado) || 0,
        descripcion: producto.descripcion,
        imagen: producto.imagenUrl || null,
        activo: true,
        categoria: 'alimentos_bebestibles'
      })),

      actividades: eventFormData.actividades.map(actividad => ({
        id: actividad.id,
        nombreActividad: actividad.nombreActividad,
        precioUnitario: parseInt(actividad.precioUnitario) || 0,
        cuposDisponibles: parseInt(actividad.cuposDisponibles) || 0,
        cuposOcupados: 0, // Inicializar en 0
        horaInicio: actividad.horaInicio,
        horaTermino: actividad.horaTermino,
        descripcion: actividad.descripcion,
        imagenPromocional: actividad.imagenPromocionalUrl || null,
        activa: true
      })),

      organizador: {
        nombreOrganizador: eventFormData.nombreOrganizador,
        correoElectronico: eventFormData.correoElectronico,
        telefonoContacto: eventFormData.telefonoContacto,
        nombreEmpresaColegio: eventFormData.nombreEmpresaColegio,
        rutEmpresa: eventFormData.rutEmpresa
      },

      configuracion: {
        permiteDevolucion: eventFormData.permiteDevolucion,
        requiereAprobacion: false,
        esPublico: true,
        notificacionesHabilitadas: true,
        limiteAsistentes: eventFormData.entradas.reduce((total, entrada) => 
          total + (parseInt(entrada.cuposDisponibles) || 0), 0
        )
      },

      metadata: {
        version: '1.0',
        creadoPor: 'sistema-web',
        formularioCompleto: true,
        totalEntradas: eventFormData.entradas.length,
        totalAlimentos: eventFormData.alimentosBebestibles.length,
        totalActividades: eventFormData.actividades.length,
        timestamp: Date.now()
      },

      archivosParaSubir: {
        bannerPromocional: eventFormData.bannerUrl ? {
          url: eventFormData.bannerUrl,
          status: 'uploaded',
          tipo: 'banner',
          folder: 'banners'
        } : null,
        productosImagenes: eventFormData.alimentosBebestibles
          .filter(p => p.imagenUrl)
          .map(p => ({
            id: p.id,
            url: p.imagenUrl,
            status: 'uploaded',
            tipo: 'producto',
            folder: 'products'
          })),
        actividadesImagenes: eventFormData.actividades
          .filter(a => a.imagenPromocionalUrl)
          .map(a => ({
            id: a.id,
            url: a.imagenPromocionalUrl,
            status: 'uploaded',
            tipo: 'actividad',
            folder: 'activities'
          }))
      }
    };

    return eventData;
  }, [eventFormData, user?._id]);

  const uploadBanner = useCallback(async (file) => {
    if (!file) return;

    setUploadStates(prev => ({
      ...prev,
      banner: { loading: true, error: null, success: false }
    }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(API_CONFIG.ENDPOINTS.UPLOAD_BANNER, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setEventFormData(prev => ({
          ...prev,
          bannerPromocional: file,
          bannerUrl: result.data.banner.url
        }));

        setUploadStates(prev => ({
          ...prev,
          banner: { loading: false, error: null, success: true }
        }));

      } else {
        throw new Error(result.message || 'Error al subir banner');
      }
    } catch (error) {
      console.error('❌ Error al subir banner:', error);      
      setUploadStates(prev => ({
        ...prev,
        banner: { loading: false, error: error.message, success: false }
      }));
    }
  }, []);

  const uploadProductImage = useCallback(async (productoId, file) => {
    if (!file) return;
    setUploadStates(prev => ({
      ...prev,
      productos: {
        ...prev.productos,
        [productoId]: { loading: true, error: null, success: false, url: '' }
      }
    }));

    try {
      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch(API_CONFIG.ENDPOINTS.UPLOAD_PRODUCTS, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success' && result.data.productos.length > 0) {
        const productUrl = result.data.productos[0].url;
        setEventFormData(prev => ({
          ...prev,
          alimentosBebestibles: prev.alimentosBebestibles.map(producto => 
            producto.id === productoId 
              ? { ...producto, imagen: file, imagenUrl: productUrl }
              : producto
          )
        }));

        setUploadStates(prev => ({
          ...prev,
          productos: {
            ...prev.productos,
            [productoId]: { loading: false, error: null, success: true, url: productUrl }
          }
        }));

      } else {
        throw new Error(result.message || 'Error al subir imagen del producto');
      }
    } catch (error) {
      console.error(`❌ Error al subir imagen del producto ${productoId}:`, error);
      setUploadStates(prev => ({
        ...prev,
        productos: {
          ...prev.productos,
          [productoId]: { loading: false, error: error.message, success: false, url: '' }
        }
      }));
    }
  }, []);

  const uploadActivityImage = useCallback(async (actividadId, file) => {
    if (!file) return;

    setUploadStates(prev => ({
      ...prev,
      actividades: {
        ...prev.actividades,
        [actividadId]: { loading: true, error: null, success: false, url: '' }
      }
    }));

    try {
      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch(API_CONFIG.ENDPOINTS.UPLOAD_ACTIVITIES, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success' && result.data.actividades.length > 0) {
        const activityUrl = result.data.actividades[0].url;
        setEventFormData(prev => ({
          ...prev,
          actividades: prev.actividades.map(actividad => 
            actividad.id === actividadId 
              ? { ...actividad, imagenPromocional: file, imagenPromocionalUrl: activityUrl }
              : actividad
          )
        }));

        setUploadStates(prev => ({
          ...prev,
          actividades: {
            ...prev.actividades,
            [actividadId]: { loading: false, error: null, success: true, url: activityUrl }
          }
        }));

      } else {
        throw new Error(result.message || 'Error al subir imagen de la actividad');
      }
    } catch (error) {
      console.error(`❌ Error al subir imagen de actividad ${actividadId}:`, error);
      
      setUploadStates(prev => ({
        ...prev,
        actividades: {
          ...prev.actividades,
          [actividadId]: { loading: false, error: error.message, success: false, url: '' }
        }
      }));
    }
  }, []);

  // Función para eliminar borrador
  const deleteDraft = useCallback(async (draftId) => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.DRAFT_BY_ID(draftId), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        return { success: true, message: result.message };
      } else {
        console.error('❌ Error al eliminar borrador:', result.message);
        return { success: false, message: result.message || 'Error al eliminar borrador' };
      }
    } catch (error) {
      console.error('❌ Error al eliminar borrador:', error);
      return { success: false, message: error.message || 'Error al eliminar borrador' };
    }
  }, []);

  const createEvent = useCallback(async () => {
    console.log('🚀 Iniciando creación de evento:', {
      isEditMode,
      editingEventId,
      draftId,
      fromDraft: !!draftId,
      currentStep: createEventStep
    });
    
    // Debug adicional: verificar el estado actual
    console.log('🔍 Estado actual del hook:', {
      draftId,
      isEditMode,
      editingEventId,
      createEventStep
    });
    
    setCreateEventState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));

    try {
      const eventData = generateEventJSON();
      
      console.log('📦 Datos del evento a crear:', {
        nombre: eventData.informacionGeneral?.nombreEvento,
        organizador: eventData.organizador,
        configuracion: eventData.configuracion
      });
      
      // Validar que tenemos un ID válido en modo edición
      if (isEditMode && (!editingEventId || editingEventId === 'undefined' || editingEventId === 'null')) {
        console.error('❌ ID de evento inválido:', {
          isEditMode,
          editingEventId,
          typeOfId: typeof editingEventId
        });
        throw new Error('No se puede actualizar el evento: ID de evento no válido');
      }
      
      // Debug adicional antes de hacer la petición
      console.log('🔍 DEBUG - Antes de hacer petición:', {
        isEditMode,
        editingEventId,
        url: isEditMode ? API_CONFIG.ENDPOINTS.EVENT_BY_ID(editingEventId) : API_CONFIG.ENDPOINTS.EVENTS
      });
      
      // Determinar la URL y método según el modo
      const url = isEditMode 
        ? API_CONFIG.ENDPOINTS.EVENT_BY_ID(editingEventId)
        : API_CONFIG.ENDPOINTS.EVENTS;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      console.log('🌐 Enviando a:', { url, method, isEditMode, draftId });

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setCreateEventState(prev => ({
          ...prev,
          loading: false,
          error: null,
          success: true,
          showSuccessModal: true
        }));

        // Limpiar localStorage si estamos en modo edición
        if (isEditMode) {
          localStorage.removeItem('editingEvent');
        }

        // Si hay un borrador asociado, eliminarlo después de publicar
        if (draftId && !isEditMode) {
          console.log('🗑️ Intentando eliminar borrador después de crear evento:', {
            draftId,
            isEditMode,
            eventCreated: true
          });
          try {
            const deleteResult = await deleteDraft(draftId);
            console.log('📥 Resultado de eliminación del borrador:', deleteResult);
            
            if (deleteResult.success) {
              console.log('✅ Borrador eliminado exitosamente después de publicar evento');
              // Limpiar el draftId local después de eliminar exitosamente
              setDraftId(null);
            } else {
              console.error('❌ Error al eliminar borrador:', deleteResult.message);
            }
          } catch (error) {
            console.error('❌ Error al eliminar borrador después de publicar:', error);
            // No mostramos error al usuario ya que el evento se creó exitosamente
          }
        } else {
          console.log('ℹ️ No hay borrador para eliminar:', { 
            draftId, 
            isEditMode, 
            reason: !draftId ? 'No hay draftId' : 'Es modo edición'
          });
        }

      } else {
        throw new Error(result.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el evento`);
      }
    } catch (error) {
      console.error(`❌ Error al ${isEditMode ? 'actualizar' : 'crear'} evento:`, error);
      
      setCreateEventState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
        success: false,
        showSuccessModal: false
      }));
    }
  }, [generateEventJSON, isEditMode, editingEventId, draftId, deleteDraft, createEventStep]);

  // Función para guardar borrador
  const saveAsDraft = useCallback(async () => {
    // Si no está validado el paso 1, no permitir guardar
    if (!isStep1Valid) {
      return;
    }

    // Evitar llamadas múltiples mientras está cargando
    if (draftSaveState.loading) {
      return;
    }

    try {
      setDraftSaveState({
        loading: true,
        success: false,
        error: null,
        showTooltip: false
      });

      
      // Preparar payload solo con los campos que tienen datos
      const basePayload = {
        informacionGeneral: {
          nombreEvento: eventFormData.nombreEvento.trim(),
          descripcion: eventFormData.descripcion || '',
          fechaEvento: eventFormData.fechaEvento || '',
          horaInicio: eventFormData.horaInicio || '',
          horaTermino: eventFormData.horaTermino || '',
          lugarEvento: eventFormData.lugarEvento || '',
          bannerPromocional: eventFormData.bannerUrl || null
        }
      };

      // Solo agregar entradas si hay alguna
      if (eventFormData.entradas && eventFormData.entradas.length > 0) {
        basePayload.entradas = eventFormData.entradas;
      }

      // Solo agregar alimentos si hay alguno
      if (eventFormData.alimentosBebestibles && eventFormData.alimentosBebestibles.length > 0) {
        // Limpiar campos de imagen para evitar errores de cast
        const alimentosLimpios = eventFormData.alimentosBebestibles.map(alimento => ({
          ...alimento,
          imagen: alimento.imagenUrl || null, // Solo enviar URL o null, no el objeto File
          imagenUrl: alimento.imagenUrl || null
        }));
        basePayload.alimentosBebestibles = alimentosLimpios;
      }

      // Solo agregar actividades si hay alguna
      if (eventFormData.actividades && eventFormData.actividades.length > 0) {
        // Limpiar campos de imagen para evitar errores de cast
        const actividadesLimpias = eventFormData.actividades.map(actividad => ({
          ...actividad,
          imagenPromocional: actividad.imagenPromocionalUrl || null, // Solo enviar URL o null, no el objeto File
          imagenPromocionalUrl: actividad.imagenPromocionalUrl || null
        }));
        basePayload.actividades = actividadesLimpias;
      }

      // Solo agregar organizador si tiene datos válidos
      const organizadorData = {};
      if (eventFormData.nombreOrganizador && eventFormData.nombreOrganizador.trim()) {
        organizadorData.nombreOrganizador = eventFormData.nombreOrganizador.trim();
      }
      if (eventFormData.correoElectronico && eventFormData.correoElectronico.trim()) {
        organizadorData.correoElectronico = eventFormData.correoElectronico.trim();
      }
      if (eventFormData.telefonoContacto && eventFormData.telefonoContacto.trim()) {
        organizadorData.telefonoContacto = eventFormData.telefonoContacto.trim();
      }
      if (eventFormData.nombreEmpresaColegio && eventFormData.nombreEmpresaColegio.trim()) {
        organizadorData.nombreEmpresaColegio = eventFormData.nombreEmpresaColegio.trim();
      }
      if (eventFormData.rutEmpresa && eventFormData.rutEmpresa.trim()) {
        organizadorData.rutEmpresa = eventFormData.rutEmpresa.trim();
      }

      if (Object.keys(organizadorData).length > 0) {
        basePayload.organizador = organizadorData;
      }

      // Solo agregar configuración si tiene datos
      if (eventFormData.permiteDevolucion !== null && eventFormData.permiteDevolucion !== undefined) {
        basePayload.configuracion = {
          permiteDevolucion: eventFormData.permiteDevolucion
        };
      }
      
      const payload = draftId ? { draftId, ...basePayload } : basePayload;
      
      // Debug: mostrar información del payload
      console.log('🔍 Guardando borrador:', {
        draftId: draftId,
        isUpdate: !!draftId,
        payload: {
          ...payload,
          // Mostrar solo los primeros caracteres de arrays largos para debug
          entradas: payload.entradas?.length || 0,
          alimentosBebestibles: payload.alimentosBebestibles?.length || 0,
          actividades: payload.actividades?.length || 0
        }
      });

      // Verificación adicional: si no hay draftId pero debería haberlo, mostrar warning
      if (!draftId && eventFormData.nombreEvento) {
        console.warn('⚠️ Guardando borrador sin draftId - esto puede crear duplicados');
      }
      
      const response = await fetch(API_CONFIG.ENDPOINTS.DRAFT_SAVE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      // Debug: mostrar respuesta del backend
      console.log('📥 Respuesta del backend:', {
        status: result.status,
        isNew: result.data?.draftInfo?.isNew,
        draftId: result.data?.draftInfo?.id,
        message: result.message
      });
      
      if (result.status === 'success') {
        // Si es nuevo, guardar el ID para próximas actualizaciones
        if (result.data.draftInfo.isNew) {
          console.log('✅ Nuevo borrador creado con ID:', result.data.draftInfo.id);
          setDraftId(result.data.draftInfo.id);
        } else {
          console.log('🔄 Borrador actualizado con ID:', result.data.draftInfo.id);
        }
        
        // Mostrar tooltip de éxito
        setDraftSaveState({
          loading: false,
          success: true,
          error: null,
          showTooltip: true
        });
        
        // Ocultar tooltip después de 3 segundos
        setTimeout(() => {
          setDraftSaveState(prev => ({ ...prev, showTooltip: false }));
        }, 3000);
        
        return result;
      } else {
        console.error('❌ Error al guardar borrador:', result.message);
        
        setDraftSaveState({
          loading: false,
          success: false,
          error: result.message || 'Error al guardar borrador',
          showTooltip: true
        });
        
        // Ocultar tooltip después de 5 segundos
        setTimeout(() => {
          setDraftSaveState(prev => ({ ...prev, showTooltip: false }));
        }, 5000);
        
        return null;
      }
    } catch (error) {
      console.error('❌ Error de conexión al guardar borrador:', error);
      
      setDraftSaveState({
        loading: false,
        success: false,
        error: 'Error de conexión. Inténtalo más tarde.',
        showTooltip: true
      });
      
      // Ocultar tooltip después de 5 segundos
      setTimeout(() => {
        setDraftSaveState(prev => ({ ...prev, showTooltip: false }));
      }, 5000);
      
      return null;
    }
  }, [draftId, eventFormData, isStep1Valid, draftSaveState.loading]);

  const closeSuccessModal = useCallback(() => {
    setCreateEventState(prev => ({
      ...prev,
      showSuccessModal: false
    }));
  }, []);

  const resetCreateEventError = useCallback(() => {
    setCreateEventState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    createEventStep,
    eventFormData,
    uploadStates,
    createEventState,
    draftSaveState,
    isEditMode,
    editingEventId,
    handleFormChange,
    handleNextStep,
    handlePrevStep,
    handleCloseForm,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
    canSaveDraft,
    addEntrada,
    updateEntrada,
    deleteEntrada,
    addAlimento,
    updateAlimento,
    deleteAlimento,
    addActividad,
    updateActividad,
    deleteActividad,
    generateEventJSON,
    uploadBanner,
    uploadProductImage,
    uploadActivityImage,
    createEvent,
    saveAsDraft,
    deleteDraft,
    closeSuccessModal,
    resetCreateEventError,
    formLoadingState
  };
};
