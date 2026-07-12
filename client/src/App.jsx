import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Finance from './pages/Finance';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-full text-text-primary">
    <h2 className="text-3xl font-bold text-error mb-2">403</h2>
    <p>You don't have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              
              <Route element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Dispatcher']} />}>
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/trips" element={<Trips />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Dispatcher', 'Safety Officer']} />}>
                <Route path="/drivers" element={<Drivers />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['Fleet Manager']} />}>
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']} />}>
                <Route path="/finance" element={<Finance />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst', 'Safety Officer']} />}>
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
