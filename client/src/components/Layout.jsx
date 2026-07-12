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
  Menu,
  ChevronRight
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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Fleet', path: '/fleet', icon: Truck, roles: ['Fleet Manager', 'Dispatcher'] },
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { name: 'Trips', path: '/trips', icon: Map, roles: ['Fleet Manager', 'Dispatcher'] },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Fleet Manager'] },
    { name: 'Fuel & Expenses', path: '/finance', icon: Fuel, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst', 'Safety Officer'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Fleet Manager'] },
  ];

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Role color mapping
  const getRoleColor = (role) => {
    const colors = {
      'Fleet Manager': 'bg-primary/20 text-primary',
      'Dispatcher': 'bg-status-ontrip/20 text-status-ontrip',
      'Safety Officer': 'bg-status-inshop/20 text-status-inshop',
      'Financial Analyst': 'bg-status-available/20 text-status-available',
    };
    return colors[role] || 'bg-surface-border text-text-muted';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-surface/60 backdrop-blur-xl border-r border-surface-border flex flex-col hidden md:flex text-text-primary relative">
        {/* Subtle gradient overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
            <Truck className="text-background" size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">TransitOps</h1>
          </div>
        </div>
        
        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative z-10">
          {navItems.filter(item => hasRole(item.roles)).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                             (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-text-secondary hover:bg-surface-border/60 hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <Icon size={18} className={`${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'} transition-colors`} />
                <span className="ml-3 font-medium text-sm">{item.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-primary/50" />}
              </Link>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-surface-border relative z-10">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-background/40">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 ring-2 ring-primary/20">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${getRoleColor(user?.role)}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-text-muted hover:text-error hover:bg-error/5 rounded-lg transition-all duration-200"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Mobile) */}
        <header className="h-16 bg-surface/60 backdrop-blur-xl border-b border-surface-border flex items-center px-4 md:hidden">
          <button className="text-text-secondary hover:text-text-primary p-2 -ml-2 mr-2">
            <Menu size={24} />
          </button>
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mr-2">
            <Truck className="text-background" size={14} />
          </div>
          <h1 className="text-lg font-bold text-text-primary">TransitOps</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
