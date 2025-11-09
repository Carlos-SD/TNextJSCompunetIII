'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/app/services/auth/auth.service';
import { LoginDto } from '@/app/interfaces/auth.interface';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDto>({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(formData);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.response?.data?.message 
        || err?.message 
        || 'Error al iniciar sesión. Verifica tus credenciales.';
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
        Bienvenido a Footballers Bets!
      </h1>
      <p className="text-text-light text-center mb-8 opacity-90">
        
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-text-light mb-2 text-sm font-medium">
          </label>
          
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required
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

        {/* Remember me y Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-text-light cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-neutral-medium text-primary focus:ring-primary focus:ring-2"
            />
            <span className="text-sm">Recordarme</span>
          </label>
          <a href="#" className="text-text-light text-sm hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón de Sign In */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Link a Register */}
      <p className="text-center text-text-light mt-6 text-sm">
        ¿No tienes una cuenta?{' '}
        <a href="/register" className="text-primary hover:underline font-semibold">
          Regístrate
        </a>
      </p>
    </div>
  );
}

