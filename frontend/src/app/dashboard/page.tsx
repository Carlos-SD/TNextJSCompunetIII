'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth/auth.service';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-dark p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-light">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#1ed760] transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="bg-neutral-medium rounded-lg p-6 text-text-light">
          <h2 className="text-xl font-semibold mb-4">Bienvenido a Footballers Bets!</h2>
          <p>Esta es tu página principal. Aquí podrás ver tus apuestas, eventos y más.</p>
        </div>
      </div>
    </div>
  );
}

