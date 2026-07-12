import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Truck } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl shadow-primary/20 mb-4 animate-pulse">
          <Truck size={24} className="text-background" />
        </div>
        <div className="text-text-muted text-sm font-medium">Loading TransitOps...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
