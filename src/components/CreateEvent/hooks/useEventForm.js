import { useState, useCallback, useMemo, useEffect } from 'react';

export const useEventForm = () => {
  const [createEventStep, setCreateEventStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  
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

  // useEffect para cargar datos del evento en modo edición
  useEffect(() => {
    const loadEventData = () => {
      try {
        // Verificar si estamos en modo edición
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        
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
              entradas: eventData.entradas || [],
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
        }
      } catch (error) {
        console.error('Error loading event data:', error);
      }
    };

    loadEventData();
  }, []);

  const handleFormChange = useCallback((field, value) => {
    console.log('📝 handleFormChange - field:', field, 'value:', value);
    setEventFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('📝 handleFormChange - nuevo eventFormData:', newData);
      return newData;
    });
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
           eventFormData.lugarEvento;
  }, [
    eventFormData.nombreEvento,
    eventFormData.descripcion,
    eventFormData.fechaEvento,
    eventFormData.horaInicio,
    eventFormData.horaTermino,
    eventFormData.lugarEvento
  ]);

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
    setEventFormData(prev => ({
      ...prev,
      entradas: prev.entradas.map(entrada => 
        entrada.id === id ? { ...entrada, [field]: value } : entrada
      )
    }));
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
    setEventFormData(prev => ({
      ...prev,
      alimentosBebestibles: prev.alimentosBebestibles.map(alimento => 
        alimento.id === id ? { ...alimento, [field]: value } : alimento
      )
    }));
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
    setEventFormData(prev => ({
      ...prev,
      actividades: prev.actividades.map(actividad => 
        actividad.id === id ? { ...actividad, [field]: value } : actividad
      )
    }));
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

    console.log('🚀 generateEventJSON - eventFormData.fechaEvento:', eventFormData.fechaEvento);
    console.log('🚀 generateEventJSON - eventFormData completo:', eventFormData);
    
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

      const response = await fetch('http://localhost:3001/api/upload/banner', {
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

      const response = await fetch('http://localhost:3001/api/upload/products', {
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

      const response = await fetch('http://localhost:3001/api/upload/activities', {
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
      console.log('📤 createEvent - eventData a enviar:', eventData);
      console.log('📤 createEvent - fechaEvento en eventData:', eventData.informacionGeneral.fechaEvento);
      
      // Determinar la URL y método según el modo
      const url = isEditMode 
        ? `http://localhost:3001/api/events/${editingEventId}`
        : 'http://localhost:3001/api/events';
      
      const method = isEditMode ? 'PUT' : 'POST';

      console.log('📤 createEvent - enviando a:', url, 'método:', method);
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
    closeSuccessModal,
    resetCreateEventError,
  };
};
