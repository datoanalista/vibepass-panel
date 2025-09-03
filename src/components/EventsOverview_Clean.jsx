"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Calendar, Users, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';
import CreateEvent from './CreateEvent';

const EventsOverview = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  const [dateRange, setDateRange] = useState('1 Abr 2025 - 1 May 2025');
  const [selectedEventId, setSelectedEventId] = useState('british-royal');
  const [selectedActiveEvent, setSelectedActiveEvent] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);

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

  // Renderizado principal
  if (showCreateEventForm) {
    return <CreateEvent onClose={() => setShowCreateEventForm(false)} />;
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

