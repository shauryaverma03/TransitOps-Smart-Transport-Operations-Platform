import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    depotName: '', currency: 'USD', distanceUnit: 'km'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/settings', settings);
      setSettings(data);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-text-muted py-10">Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-text-primary mb-6">System Settings</h2>
      
      <div className="bg-surface border border-surface-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Depot Name</label>
            <input 
              type="text" 
              required
              value={settings.depotName} 
              onChange={e => setSettings({...settings, depotName: e.target.value})}
              className="w-full px-4 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Currency</label>
              <select 
                value={settings.currency} 
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Distance Unit</label>
              <select 
                value={settings.distanceUnit} 
                onChange={e => setSettings({...settings, distanceUnit: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="km">Kilometers (km)</option>
                <option value="mi">Miles (mi)</option>
              </select>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm font-medium ${message.includes('success') ? 'bg-status-available/10 text-status-available' : 'bg-error/10 text-error'}`}>
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-surface-border flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-surface border border-surface-border rounded-lg p-6">
         <h3 className="text-lg font-medium text-text-primary mb-4 border-b border-surface-border pb-2">RBAC Matrix Reference</h3>
         <p className="text-sm text-text-secondary mb-4">Roles are enforced strictly at the API layer via JWT decoding.</p>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
                    <tr>
                        <th className="px-4 py-2 font-medium">Role</th>
                        <th className="px-4 py-2 font-medium text-center">Dashboard</th>
                        <th className="px-4 py-2 font-medium text-center">Fleet</th>
                        <th className="px-4 py-2 font-medium text-center">Drivers</th>
                        <th className="px-4 py-2 font-medium text-center">Trips</th>
                        <th className="px-4 py-2 font-medium text-center">Maintenance</th>
                        <th className="px-4 py-2 font-medium text-center">Finance</th>
                        <th className="px-4 py-2 font-medium text-center">Analytics</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-text-primary">
                    <tr><td className="px-4 py-3 font-medium">Fleet Manager</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td></tr>
                    <tr><td className="px-4 py-3 font-medium">Dispatcher</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td></tr>
                    <tr><td className="px-4 py-3 font-medium">Safety Officer</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-status-available">✓</td></tr>
                    <tr><td className="px-4 py-3 font-medium">Financial Analyst</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-text-muted">-</td><td className="px-4 py-3 text-center text-status-available">✓</td><td className="px-4 py-3 text-center text-status-available">✓</td></tr>
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Settings;
