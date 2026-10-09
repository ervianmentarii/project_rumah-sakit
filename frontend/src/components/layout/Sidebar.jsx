import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const getLinksByRole = (role) => {
    const defaultLinks = [{ name: 'Dashboard', path: '/' }];
    
    switch (role) {
      case 'admin':
        return [
          ...defaultLinks,
          { name: 'Users', path: '/admin/users' },
          { name: 'Tariffs', path: '/admin/tariffs' },
          { name: 'Reports', path: '/admin/reports' }
        ];
      case 'resepsionis':
        return [
          ...defaultLinks,
          { name: 'Patients', path: '/patients' },
          { name: 'Register Patient', path: '/patients/register' },
          { name: 'Queues', path: '/queues' },
          { name: 'Queue Display', path: '/queues/display' }
        ];
      case 'perawat':
        return [
          ...defaultLinks,
          { name: 'Triage', path: '/triage' }
        ];
      case 'dokter':
        return [
          ...defaultLinks,
          { name: 'Patient Queue', path: '/doctor' }
        ];
      case 'kasir':
        return [
          ...defaultLinks,
          { name: 'Transactions', path: '/cashier' }
        ];
      case 'apoteker':
        return [
          ...defaultLinks,
          { name: 'Prescriptions', path: '/pharmacy' },
          { name: 'Medicines', path: '/pharmacy/medicines' }
        ];
      default:
        return defaultLinks;
    }
  };

  const links = getLinksByRole(user?.role);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-clinic-primary">KlinikKu</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-clinic-primary text-white' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
