import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Truck, Activity, Wrench, Users, Send, CheckCircle2, RotateCcw } from 'lucide-react';
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
    return <div className="text-text-muted text-center py-10">Loading dashboard...</div>;
  }

  if (!stats) return null;

  const { kpi, vehicleStatusDistribution: dist, recentTrips } = stats;

  const kpiCards = [
    { title: 'Total Vehicles', value: kpi.totalVehicles, icon: <Truck size={24} className="text-primary" />, bg: 'bg-primary/10' },
    { title: 'Active Vehicles', value: kpi.activeVehicles, icon: <Activity size={24} className="text-status-available" />, bg: 'bg-status-available/10' },
    { title: 'In Shop', value: kpi.inMaintenanceVehicles, icon: <Wrench size={24} className="text-status-inshop" />, bg: 'bg-status-inshop/10' },
    { title: 'Drivers On Duty', value: kpi.driversOnDuty, icon: <Users size={24} className="text-primary" />, bg: 'bg-primary/10' },
    { title: 'Pending Trips', value: kpi.pendingTrips, icon: <RotateCcw size={24} className="text-text-secondary" />, bg: 'bg-surface-border' },
    { title: 'Active Trips', value: kpi.activeTrips, icon: <Send size={24} className="text-status-ontrip" />, bg: 'bg-status-ontrip/10' },
    { title: 'Fleet Utilization', value: `${kpi.fleetUtilization}%`, icon: <CheckCircle2 size={24} className="text-status-available" />, bg: 'bg-status-available/10' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Dashboard Overview</h2>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-lg p-4 flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-text-secondary">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
            </div>
            <div className="text-2xl font-bold text-text-primary">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Status Breakdown Bar */}
      <div className="bg-surface border border-surface-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Fleet Status Breakdown</h3>
        <div className="w-full h-8 flex rounded-md overflow-hidden bg-surface-border">
          <div 
            style={{ width: `${(dist.available / kpi.totalVehicles) * 100 || 0}%` }} 
            className="bg-status-available h-full transition-all duration-500 hover:brightness-110" 
            title={`Available: ${dist.available}`} 
          />
          <div 
            style={{ width: `${(dist.onTrip / kpi.totalVehicles) * 100 || 0}%` }} 
            className="bg-status-ontrip h-full transition-all duration-500 hover:brightness-110" 
            title={`On Trip: ${dist.onTrip}`} 
          />
          <div 
            style={{ width: `${(dist.inShop / kpi.totalVehicles) * 100 || 0}%` }} 
            className="bg-status-inshop h-full transition-all duration-500 hover:brightness-110" 
            title={`In Shop: ${dist.inShop}`} 
          />
          <div 
            style={{ width: `${(dist.retired / kpi.totalVehicles) * 100 || 0}%` }} 
            className="bg-status-retired h-full transition-all duration-500 hover:brightness-110" 
            title={`Retired: ${dist.retired}`} 
          />
        </div>
        <div className="flex gap-6 mt-4 text-sm flex-wrap">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-available mr-2"></span> Available ({dist.available})</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-ontrip mr-2"></span> On Trip ({dist.onTrip})</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-inshop mr-2"></span> In Shop ({dist.inShop})</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-status-retired mr-2"></span> Retired ({dist.retired})</div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
          <h3 className="text-lg font-medium text-text-primary">Recent Trips</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">Trip Ref</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {recentTrips.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No recent trips.</td></tr>
              ) : (
                recentTrips.map(trip => (
                  <tr key={trip._id} className="hover:bg-surface-border/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{trip.tripId}</td>
                    <td className="px-6 py-4">{trip.source} → {trip.destination}</td>
                    <td className="px-6 py-4">{trip.driver?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${
                        trip.status === 'Completed' ? 'bg-status-available/20 text-status-available border-status-available/30' :
                        trip.status === 'Dispatched' ? 'bg-status-ontrip/20 text-status-ontrip border-status-ontrip/30' :
                        'bg-surface-border text-text-secondary border-surface-border'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{format(new Date(trip.updatedAt), 'MMM dd, HH:mm')}</td>
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
