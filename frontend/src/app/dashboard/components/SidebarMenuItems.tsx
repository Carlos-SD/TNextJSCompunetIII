"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { MenuItems } from '../../interfaces/menu-items.interface';

export const SidebarMenuItems = ({ path, icon, title, subtitle }: MenuItems) => {
    const pathname = usePathname();
    const isActive = pathname === path;
    
    return (
        <a 
            href={path}
            className={`w-full px-4 py-3 inline-flex gap-3 items-center rounded-lg mb-2 transition-all group ${
                isActive 
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' 
                    : 'text-text-light/70 hover:bg-neutral-dark/40 hover:text-text-light border border-transparent hover:border-neutral-dark/50'
            }`}
        >
            <div className={`text-xl transition-colors ${isActive ? 'text-primary' : 'text-text-light/60 group-hover:text-primary'}`}>
                {icon}
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
                <span className={`font-semibold leading-5 transition-colors ${isActive ? 'text-primary' : 'text-text-light group-hover:text-text-light'}`}>
                    {title}
                </span>
                {subtitle && (
                    <span className={`text-xs leading-4 mt-0.5 transition-colors ${
                        isActive ? 'text-primary/70' : 'text-text-light/50 group-hover:text-text-light/70'
                    }`}>
                        {subtitle}
                    </span>
                )}
            </div>
        </a>
    )
}
