"use client";

import React, { useState } from 'react';
import { IoWalletOutline, IoHomeOutline, IoLogOutOutline } from 'react-icons/io5';
import { SidebarMenuItems } from './SidebarMenuItems';

export const Sidebar = ({ username, balance, onLogout, onToggle } : { username?: string; balance?: number | string; onLogout?: () => void; onToggle?: (isOpen: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: <IoHomeOutline/>,
      title: 'Inicio',
      subtitle: 'Ver eventos disponibles'
    },
    {
      path: '/dashboard/my-bets',
      icon: <IoWalletOutline/>,
      title: 'Mis Apuestas',
      subtitle: 'Historial completo'
    }
  ];

  return (
    <>
      {/* Botón para abrir/cerrar */}
      <button
        onClick={handleToggle}
        className={`fixed left-6 top-[150px] z-30 w-10 h-10 bg-neutral-medium border border-neutral-700 rounded-lg flex items-center justify-center text-text-light hover:bg-neutral-medium/80 transition-all duration-300 ${isOpen ? 'translate-x-[288px]' : ''}`}
        aria-label="Toggle sidebar"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-72 bg-gradient-to-b from-neutral-medium to-neutral-medium/90 text-text-light overflow-y-auto border-r border-neutral-700/50 shadow-xl transition-transform duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Perfil del usuario */}
        <div className='px-5 pt-8 pb-4 border-b border-neutral-700/50'>
            <p className='text-text-light/60 text-xs uppercase tracking-wider mb-2'>Tu Perfil</p>
            <div className='flex items-center gap-4 bg-neutral-dark/40 rounded-lg p-4 border border-neutral-dark/50'>
                <div className='rounded-full w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xl font-bold border-2 border-primary/30'>
                  {(username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='text-sm font-semibold text-text-light truncate'>{username ?? 'Usuario'}</div>
                </div>
            </div>
        </div>

        {/* Navegación */}
        <nav className='px-5 pb-4 flex-1 mt-4'>
            <p className='text-text-light/60 text-xs uppercase tracking-wider mb-2 px-2'>Navegación</p>
            <div className='space-y-2'>
              {menuItems.map(item => (
                  <SidebarMenuItems key={item.path} {...item} />
              ))}
            </div>
        </nav>

        {/* Botón de cerrar sesión al final */}
        {onLogout && (
          <div className='p-5 pt-4 mt-auto border-t border-neutral-700/50'>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600/90 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
            >
              <IoLogOutOutline className="text-lg" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar;
