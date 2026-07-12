import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

const Layout = () => {
  const { user, logout, hasRole } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Fleet', path: '/fleet', icon: <Truck size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
    { name: 'Drivers', path: '/drivers', icon: <Users size={20} />, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { name: 'Trips', path: '/trips', icon: <Map size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: ['Fleet Manager'] },
    { name: 'Fuel & Expenses', path: '/finance', icon: <Fuel size={20} />, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['Fleet Manager', 'Financial Analyst', 'Safety Officer'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['Fleet Manager'] },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-surface-border flex flex-col hidden md:flex text-text-primary">
        <div className="h-16 flex items-center px-6 border-b border-surface-border">
          <Truck className="text-primary mr-3" size={24} />
          <h1 className="text-xl font-bold">TransitOps</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.filter(item => hasRole(item.roles)).map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-surface-border hover:text-text-primary'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Mobile) */}
        <header className="h-16 bg-surface border-b border-surface-border flex items-center px-4 md:hidden">
          <button className="text-text-secondary hover:text-text-primary p-2 -ml-2 mr-2">
            <Menu size={24} />
          </button>
          <Truck className="text-primary mr-2" size={20} />
          <h1 className="text-lg font-bold text-text-primary">TransitOps</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
