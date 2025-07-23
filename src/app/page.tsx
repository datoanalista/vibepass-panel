import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Sistema de Gestión de Eventos
        </h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Link 
              href="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-lg transition-colors shadow-lg"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h2 className="text-xl font-semibold mb-2">Dashboard de Eventos</h2>
                <p className="text-blue-100 text-sm">
                  Gestión detallada de inventarios, tickets y usuarios
                </p>
              </div>
            </Link>

            <Link 
              href="/events-overview"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-lg transition-colors shadow-lg"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📅</div>
                <h2 className="text-xl font-semibold mb-2">Vista General de Eventos</h2>
                <p className="text-green-100 text-sm">
                  Listado y gestión de eventos activos, programados y pasados
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}