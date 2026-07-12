import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, XCircle, Send, CheckCircle2, Search, AlertTriangle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Trips = () => {
  const { hasRole } = useContext(AuthContext);
  const isDispatcher = hasRole(['Dispatcher']);
  const isManager = hasRole(['Fleet Manager']);
  const canManage = isDispatcher; // Only dispatcher manages trips according to RBAC matrix (though FM can view)
  
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({
    vehicle: '', driver: '', source: '', destination: '', cargoWeight: '', plannedDistance: '', revenue: ''
  });
  const [createError, setCreateError] = useState('');

  // Complete Cascade Modal
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [completeStep, setCompleteStep] = useState(1);
  const [completeData, setCompleteData] = useState({
    finalOdometer: '',
    liters: '', fuelCost: '',
    toll: '0', maintenanceCost: '0', other: '0'
  });
  const [completeError, setCompleteError] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const { data } = await api.get(`/trips?${params.toString()}`);
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [vRes, dRes] = await Promise.all([
        api.get('/vehicles/available'),
        api.get('/drivers/available')
      ]);
      setVehicles(vRes.data);
      setDrivers(dRes.data);
    } catch (error) {
      console.error('Failed to fetch dependencies', error);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDependencies();
  }, [search]);

  // Create & Dispatch
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      await api.post('/trips', createData);
      setIsCreateOpen(false);
      fetchTrips();
      fetchDependencies();
    } catch (error) {
      setCreateError(error.response?.data?.message || 'Failed to create trip');
    }
  };

  const handleDispatch = async (tripId) => {
    if (!window.confirm('Dispatch this trip? Vehicle and driver status will change to On Trip.')) return;
    try {
      await api.put(`/trips/${tripId}/dispatch`);
      fetchTrips();
      fetchDependencies();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to dispatch trip');
    }
  };

  const handleCancel = async (tripId) => {
    if (!window.confirm('Cancel this trip? Any allocated resources will be released.')) return;
    try {
      await api.put(`/trips/${tripId}/cancel`);
      fetchTrips();
      fetchDependencies();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel trip');
    }
  };

  // Completion Cascade
  const startCompletion = (trip) => {
    setActiveTrip(trip);
    setCompleteStep(trip.completionStep === 0 ? 1 : trip.completionStep + 1);
    setCompleteData({
      finalOdometer: trip.vehicle.odometer, // default to current
      liters: '', fuelCost: '',
      toll: '0', maintenanceCost: '0', other: '0'
    });
    setCompleteError('');
    setIsCompleteOpen(true);
  };

  const submitCompleteStep = async (e) => {
    e.preventDefault();
    setCompleteError('');
    try {
      if (completeStep === 1) {
        await api.put(`/trips/${activeTrip._id}/complete`, { finalOdometer: completeData.finalOdometer });
        setCompleteStep(2);
      } else if (completeStep === 2) {
        await api.put(`/trips/${activeTrip._id}/fuel`, { liters: completeData.liters, cost: completeData.fuelCost });
        setCompleteStep(3);
      } else if (completeStep === 3) {
        await api.put(`/trips/${activeTrip._id}/expenses`, { 
          toll: completeData.toll, 
          maintenanceCost: completeData.maintenanceCost, 
          other: completeData.other 
        });
        setIsCompleteOpen(false);
        fetchTrips();
        fetchDependencies();
      }
    } catch (error) {
      setCompleteError(error.response?.data?.message || `Failed at step ${completeStep}`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Draft': 'bg-surface-border text-text-secondary border-surface-border',
      'Dispatched': 'bg-status-ontrip/15 text-status-ontrip border-status-ontrip/20 badge-glow-blue',
      'Completed': 'bg-status-available/15 text-status-available border-status-available/20 badge-glow-green',
      'Cancelled': 'bg-status-retired/15 text-status-retired border-status-retired/20 badge-glow-red',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const selectedVehicle = vehicles.find(v => v._id === createData.vehicle);
  const capacityExcess = selectedVehicle && createData.cargoWeight 
    ? Number(createData.cargoWeight) - selectedVehicle.maxLoadCapacity 
    : 0;
  const isOverCapacity = capacityExcess > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Trip Management</h2>
          <p className="text-sm text-text-muted mt-1">Create, dispatch, and complete freight operations</p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              setCreateData({ vehicle: '', driver: '', source: '', destination: '', cargoWeight: '', plannedDistance: '', revenue: '' });
              setIsCreateOpen(true);
            }}
            className="flex items-center px-4 py-2.5 bg-primary text-background rounded-lg hover:bg-primary-hover font-semibold transition-all duration-200 shadow-lg shadow-primary/20 text-sm"
          >
            <Plus size={16} className="mr-2" />
            Create Trip
          </button>
        )}
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background/50 text-text-muted border-b border-surface-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Trip ID</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Vehicle / Driver</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Load / Dist.</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
                {canManage && <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-text-primary">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading trips...</td></tr>
              ) : trips.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">No trips found.</td></tr>
              ) : (
                trips.map((t) => (
                  <tr key={t._id} className="table-row-hover">
                    <td className="px-6 py-4 font-mono font-medium">{t.tripId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span>{t.source}</span>
                        <ArrowRight size={14} className="mx-2 text-text-muted" />
                        <span>{t.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{t.vehicle?.registrationNumber || 'Unassigned'}</div>
                      <div className="text-xs text-text-muted">{t.driver?.name || 'Unassigned'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{t.cargoWeight} kg</div>
                      <div className="text-xs text-text-muted">{t.plannedDistance} km</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                    {canManage && (
                      <td className="px-6 py-4 text-right space-x-2">
                        {t.status === 'Draft' && (
                          <>
                            <button
                              onClick={() => handleDispatch(t._id)}
                              title="Dispatch Trip"
                              className="text-primary hover:text-primary-hover p-1 bg-primary/10 rounded"
                            >
                              <Send size={16} />
                            </button>
                            <button
                              onClick={() => handleCancel(t._id)}
                              title="Cancel Trip"
                              className="text-error hover:opacity-80 p-1 bg-error/10 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {t.status === 'Dispatched' && (
                          <>
                            <button
                              onClick={() => startCompletion(t)}
                              title="Complete Trip"
                              className="text-status-available hover:opacity-80 p-1 bg-status-available/10 rounded mr-2"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() => handleCancel(t._id)}
                              title="Cancel Trip"
                              className="text-error hover:opacity-80 p-1 bg-error/10 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
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

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Trip">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Source</label>
              <input type="text" required value={createData.source} onChange={e => setCreateData({...createData, source: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Destination</label>
              <input type="text" required value={createData.destination} onChange={e => setCreateData({...createData, destination: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Vehicle (Available Only)</label>
            <select required value={createData.vehicle} onChange={e => setCreateData({...createData, vehicle: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Select Vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name} (Max: {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Driver (Available Only)</label>
            <select required value={createData.driver} onChange={e => setCreateData({...createData, driver: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Select Driver...</option>
              {drivers.map(d => (
                <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Cargo (kg)</label>
              <input type="number" required min="1" value={createData.cargoWeight} onChange={e => setCreateData({...createData, cargoWeight: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Dist. (km)</label>
              <input type="number" required min="1" value={createData.plannedDistance} onChange={e => setCreateData({...createData, plannedDistance: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Revenue ($)</label>
              <input type="number" required min="0" value={createData.revenue} onChange={e => setCreateData({...createData, revenue: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          
          {isOverCapacity && (
            <div className="text-error text-sm p-2 bg-error/10 rounded border border-error/20 flex items-center mt-2">
              <AlertTriangle size={16} className="mr-2" /> Capacity exceeded by {capacityExcess} kg — dispatch blocked. Vehicle max: {selectedVehicle.maxLoadCapacity} kg, Cargo: {createData.cargoWeight} kg
            </div>
          )}
          {createError && (
            <div className="text-error text-sm p-2 bg-error/10 rounded border border-error/20 flex items-center">
              <AlertTriangle size={16} className="mr-2" /> {createError}
            </div>
          )}
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" disabled={isOverCapacity} className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed">Create Trip</button>
          </div>
        </form>
      </Modal>

      {/* COMPLETION WIZARD MODAL */}
      <Modal isOpen={isCompleteOpen} onClose={() => setIsCompleteOpen(false)} title={`Complete Trip: ${activeTrip?.tripId}`}>
        <div className="mb-6 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-border -z-10" />
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 border-surface transition-colors ${
              completeStep > step ? 'bg-status-available text-background' :
              completeStep === step ? 'bg-primary text-background' : 'bg-surface-border text-text-muted'
            }`}>
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={submitCompleteStep} className="space-y-4">
          {completeStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h4 className="font-medium text-text-primary mb-4 text-lg">Step 1: Odometer Reading</h4>
              <p className="text-sm text-text-secondary mb-4">Current vehicle odometer: <strong className="text-primary">{activeTrip?.vehicle?.odometer}</strong> km</p>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Final Odometer (km)</label>
                <input type="number" required min={activeTrip?.vehicle?.odometer} value={completeData.finalOdometer} onChange={e => setCompleteData({...completeData, finalOdometer: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          )}

          {completeStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h4 className="font-medium text-text-primary mb-4 text-lg">Step 2: Fuel Log</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fuel Used (Liters)</label>
                  <input type="number" required min="0.1" step="0.1" value={completeData.liters} onChange={e => setCompleteData({...completeData, liters: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fuel Cost ($)</label>
                  <input type="number" required min="0.01" step="0.01" value={completeData.fuelCost} onChange={e => setCompleteData({...completeData, fuelCost: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          )}

          {completeStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h4 className="font-medium text-text-primary mb-4 text-lg">Step 3: Trip Expenses</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Toll Fees ($)</label>
                  <input type="number" required min="0" step="0.01" value={completeData.toll} onChange={e => setCompleteData({...completeData, toll: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Maintenance on Trip ($)</label>
                  <input type="number" required min="0" step="0.01" value={completeData.maintenanceCost} onChange={e => setCompleteData({...completeData, maintenanceCost: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Other Expenses ($)</label>
                  <input type="number" required min="0" step="0.01" value={completeData.other} onChange={e => setCompleteData({...completeData, other: e.target.value})} className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          )}
          
          {completeError && (
            <div className="text-error text-sm p-2 bg-error/10 rounded border border-error/20 flex items-center mt-4">
              <AlertTriangle size={16} className="mr-2" /> {completeError}
            </div>
          )}
          
          <div className="pt-6 flex justify-end gap-3 border-t border-surface-border mt-6">
            <button type="button" onClick={() => setIsCompleteOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-hover font-medium">
              {completeStep === 3 ? 'Finalize Trip' : 'Next Step'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Trips;
