"use client";

import { useState, useEffect } from 'react';
import { X, User, Users, ExternalLink, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
  _id: string;
  name: string;
  quantity: { available: number };
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AssignmentFormProps {
  assetId?: string;
  assetName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignmentForm({ assetId, assetName, onClose, onSuccess }: AssignmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setFetching(true);
      try {
        const [assetsRes, usersRes] = await Promise.all([
          fetch('/api/assets'),
          fetch('/api/users')
        ]);
        
        const assetsData = await assetsRes.json();
        setAssets(assetsData.filter((a: Asset) => a.quantity.available > 0));
        
        // Mock users for now if the API doesn't exist
        if (usersRes.ok) {
           const usersData = await usersRes.json();
           setUsers(usersData);
        } else {
           setUsers([
             { _id: '1', name: 'John Doe', email: 'john@example.com' },
             { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
           ]);
        }
      } catch (err) {
        console.error("Failed to fetch data for assignment", err);
      } finally {
        setFetching(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Construct assignment object
    const assignmentData = {
      asset: data.assetId,
      assignee: {
        type: data.assigneeType,
        id: data.assigneeType === 'User' ? data.userId : undefined,
        name: data.assigneeName || (users.find(u => u._id === data.userId)?.name),
      },
      assignedBy: '65a0f0000000000000000001', // Mocked Admin ID for now
      conditionAtAssignment: data.condition,
      notes: data.notes,
      expectedReturnDate: data.expectedReturnDate || undefined,
    };

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to assign asset');
      }
      
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
          <h3 className="text-lg font-bold text-foreground truncate max-w-[80%]">
            Assign {assetName || 'Asset'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        {fetching ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Select Asset</label>
              <select name="assetId" defaultValue={assetId} required className="input">
                <option value="">Choose an available asset</option>
                {assets.map(a => (
                  <option key={a._id} value={a._id}>{a.name} ({a.quantity.available} available)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Assignee Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['User', 'Department', 'External'].map((type) => (
                  <label key={type} className="flex items-center gap-2 p-2 border border-border rounded-md cursor-pointer hover:bg-secondary transition-colors">
                    <input type="radio" name="assigneeType" value={type} defaultChecked={type === 'User'} className="text-primary focus:ring-primary" />
                    <span className="text-xs">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Select User / Assignee Name</label>
              <div className="flex flex-col gap-2">
                <select name="userId" className="input text-sm">
                  <option value="">Select a registered user</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
                <div className="relative">
                  <input name="assigneeName" placeholder="Or enter manual name (Department/External)" className="input pl-9" />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Condition</label>
                <select name="condition" required className="input">
                  <option value="Good">Good</option>
                  <option value="New">New</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Expected Return</label>
                <div className="relative">
                  <input type="date" name="expectedReturnDate" className="input pl-9" />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Internal Notes</label>
              <textarea name="notes" rows={2} className="input py-2 resize-none" placeholder="Purpose of assignment..."></textarea>
            </div>
          </form>
        )}

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-secondary/30">
          <button onClick={onClose} type="button" className="btn btn-secondary text-sm">Cancel</button>
          <button 
            type="submit"
            disabled={loading || fetching}
            className="btn btn-primary text-sm flex items-center gap-2 min-w-[120px] justify-center"
            onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Assign Asset"}
          </button>
        </div>
      </div>
    </div>
  );
}
