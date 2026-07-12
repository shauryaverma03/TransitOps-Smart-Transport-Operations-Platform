import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { Truck, Shield, ArrowRight, Zap } from 'lucide-react';

const ROLES = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const ROLE_META = {
  'Fleet Manager': { icon: Truck, color: 'from-primary/20 to-primary/5', accent: 'text-primary', desc: 'Full system access' },
  'Dispatcher': { icon: Zap, color: 'from-status-ontrip/20 to-status-ontrip/5', accent: 'text-status-ontrip', desc: 'Trips & Fleet' },
  'Safety Officer': { icon: Shield, color: 'from-status-inshop/20 to-status-inshop/5', accent: 'text-status-inshop', desc: 'Drivers & Compliance' },
  'Financial Analyst': { icon: ArrowRight, color: 'from-status-available/20 to-status-available/5', accent: 'text-status-available', desc: 'Finance & Analytics' },
};

const Login = () => {
  const [email, setEmail] = useState('fleet@transitops.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Fleet Manager');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDemoFill = (demoRole) => {
    setRole(demoRole);
    setPassword('password123');
    switch (demoRole) {
      case 'Fleet Manager': setEmail('fleet@transitops.com'); break;
      case 'Dispatcher': setEmail('dispatch@transitops.com'); break;
      case 'Safety Officer': setEmail('safety@transitops.com'); break;
      case 'Financial Analyst': setEmail('finance@transitops.com'); break;
      default: break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/login', { email, password, role });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-status-inshop/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl shadow-primary/20">
            <Truck size={28} className="text-background" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          TransitOps
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Smart Transport Operations Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-6 sm:px-10">
          {/* Gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2.5 border border-surface-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2.5 border border-surface-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2.5 border border-surface-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>

            {error && (
              <div className="text-error text-sm text-center bg-error/10 p-3 rounded-lg border border-error/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-background bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface text-text-muted uppercase tracking-wider font-semibold">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {ROLES.map(demoRole => {
                const meta = ROLE_META[demoRole];
                const Icon = meta.icon;
                return (
                  <button
                    key={demoRole}
                    type="button"
                    onClick={() => handleDemoFill(demoRole)}
                    className={`group relative overflow-hidden w-full flex items-center py-2.5 px-3 border border-surface-border rounded-lg bg-background text-xs font-medium text-text-secondary hover:text-text-primary hover:border-surface-border transition-all duration-200 ${role === demoRole ? 'ring-1 ring-primary border-primary/30' : ''}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${meta.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <Icon size={14} className={`mr-2 relative z-10 ${meta.accent}`} />
                    <span className="relative z-10">{demoRole}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
