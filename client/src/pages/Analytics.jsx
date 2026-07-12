import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Download } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import Papa from 'papaparse';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/summary');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/analytics/export/csv');
      const { trips } = res.data;
      
      const csvData = trips.map(t => ({
        TripID: t.tripId,
        Vehicle: t.vehicle?.registrationNumber,
        Driver: t.driver?.name,
        Source: t.source,
        Destination: t.destination,
        Distance: t.plannedDistance,
        Revenue: t.revenue,
        Status: t.status
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `transitops_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('CSV export failed', error);
      alert('Failed to export CSV');
    }
  };

  if (loading) return <div className="text-text-muted text-center py-10">Loading analytics...</div>;
  if (!data) return null;

  const { summary, monthlyRevenue, vehicleROI, topCostlyVehicles } = data;

  // Custom Tooltip for dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-surface-border p-3 rounded-lg shadow-xl">
          <p className="text-text-primary font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.name === 'Revenue' || entry.name.includes('Cost') ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Analytics & ROI</h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 bg-surface text-primary border border-surface-border rounded-md hover:bg-surface-border font-medium transition-colors"
        >
          <Download size={18} className="mr-2" />
          Export Data (CSV)
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-surface-border p-5 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Overall ROI</h4>
          <div className="flex items-baseline">
            <span className={`text-3xl font-bold ${summary.overallROI >= 0 ? 'text-status-available' : 'text-error'}`}>
              {summary.overallROI > 0 ? '+' : ''}{summary.overallROI}%
            </span>
          </div>
        </div>
        <div className="bg-surface border border-surface-border p-5 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Total Revenue</h4>
          <div className="text-3xl font-bold text-text-primary">${summary.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-surface border border-surface-border p-5 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Operational Cost</h4>
          <div className="text-3xl font-bold text-error">${summary.totalOperationalCost.toLocaleString()}</div>
        </div>
        <div className="bg-surface border border-surface-border p-5 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Fleet Fuel Eff.</h4>
          <div className="text-3xl font-bold text-primary">
            {summary.fuelEfficiency} <span className="text-lg text-text-muted font-normal">{summary.fuelEfficiencyUnit}</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-surface-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Monthly Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272a31" vertical={false} />
                <XAxis dataKey="month" stroke="#8e9099" tick={{fill: '#8e9099'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#8e9099" tick={{fill: '#8e9099'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#272a31', opacity: 0.4}} />
                <Bar dataKey="revenue" name="Revenue" fill="#adc6ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-surface-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Top Costliest Vehicles</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCostlyVehicles} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272a31" horizontal={false} />
                <XAxis type="number" stroke="#8e9099" tick={{fill: '#8e9099'}} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="vehicle.registrationNumber" stroke="#8e9099" tick={{fill: '#e3e2e6'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#272a31', opacity: 0.4}} />
                <Bar dataKey="maintenanceCost" name="Maintenance Cost" stackId="a" fill="#ffb786" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fuelCost" name="Fuel Cost" stackId="a" fill="#ffb4ab" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Table */}
      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
          <h3 className="text-lg font-medium text-text-primary">Vehicle ROI Analysis</h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 font-medium">Vehicle Reg</th>
                <th className="px-6 py-3 font-medium">Model</th>
                <th className="px-6 py-3 font-medium text-right">Acquisition ($)</th>
                <th className="px-6 py-3 font-medium text-right">Revenue ($)</th>
                <th className="px-6 py-3 font-medium text-right">Maint. Cost ($)</th>
                <th className="px-6 py-3 font-medium text-right">Fuel Cost ($)</th>
                <th className="px-6 py-3 font-medium text-right">ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {vehicleROI.sort((a,b) => b.roi - a.roi).map((v) => (
                <tr key={v.vehicle._id} className="hover:bg-surface-border/20 transition-colors">
                  <td className="px-6 py-3 font-medium">{v.vehicle.registrationNumber}</td>
                  <td className="px-6 py-3 text-text-secondary">{v.vehicle.name}</td>
                  <td className="px-6 py-3 text-right">{v.vehicle.acquisitionCost.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-status-available">{v.revenue.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-status-inshop">{v.maintenanceCost.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-error">{v.fuelCost.toLocaleString()}</td>
                  <td className={`px-6 py-3 text-right font-bold ${v.roi >= 0 ? 'text-status-available' : 'text-error'}`}>
                    {v.roi > 0 ? '+' : ''}{v.roi}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
