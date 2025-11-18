'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/app/store/auth.store';
import { LoginDto } from '@/app/interfaces/auth.interface';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error: storeError } = useAuthStore();
  const [formData, setFormData] = useState<LoginDto>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      // El error ya se maneja en el store y muestra el toast
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
        Bienvenido a Apostólicos!
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

        {/* Error message */}
        {storeError && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {storeError}
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

