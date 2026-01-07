"use client";

import { useState } from 'react';
import { X, Wrench, DollarSign, User, Calendar, Loader2 } from 'lucide-react';

interface MaintenanceFormProps {
  assetId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaintenanceForm({ assetId, onClose, onSuccess }: MaintenanceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const maintData = {
      asset: assetId,
      type: data.type,
      description: data.description,
      cost: Number(data.cost) || 0,
      performedBy: data.performedBy,
      date: data.date || new Date(),
      status: 'Completed',
    };

    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintData),
      });

      if (!res.ok) throw new Error('Failed to record maintenance');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Register Maintenance / Repair</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Log Type</label>
              <select name="type" required className="input">
                <option value="Maintenance">Routine Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Damage">Damage Report</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Cost (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input type="number" name="cost" placeholder="0.00" className="input pl-8" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Performed By / Vendor</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input name="performedBy" required placeholder="Name or Service Center" className="input pl-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="input pl-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Detailed Description</label>
            <textarea name="description" rows={4} required className="input py-2 resize-none" placeholder="Describe the work done or damage found..."></textarea>
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-secondary/30">
          <button onClick={onClose} type="button" className="btn btn-secondary text-sm">Cancel</button>
          <button 
            onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}
            disabled={loading}
            className="btn btn-primary text-sm flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Record Log"}
          </button>
        </div>
      </div>
    </div>
  );
}
