'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';
import { toast } from '@/app/store/toast.store';
import Breadcrumb from '@/app/components/Breadcrumb';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ConfirmModal from '@/app/components/ConfirmModal';
import usersService from '@/app/services/users.service';
import { User } from '@/app/interfaces/user.interface';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, logout, checkAuth, refreshUser } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    if (currentUser && !currentUser.roles?.includes('admin')) {
      router.push('/dashboard');
      return;
    }

    if (currentUser && currentUser.roles?.includes('admin')) {
      loadUsers();
    }
  }, [router, checkAuth, currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleToggleAdminRole = async (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes modificar tus propios roles');
      return;
    }

    const hasAdminRole = user.roles?.includes('admin') || false;
    const newRoles = hasAdminRole
      ? ['user'] // Quitar admin, dejar solo user
      : ['user', 'admin']; // Agregar admin

    try {
      await usersService.updateUserRoles(user.id, newRoles);
      toast.success(
        hasAdminRole
          ? `Rol de admin removido de ${user.username}`
          : `Rol de admin agregado a ${user.username}`
      );
      loadUsers();
    } catch (error) {
      console.error('Error updating user roles:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Error al actualizar roles';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }

    setDeletingUser(user);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await usersService.deleteUser(deletingUser.id);
      toast.success(`Usuario ${deletingUser.username} eliminado exitosamente`);
      setDeletingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Error al eliminar usuario';
      toast.error(errorMessage);
    }
  };

  // Filtros y paginación
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filtro por rol
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.roles?.includes(filterRole));
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [users, filterRole, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const breadcrumbItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Panel de Admin', path: '/dashboard/admin' },
    { name: 'Gestión de Usuarios', path: '/dashboard/admin/users' },
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-dark">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-dark to-neutral-darker text-text-light">
      <Navbar onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar onToggle={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'} pt-[73px]`}>
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl font-extrabold text-primary mb-8 mt-4">Gestión de Usuarios</h1>

          {/* Controles de tabla */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="w-full md:w-64 px-4 py-2 rounded-lg bg-neutral-dark/60 text-text-light border border-neutral-700 focus:border-primary focus:outline-none transition-colors"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className="w-full md:w-40 px-4 py-2 rounded-lg bg-neutral-dark text-text-light border border-neutral-700 focus:border-primary focus:outline-none transition-colors"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value as 'all' | 'admin' | 'user');
                  setCurrentPage(1);
                }}
                style={{ colorScheme: 'dark' }}
              >
                <option value="all" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Todos</option>
                <option value="admin" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Admins</option>
                <option value="user" style={{ backgroundColor: '#0f1720', color: '#E6F6EA' }}>Usuarios</option>
              </select>
            </div>
          </div>

          <div className="mb-4 text-text-light/60 text-sm">
            Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-light/70">Cargando usuarios...</p>
              </div>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="bg-neutral-medium rounded-xl p-12 text-center">
              <p className="text-text-light/70 text-lg">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-medium/40 to-transparent rounded-xl border border-neutral-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-dark/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Apuestas
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-text-light/70 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-dark/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-text-light font-medium">{user.username}</div>
                              <div className="text-text-light/50 text-sm">
                                {user.id === currentUser?.id && '(Tú)'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Usuario
                            </span>
                            {user.roles?.includes('admin') && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-text-light font-medium">
                            {Number(user.balance).toLocaleString('es-CO')} COP
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-text-light/70 text-sm">
                            {user.bets?.length || 0} apuestas
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {user.id !== currentUser?.id && (
                              <>
                                <button
                                  onClick={() => handleToggleAdminRole(user)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.roles?.includes('admin')
                                      ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                                      : 'text-text-light/70 hover:text-primary hover:bg-primary/10'
                                  }`}
                                  title={
                                    user.roles?.includes('admin')
                                      ? 'Quitar rol de admin'
                                      : 'Agregar rol de admin'
                                  }
                                >
                                  {user.roles?.includes('admin') ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="p-2 text-text-light/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                  title="Eliminar usuario"
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
                className="px-4 py-2 bg-neutral-medium rounded-lg text-text-light hover:bg-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-text-light/80">Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-neutral-medium rounded-lg text-text-light hover:bg-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {deletingUser && (
        <ConfirmModal
          title="¿Eliminar usuario?"
          message={`¿Estás seguro de que deseas eliminar al usuario "${deletingUser.username}"? Se eliminarán todas sus apuestas, historial y datos asociados. Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          type="danger"
          onConfirm={confirmDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

