"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Calendar, Users, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';

const EventsOverview = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  const [dateRange, setDateRange] = useState('1 Abr 2025 - 1 May 2025');
  const [selectedEventId, setSelectedEventId] = useState('british-royal');
  const [selectedActiveEvent, setSelectedActiveEvent] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [createEventStep, setCreateEventStep] = useState(1);
  const [eventFormData, setEventFormData] = useState({
    nombreEvento: '',
    tipoEvento: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
    ubicacion: '',
    capacidadMaxima: '',
    precioEntrada: '',
    metodoPago: '',
    requiereRegistro: false,
    esPublico: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Base de datos de eventos
  const eventosDatabase = {
    'british-royal': {
      cliente: 'British Royal',
      eventosActivos: [
        {
          id: 1,
          nombre: 'British royal school',
          email: 'Gerencia@british.cl',
          precio: '$0',
          estado: 'Pago al contado',
          asistentes: 1200,
          lugar: 'Parque Padre Hurtado',
          telefono: '9 4578 2569',
          rut: '76.029.290-8',
          fecha: '20/05/2025',
          periodo: '13:00 a 17:00',
          imagen: '/api/placeholder/60/60',
          activo: true
        },
        {
          id: 2,
          nombre: 'British royal school - Festival de Primavera',
          email: 'Gerencia@british.cl',
          precio: '$0',
          estado: 'Pago por transferencia',
          asistentes: 1500,
          lugar: 'Gimnasio Principal',
          telefono: '9 4578 2569',
          rut: '76.029.290-8',
          fecha: '25/05/2025',
          periodo: '10:00 a 15:00',
          imagen: '/api/placeholder/60/60',
          activo: true
        }
      ],
      eventosProgramados: [
        {
          id: 3,
          nombre: 'British royal school - Gala de Graduación',
          email: 'Gerencia@british.cl',
          precio: '$15.000',
          estado: 'Pago por transferencia',
          asistentes: 800,
          imagen: '/api/placeholder/60/60'
        }
      ],
      eventosPasados: [
        {
          id: 5,
          nombre: 'Fiesta de otoño',
          cliente: 'British Royal School',
          fecha: '22/01/2024',
          entradas: 220,
          ingresos: '$1.000.000 CLP',
          imagen: '/api/placeholder/60/60'
        }
      ]
    },
    'colegio-san-patricio': {
      cliente: 'Colegio San Patricio',
      eventosActivos: [
        {
          id: 11,
          nombre: 'Festival de la Familia San Patricio',
          email: 'eventos@sanpatricio.cl',
          precio: '$8.000',
          estado: 'Pago al contado',
          asistentes: 950,
          lugar: 'Patio Central',
          telefono: '9 8765 4321',
          rut: '82.456.789-1',
          fecha: '28/05/2025',
          periodo: '09:00 a 18:00',
          imagen: '/api/placeholder/60/60',
          activo: true
        }
      ],
      eventosProgramados: [
        {
          id: 12,
          nombre: 'Muestra de Talentos San Patricio',
          email: 'eventos@sanpatricio.cl',
          precio: '$3.000',
          estado: 'Pago por transferencia',
          asistentes: 600,
          imagen: '/api/placeholder/60/60'
        }
      ],
      eventosPasados: [
        {
          id: 14,
          nombre: 'Día del Libro',
          cliente: 'Colegio San Patricio',
          fecha: '23/04/2024',
          entradas: 180,
          ingresos: '$540.000 CLP',
          imagen: '/api/placeholder/60/60'
        }
      ]
    }
  };

  const currentEventData = eventosDatabase[selectedEventId];
  const eventOptions = [
    { id: 'british-royal', name: 'British Royal' },
    { id: 'colegio-san-patricio', name: 'Colegio San Patricio' }
  ];

  // Funciones del formulario
  const handleFormChange = (field, value) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (createEventStep < 2) {
      setCreateEventStep(createEventStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (createEventStep > 1) {
      setCreateEventStep(createEventStep - 1);
    }
  };

  const handleCloseForm = () => {
    setShowCreateEventForm(false);
    setCreateEventStep(1);
    setEventFormData({
      nombreEvento: '',
      tipoEvento: '',
      fechaInicio: '',
      fechaFin: '',
      horaInicio: '',
      horaFin: '',
      descripcion: '',
      ubicacion: '',
      capacidadMaxima: '',
      precioEntrada: '',
      metodoPago: '',
      requiereRegistro: false,
      esPublico: true
    });
  };

  const isStep1Valid = () => {
    return eventFormData.nombreEvento && 
           eventFormData.tipoEvento && 
           eventFormData.fechaInicio && 
           eventFormData.horaInicio;
  };

  // Navbar Component
  const Navbar = () => (
    <nav className="bg-slate-700 text-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-blue-400 text-xl">💎</div>
            <div className="text-white font-medium">
              ¡Bienvenido, José Ortiz! 👋
            </div>
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

  // Event Card Component
  const EventCard = ({ evento, showDetails = false }) => (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-300 rounded object-cover"></div>
            {evento.activo && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-medium text-gray-900">{evento.nombre}</h3>
                <p className="text-sm text-gray-600">{evento.email}</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{evento.precio}</div>
                <div className="text-xs text-gray-500">{evento.estado}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                  Asistentes {evento.asistentes}
                </span>
              </div>
            </div>
            
            {showDetails && (
              <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Lugar</div>
                  <div className="text-gray-600">{evento.lugar}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Teléfono</div>
                  <div className="text-gray-600">{evento.telefono}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Rut</div>
                  <div className="text-gray-600">{evento.rut}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Fecha</div>
                  <div className="text-gray-600">{evento.fecha}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            !
          </button>
          <button className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Past Event Row Component
  const PastEventRow = ({ evento }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded"></div>
          <div>
            <div className="font-medium text-gray-900">{evento.nombre}</div>
            <div className="text-sm text-gray-600">{evento.cliente}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-700">{evento.fecha}</td>
      <td className="py-3 px-4 text-gray-700">{evento.entradas}</td>
      <td className="py-3 px-4 text-gray-700">{evento.ingresos}</td>
      <td className="py-3 px-4">
        <button className="text-blue-500 hover:text-blue-600">
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  // Formulario de Crear Evento - Paso 1
  const CreateEventFormStep1 = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Crear Nuevo Evento</h1>
          <button 
            onClick={handleCloseForm}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium text-blue-600">Información Básica</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm text-gray-500">Detalles y Configuración</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-sm font-medium">Paso 1: Información Básica del Evento</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del evento *
            </label>
            <input
              type="text"
              value={eventFormData.nombreEvento}
              onChange={(e) => handleFormChange('nombreEvento', e.target.value)}
              placeholder="Ej: Festival de Primavera 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de evento *
            </label>
            <select 
              value={eventFormData.tipoEvento}
              onChange={(e) => handleFormChange('tipoEvento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona el tipo de evento</option>
              <option value="festival">Festival</option>
              <option value="concierto">Concierto</option>
              <option value="conferencia">Conferencia</option>
              <option value="deportivo">Evento Deportivo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio *
              </label>
              <input
                type="date"
                value={eventFormData.fechaInicio}
                onChange={(e) => handleFormChange('fechaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio *
              </label>
              <input
                type="time"
                value={eventFormData.horaInicio}
                onChange={(e) => handleFormChange('horaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del evento
            </label>
            <textarea
              value={eventFormData.descripcion}
              onChange={(e) => handleFormChange('descripcion', e.target.value)}
              placeholder="Describe brevemente el evento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          <button 
            onClick={handleCloseForm}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleNextStep}
            disabled={!isStep1Valid()}
            className={`px-6 py-2 rounded text-sm font-medium ${
              isStep1Valid() 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );

  // Formulario de Crear Evento - Paso 2
  const CreateEventFormStep2 = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Crear Nuevo Evento</h1>
          <button 
            onClick={handleCloseForm}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="text-sm text-green-600">Información Básica</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-500"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm font-medium text-blue-600">Detalles y Configuración</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-sm font-medium">Paso 2: Detalles y Configuración</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación del evento *
            </label>
            <input
              type="text"
              value={eventFormData.ubicacion}
              onChange={(e) => handleFormChange('ubicacion', e.target.value)}
              placeholder="Ej: Auditorio Principal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad máxima
            </label>
            <input
              type="number"
              value={eventFormData.capacidadMaxima}
              onChange={(e) => handleFormChange('capacidadMaxima', e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de entrada (CLP)
            </label>
            <input
              type="number"
              value={eventFormData.precioEntrada}
              onChange={(e) => handleFormChange('precioEntrada', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Resumen:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Nombre:</span> {eventFormData.nombreEvento}</p>
              <p><span className="font-medium">Tipo:</span> {eventFormData.tipoEvento}</p>
              <p><span className="font-medium">Fecha:</span> {eventFormData.fechaInicio}</p>
              <p><span className="font-medium">Ubicación:</span> {eventFormData.ubicacion}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          <button 
            onClick={handlePrevStep}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 font-medium"
          >
            ← Anterior
          </button>
          <button 
            onClick={() => {
              alert('¡Evento creado exitosamente!');
              handleCloseForm();
            }}
            className="px-6 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600"
          >
            Crear Evento
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  if (showCreateEventForm) {
    return (
      <div>
        {createEventStep === 1 && <CreateEventFormStep1 />}
        {createEventStep === 2 && <CreateEventFormStep2 />}
      </div>
    );
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
                className={`px-4 py-2 rounded text-sm font-medium ${
                  activeTab === 'listado'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Listado
              </button>
              <button
                onClick={() => setActiveTab('calendario')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  activeTab === 'calendario'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
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

        <div className="mb-8">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">
            <h2 className="text-sm font-medium">Eventos activos</h2>
          </div>
          <div className="bg-white p-4 rounded-b-lg border border-t-0">
            <div className="mb-4">
              <select 
                value={selectedActiveEvent || ''}
                onChange={(e) => setSelectedActiveEvent(e.target.value || null)}
                className="text-sm text-gray-600 bg-transparent border-0 focus:outline-none cursor-pointer"
              >
                <option value="">Seleccionar evento a visualizar ▼</option>
                {currentEventData.eventosActivos.map(evento => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {currentEventData.eventosActivos.map(evento => (
              <EventCard 
                key={evento.id} 
                evento={evento} 
                showDetails={selectedActiveEvent == evento.id}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-medium text-gray-900 mb-4">Eventos programados</h2>
          <div className="space-y-3">
            {currentEventData.eventosProgramados.map(evento => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-900 mb-4">Lista de eventos pasados</h2>
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Entradas vendidas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ingresos totales</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ver más</th>
                </tr>
              </thead>
              <tbody>
                {currentEventData.eventosPasados.map(evento => (
                  <PastEventRow key={evento.id} evento={evento} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsOverview;