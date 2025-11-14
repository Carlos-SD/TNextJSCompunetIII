"use client";

import React from 'react';
import { IoWalletOutline } from 'react-icons/io5';
import { SidebarMenuItems } from './SidebarMenuItems';

export const Sidebar = ({ username, balance } : { username?: string; balance?: number | string }) => {
  const menuItems = [
    {
      path: '/dashboard/my-bets',
      icon: <IoWalletOutline/>,
      title: 'Ver mis apuestas',
      subtitle: 'Historial de mis apuestas'
    }
  ];

  return (
    <aside className='w-64 bg-neutral-medium text-text-light rounded-md p-4 overflow-y-auto'>
        <div className='mb-6'>
            <h1 className='text-lg md:text-2xl font-bold text-white'>Tu Apuestas</h1>
            <p className='text-slate-400 text-sm'>Panel rápido</p>
        </div>

        <div className='px-1 py-4 mb-6'>
            <p className='text-slate-400 text-sm'>Bienvenido,</p>
            <div className='inline-flex items-center space-x-3 mt-3'>
                <span className='rounded-full w-10 h-10 bg-neutral-dark flex items-center justify-center text-white'>{(username || 'U').charAt(0).toUpperCase()}</span>
                <div>
                    <div className='text-sm font-semibold'>{username ?? 'Usuario'}</div>
                    <div className='text-xs text-slate-400'>Saldo: {balance ?? '0'}</div>
                </div>
            </div>
        </div>

        <nav className='w-full'>
            {menuItems.map(item => (
                <SidebarMenuItems key={item.path} {...item} />
            ))}
        </nav>
    </aside>
  )
}

export default Sidebar;
