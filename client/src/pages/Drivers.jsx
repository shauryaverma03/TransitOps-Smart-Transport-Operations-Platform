import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Drivers = () => {
  const { hasRole } = useContext(AuthContext);
  const canManage = hasRole(['Dispatcher', 'Safety Officer']);
  const canDelete = hasRole(['Safety Officer']);
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'Class A',
    licenseExpiry: '',
    contact: '',
    status: 'Available'
  });
  const [formError, setFormError] = useState('');

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const { data } = await api.get(`/drivers?${params.toString()}`);
      setDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, statusFilter]);

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        // Format date to YYYY-MM-DD for input type="date"
        licenseExpiry: new Date(driver.licenseExpiry).toISOString().split('T')[0],
        contact: driver.contact,
        status: driver.status
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'Class A',
        licenseExpiry: '',
        contact: '',
        status: 'Available'
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingDriver) {
        await api.put(`/drivers/${editingDriver._id}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete driver');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Available': 'bg-status-available/20 text-status-available border-status-available/30',
      'On Trip': 'bg-status-ontrip/20 text-status-ontrip border-status-ontrip/30',
      'Off Duty': 'bg-surface-border text-text-secondary border-surface-border',
      'Suspended': 'bg-status-retired/20 text-status-retired border-status-retired/30',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Drivers Registry</h2>
        {canManage && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Driver
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">License No.</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium">Completion Rate</th>
                <th className="px-6 py-4 font-medium">Safety Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {canManage && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-muted">Loading driver data...</td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-muted">No drivers found.</td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d._id} className="hover:bg-surface-border/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{d.name}</td>
                    <td className="px-6 py-4 font-mono">{d.licenseNumber}</td>
                    <td className="px-6 py-4 text-text-secondary">{d.licenseCategory}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {d.isLicenseExpired && <AlertTriangle size={14} className="text-error mr-1" />}
                        <span className={d.isLicenseExpired ? 'text-error font-medium' : ''}>
                          {format(new Date(d.licenseExpiry), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-surface-border rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${d.tripCompletionRate}%` }}
                          />
                        </div>
                        {d.tripCompletionRate}%
                      </div>
                    </td>
                    <td className="px-6 py-4">{d.safetyScore}/100</td>
                    <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(d)}
                          className="text-primary hover:text-primary-hover p-1 mr-2"
                        >
                          <Edit2 size={16} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="text-error hover:opacity-80 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver' : 'Add Driver'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">License No.</label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={e => setFormData({...formData, licenseNumber: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select
                value={formData.licenseCategory}
                onChange={e => setFormData({...formData, licenseCategory: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {['Class A', 'Class B', 'Class C', 'Commercial'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.licenseExpiry}
                onChange={e => setFormData({...formData, licenseExpiry: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Contact No.</label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          
          {formError && (
            <div className="text-error text-sm p-2 bg-error/10 rounded border border-error/20">
              {formError}
            </div>
          )}
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium transition-colors"
            >
              {editingDriver ? 'Update Driver' : 'Add Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Drivers;
