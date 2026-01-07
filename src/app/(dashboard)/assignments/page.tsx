"use client";

import AssignmentForm from '@/components/AssignmentForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { Clock, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [returnId, setReturnId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/assignments?status=${statusFilter}` : '/api/assignments';
      const res = await fetch(url);
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter]);

  const handleReturnAction = async () => {
    if (!returnId) return;
    
    try {
       const res = await fetch(`/api/assignments/${returnId}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           status: 'Returned', 
           actualReturnDate: new Date(),
           conditionAtReturn: 'Good' // This could be made dynamic with a small modal
         }),
       });
       if (res.ok) fetchAssignments();
    } catch (error) {
       console.error("Return failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-sm text-muted-foreground">Track who has what and when it's due back</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 text-sm w-fit"
        >
          <Plus size={16} /> New Assignment
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "", label: "All Statuses" },
            { value: "Active", label: "Active" },
            { value: "Returned", label: "Returned" },
            { value: "Overdue", label: "Overdue" },
            { value: "Lost", label: "Lost" },
          ]}
          className="w-48"
          placeholder="Filter by status..."
        />
      </div>

      {loading ? (
        <div className="card overflow-hidden">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-1/6" />
                <Skeleton className="h-10 w-1/6" />
                <Skeleton className="h-10 w-1/6" />
                <Skeleton className="h-10 w-1/6" />
                <Skeleton className="h-10 w-1/6" />
                <Skeleton className="h-10 w-1/6" />
              </div>
            ))}
          </div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="card p-20 text-center">
            <h3 className="font-semibold">No assignments found</h3>
            <p className="text-muted-foreground text-sm">Assign an asset to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Asset</th>
                <th className="px-4 py-3 font-semibold">Assignee</th>
                <th className="px-4 py-3 font-semibold">Date Assigned</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignments.map((as) => (
                <tr key={as._id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{as.asset?.name || 'Deleted Asset'}</div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{as.asset?.serialNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       <User size={14} className="text-muted-foreground" />
                       <span>{as.assignee.name}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground px-5 uppercase">{as.assignee.type}</div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(as.assignedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {as.expectedReturnDate ? (
                        <div className={cn("flex items-center gap-1", 
                            as.status === 'Active' && new Date(as.expectedReturnDate) < new Date() ? "text-red-500 font-bold" : ""
                        )}>
                            <Clock size={14} />
                            {new Date(as.expectedReturnDate).toLocaleDateString()}
                        </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                      as.status === 'Active' ? "bg-blue-100 text-blue-700" :
                      as.status === 'Returned' ? "bg-green-100 text-green-700" :
                      as.status === 'Overdue' ? "bg-red-100 text-red-700" :
                      "bg-zinc-100 text-zinc-700"
                    )}>
                      {as.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {as.status === 'Active' && (
                        <button 
                           onClick={() => setReturnId(as._id)}
                           className="text-xs text-primary hover:underline font-medium"
                        >
                            Mark Returned
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AssignmentForm 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchAssignments();
            setShowModal(false);
          }}
        />
      )}

      <ConfirmationDialog
        isOpen={!!returnId}
        onClose={() => setReturnId(null)}
        onConfirm={handleReturnAction}
        title="Confirm Asset Return"
        description="Are you sure you want to mark this asset as returned? This will update the inventory quantity and mark the assignment as complete."
        confirmText="Confirm Return"
      />
    </div>
  );
}
