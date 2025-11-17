import { create } from 'zustand';
import { User } from '../interfaces/user.interface';
import { usersService } from '../services/users.service';
import { toast } from './toast.store';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllUsers: () => Promise<void>;
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar usuarios';
      set({
        users: [],
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  updateUserRoles: async (userId: string, roles: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await usersService.updateUserRoles(userId, roles);
      
      // Actualizar el usuario en la lista local
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user => 
        user.id === userId ? updatedUser : user
      );
      
      set({ users: updatedUsers, isLoading: false });
      toast.success('Roles actualizados correctamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar roles';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await usersService.deleteUser(userId);
      
      // Eliminar el usuario de la lista local
      const currentUsers = get().users;
      const filteredUsers = currentUsers.filter(user => user.id !== userId);
      
      set({ users: filteredUsers, isLoading: false });
      toast.success('Usuario eliminado correctamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

