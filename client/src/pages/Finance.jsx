import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Fuel, ReceiptText } from 'lucide-react';
import { format } from 'date-fns';

const Finance = () => {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' | 'expenses'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'fuel') {
          const { data } = await api.get('/fuel');
          setFuelLogs(data);
        } else {
          const { data } = await api.get('/expenses');
          setExpenses(data);
        }
      } catch (error) {
        console.error('Failed to fetch finance data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Finance & Accounting</h2>
      </div>

      <div className="flex space-x-1 border-b border-surface-border">
        <button
          onClick={() => setActiveTab('fuel')}
          className={`flex items-center px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'fuel'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-border'
          }`}
        >
          <Fuel size={16} className="mr-2" />
          Fuel Logs
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
            activeTab === 'expenses'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-border'
          }`}
        >
          <ReceiptText size={16} className="mr-2" />
          Trip Expenses
        </button>
      </div>

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'fuel' ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Trip Ref</th>
                  <th className="px-6 py-4 font-medium">Liters</th>
                  <th className="px-6 py-4 font-medium">Cost ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
                ) : fuelLogs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No fuel logs found.</td></tr>
                ) : (
                  fuelLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-surface-border/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4">{log.vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="px-6 py-4 font-mono text-text-secondary">{log.trip?.tripId || '-'}</td>
                      <td className="px-6 py-4">{log.liters.toLocaleString()} L</td>
                      <td className="px-6 py-4 text-error font-medium">${log.cost.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-border/50 text-text-secondary border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Trip Ref</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Tolls ($)</th>
                  <th className="px-6 py-4 font-medium">Maintenance ($)</th>
                  <th className="px-6 py-4 font-medium">Other ($)</th>
                  <th className="px-6 py-4 font-medium text-right">Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-text-primary">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
                ) : expenses.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-text-muted">No expenses found.</td></tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-surface-border/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{format(new Date(exp.createdAt), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4 font-mono">{exp.trip?.tripId || 'Unknown'}</td>
                      <td className="px-6 py-4 text-text-secondary">{exp.vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="px-6 py-4">${exp.toll.toLocaleString()}</td>
                      <td className="px-6 py-4">${exp.maintenanceCost.toLocaleString()}</td>
                      <td className="px-6 py-4">${exp.other.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-error font-bold">${exp.total.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
