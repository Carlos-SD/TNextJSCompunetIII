'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/app/services/auth/auth.service';
import { RegisterDto } from '@/app/interfaces/auth.interface';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterDto>({
    username: '',
    password: '',
    roles: ['user'],
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMessage = err?.response?.data?.message 
        || err?.message 
        || 'Error al registrar usuario. Intenta nuevamente.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center p-3">
          <Image
            src="/images/icons/FootballIcon.png"
            alt="Footballers Bets Logo"
            width={88}
            height={88}
            className="object-contain"
          />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-text-light text-center mb-2">
        Únete a Footballers Bets!
      </h1>
      <p className="text-text-light text-center mb-8 opacity-90">
        Crea tu cuenta para comenzar
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required
            minLength={3}
            maxLength={100}
            className="w-full bg-neutral-medium text-text-light py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
            minLength={6}
            className="w-full bg-neutral-medium text-text-light py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            required
            minLength={6}
            className="w-full bg-neutral-medium text-text-light py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón de Sign Up */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      {/* Link a Login */}
      <p className="text-center text-text-light mt-6 text-sm">
        ¿Ya tienes una cuenta?{' '}
        <a href="/login" className="text-primary hover:underline font-semibold">
          Iniciar Sesión
        </a>
      </p>
    </div>
  );
}

