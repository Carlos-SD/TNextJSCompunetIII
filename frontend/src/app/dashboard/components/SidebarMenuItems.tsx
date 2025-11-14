"use client";

import React from 'react';
import { MenuItems } from '../../interfaces/menu-items.interface';

export const SidebarMenuItems = ({ path, icon, title, subtitle }: MenuItems) => {
    return (
        <a href={path}
            className='w-full px-2 inline-flex space-x-4 items-center border-b border-slate-700 py-3'
        >
                <div className='text-xl text-brand'>
                    {icon}
                </div>
                <div className='flex flex-col'>
                    <span className='text-lg font-bold text-brand leading-5'>{title}</span>
                    {subtitle && <span className='text-sm text-brand/70 hidden md:block'>{subtitle}</span>}
                </div>
        </a>
    )
}
