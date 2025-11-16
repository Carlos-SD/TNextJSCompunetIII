'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import React from 'react';

type BreadcrumbItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter((path) => path);
    
    if (pathname === '/dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard', icon: <FaHome /> }];
    }
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/dashboard', icon: <FaHome /> },
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      
      if (path.toLowerCase() === 'dashboard' && currentPath === '/dashboard') {
        return;
      }
      
      let label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const customLabels: Record<string, string> = {
        dashboard: 'Dashboard',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        events: 'Eventos',
        bets: 'Apuestas',
        profile: 'Perfil',
        'my-bets': 'Mis Apuestas',
      };

      if (customLabels[path.toLowerCase()]) {
        label = customLabels[path.toLowerCase()];
      }

      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="w-full bg-neutral-700/30 backdrop-blur-md border-b border-brand/20 px-4 py-3 relative z-40">
      <div className="w-full">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li key={breadcrumb.href} className="flex items-center">
                {!isFirst && (
                  <FaChevronRight className="text-neutral-400 mx-2 text-xs" />
                )}
                
                {isLast ? (
                  <span className="flex items-center gap-2 text-brand font-semibold">
                    {breadcrumb.icon && breadcrumb.icon}
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="flex items-center gap-2 text-neutral-300 hover:text-brand transition-colors duration-300 group"
                  >
                    {breadcrumb.icon && (
                      <span className="group-hover:scale-110 transition-transform duration-300">
                        {breadcrumb.icon}
                      </span>
                    )}
                    <span className="group-hover:underline">{breadcrumb.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

