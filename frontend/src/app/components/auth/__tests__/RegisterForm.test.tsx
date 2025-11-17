import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../RegisterForm';
import { useAuthStore } from '@/app/store/auth.store';

jest.mock('@/app/store/auth.store');

describe('RegisterForm', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
    });
  });

  it('should render register form', () => {
    render(<RegisterForm />);
    
    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/contraseña/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    mockRegister.mockResolvedValue(undefined);
    
    render(<RegisterForm />);
    
    const inputs = screen.getAllByPlaceholderText(/contraseña/i);
    
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(inputs[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(inputs[1], {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
        roles: ['user'],
      });
    });
  });

  it('should show loading state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: true,
      error: null,
    });
    
    render(<RegisterForm />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading state during submission', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: true,
      error: null,
    });
    
    render(<RegisterForm />);
    
    const button = screen.getByRole('button', { name: /creando cuenta/i });
    expect(button).toBeDisabled();
  });

  it('should validate password match', async () => {
    render(<RegisterForm />);
    
    const inputs = screen.getAllByPlaceholderText(/contraseña/i);
    
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(inputs[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(inputs[1], {
      target: { value: 'different' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });
});

