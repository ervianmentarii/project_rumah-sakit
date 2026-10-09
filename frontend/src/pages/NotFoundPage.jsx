import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-6xl font-bold text-clinic-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-clinic-primary text-white rounded-md hover:bg-clinic-secondary transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
