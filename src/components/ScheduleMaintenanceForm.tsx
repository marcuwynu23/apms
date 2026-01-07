"use client";

import { useEffect, useState } from 'react';
import { X, Wrench, Calendar, Loader2 } from 'lucide-react';
import { Select } from '@/components/ui/Select';

interface ScheduleMaintenanceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleMaintenanceForm({ onClose, onSuccess }: ScheduleMaintenanceFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingAssets, setFetchingAssets] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('/api/assets');
        const data = await res.json();
        setAssets(data);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setFetchingAssets(false);
      }
    }
    fetchAssets();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAsset) {
      setError("Please select an asset");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const maintData = {
      asset: selectedAsset,
      type: data.type,
      description: data.description,
      cost: 0, // Scheduled maintenance initial cost is 0 or estimated (optional)
      performedBy: data.performedBy,
      scheduledDate: data.scheduledDate, // Using scheduledDate as per model (implied) or date
      date: data.scheduledDate, // Using date as the scheduled date for now, or we should check the model
      status: 'Scheduled',
    };

    // Note: The original MaintenanceForm used 'date'. The MaintenancePage displays 'scheduledDate'. 
    // We should check the model definition, but assuming 'date' is the date of maintenance.
    // If the schema has both, we'll send both or whichever is appropriate.
    // For now I will send `date` as the scheduled date.

    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintData),
      });

      if (!res.ok) throw new Error('Failed to schedule maintenance');
      
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
          <h3 className="text-lg font-bold text-foreground">Schedule Maintenance</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Select Asset</label>
            {fetchingAssets ? (
              <div className="h-10 w-full animate-pulse bg-secondary rounded-md" />
            ) : (
                <Select
                    options={assets.map(a => ({ value: a._id, label: `${a.name} (${a.serialNumber || 'No Serial'})` }))}
                    value={selectedAsset}
                    onChange={setSelectedAsset}
                    placeholder="Search or select an asset..."
                    className="w-full"
                />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
              <select name="type" required className="input w-full">
                <option value="Maintenance">Routine Maintenance</option>
                <option value="Inspection">Inspection</option>
                <option value="Repair">Repair</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Scheduled Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type="date" name="scheduledDate" required className="input pl-9 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Assign To (Optional)</label>
            <input name="performedBy" placeholder="Technician or Vendor Name" className="input w-full" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Notes / Instructions</label>
            <textarea name="description" rows={4} className="input py-2 resize-none w-full" placeholder="Add instructions or details..."></textarea>
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-secondary/30">
          <button onClick={onClose} type="button" className="btn btn-secondary text-sm">Cancel</button>
          <button 
            onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}
            disabled={loading}
            className="btn btn-primary text-sm flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
