import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Truck, Activity, Wrench, Users, Send, CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="glass-card p-4 h-28">
              <div className="h-4 w-20 skeleton mb-3" />
              <div className="h-8 w-16 skeleton" />
            </div>
          ))}
        </div>
        <div className="glass-card p-6 h-40 skeleton" />
      </div>
    );
  }

  if (!stats) return null;

  const { kpi, vehicleStatusDistribution: dist, recentTrips } = stats;

  const kpiCards = [
    { title: 'Total Vehicles', value: kpi.totalVehicles, icon: Truck, color: 'text-primary', bg: 'bg-primary/10', glow: 'badge-glow-blue' },
    { title: 'Active Vehicles', value: kpi.activeVehicles, icon: Activity, color: 'text-status-available', bg: 'bg-status-available/10', glow: 'badge-glow-green' },
    { title: 'In Shop', value: kpi.inMaintenanceVehicles, icon: Wrench, color: 'text-status-inshop', bg: 'bg-status-inshop/10', glow: 'badge-glow-orange' },
    { title: 'Drivers On Duty', value: kpi.driversOnDuty, icon: Users, color: 'text-primary', bg: 'bg-primary/10', glow: 'badge-glow-blue' },
    { title: 'Pending Trips', value: kpi.pendingTrips, icon: RotateCcw, color: 'text-text-secondary', bg: 'bg-surface-border', glow: '' },
    { title: 'Active Trips', value: kpi.activeTrips, icon: Send, color: 'text-status-ontrip', bg: 'bg-status-ontrip/10', glow: 'badge-glow-blue' },
    { title: 'Fleet Utilization', value: `${kpi.fleetUtilization}%`, icon: TrendingUp, color: 'text-status-available', bg: 'bg-status-available/10', glow: 'badge-glow-green' }
  ];

  const totalVehicles = kpi.totalVehicles || 1; // prevent divide by zero

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Dashboard Overview</h2>
          <p className="text-sm text-text-muted mt-1">Real-time fleet intelligence & operational metrics</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 stagger-children">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`glass-card hover-glow p-4 flex flex-col justify-between h-28 ${card.glow}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{card.title}</span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon size={18} className={card.color} />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown Bar */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Fleet Status Breakdown</h3>
        <div className="w-full h-6 flex rounded-full overflow-hidden bg-background">
          <div 
            style={{ width: `${(dist.available / totalVehicles) * 100}%` }} 
            className="bg-status-available h-full transition-all duration-700 ease-out" 
            title={`Available: ${dist.available}`} 
          />
          <div 
            style={{ width: `${(dist.onTrip / totalVehicles) * 100}%` }} 
            className="bg-status-ontrip h-full transition-all duration-700 ease-out" 
            title={`On Trip: ${dist.onTrip}`} 
          />
          <div 
            style={{ width: `${(dist.inShop / totalVehicles) * 100}%` }} 
            className="bg-status-inshop h-full transition-all duration-700 ease-out" 
            title={`In Shop: ${dist.inShop}`} 
          />
          <div 
            style={{ width: `${(dist.retired / totalVehicles) * 100}%` }} 
            className="bg-status-retired h-full transition-all duration-700 ease-out" 
            title={`Retired: ${dist.retired}`} 
          />
        </div>
        <div className="flex gap-6 mt-4 text-sm flex-wrap text-text-secondary">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-status-available mr-2 badge-glow-green"></span> Available ({dist.available})</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-status-ontrip mr-2 badge-glow-blue"></span> On Trip ({dist.onTrip})</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-status-inshop mr-2 badge-glow-orange"></span> In Shop ({dist.inShop})</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-status-retired mr-2 badge-glow-red"></span> Retired ({dist.retired})</div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
          <h3 className="text-base font-semibold text-text-primary">Recent Trips</h3>
          <span className="text-xs text-text-muted font-mono">{recentTrips.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background/50 text-text-muted border-b border-surface-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Trip Ref</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-text-primary">
              {recentTrips.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-text-muted">No recent trips.</td></tr>
              ) : (
                recentTrips.map(trip => (
                  <tr key={trip._id} className="table-row-hover">
                    <td className="px-6 py-3.5 font-mono font-semibold text-primary">{trip.tripId}</td>
                    <td className="px-6 py-3.5">{trip.source} → {trip.destination}</td>
                    <td className="px-6 py-3.5">{trip.driver?.name || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${
                        trip.status === 'Completed' ? 'bg-status-available/15 text-status-available border-status-available/20 badge-glow-green' :
                        trip.status === 'Dispatched' ? 'bg-status-ontrip/15 text-status-ontrip border-status-ontrip/20 badge-glow-blue' :
                        'bg-surface-border text-text-secondary border-surface-border'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-text-muted text-xs">{format(new Date(trip.updatedAt), 'MMM dd, HH:mm')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
