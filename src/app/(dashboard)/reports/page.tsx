"use client";

import { Download, FileText, Package, TrendingUp, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const reportTypes = [
    { id: 'asset-utilization', name: 'Asset Utilization', icon: Package, description: 'Track asset usage and allocation' },
    { id: 'maintenance-history', name: 'Maintenance History', icon: Wrench, description: 'Review maintenance activities' },
    { id: 'depreciation', name: 'Depreciation Report', icon: TrendingUp, description: 'Asset value depreciation over time' },
    { id: 'assignment-summary', name: 'Assignment Summary', icon: FileText, description: 'User and department assignments' },
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', selectedReport, dateRange);
    // TODO: Implement report generation
  };

  if (loading) return (
     <div className="flex items-center justify-center min-h-[400px]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
     </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-sm text-muted-foreground">Generate and export comprehensive reports</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Report Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold">Select Report Type</h3>
          <div className="space-y-2">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`w-full card p-4 text-left transition-all ${
                  selectedReport === report.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <report.icon size={20} className="text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{report.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold">Configure Report</h3>
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="input w-full"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="input w-full"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <select className="input w-full">
                <option>PDF</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
              </select>
            </div>

            <button 
              onClick={handleGenerateReport}
              disabled={!selectedReport}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Generate Report
            </button>
          </div>

          {/* Quick Stats */}
          <div className="card p-6 space-y-3">
            <h4 className="font-semibold text-sm">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">{stats?.stats[0]?.label || 'Total Assets'}</p>
                <p className="text-2xl font-bold">{stats?.stats[0]?.value || 0}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">{stats?.stats[1]?.label || 'Active Assignments'}</p>
                <p className="text-2xl font-bold">{stats?.stats[1]?.value || 0}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">{stats?.stats[2]?.label || 'Maintenance'}</p>
                <p className="text-2xl font-bold">{stats?.stats[2]?.value || 0}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">{stats?.stats[3]?.label || 'Available'}</p>
                <p className="text-2xl font-bold">{stats?.stats[3]?.value || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
