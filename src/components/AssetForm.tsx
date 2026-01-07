"use client";

import { useState } from 'react';
import { X, Upload, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssetForm({ initialData, onClose, onSuccess }: AssetFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<{ photos: File[], documents: File[] }>({
    photos: [],
    documents: [],
  });

  const categories = ["Electronics", "Furniture", "Office Supplies", "Vehicles", "Tools"];
  const conditions = ["New", "Good", "Fair", "Poor", "Broken"];

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataFields = new FormData(e.currentTarget);
    const data = Object.fromEntries(formDataFields.entries());
    
    try {
      let photoUrls: string[] = [];
      let documentUrls: string[] = [];

      // Upload photos if any
      if (files.photos.length > 0) {
        const photoFormData = new FormData();
        files.photos.forEach((file: File) => photoFormData.append('files', file));
        photoFormData.append('type', 'photos');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });
        if (!res.ok) throw new Error('Failed to upload photos');
        const { urls } = await res.json();
        photoUrls = urls;
      }

      // Upload documents if any
      if (files.documents.length > 0) {
        const docFormData = new FormData();
        files.documents.forEach((file: File) => docFormData.append('files', file));
        docFormData.append('type', 'documents');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: docFormData,
        });
        if (!res.ok) throw new Error('Failed to upload documents');
        const { urls } = await res.json();
        documentUrls = urls;
      }

      const assetData = {
        ...data,
        quantity: {
          total: Number(data.quantity),
          available: isEditing ? initialData.quantity.available : Number(data.quantity),
        },
        photos: photoUrls.length > 0 ? photoUrls : (isEditing ? initialData.photos : []),
        documents: documentUrls.length > 0 ? documentUrls : (isEditing ? initialData.documents : []),
      };

      const url = isEditing ? `/api/assets/${initialData._id}` : '/api/assets';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData),
      });

      if (!res.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} asset`);
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'documents') => {
    if (e.target.files) {
      setFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...Array.from(e.target.files!)]
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {isEditing ? `Edit ${initialData.name}` : 'Register New Asset'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Asset Name</label>
              <input name="name" defaultValue={initialData?.name} required placeholder="e.g. MacBook Pro M3" className="input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
              <select name="category" defaultValue={initialData?.category} required className="input">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Serial Number</label>
              <input name="serialNumber" defaultValue={initialData?.serialNumber} placeholder="Optional" className="input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Purchase Date</label>
              <input type="date" name="purchaseDate" defaultValue={initialData?.purchaseDate ? initialData.purchaseDate.split('T')[0] : ''} className="input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Quantity</label>
              <input type="number" name="quantity" defaultValue={initialData?.quantity?.total || "1"} min="1" required className="input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Condition</label>
              <select name="condition" defaultValue={initialData?.condition} className="input">
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
              <input name="location" defaultValue={initialData?.location} required placeholder="e.g. Office 402" className="input" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
            <textarea name="description" defaultValue={initialData?.description} rows={3} placeholder="Additional details..." className="input py-2 h-24 resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-muted-foreground block">Photos</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'photos')}
                />
                <ImageIcon className="mx-auto text-muted-foreground" size={24} />
                <p className="text-xs text-muted-foreground">Click or drag photos here</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.photos.map((f, i) => (
                    <div key={i} className="text-[10px] bg-secondary px-2 py-1 rounded truncate max-w-[100px]">{f.name}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-muted-foreground block">Documents</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'documents')}
                />
                <FileText className="mx-auto text-muted-foreground" size={24} />
                <p className="text-xs text-muted-foreground">Warranty, receipts, etc.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.documents.map((f, i) => (
                    <div key={i} className="text-[10px] bg-secondary px-2 py-1 rounded truncate max-w-[100px]">{f.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-secondary/30">
          <button onClick={onClose} type="button" className="btn btn-secondary text-sm">Cancel</button>
          <button 
            onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}
            disabled={loading}
            className="btn btn-primary text-sm flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? "Update Asset" : "Save Asset")}
          </button>
        </div>
      </div>
    </div>
  );
}
