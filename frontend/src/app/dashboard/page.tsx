'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { useEventsStore } from '@/app/store/events.store';
import { useBetsStore } from '@/app/store/bets.store';
import { toast } from '@/app/store/toast.store';
import userService from '@/app/services/user.service';
import Breadcrumb from '../components/Breadcrumb';
import Navbar from './components/Navbar';
import EventsList from './components/EventsList';
import BetSlip from './components/BetSlip';
import Sidebar from './components/Sidebar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, checkAuth, updateUser, refreshUser } = useAuthStore();
  const { events, isLoading, error: eventsError, fetchOpenEvents } = useEventsStore();
  const { createBet } = useBetsStore();
  
  const [betLine, setBetLine] = useState<any | null>(null);
  const [showBetSlip, setShowBetSlip] = useState(false);
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
    
    fetchOpenEvents();
  }, [router, checkAuth, fetchOpenEvents]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handlePlaceBet = async (line: any, stake: number) => {
    if (!line || stake <= 0) {
      toast.warning('Ingresa un monto válido');
      return;
    }

    if (!user || user.balance < stake) {
      toast.error('Saldo insuficiente para realizar esta apuesta');
      return;
    }

    try {
      await createBet({
        userId: user.id,
        eventId: line.eventId,
        selectedOption: line.optionName,
        amount: stake,
      });

      toast.success('Apuesta realizada exitosamente');
      setShowBetSlip(false);
      setBetLine(null);
      
      // Actualizar el saldo del usuario después de la apuesta
      try {
        const updatedUser = await userService.getProfile();
        updateUser(updatedUser);
      } catch (profileError) {
        console.error('Error al actualizar perfil:', profileError);
        // No mostramos error al usuario ya que la apuesta fue exitosa
      }
      
      // Recargar eventos para refrescar datos
      fetchOpenEvents();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || 'Error al realizar la apuesta';
      toast.error(errorMsg);
    }
  };

  // Normalizar eventos para compatibilidad con EventsList
  const normalizedEvents = (events || []).map((ev: any) => ({
    ...ev,
    options: (ev.options || []).map((opt: any, i: number) => ({
      id: opt.id ?? `${ev.id ?? 'e'}-${i}`,
      name: opt.name ?? opt.option ?? opt.label ?? 'Opción',
      odd: opt.odds ?? opt.odd ?? opt.price ?? 0,
    })),
  }));

  return (
    <div className="min-h-screen bg-neutral-dark">
      <Navbar logoSrc={'/images/logo.png'} balance={user?.balance} username={user?.username} />
      <Sidebar username={user?.username} balance={user?.balance} onLogout={handleLogout} onToggle={setSidebarOpen} />
      
      <div className={`transition-all duration-300 pt-[73px] ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="px-6 pt-4">
          <Breadcrumb />
        </div>
        <div className="w-full px-6 pt-2">
          <div className="max-w-7xl mx-auto py-8">

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-light/70">Cargando eventos disponibles...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {eventsError && (
                <div className="bg-gradient-to-r from-error/20 to-transparent border-l-4 border-error rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-error flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                      <h4 className="text-text-light font-semibold mb-1">Error al cargar eventos</h4>
                      <p className="text-text-light/70 text-sm">{eventsError}</p>
                    </div>
                  </div>
                </div>
              )}

            {/* Events List */}
            {!isLoading && !eventsError && (
              <div className="bg-gradient-to-br from-neutral-medium/40 to-transparent rounded-2xl p-8 border border-neutral-700/50">
                <EventsList
                  events={normalizedEvents}
                  onSelectOption={(ev, opt) => {
                    setBetLine({
                      id: `${ev.id}-${opt.id}`,
                      eventId: ev.id,
                      eventName: ev.name,
                      optionId: opt.id,
                      optionName: opt.name,
                      odd: opt.odd,
                    });
                    setShowBetSlip(true);
                  }}
                />
              </div>
            )}

            {/* Bet Slip */}
            <BetSlip
              open={showBetSlip}
              line={betLine}
              onClose={() => setShowBetSlip(false)}
              onPlaceBet={handlePlaceBet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

