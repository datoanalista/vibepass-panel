"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Users, Calendar, Package, Edit, Eye, Trash2, ChevronDown } from 'lucide-react';

const EventAdminDashboard = () => {
  const [activeView, setActiveView] = useState('inventario'); // Empezamos en inventario
  const [selectedEventId, setSelectedEventId] = useState('event1');
  const [mounted, setMounted] = useState(false);
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Datos dummy de eventos
  const eventosDisponibles = [
    {
      id: 'event1',
      nombre: 'Salto Fest',
      cliente: 'British Royal',
      activo: true,
      data: {
        totalVentas: 5800000,
        ventasAtribuidas: 5360000,
        registradosNuevos: 17,
        ventasDelDia: [
          { item: 'Entradas', amount: 2800000 },
          { item: 'Arriendos', amount: 900000 },
          { item: 'Bebastibles', amount: 400000 },
          { item: 'Hot dogs', amount: 700000 },
          { item: 'Helados', amount: 1000000 }
        ]
      }
    },
    {
      id: 'event2',
      nombre: 'Festival de Primavera',
      cliente: 'Colegio San Patricio',
      activo: false,
      data: {
        totalVentas: 3200000,
        ventasAtribuidas: 2900000,
        registradosNuevos: 23,
        ventasDelDia: [
          { item: 'Entradas', amount: 1500000 },
          { item: 'Comida', amount: 800000 },
          { item: 'Bebidas', amount: 600000 }
        ]
      }
    },
    {
      id: 'event3',
      nombre: 'Gala de Fin de Año',
      cliente: 'Instituto Bilingüe',
      activo: true,
      data: {
        totalVentas: 7200000,
        ventasAtribuidas: 6800000,
        registradosNuevos: 35,
        ventasDelDia: [
          { item: 'Entradas VIP', amount: 4000000 },
          { item: 'Entradas General', amount: 2200000 },
          { item: 'Cena', amount: 800000 }
        ]
      }
    }
  ];

  const selectedEvent = eventosDisponibles.find(e => e.id === selectedEventId);
  const eventData = selectedEvent?.data || {};

  const productosAgendables = [
    { tipo: 'Ticket', cuposTotal: 600, cuposUsados: 260, cuposValidados: 220, cuposSinUsar: 115, anulados: 5 },
    { tipo: 'Parking', cuposTotal: 260, cuposUsados: 170, cuposValidados: 100, cuposSinUsar: 40, anulados: null },
    { tipo: 'Inflables', cuposTotal: 6, cuposUsados: 3, cuposValidados: 2, cuposSinUsar: 1, anulados: null },
    { tipo: 'Reposera', cuposTotal: 79, cuposUsados: 35, cuposValidados: 30, cuposSinUsar: 14, anulados: null }
  ];

  const historialEventos = [
    { cliente: 'British Royal School', rut: '96.123.456-7', nombre: 'Juan Pérez', correo: 'perez@british.cl', fecha: '01/07/2025' },
    { cliente: 'British Royal School', rut: '96.123.456-7', nombre: 'Juan Pérez', correo: 'perez@british.cl', fecha: '05/06/2025' },
    { cliente: 'British Royal School', rut: '96.123.456-7', nombre: 'Juan Pérez', correo: 'perez@british.cl', fecha: '10/03/2025' },
    { cliente: 'British Royal School', rut: '96.123.456-7', nombre: 'Juan Pérez', correo: 'perez@british.cl', fecha: '01/07/2024' }
  ];

  const miembros = [
    { id: 1, nombre: 'José Ortiz', rut: '17.568.240-k', correo: 'Jose@gmail.com', fecha: '20/05/2025', rol: 'Administracion', qr: false },
    { id: 2, nombre: 'María Muñoz', rut: '19.567.281-1', correo: 'Maria@gmail.com', fecha: '15/10/2024', rol: 'Organizadores', qr: false }
  ];

  const inventarioItems = [
    { categoria: 'Tickets', items: [
      { nombre: 'NIÑOS - MENOS 1.30 MT.', precio: 7900, sku: 'Ent003', stock: 0, estado: 'agotado' },
      { nombre: 'ADULTOS', precio: 5600, sku: 'Ent002', stock: 'Agotado', estado: 'agotado' }
    ]},
    { categoria: 'Alimento', items: [
      { nombre: 'Snack', precio: 700, sku: 'Sna001', stock: 1000 },
      { nombre: 'Hamburguesa', precio: 1000, sku: 'Ham001', stock: 1000 },
      { nombre: 'Completo', precio: 1500, sku: 'Com001', stock: 1000 }
    ]},
    { categoria: 'Agendables', items: [
      { nombre: 'Reposera', precio: 500, sku: 'Rep001', stock: 1000 }
    ]}
  ];

  // Navbar Component
  const Navbar = () => (
    <nav className="bg-slate-700 text-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-blue-400 text-xl">💎</div>
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setShowAddInventoryForm(false);
                  setShowAddUserForm(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeView === 'dashboard' 
                    ? 'bg-slate-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('buscar');
                  setShowAddInventoryForm(false);
                  setShowAddUserForm(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeView === 'buscar' 
                    ? 'bg-slate-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                🔍 Busca Ticket
              </button>
              <button
                onClick={() => {
                  setActiveView('inventario');
                  setShowAddInventoryForm(false);
                  setShowAddUserForm(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeView === 'inventario' 
                    ? 'bg-slate-500 text-white' 
                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                📦 Inventario
              </button>
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

  // Event Selector Component
  const EventSelector = () => (
    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-gray-600 text-lg font-normal">
            {showAddInventoryForm ? 'Añadir inventario' : 
             showAddUserForm ? 'Nuevo rol de usuario' : 
             `Evento - "${selectedEvent?.nombre}"`}
          </h1>
        </div>
        {activeView === 'inventario' && !showAddInventoryForm && !showAddUserForm && (
          <div className="text-red-500 text-sm font-medium">
            ⚠️ Últimas unidades - Revisar inventario
          </div>
        )}
        <div className="relative">
          <select 
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm appearance-none cursor-pointer pr-8 font-medium"
          >
            {eventosDisponibles.map(evento => (
              <option key={evento.id} value={evento.id} className="bg-white text-black">
                {evento.cliente}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
        </div>
      </div>
    </div>
  );

  // Add User Form Component
  const AddUserForm = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Completa la información y define nivel de acceso en la plataforma
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-sm font-medium">Datos del Organizador</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Nombre completo del usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo del usuario
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="camila@colegio.cl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* RUT o ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUT o ID
            </label>
            <input
              type="text"
              placeholder="12.345.678-9"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Teléfono de contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de contacto
            </label>
            <input
              type="tel"
              placeholder="+56 9 1234 5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Seleccionar rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar rol
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Administrador</option>
              <option>Organizador</option>
              <option>Validador</option>
              <option>Comprador</option>
            </select>
          </div>
        </div>

        {/* Botón Enviar acceso */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center">
            📧 Enviar acceso
          </button>
        </div>
      </div>
    </div>
  );
  const AddInventoryForm = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Completa la siguiente información para registrar un nuevo producto
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
          <h3 className="text-sm font-medium">Formulario de producto</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <span className="text-green-600 text-sm font-medium flex items-center">
              Producto agregado correctamente <span className="ml-1 text-green-500">●</span>
            </span>
          </div>

          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto
            </label>
            <input
              type="text"
              defaultValue="Hamburguesa simple"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Selecciona una categoría</option>
              <option>Alimento</option>
              <option>Bebida</option>
              <option>Tickets</option>
              <option>Agendables</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              defaultValue="Hamburguesa con pan, carne y queso cheddar"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* SKU o Código interno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU o Código interno
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="HAM-001"
                className="w-full px-3 py-2 border border-red-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <div className="mt-1 flex items-center text-red-500 text-xs">
                <span className="mr-1">⚠</span>
                <span>Este código ya está en uso. Por favor, asigna uno diferente.</span>
              </div>
            </div>
          </div>

          {/* Precio de venta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de venta (CLP)
            </label>
            <input
              type="text"
              defaultValue="$2.500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Stock inicial disponible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock inicial disponible
            </label>
            <input
              type="text"
              defaultValue="100 unidades"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Imagen del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <div className="text-gray-500 text-sm">
                <span className="text-blue-500 underline cursor-pointer hover:text-blue-600">(Adjuntar archivo)</span>
                <span className="ml-2">📎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3">
          <button 
            onClick={() => setShowAddInventoryForm(false)}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 bg-gray-400 text-white rounded text-sm font-medium cursor-not-allowed">
            Guardar borrador
          </button>
        </div>
      </div>
    </div>
  );

  // Inventario View
  const InventarioView = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-1 bg-white rounded-lg p-1 inline-flex border shadow-sm">
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">Todos</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Activos</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Programados</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Pasados</button>
        </div>
        <button 
          onClick={() => setShowAddInventoryForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 font-medium transition-colors"
        >
          📦 Añadir inventario
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-sm font-medium text-gray-700">Inventario activo</span>
        </div>
        
        {/* Event Date Selector - Moved to right */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Seleccionar fecha de evento</span>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:border-blue-500 focus:outline-none">
            <option>A May 20, 2025</option>
          </select>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        {inventarioItems.map((categoria, catIndex) => (
          <div key={catIndex}>
            <h3 className="text-base font-medium mb-3 text-gray-900">{categoria.categoria}</h3>
            <div className="space-y-2">
              {categoria.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{item.nombre}</div>
                    <div className="text-gray-600 text-sm">${item.precio.toLocaleString()}</div>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mt-1 inline-block font-medium">
                      Casa matriz
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1 font-medium">Sku</div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {item.sku}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1 font-medium">Stock</div>
                      {item.estado === 'agotado' ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                          Agotado
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          📦 {item.stock}
                        </span>
                      )}
                    </div>
                    
                    {item.estado === 'agotado' && (
                      <div className="text-orange-600 text-sm font-medium">⚠️ Últimas unidades (1)</div>
                    )}
                    
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 font-medium transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Dashboard View (simplificado para el ejemplo)
  const DashboardView = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl">Dashboard View</h2>
        <p>Haz clic en "Inventario" para ver el formulario funcionando</p>
      </div>
    </div>
  );

  // Buscar Ticket View
  const BuscarTicketView = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 inline-flex border shadow-sm">
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">Todos</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Organizadores</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Validadores</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Visitantes</button>
        </div>
        <button 
          onClick={() => setShowAddUserForm(true)}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 font-medium transition-colors"
        >
          👤 Añadir rol de usuario
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900">Miembros (1000)</h3>
          </div>

          {/* Search */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none">
              <option>Buscar por fechas</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Cuentas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Correo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">QR</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rol</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-900 font-medium">José Ortiz</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">17.568.240-k</td>
                <td className="py-3 px-4 text-gray-700">Jose@gmail.com</td>
                <td className="py-3 px-4 text-gray-700">20/05/2025</td>
                <td className="py-3 px-4 text-gray-500">-</td>
                <td className="py-3 px-4">
                  <select className="bg-gray-100 px-3 py-1 rounded text-sm border-0 font-medium" defaultValue="Administracion">
                    <option value="Administracion">Administracion</option>
                    <option value="Organizadores">Organizadores</option>
                    <option value="Validadores">Validadores</option>
                    <option value="Compradores">Compradores</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button className="text-red-500 text-sm hover:text-red-700 font-medium">Eliminar</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-900 font-medium">María Muñoz</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">19.567.281-1</td>
                <td className="py-3 px-4 text-gray-700">Maria@gmail.com</td>
                <td className="py-3 px-4 text-gray-700">15/10/2024</td>
                <td className="py-3 px-4 text-gray-500">-</td>
                <td className="py-3 px-4">
                  <select className="bg-gray-100 px-3 py-1 rounded text-sm border-0 font-medium" defaultValue="Organizadores">
                    <option value="Administracion">Administracion</option>
                    <option value="Organizadores">Organizadores</option>
                    <option value="Validadores">Validadores</option>
                    <option value="Compradores">Compradores</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button className="text-red-500 text-sm hover:text-red-700 font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EventSelector />
      {showAddInventoryForm ? (
        <AddInventoryForm />
      ) : showAddUserForm ? (
        <AddUserForm />
      ) : (
        <>
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'buscar' && <BuscarTicketView />}
          {activeView === 'inventario' && <InventarioView />}
        </>
      )}
    </div>
  );
};

export default EventAdminDashboard;