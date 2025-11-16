import React from 'react';

const Navbar = ({ logoSrc, balance, onLogout, username }: { logoSrc?: string; balance?: number | string; onLogout?: () => void; username?: string }) => {
  return (
    <nav className="w-full bg-gradient-to-r from-neutral-medium via-neutral-medium/95 to-neutral-medium backdrop-blur-md border-b border-neutral-700/50 shadow-lg">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y navegación */}
          <div className="flex items-center gap-8">
            <div className="text-brand font-extrabold text-2xl md:text-3xl tracking-wide" style={{color: '#08fc1cff'}}>
              Apostólicos
            </div>
            <ul className="hidden md:flex gap-2 text-sm text-text-light/80">
              <li className="px-4 py-2 hover:bg-neutral-dark/40 rounded-lg cursor-pointer transition-colors hover:text-text-light font-medium">
                Deportes
              </li>
            </ul>
          </div>

          {/* Usuario, Saldo y acciones */}
          <div className="flex items-center gap-4">
            {username && (
              <div className="text-text-light/80 text-sm">
                Bienvenido, <span className="font-semibold text-text-light">{username}</span>
              </div>
            )}
            <div className="bg-gradient-to-r from-neutral-dark/60 to-neutral-dark/40 px-5 py-2.5 rounded-xl border border-neutral-700/50 flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-text-light/60 font-medium">Saldo</p>
                <p className="text-base font-bold text-primary">{typeof balance === 'number' ? balance.toLocaleString() : balance ?? '0.00'}</p>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 active:scale-95"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
