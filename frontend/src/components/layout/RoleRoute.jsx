import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function RoleRoute({ allowedRoles, children }) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect or show 403. Using 404/NotFound is also common if we don't want a dedicated 403.
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-3xl font-bold text-slate-800">403 - Access Denied</h2>
        <p className="mt-2 text-slate-500">You don't have permission to view this page.</p>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
