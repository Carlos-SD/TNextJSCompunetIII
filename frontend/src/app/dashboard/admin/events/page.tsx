'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { useEventsStore } from '@/app/store/events.store';
import { toast } from '@/app/store/toast.store';
import Breadcrumb from '@/app/components/Breadcrumb';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Event, CreateEventDto, UpdateEventDto, CloseEventDto } from '@/app/interfaces/event.interface';
import EventFormModal from './components/EventFormModal';
import CloseEventModal from './components/CloseEventModal';
import ConfirmModal from '@/app/components/ConfirmModal';

export default function AdminEventsPage() {
  const router = useRouter();
  const { user, logout, checkAuth, refreshUser } = useAuthStore();
  const { events, isLoading, fetchEvents, createEvent, updateEvent, closeEvent, deleteEvent } = useEventsStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [closingEvent, setClosingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtros y paginación
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

    // Solo cargar eventos si el usuario está cargado y es admin
    if (user && user.roles?.includes('admin')) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, checkAuth, user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCreateEvent = async (data: CreateEventDto | UpdateEventDto) => {
    try {
      await createEvent(data as CreateEventDto);
      setShowCreateModal(false);
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const handleUpdateEvent = async (id: string, data: UpdateEventDto) => {
    try {
      await updateEvent(id, data);
      setEditingEvent(null);
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (event.status === 'closed') {
      toast.error('No se puede eliminar un evento cerrado');
      return;
    }

    // Mostrar el modal de confirmación
    setDeletingEvent(event);
  };

  const confirmDeleteEvent = async () => {
    if (!deletingEvent) return;

    try {
      await deleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error deleting event:', error);
    }
  };

  const handleCloseEvent = async (id: string, data: CloseEventDto) => {
    try {
      await closeEvent(id, data);
      setClosingEvent(null);
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error closing event:', error);
      throw error;
    }
  };

  // Filtros y paginación
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [events, filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

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
        username={user?.username} 
      />
      <Sidebar username={user?.username} balance={user?.balance} onLogout={handleLogout} onToggle={setSidebarOpen} />
      
      <div className={`transition-all duration-300 pt-[73px] ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="px-6 pt-4">
          <Breadcrumb />
        </div>
        <div className="w-full px-6 pt-2">
          <div className="max-w-7xl mx-auto py-8">
          
          {/* Header con botón de crear */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-light mb-2">
                Gestión de Eventos
              </h1>
              <p className="text-text-light/70">
                Administra todos los eventos del sistema
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Crear Evento
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-gradient-to-br from-neutral-medium to-neutral-medium/80 rounded-xl p-6 border border-neutral-700 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <label className="text-text-light/70 text-sm mb-2 block">Buscar evento</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full px-4 py-2 rounded-lg bg-neutral-dark/60 text-text-light border border-neutral-700 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Filtro de estado */}
              <div className="md:w-48">
                <label className="text-text-light/70 text-sm mb-2 block">Estado</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'open' | 'closed')}
                  className="w-full px-4 py-2 rounded-lg bg-neutral-dark text-text-light border border-neutral-700 focus:border-primary focus:outline-none transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="all" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Todos</option>
                  <option value="open" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Abiertos</option>
                  <option value="closed" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Cerrados</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-text-light/60 text-sm">
              Mostrando {paginatedEvents.length} de {filteredEvents.length} eventos
            </div>
          </div>

          {/* Tabla de eventos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-light/70">Cargando eventos...</p>
              </div>
            </div>
          ) : paginatedEvents.length === 0 ? (
            <div className="bg-neutral-medium rounded-xl p-12 text-center">
              <p className="text-text-light/70 text-lg">No se encontraron eventos</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-medium/40 to-transparent rounded-xl border border-neutral-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-dark/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Opciones
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Resultado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {paginatedEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-neutral-dark/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-text-light font-medium">{event.name}</div>
                          {event.description && (
                            <div className="text-text-light/60 text-sm mt-1">{event.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {event.status === 'open' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success border border-success/30">
                              Abierto
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/30">
                              Cerrado
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-text-light/70 text-sm">
                            {event.options?.length || 0} opciones
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {event.finalResult ? (
                            <div className="text-success text-sm font-medium">{event.finalResult}</div>
                          ) : (
                            <div className="text-text-light/40 text-sm">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {event.status === 'open' && (
                              <>
                                <button
                                  onClick={() => setEditingEvent(event)}
                                  className="p-2 text-text-light/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Editar (solo nombres)"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => setClosingEvent(event)}
                                  className="p-2 text-text-light/70 hover:text-warning hover:bg-warning/10 rounded-lg transition-colors"
                                  title="Cerrar evento"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                  </svg>
                                </button>

                                  <button
                                    onClick={() => handleDeleteEvent(event)}
                                    className="p-2 text-text-light/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                    title="Eliminar evento (devuelve dinero)"
                                  >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-neutral-medium text-text-light rounded-lg hover:bg-neutral-medium/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-neutral-medium text-text-light hover:bg-neutral-medium/80'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-neutral-medium text-text-light rounded-lg hover:bg-neutral-medium/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}

          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && (
        <EventFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
          title="Crear Nuevo Evento"
        />
      )}

      {editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={(data) => handleUpdateEvent(editingEvent.id, data)}
          title="Editar Evento"
        />
      )}

      {closingEvent && (
        <CloseEventModal
          event={closingEvent}
          onClose={() => setClosingEvent(null)}
          onSubmit={(data) => handleCloseEvent(closingEvent.id, data)}
        />
      )}

      {deletingEvent && (
        <ConfirmModal
          title="¿Eliminar evento?"
          message={`¿Estás seguro de que deseas eliminar el evento "${deletingEvent.name}"? Se devolverá el dinero a todos los usuarios que apostaron. Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          type="danger"
          onConfirm={confirmDeleteEvent}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
}

