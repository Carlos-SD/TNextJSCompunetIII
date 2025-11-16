'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { useBetsStore } from '@/app/store/bets.store';
import Breadcrumb from '@/app/components/Breadcrumb';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BetStatus } from '@/app/interfaces/bet.interface';

export default function MyBetsPage() {
  const router = useRouter();
  const { user, logout, checkAuth } = useAuthStore();
  const { bets, isLoading, error, fetchUserBets } = useBetsStore();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    if (user?.id) {
      fetchUserBets(user.id);
    }
  }, [router, checkAuth, user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = useMemo(() => {
    const totalBets = bets.length;
    const wonBets = bets.filter((b) => b.status === BetStatus.WON).length;
    const lostBets = bets.filter((b) => b.status === BetStatus.LOST).length;
    const pendingBets = bets.filter((b) => b.status === BetStatus.PENDING).length;
    const totalStaked = bets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalProfit = bets
      .filter((b) => b.status === BetStatus.WON)
      .reduce((sum, b) => sum + Number(b.profit), 0);
    const netProfit = totalProfit - bets
      .filter((b) => b.status === BetStatus.LOST)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalStaked,
      totalProfit,
      netProfit,
      winRate: totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : '0',
    };
  }, [bets]);

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
      <Navbar logoSrc={'/images/logo.png'} balance={user?.balance} onLogout={handleLogout} username={user?.username} />
      <div className="px-6 pt-4">
        <Breadcrumb />
      </div>
      <Sidebar username={user?.username} balance={user?.balance} />
      
      <div className="w-full px-6 pt-2">
        <div className="max-w-7xl mx-auto py-8">
              {/* Header con gradiente */}
              <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-8 border border-primary/30">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold text-text-light mb-2">Mis Apuestas</h1>
                  <p className="text-text-light/70 text-lg">Historial completo y estadísticas de tus apuestas</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              </div>

              {/* Estadísticas Resumidas */}
              {!isLoading && bets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    title="Total Apostado"
                    value={`${stats.totalStaked.toLocaleString()} COP`}
                    icon="💰"
                    color="from-blue-500/20 to-blue-600/20"
                    borderColor="border-blue-500/30"
                  />
                  <StatCard
                    title="Ganadas / Perdidas"
                    value={`${stats.wonBets} / ${stats.lostBets}`}
                    icon="📊"
                    color="from-purple-500/20 to-purple-600/20"
                    borderColor="border-purple-500/30"
                  />
                  <StatCard
                    title="Tasa de Éxito"
                    value={`${stats.winRate}%`}
                    icon="🎯"
                    color="from-green-500/20 to-green-600/20"
                    borderColor="border-green-500/30"
                  />
                  <StatCard
                    title="Balance Neto"
                    value={`${stats.netProfit >= 0 ? '+' : ''}${stats.netProfit.toLocaleString()} COP`}
                    icon={stats.netProfit >= 0 ? "📈" : "📉"}
                    color={stats.netProfit >= 0 ? "from-success/20 to-success/30" : "from-danger/20 to-danger/30"}
                    borderColor={stats.netProfit >= 0 ? "border-success/30" : "border-danger/30"}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-600/20 border-2 border-red-500 rounded-lg p-6 text-red-200 mb-6">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {!isLoading && !error && bets.length === 0 && (
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

              {!isLoading && !error && bets.length > 0 && (
                <div className="space-y-4">
                  {bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="bg-neutral-medium rounded-xl p-6 hover:bg-neutral-medium/80 transition-all duration-300 border border-neutral-700 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
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
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  borderColor: string;
}

function StatCard({ title, value, icon, color, borderColor }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 border-2 ${borderColor} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-text-light/70 text-sm mb-1">{title}</p>
      <p className="text-text-light font-bold text-xl">{value}</p>
    </div>
  );
}
