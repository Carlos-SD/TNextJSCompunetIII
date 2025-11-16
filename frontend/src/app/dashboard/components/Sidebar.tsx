"use client";

import React, { useState } from 'react';
import { IoWalletOutline } from 'react-icons/io5';
import { SidebarMenuItems } from './SidebarMenuItems';

export const Sidebar = ({ username, balance } : { username?: string; balance?: number | string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      path: '/dashboard/my-bets',
      icon: <IoWalletOutline/>,
      title: 'Ver mis apuestas',
      subtitle: 'Historial de mis apuestas'
    }
  ];

  return (
    <>
      {/* Botón para abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-6 top-32 z-50 w-10 h-10 bg-neutral-medium border border-neutral-700 rounded-lg flex items-center justify-center text-text-light hover:bg-neutral-medium/80 transition-all duration-300 ${isOpen ? 'translate-x-[288px]' : ''}`}
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
      <aside className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-neutral-medium to-neutral-medium/90 text-text-light p-6 overflow-y-auto border-r border-neutral-700/50 shadow-xl transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Navigation */}
        <nav className='w-full space-y-2 mt-32'>
            {menuItems.map(item => (
                <SidebarMenuItems key={item.path} {...item} />
            ))}
        </nav>
      </aside>

      {/* Overlay cuando está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar;
