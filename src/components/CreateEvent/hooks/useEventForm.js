import { useState, useCallback, useMemo, useEffect } from 'react';
import API_CONFIG from '../../../config/api';

export const useEventForm = () => {
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

  // useEffect para cargar datos del evento en modo edición o borrador
  useEffect(() => {
    const loadEventData = async () => {
      try {
        // Verificar si estamos en modo edición o borrador
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const editDraftId = urlParams.get('editDraft');
        
        if (mode === 'edit') {
          const editingEventData = localStorage.getItem('editingEvent');
          
          if (editingEventData) {
            const eventData = JSON.parse(editingEventData);
            setIsEditMode(true);
            setEditingEventId(eventData.id);
            
            // Cargar datos del evento en el formulario
            setEventFormData({
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
              entradas: (eventData.entradas || []).map(entrada => ({
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
              })),
              alimentosBebestibles: (eventData.alimentosBebestibles || []).map(alimento => ({
                id: alimento.id,
                nombre: alimento.nombre || '',
                precioUnitario: alimento.precioUnitario || '',
                stockAsignado: alimento.stockAsignado || '',
                descripcion: alimento.descripcion || '',
                imagen: null,
                imagenUrl: alimento.imagen || ''
              })),
              actividades: (eventData.actividades || []).map(actividad => ({
                id: actividad.id,
                nombreActividad: actividad.nombreActividad || '',
                precioUnitario: actividad.precioUnitario || '',
                cuposDisponibles: actividad.cuposDisponibles || '',
                horaInicio: actividad.horaInicio || '',
                horaTermino: actividad.horaTermino || '',
                descripcion: actividad.descripcion || '',
                imagenPromocional: null,
                imagenPromocionalUrl: actividad.imagenPromocional || ''
              })),
              nombreOrganizador: eventData.organizador?.nombreOrganizador || '',
              correoElectronico: eventData.organizador?.correoElectronico || '',
              telefonoContacto: eventData.organizador?.telefonoContacto || '',
              nombreEmpresaColegio: eventData.organizador?.nombreEmpresaColegio || '',
              rutEmpresa: eventData.organizador?.rutEmpresa || '',
              permiteDevolucion: eventData.configuracion?.permiteDevolucion || null
            });
          }
        } else if (editDraftId) {
          // Cargar borrador desde la API
          
          try {
            const response = await fetch(`http://localhost:3001/api/drafts/${editDraftId}`);
            const result = await response.json();
            
            if (result.status === 'success' && result.data.draft) {
              const draftData = result.data.draft;
              
              setIsEditMode(true);
              setEditingEventId(draftData._id);
              setDraftId(draftData._id);
              
              // Cargar datos del borrador en el formulario
              setEventFormData({
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
                entradas: (draftData.entradas || []).map(entrada => ({
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
                })),
                alimentosBebestibles: (draftData.alimentosBebestibles || []).map(alimento => ({
                  id: alimento.id,
                  nombre: alimento.nombre || '',
                  precioUnitario: alimento.precioUnitario || '',
                  stockAsignado: alimento.stockAsignado || '',
                  descripcion: alimento.descripcion || '',
                  imagen: null,
                  imagenUrl: alimento.imagen || ''
                })),
                actividades: (draftData.actividades || []).map(actividad => ({
                  id: actividad.id,
                  nombreActividad: actividad.nombreActividad || '',
                  precioUnitario: actividad.precioUnitario || '',
                  cuposDisponibles: actividad.cuposDisponibles || '',
                  horaInicio: actividad.horaInicio || '',
                  horaTermino: actividad.horaTermino || '',
                  descripcion: actividad.descripcion || '',
                  imagenPromocional: null,
                  imagenPromocionalUrl: actividad.imagenPromocional || ''
                })),
                nombreOrganizador: draftData.organizador?.nombreOrganizador || '',
                correoElectronico: draftData.organizador?.correoElectronico || '',
                telefonoContacto: draftData.organizador?.telefonoContacto || '',
                nombreEmpresaColegio: draftData.organizador?.nombreEmpresaColegio || '',
                rutEmpresa: draftData.organizador?.rutEmpresa || '',
                permiteDevolucion: draftData.configuracion?.permiteDevolucion || null
              });
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
    const generateCloudinaryUrl = (file, type = 'events') => {
      if (!file) return null;
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
      return `https://res.cloudinary.com/tu-cloud-name/image/upload/v${timestamp}/${type}/${cleanName}`;
    };

    
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
  }, [eventFormData]);

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

  const createEvent = useCallback(async () => {
    setCreateEventState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));

    try {
      const eventData = generateEventJSON();
      
      // Determinar la URL y método según el modo
      const url = isEditMode 
        ? API_CONFIG.ENDPOINTS.EVENT_BY_ID(editingEventId)
        : API_CONFIG.ENDPOINTS.EVENTS;
      
      const method = isEditMode ? 'PUT' : 'POST';

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
  }, [generateEventJSON, isEditMode, editingEventId]);

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
      
      const response = await fetch('http://localhost:3001/api/drafts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Si es nuevo, guardar el ID para próximas actualizaciones
        if (result.data.draftInfo.isNew) {
          setDraftId(result.data.draftInfo.id);
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

  // Función para eliminar borrador
  const deleteDraft = useCallback(async (draftId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/drafts/${draftId}`, {
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
  };
};
