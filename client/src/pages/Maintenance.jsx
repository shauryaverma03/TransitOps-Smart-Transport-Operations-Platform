import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Maintenance = () => {
  const { hasRole } = useContext(AuthContext);
  const isManager = hasRole(['Fleet Manager']); // Only FM manages maintenance
  
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '', serviceType: '', cost: '', date: new Date().toISOString().split('T')[0], notes: ''
  });
  const [formError, setFormError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/maintenance');
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch maintenance logs', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      // FM needs to see all vehicles except maybe retired ones, or at least not on trip ones. 
      // API allows any, but let's just fetch all available or in shop
      const { data } = await api.get('/vehicles');
      // Filter out 'On Trip' and 'Retired' to prevent errors during creation
      setVehicles(data.filter(v => v.status === 'Available' || v.status === 'In Shop'));
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/maintenance', formData);
      setIsModalOpen(false);
      fetchLogs();
      fetchVehicles();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create log');
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm('Mark this maintenance as resolved? Vehicle will become Available.')) return;
    try {
      await api.put(`/maintenance/${id}/resolve`);
      fetchLogs();
      fetchVehicles();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resolve maintenance');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this maintenance log permanently?')) return;
    try {
      await api.delete(`/maintenance/${id}`);
      fetchLogs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete log');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? (
      <span className="px-2 py-1 text-xs font-medium border rounded-full bg-status-inshop/20 text-status-inshop border-status-inshop/30">Active</span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium border rounded-full bg-status-available/20 text-status-available border-status-available/30">Resolved</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Maintenance Log</h2>
        {isManager && (
          <button
            onClick={() => {
              setFormData({ vehicle: '', serviceType: '', cost: '', date: new Date().toISOString().split('T')[0], notes: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Report Issue
          </button>
        )}
      </div>

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Service Type</th>
                <th className="px-6 py-4 font-medium">Cost ($)</th>
                <th className="px-6 py-4 font-medium">Notes</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isManager && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-text-muted">Loading maintenance data...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-text-muted">No maintenance logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-border/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">{log.vehicle?.registrationNumber || 'Unknown'}</td>
                    <td className="px-6 py-4 text-text-secondary">{log.serviceType}</td>
                    <td className="px-6 py-4">${log.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-text-secondary truncate max-w-[200px]">{log.notes || '-'}</td>
                    <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                    {isManager && (
                      <td className="px-6 py-4 text-right space-x-2">
                        {log.status === 'Active' && (
                          <button
                            onClick={() => handleResolve(log._id)}
                            title="Mark Resolved"
                            className="text-status-available hover:opacity-80 p-1 bg-status-available/10 rounded mr-2"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(log._id)}
                          title="Delete Record"
                          className="text-error hover:opacity-80 p-1 bg-error/10 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Maintenance Issue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Vehicle</label>
            <select required value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Select Vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Service Type</label>
              <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select Type...</option>
                <option value="Preventative">Preventative</option>
                <option value="Repair">Repair</option>
                <option value="Tire Replacement">Tire Replacement</option>
                <option value="Engine/Transmission">Engine/Transmission</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Estimated Cost ($)</label>
            <input type="number" required min="0" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
            <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Describe the issue..."></textarea>
          </div>
          
          {formError && (
            <div className="text-error text-sm p-2 bg-error/10 rounded border border-error/20">
              {formError}
            </div>
          )}
          
          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium">Create Log</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Maintenance;
