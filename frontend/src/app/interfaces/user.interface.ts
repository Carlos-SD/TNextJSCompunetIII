export interface User {
  id: string;
  username: string;
  balance: number;
  roles: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  roles: string[];
  balance: number;
  isActive: boolean;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  balance?: number;
  roles?: string[];
}

