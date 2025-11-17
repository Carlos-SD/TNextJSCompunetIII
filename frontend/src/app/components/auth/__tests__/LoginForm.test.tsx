import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useAuthStore } from '@/app/store/auth.store';

jest.mock('@/app/store/auth.store');

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  it('should render login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should show loading state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });
    
    render(<LoginForm />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should display error message', () => {
    const errorMessage = 'Credenciales inválidas';
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: errorMessage,
    });
    
    render(<LoginForm />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<LoginForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});

