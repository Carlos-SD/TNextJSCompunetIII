'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronRight } from 'react-icons/fa';

export default function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter((path) => path);
    
    const breadcrumbs = [
      { label: 'Inicio', href: '/', icon: <FaHome /> },
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      
      // Format the path label (capitalize and replace hyphens)
      let label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Custom labels for specific routes
      const customLabels: Record<string, string> = {
        dashboard: 'Dashboard',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        events: 'Eventos',
        bets: 'Apuestas',
        profile: 'Perfil',
      };

      if (customLabels[path.toLowerCase()]) {
        label = customLabels[path.toLowerCase()];
      }

      breadcrumbs.push({ label, href: currentPath, icon: null });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-neutral-700/30 backdrop-blur-md border-b border-brand/20 px-4 py-3">
      <div className="max-w-7xl mx-auto">
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
                    {breadcrumb.icon}
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

