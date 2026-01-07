"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Hash, 
  Calendar, 
  Settings, 
  History, 
  Hammer, 
  ChevronRight,
  User as UserIcon,
  Clock,
  ExternalLink,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import AssignmentForm from '@/components/AssignmentForm';
import MaintenanceForm from '@/components/MaintenanceForm';
import AssetForm from '@/components/AssetForm';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'maintenance'>('info');
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
  async function fetchAssetData() {
    try {
      const [assetRes, maintRes] = await Promise.all([
        fetch(`/api/assets/${id}`),
        fetch(`/api/maintenance?assetId=${id}`)
      ]);
      
      const assetJson = await assetRes.json();
      const maintJson = await maintRes.json();
      
      setData(assetJson);
      setMaintenance(maintJson);
    } catch (error) {
      console.error("Failed to fetch asset data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssetData();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!data?.asset) return (
    <div className="text-center py-20">
      <h3 className="text-xl font-bold">Asset not found</h3>
      <button onClick={() => router.back()} className="text-primary hover:underline mt-2">Go back</button>
    </div>
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/assets');
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const { asset, history } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Assets
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEditModal(true)}
            className="btn btn-secondary text-sm flex items-center gap-2"
          >
            <Edit size={14} /> Edit
          </button>
          <button 
            onClick={handleDelete}
            className="btn btn-secondary text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button 
            onClick={() => setShowAssignModal(true)}
            disabled={asset.quantity.available === 0}
            className="btn btn-primary text-sm disabled:opacity-50"
          >
            Assign Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card aspect-square bg-secondary relative overflow-hidden">
            {asset.photos?.[0] ? (
              <img src={asset.photos[0]} alt={asset.name} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl opacity-20">📦</div>
            )}
            <div className="absolute top-4 right-4">
              <span className={cn(
                "text-xs uppercase font-extrabold px-3 py-1 rounded shadow-lg",
                asset.condition === 'New' ? "bg-green-500 text-white" : "bg-blue-500 text-white"
              )}>
                {asset.condition}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {asset.photos?.map((photo: string, i: number) => (
              <button key={i} className="w-16 h-16 rounded border border-border overflow-hidden flex-shrink-0 bg-secondary">
                <img src={photo} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>

          <div className="card p-4 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Tag size={18} className="text-primary" /> Core Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{asset.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Serial Number</span>
                <span className="font-mono">{asset.serialNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{asset.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-medium">{asset.purchaseDate ? formatDate(asset.purchaseDate) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-6 border-b border-border mb-4">
            {[
              { id: 'info', label: 'Details', icon: Settings },
              { id: 'history', label: 'Assignment History', icon: History },
              { id: 'maintenance', label: 'Maintenance', icon: Hammer },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">{asset.name}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{asset.description || 'No description provided for this asset.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-4 bg-secondary/20 border-primary/20">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Availability</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{asset.quantity.available}</span>
                      <span className="text-muted-foreground text-sm ml-1">of {asset.quantity.total} units available</span>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-lg font-medium">{formatDate(asset.updatedAt)}</p>
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-border bg-secondary/10">
                  <h3 className="font-bold">Supporting Documents</h3>
                </div>
                <div className="p-4 space-y-2">
                  {asset.documents?.length > 0 ? (
                    asset.documents.map((doc: string, i: number) => (
                      <a key={i} href={doc} className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors text-sm border border-transparent hover:border-border">
                        <div className="flex items-center gap-3">
                          <ExternalLink size={14} className="text-primary" />
                          <span>{doc.split('/').pop() || `Document ${i+1}`}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">PDF</span>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-4">No documents attached.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Assignee</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.length > 0 ? history.map((h: any) => (
                    <tr key={h._id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-muted-foreground" />
                          <span className="font-medium">{h.assignee.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>{formatDate(h.assignedDate)}</span>
                          {h.actualReturnDate && <span className="text-[10px] text-muted-foreground">Returned {formatDate(h.actualReturnDate)}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm",
                          h.status === 'Active' ? "bg-green-100 text-green-700" :
                          h.status === 'Returned' ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {h.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-primary hover:underline text-xs">View Photos</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground italic">No assignment history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowMaintModal(true)}
                  className="btn btn-secondary text-xs flex items-center gap-2"
                >
                  <Plus size={14} /> Register Maintenance
                </button>
              </div>
              
              {maintenance.length === 0 ? (
                <div className="card p-20 text-center space-y-4 font-gitlab">
                  <Hammer className="mx-auto text-muted-foreground opacity-20" size={48} />
                  <h3 className="font-semibold text-lg">No maintenance records</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    This asset has no recorded repairs or maintenance reports yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenance.map((m: any) => (
                    <div key={m._id} className="card p-5 space-y-3 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            m.type === 'Repair' ? "bg-red-500" : 
                            m.type === 'Maintenance' ? "bg-blue-500" : "bg-zinc-400"
                          )}></div>
                          <span className="font-bold text-sm tracking-tight">{m.type}</span>
                          <span className="text-[10px] text-muted-foreground">• {formatDate(m.date)}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {m.cost ? `$${m.cost}` : 'No Cost'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-[10px] text-muted-foreground">Performed by: <span className="font-medium">{m.performedBy}</span></span>
                        <span className={cn(
                          "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                          m.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {showAssignModal && (
        <AssignmentForm 
          assetId={asset._id}
          assetName={asset.name}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            fetchAssetData();
            setActiveTab('history');
          }}
        />
      )}

      {showMaintModal && (
        <MaintenanceForm 
          assetId={asset._id}
          onClose={() => setShowMaintModal(false)}
          onSuccess={() => {
            fetchAssetData();
            setActiveTab('maintenance');
          }}
        />
      )}

      {showEditModal && (
        <AssetForm 
          initialData={asset}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchAssetData();
          }}
        />
      )}
    </div>
  );
}
