"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = sessionStorage.getItem('authToken');
    
    if (token) {
      // Si está autenticado, redirigir al home
      router.push('/home');
    } else {
      // Si no está autenticado, redirigir al login
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </main>
  );
}