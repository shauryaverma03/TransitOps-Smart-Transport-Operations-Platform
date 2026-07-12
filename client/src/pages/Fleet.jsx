import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const Fleet = () => {
  const { hasRole } = useContext(AuthContext);
  const isManager = hasRole(['Fleet Manager']);
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    type: 'Heavy Duty',
    maxLoadCapacity: '',
    odometer: '',
    acquisitionCost: '',
    status: 'Available'
  });
  const [formError, setFormError] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const { data } = await api.get(`/vehicles?${params.toString()}`);
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search, statusFilter]);

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        odometer: vehicle.odometer,
        acquisitionCost: vehicle.acquisitionCost,
        status: vehicle.status
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        registrationNumber: '',
        name: '',
        type: 'Heavy Duty',
        maxLoadCapacity: '',
        odometer: '',
        acquisitionCost: '',
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
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle._id}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete vehicle');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Available': 'bg-status-available/20 text-status-available border-status-available/30',
      'On Trip': 'bg-status-ontrip/20 text-status-ontrip border-status-ontrip/30',
      'In Shop': 'bg-status-inshop/20 text-status-inshop border-status-inshop/30',
      'Retired': 'bg-status-retired/20 text-status-retired border-status-retired/30',
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
        <h2 className="text-2xl font-bold text-text-primary">Fleet Registry</h2>
        {isManager && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Vehicle
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name or reg number..."
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
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">Registration</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Capacity (kg)</th>
                <th className="px-6 py-4 font-medium">Odometer (km)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isManager && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">Loading fleet data...</td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">No vehicles found.</td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-surface-border/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{v.registrationNumber}</td>
                    <td className="px-6 py-4">{v.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{v.type}</td>
                    <td className="px-6 py-4">{v.maxLoadCapacity.toLocaleString()}</td>
                    <td className="px-6 py-4">{v.odometer.toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                    {isManager && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(v)}
                          className="text-primary hover:text-primary-hover p-1 mr-2"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="text-error hover:opacity-80 p-1"
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Registration Number</label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={e => setFormData({...formData, registrationNumber: e.target.value.toUpperCase()})}
              className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Name / Model</label>
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
              <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {['Heavy Duty', 'Light Commercial', 'Electric Van', 'Long Haul', 'Light Duty', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Capacity (kg)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.maxLoadCapacity}
                onChange={e => setFormData({...formData, maxLoadCapacity: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Odometer (km)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.odometer}
                onChange={e => setFormData({...formData, odometer: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Cost ($)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.acquisitionCost}
                onChange={e => setFormData({...formData, acquisitionCost: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fleet;
