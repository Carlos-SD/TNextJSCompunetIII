'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth/auth.service';
import userService from '@/app/services/user.service';
import betsService from '@/app/services/bets.service';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bet, BetStatus } from '@/app/interfaces/bet.interface';

type User = {
  id: string;
  username: string;
  balance: number;
};

export default function MyBetsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // Cargar perfil del usuario
        const profileRes: any = await userService.getProfile();
        const profile = profileRes?.user ?? profileRes;
        const userId = profile.id;
        
        setUser({
          id: userId,
          username: profile.username || profile.name || 'Usuario',
          balance: profile.balance ?? 0,
        });

        // Cargar apuestas del usuario usando el endpoint correcto
        const userBets = await betsService.getUserBets(userId);
        setBets(userBets);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const getStatusBadge = (status: BetStatus) => {
    switch (status) {
      case BetStatus.PENDING:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300">Pendiente</span>;
      case BetStatus.WON:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">Ganada</span>;
      case BetStatus.LOST:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">Perdida</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-dark">
      <Navbar logoSrc={'/images/logo.png'} balance={user?.balance} onLogout={handleLogout} />
      <div className="min-h-[70px]" />
      <div className="w-full">
        <div className="flex">
          <Sidebar username={user?.username} balance={user?.balance} />

          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-light mb-2">Mis Apuestas</h1>
                <p className="text-text-light/70">Historial completo de tus apuestas</p>
              </div>

              {loading && (
                <div className="bg-neutral-medium rounded-lg p-6 text-text-light text-center">
                  Cargando apuestas...
                </div>
              )}

              {error && (
                <div className="bg-red-600 rounded-lg p-4 text-white mb-6">{error}</div>
              )}

              {!loading && !error && bets.length === 0 && (
                <div className="bg-neutral-medium rounded-lg p-12 text-center">
                  <p className="text-text-light/70 text-lg mb-4">No tienes apuestas aún</p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-primary hover:bg-[#1ed760] text-white rounded-lg font-semibold transition-colors"
                  >
                    Explorar Eventos
                  </button>
                </div>
              )}

              {!loading && !error && bets.length > 0 && (
                <div className="space-y-4">
                  {bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="bg-neutral-medium rounded-lg p-6 hover:bg-neutral-medium/80 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-light mb-1">
                            {bet.event?.name || 'Evento'}
                          </h3>
                          <p className="text-text-light/70 text-sm">
                            Selección: <span className="font-medium">{bet.selectedOption}</span>
                          </p>
                        </div>
                        <div>{getStatusBadge(bet.status)}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                        <div>
                          <p className="text-text-light/60 text-xs mb-1">Cuota</p>
                          <p className="text-text-light font-semibold">{Number(bet.odds).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-text-light/60 text-xs mb-1">Apostado</p>
                          <p className="text-text-light font-semibold">{Number(bet.amount).toLocaleString()} COP</p>
                        </div>
                        <div>
                          <p className="text-text-light/60 text-xs mb-1">
                            {bet.status === BetStatus.WON ? 'Ganancia' : 'Potencial'}
                          </p>
                          <p className={`font-semibold ${bet.status === BetStatus.WON ? 'text-green-400' : 'text-text-light'}`}>
                            {bet.status === BetStatus.WON 
                              ? Number(bet.profit).toLocaleString() 
                              : Math.round(Number(bet.amount) * Number(bet.odds)).toLocaleString()
                            } COP
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light/60 text-xs mb-1">Fecha</p>
                          <p className="text-text-light text-sm">{formatDate(bet.createdAt)}</p>
                        </div>
                      </div>

                      {bet.status === BetStatus.LOST && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-red-400 text-sm">
                            Pérdida: -{Number(bet.amount).toLocaleString()} COP
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && bets.length > 0 && (
                <div className="mt-8 bg-neutral-medium rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-light mb-4">Resumen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-dark/50 rounded-lg p-4">
                      <p className="text-text-light/60 text-sm mb-1">Total de Apuestas</p>
                      <p className="text-2xl font-bold text-text-light">{bets.length}</p>
                    </div>
                    <div className="bg-neutral-dark/50 rounded-lg p-4">
                      <p className="text-text-light/60 text-sm mb-1">Apuestas Ganadas</p>
                      <p className="text-2xl font-bold text-green-400">
                        {bets.filter((b) => b.status === BetStatus.WON).length}
                      </p>
                    </div>
                    <div className="bg-neutral-dark/50 rounded-lg p-4">
                      <p className="text-text-light/60 text-sm mb-1">Apuestas Perdidas</p>
                      <p className="text-2xl font-bold text-red-400">
                        {bets.filter((b) => b.status === BetStatus.LOST).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
