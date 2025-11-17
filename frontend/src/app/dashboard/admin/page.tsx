'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import Breadcrumb from '@/app/components/Breadcrumb';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, checkAuth, refreshUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refrescar el perfil del usuario al montar el componente
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    // Esperar a que el usuario esté cargado antes de verificar
    if (user && !user.roles?.includes('admin')) {
      router.push('/dashboard');
      return;
    }
  }, [router, checkAuth, user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mostrar loading mientras se carga el usuario
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light/70">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, no mostrar nada (será redirigido)
  if (!user.roles?.includes('admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-dark">
      <Navbar 
        logoSrc={'/images/logo.png'} 
        balance={user?.balance} 
        onLogout={handleLogout} 
        username={user?.username} 
      />
      <Sidebar username={user?.username} balance={user?.balance} onLogout={handleLogout} onToggle={setSidebarOpen} />
      
      <div className={`transition-all duration-300 pt-[73px] ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="px-6 pt-4">
          <Breadcrumb />
        </div>
        <div className="w-full px-6 pt-2">
          <div className="max-w-7xl mx-auto py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-xl p-6 shadow-lg shadow-primary/5">
              <h1 className="text-3xl font-bold text-text-light mb-2 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Panel de Administración
              </h1>
              <p className="text-text-light/70">
                Gestiona eventos, usuarios y configuraciones del sistema
              </p>
            </div>
          </div>

          {/* Cards de opciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gestión de Eventos */}
            <Link href="/dashboard/admin/events">
              <div className="group bg-gradient-to-br from-neutral-medium to-neutral-medium/80 rounded-xl p-6 border border-neutral-700 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-primary transition-colors">
                  Gestión de Eventos
                </h3>
                <p className="text-text-light/70 text-sm mb-4">
                  Crear, editar, eliminar y cerrar eventos deportivos
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Ir a eventos
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Usuarios */}
            <Link href="/dashboard/admin/users">
              <div className="group bg-gradient-to-br from-neutral-medium to-neutral-medium/80 rounded-xl p-6 border border-neutral-700 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 cursor-pointer hover:scale-105">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-accent transition-colors">
                  Gestión de Usuarios
                </h3>
                <p className="text-text-light/70 text-sm mb-4">
                  Administrar usuarios, asignar roles y eliminar cuentas
                </p>
                <div className="flex items-center text-accent text-sm font-medium">
                  Ir a usuarios
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Link>

          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

