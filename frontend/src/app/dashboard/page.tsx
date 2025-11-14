'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth/auth.service';
import userService from '@/app/services/user.service';
import eventsService from '@/app/services/events.service';
import Navbar from './components/Navbar';
import EventsList from './components/EventsList';
import BetSlip from './components/BetSlip';
import Sidebar from './components/Sidebar';

type User = {
  id: string;
  username: string;
  balance: number;
};

type EventOption = {
  id: string;
  name: string;
  odd: number;
};
export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betLine, setBetLine] = useState<any | null>(null);
  const [showBetSlip, setShowBetSlip] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const profileRes: any = await userService.getProfile();
        const profile = profileRes?.user ?? profileRes;
        setUser({
          id: profile.id,
          username: profile.username || profile.name || 'Usuario',
          balance: profile.balance ?? 0,
        });

        const openEvents: any = await eventsService.getOpen();
        const normalized = (Array.isArray(openEvents) ? openEvents : []).map((ev: any) => ({
          ...ev,
          options: (ev.options || []).map((opt: any, i: number) => ({
            id: opt.id ?? `${ev.id ?? 'e'}-${i}`,
            name: opt.name ?? opt.label ?? 'Opción',
            odd: opt.odd ?? opt.odds ?? opt.price ?? 0,
          })),
        }));

        setEvents(normalized);
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

  return (
    <div className="min-h-screen bg-neutral-dark">
      <Navbar logoSrc={'/images/logo.png'} balance={user?.balance} />
      <div className="min-h-[70px]" />
      <div className="w-full">
        <div className="flex">
          <Sidebar username={user?.username} balance={user?.balance} />

          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-6">

              {loading && (
                <div className="bg-neutral-medium rounded-lg p-6 text-text-light">Cargando...</div>
              )}

              {error && (
                <div className="bg-red-600 rounded-lg p-4 text-white">{error}</div>
              )}

              {!loading && !error && (
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="bg-neutral-medium rounded-lg p-6 text-text-light mb-6">
                      <h3 className="text-xl font-semibold mb-4">Próximos eventos destacados</h3>
                      <EventsList
                        events={events}
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
                  </div>

                  <div className="w-80">
                    <div className="bg-neutral-medium rounded-lg p-4 text-text-light">
                      <h4 className="font-semibold mb-2">Tu apuesta</h4>
                      <p className="text-sm">Selecciona una cuota</p>
                      {betLine && (
                        <div className="mt-4 bg-neutral-dark/40 p-3 rounded">
                          <div className="font-medium">{betLine.eventName}</div>
                          <div className="text-sm text-text-light/80">{betLine.optionName} @{betLine.odd}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <BetSlip
                open={showBetSlip}
                line={betLine}
                onClose={() => setShowBetSlip(false)}
                onPlaceBet={(line, stake) => {
                  console.log('Place bet', line, stake);
                  setShowBetSlip(false);
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

