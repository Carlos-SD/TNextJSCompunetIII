import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, LoginCredentials, RegisterData } from '../interfaces/user.interface';
import { authService } from '../services/auth/auth.service';
import { toast } from './toast.store';

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  clearError: () => void;
  updateUser: (user: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('¡Bienvenido! Has iniciado sesión correctamente');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          set({
            user: response,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('¡Cuenta creada! Bienvenido a BetFicticia');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al registrarse';
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        toast.info('Has cerrado sesión correctamente');
      },

      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.token;
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (user: AuthResponse) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

