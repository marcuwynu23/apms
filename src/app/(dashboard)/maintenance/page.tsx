"use client";

import { useState, useEffect } from 'react';
import { Wrench, Plus, Filter, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import ScheduleMaintenanceForm from '@/components/ScheduleMaintenanceForm';

export default function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const query = statusFilter ? `?status=${statusFilter}` : '';
        const res = await fetch(`/api/maintenance${query}`);
        const data = await res.json();
        setMaintenanceRecords(data);
      } catch (error) {
        console.error("Failed to fetch maintenance records", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMaintenance();
  }, [statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'In Progress': return <Clock size={16} className="text-blue-600" />;
      case 'Scheduled': return <Calendar size={16} className="text-gray-600" />;
      default: return <AlertCircle size={16} className="text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Maintenance</h2>
          <p className="text-sm text-muted-foreground">Track and schedule asset maintenance</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="btn btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Schedule Maintenance
        </button>
      </div>

      <div className="flex items-center gap-4">
        <select 
          className="input w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : maintenanceRecords.length === 0 ? (
        <div className="card p-20 text-center space-y-4">
          <Wrench size={48} className="mx-auto text-muted-foreground" />
          <h3 className="font-semibold text-lg">No maintenance records</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Schedule maintenance to keep your assets in optimal condition.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Asset</th>
                <th className="text-left p-4 text-sm font-semibold">Type</th>
                <th className="text-left p-4 text-sm font-semibold">Scheduled Date</th>
                <th className="text-left p-4 text-sm font-semibold">Status</th>
                <th className="text-left p-4 text-sm font-semibold">Technician</th>
                <th className="text-left p-4 text-sm font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceRecords.map((record) => (
                <tr key={record._id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <Link href={`/assets/${record.asset?._id}`} className="font-medium hover:text-primary">
                      {record.asset?.name || 'N/A'}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{record.type}</td>
                  <td className="p-4 text-sm">{new Date(record.scheduledDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{record.performedBy || '-'}</td>
                  <td className="p-4 text-sm font-medium">${record.cost?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showScheduleModal && (
        <ScheduleMaintenanceForm 
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            // Refresh data
            const query = statusFilter ? `?status=${statusFilter}` : '';
            fetch(`/api/maintenance${query}`)
              .then(res => res.json())
              .then(setMaintenanceRecords);
          }}
        />
      )}
    </div>
  );
}
