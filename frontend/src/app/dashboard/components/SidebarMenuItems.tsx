"use client";

import React from 'react';
import { MenuItems } from '../../interfaces/menu-items.interface';

export const SidebarMenuItems = ({ path, icon, title, subtitle }: MenuItems) => {
    return (
        <a href={path}
            className='group w-full px-4 py-4 inline-flex space-x-4 items-center rounded-xl bg-neutral-dark/40 hover:bg-neutral-dark/70 border border-neutral-700/50 hover:border-primary/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10'
        >
                <div className='text-2xl text-primary group-hover:scale-110 transition-transform duration-200 flex-shrink-0'>
                    {icon}
                </div>
                <div className='flex flex-col flex-1'>
                    <span className='text-base font-bold text-text-light group-hover:text-primary leading-5 transition-colors'>{title}</span>
                    {subtitle && <span className='text-xs text-text-light/60 mt-1'>{subtitle}</span>}
                </div>
                <div className='text-text-light/40 group-hover:text-primary transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
        </a>
    )
}
