import React from 'react';

const Navbar = ({ logoSrc, balance, onLogout }: { logoSrc?: string; balance?: number | string; onLogout?: () => void }) => {
  return (
    <nav className="w-full bg-neutral-medium/70 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
          <div className="text-brand font-extrabold text-lg md:text-2xl tracking-wide" style={{color: '#08fc1cff'}}>
            Apostólicos
          </div>
        <ul className="flex gap-4 text-sm text-text-light/90">
          <li className="px-3 py-1 hover:underline cursor-pointer">Deportes</li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-text-light/90">Saldo: <strong className="text-brand">{balance ?? '-'}</strong></div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
