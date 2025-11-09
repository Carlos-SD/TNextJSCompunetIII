import RegisterForm from '@/app/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda - Formulario */}
      <div className="w-full lg:w-[45%] bg-secondary flex items-center justify-center p-8">
        <RegisterForm />
      </div>

      {/* Sección derecha - Imagen de fondo */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/backgrounds/Fans.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay oscuro para mejor contraste */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>
    </div>
  );
}

