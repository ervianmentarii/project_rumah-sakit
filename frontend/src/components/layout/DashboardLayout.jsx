import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-purple-700">RSIA Halim</h1>
          <button className="md:hidden text-slate-500 hover:text-slate-700 focus:outline-none" onClick={closeMobileMenu}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav 
          className="flex-1 px-4 py-4 space-y-1 overflow-y-auto"
          onClick={(e) => {
            if (e.target.closest('a')) closeMobileMenu();
          }}
        >
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-purple-700 bg-purple-50 transition-colors">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          {(user?.role === 'admin' || user?.role === 'resepsionis') && (
            <>
              <Link to="/patients" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Data Pasien
              </Link>
              <Link to="/queues" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Manajemen Antrian
              </Link>
            </>
          )}

          {(user?.role === 'admin' || user?.role === 'perawat') && (
            <Link to="/triage" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Triase Pemeriksaan
            </Link>
          )}

          {(user?.role === 'admin' || user?.role === 'dokter') && (
            <Link to="/doctor" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Dashboard Dokter
            </Link>
          )}

          {(user?.role === 'admin' || user?.role === 'kasir') && (
            <Link to="/cashier" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Kasir & Pembayaran
            </Link>
          )}

          {(user?.role === 'admin' || user?.role === 'apoteker') && (
            <>
              <Link to="/pharmacy" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Apotek & Resep
              </Link>
              <Link to="/pharmacy/medicines" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Stok Obat
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Admin Master
                </p>
              </div>
              <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Kelola Pengguna
              </Link>
              <Link to="/admin/tariffs" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Kelola Tarif
              </Link>
              <Link to="/admin/reports" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Laporan
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-purple-700 truncate">RSIA Halim</h1>
          </div>
          
          <div className="hidden md:block flex-1"></div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center sm:gap-1 text-right">
              <span className="font-semibold text-slate-900 truncate max-w-[120px] sm:max-w-[200px]">{user?.name}</span>
              <span className="text-slate-400 capitalize hidden sm:inline">({user?.role})</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs sm:text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100 flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
