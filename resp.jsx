"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Calendar, Users, ChevronDown, MoreHorizontal, Eye, Trash2 } from 'lucide-react';

const EventsOverview = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  const [dateRange, setDateRange] = useState('1 Abr 2025 - 1 May 2025');
  const [selectedEventId, setSelectedEventId] = useState('british-royal');
  const [selectedActiveEvent, setSelectedActiveEvent] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [createEventStep, setCreateEventStep] = useState(1);
  const [eventFormData, setEventFormData] = useState({
    eventInfo: {
      nombreEvento: '',
      descripcion: '',
      fechaEvento: '',
      horaInicio: '',
      horaTermino: '',
      lugarEvento: '',
      bannerPromocional: null
    },
    entradas: [{ tipo: '', precio: '', cupos: '', limitePersona: '', fechaVenta: '' }],
    alimentosBebestibles: [{ nombreProducto: '', precioUnitario: '', stock: '', descripcion: '', imagen: null }],
    actividades: [{ nombreActividad: '', precioUnitario: '', cupos: '', horarioInicio: '', horarioFin: '', descripcion: '', imagenPromocional: null }],
    datosOrganizador: {
      nombreOrganizador: '',
      correoElectronico: '',
      telefonoContacto: '',
      nombreEmpresa: '',
      rutEmpresa: ''
    },
    permiteDevolucion: 'No'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const eventosDatabase = {
    'british-royal': {
      cliente: 'British Royal',
      eventosActivos: [],
      eventosProgramados: [],
      eventosPasados: []
    },
    'colegio-san-patricio': {
      cliente: 'Colegio San Patricio',
      eventosActivos: [],
      eventosProgramados: [],
      eventosPasados: []
    }
  };

  const currentEventData = eventosDatabase[selectedEventId];
  const eventOptions = [
    { id: 'british-royal', name: 'British Royal' },
    { id: 'colegio-san-patricio', name: 'Colegio San Patricio' }
  ];

  const handleFormChange = (section, field, value, index = null) => {
    setEventFormData(prev => {
      if (index !== null) {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [field]: value };
        return { ...prev, [section]: updatedSection };
      }
      return { ...prev, [section]: field ? { ...prev[section], [field]: value } : value };
    });
  };

  const addNewEntry = (section) => {
    setEventFormData(prev => ({
      ...prev,
      [section]: [...prev[section], 
        section === 'eventInfo' ? { nombreEvento: '', descripcion: '', fechaEvento: '', horaInicio: '', horaTermino: '', lugarEvento: '', bannerPromocional: null } :
        section === 'datosOrganizador' ? { nombreOrganizador: '', correoElectronico: '', telefonoContacto: '', nombreEmpresa: '', rutEmpresa: '' } :
        { tipo: '', precio: '', cupos: '', limitePersona: '', fechaVenta: '', nombreProducto: '', precioUnitario: '', stock: '', descripcion: '', imagen: null, nombreActividad: '', horarioInicio: '', horarioFin: '', imagenPromocional: null }[section]]
    }));
  };

  const removeEntry = (section, index) => {
    setEventFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    const { eventInfo, entradas, alimentosBebestibles, actividades, datosOrganizador } = eventFormData;
    const isEventInfoComplete = eventInfo.nombreEvento && eventInfo.descripcion && eventInfo.fechaEvento && eventInfo.horaInicio && eventInfo.horaTermino && eventInfo.lugarEvento && eventInfo.bannerPromocional;
    const areEntradasComplete = entradas.every(e => e.tipo && e.precio && e.cupos && e.limitePersona && e.fechaVenta);
    const areAlimentosComplete = alimentosBebestibles.every(a => a.nombreProducto && a.precioUnitario && a.stock && a.descripcion && a.imagen);
    const areActividadesComplete = actividades.every(a => a.nombreActividad && a.precioUnitario && a.cupos && a.horarioInicio && a.horarioFin && a.descripcion && (a.imagenPromocional || true));
    const areDatosComplete = datosOrganizador.nombreOrganizador && datosOrganizador.correoElectronico && datosOrganizador.telefonoContacto && datosOrganizador.nombreEmpresa && datosOrganizador.rutEmpresa;
    return isEventInfoComplete && areEntradasComplete && areAlimentosComplete && areActividadesComplete && areDatosComplete;
  };

  const Navbar = () => (
    <nav className="bg-slate-700 text-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-blue-400 text-xl">💎</div>
            <div className="text-white font-medium">¡Bienvenido, José Ortiz! 👋</div>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white" />
            <Bell className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              <div className="text-sm">
                <div className="font-medium text-white">José Ortiz</div>
                <div className="text-gray-300 text-xs">Administrador</div>
              </div>
            </div>
            <Menu className="w-5 h-5 cursor-pointer text-gray-300 hover:text-white" />
          </div>
        </div>
      </div>
    </nav>
  );

  const CreateEventForm = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">¡Crea tu evento!</h1>
          <button onClick={() => setShowCreateEventForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        {createEventStep === 1 && (
          <>
            <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
              <h3 className="text-sm font-medium">Información general</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del evento</label>
                <input
                  type="text"
                  value={eventFormData.eventInfo.nombreEvento}
                  onChange={(e) => handleFormChange('eventInfo', 'nombreEvento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del evento</label>
                <input
                  type="text"
                  value={eventFormData.eventInfo.descripcion}
                  onChange={(e) => handleFormChange('eventInfo', 'descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del evento</label>
                  <input
                    type="date"
                    value={eventFormData.eventInfo.fechaEvento}
                    onChange={(e) => handleFormChange('eventInfo', 'fechaEvento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de inicio</label>
                  <input
                    type="time"
                    value={eventFormData.eventInfo.horaInicio}
                    onChange={(e) => handleFormChange('eventInfo', 'horaInicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora de término</label>
                  <input
                    type="time"
                    value={eventFormData.eventInfo.horaTermino}
                    onChange={(e) => handleFormChange('eventInfo', 'horaTermino', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lugar del evento</label>
                <input
                  type="text"
                  value={eventFormData.eventInfo.lugarEvento}
                  onChange={(e) => handleFormChange('eventInfo', 'lugarEvento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner promocional</label>
                <input
                  type="file"
                  onChange={(e) => handleFormChange('eventInfo', 'bannerPromocional', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-500 text-white px-4 py-3">
              <h3 className="text-sm font-medium">Configuración de Entradas</h3>
            </div>
            <div className="p-6 space-y-4">
              {eventFormData.entradas.map((entrada, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Entrada</label>
                    <input
                      type="text"
                      value={entrada.tipo}
                      onChange={(e) => handleFormChange('entradas', 'tipo', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio (CLP)</label>
                    <input
                      type="number"
                      value={entrada.precio}
                      onChange={(e) => handleFormChange('entradas', 'precio', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cupos disponibles</label>
                    <input
                      type="number"
                      value={entrada.cupos}
                      onChange={(e) => handleFormChange('entradas', 'cupos', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Límite por persona</label>
                    <input
                      type="number"
                      value={entrada.limitePersona}
                      onChange={(e) => handleFormChange('entradas', 'limitePersona', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fechas de venta</label>
                    <input
                      type="date"
                      value={entrada.fechaVenta}
                      onChange={(e) => handleFormChange('entradas', 'fechaVenta', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button onClick={() => removeEntry('entradas', index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => addNewEntry('entradas')} className="px-4 py-2 bg-blue-500 text-white rounded">Agregar nueva entrada</button>
            </div>

            <div className="bg-blue-500 text-white px-4 py-3">
              <h3 className="text-sm font-medium">Alimentos y Bebestibles</h3>
            </div>
            <div className="p-6 space-y-4">
              {eventFormData.alimentosBebestibles.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto</label>
                    <input
                      type="text"
                      value={item.nombreProducto}
                      onChange={(e) => handleFormChange('alimentosBebestibles', 'nombreProducto', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio unitario (CLP)</label>
                    <input
                      type="number"
                      value={item.precioUnitario}
                      onChange={(e) => handleFormChange('alimentosBebestibles', 'precioUnitario', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock asignado</label>
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleFormChange('alimentosBebestibles', 'stock', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={(e) => handleFormChange('alimentosBebestibles', 'descripcion', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                    <input
                      type="file"
                      onChange={(e) => handleFormChange('alimentosBebestibles', 'imagen', e.target.files[0], index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button onClick={() => removeEntry('alimentosBebestibles', index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => addNewEntry('alimentosBebestibles')} className="px-4 py-2 bg-blue-500 text-white rounded">Agregar nueva entrada</button>
            </div>
          </>
        )}

        {createEventStep === 2 && (
          <>
            <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
              <h3 className="text-sm font-medium">Actividades</h3>
            </div>
            <div className="p-6 space-y-4">
              {eventFormData.actividades.map((actividad, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la actividad</label>
                    <input
                      type="text"
                      value={actividad.nombreActividad}
                      onChange={(e) => handleFormChange('actividades', 'nombreActividad', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio unitario (CLP)</label>
                    <input
                      type="number"
                      value={actividad.precioUnitario}
                      onChange={(e) => handleFormChange('actividades', 'precioUnitario', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cupos disponibles</label>
                    <input
                      type="number"
                      value={actividad.cupos}
                      onChange={(e) => handleFormChange('actividades', 'cupos', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horario de inicio</label>
                    <input
                      type="time"
                      value={actividad.horarioInicio}
                      onChange={(e) => handleFormChange('actividades', 'horarioInicio', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horario de fin</label>
                    <input
                      type="time"
                      value={actividad.horarioFin}
                      onChange={(e) => handleFormChange('actividades', 'horarioFin', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <input
                      type="text"
                      value={actividad.descripcion}
                      onChange={(e) => handleFormChange('actividades', 'descripcion', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen promocional</label>
                    <input
                      type="file"
                      onChange={(e) => handleFormChange('actividades', 'imagenPromocional', e.target.files[0], index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button onClick={() => removeEntry('actividades', index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => addNewEntry('actividades')} className="px-4 py-2 bg-blue-500 text-white rounded">Agregar nueva entrada</button>
            </div>

            <div className="bg-blue-500 text-white px-4 py-3">
              <h3 className="text-sm font-medium">Datos del Organizador</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del organizador</label>
                <input
                  type="text"
                  value={eventFormData.datosOrganizador.nombreOrganizador}
                  onChange={(e) => handleFormChange('datosOrganizador', 'nombreOrganizador', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={eventFormData.datosOrganizador.correoElectronico}
                  onChange={(e) => handleFormChange('datosOrganizador', 'correoElectronico', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de contacto</label>
                <input
                  type="tel"
                  value={eventFormData.datosOrganizador.telefonoContacto}
                  onChange={(e) => handleFormChange('datosOrganizador', 'telefonoContacto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la empresa o colegio</label>
                <input
                  type="text"
                  value={eventFormData.datosOrganizador.nombreEmpresa}
                  onChange={(e) => handleFormChange('datosOrganizador', 'nombreEmpresa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RUT de la empresa</label>
                <input
                  type="text"
                  value={eventFormData.datosOrganizador.rutEmpresa}
                  onChange={(e) => handleFormChange('datosOrganizador', 'rutEmpresa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-500 text-white px-4 py-3">
              <h3 className="text-sm font-medium">Opción del evento</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Se permite devolución?</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFormChange('permiteDevolucion', 'Sí')}
                  className={`px-4 py-2 rounded ${eventFormData.permiteDevolucion === 'Sí' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >Sí</button>
                <button
                  onClick={() => handleFormChange('permiteDevolucion', 'No')}
                  className={`px-4 py-2 rounded ${eventFormData.permiteDevolucion === 'No' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >No</button>
              </div>
            </div>
          </>
        )}

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          {createEventStep === 1 ? (
            <button onClick={() => setShowCreateEventForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100">Cancelar</button>
          ) : (
            <button onClick={() => setCreateEventStep(1)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100">← Anterior</button>
          )}
          {createEventStep === 1 ? (
            <button onClick={() => setCreateEventStep(2)} className={`px-6 py-2 rounded text-sm font-medium ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Siguiente →</button>
          ) : (
            <button onClick={() => { if (isFormValid()) alert('¡Evento creado exitosamente!'); setShowCreateEventForm(false); }} className={`px-6 py-2 rounded text-sm font-medium ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Publicar evento</button>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  if (showCreateEventForm) {
    return <CreateEventForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1 bg-white rounded-lg p-1 border shadow-sm">
              <button
                onClick={() => setActiveTab('listado')}
                className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'listado' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Listado
              </button>
              <button
                onClick={() => setActiveTab('calendario')}
                className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'calendario' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Calendario
              </button>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm appearance-none cursor-pointer pr-8 font-medium"
            >
              {eventOptions.map(option => (
                <option key={option.id} value={option.id} className="bg-white text-black">
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
              Esta semana
            </button>
            <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setShowCreateEventForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
          >
            ⭕ Crear nuevo evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsOverview;