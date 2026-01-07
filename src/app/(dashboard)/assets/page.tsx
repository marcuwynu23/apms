"use client";

import AssetForm from '@/components/AssetForm';
import { AssetCard, AssetTable } from '@/components/AssetListComponents';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);

  const categories = ["Electronics", "Furniture", "Office Supplies", "Vehicles", "Tools"];

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category) query.append('category', category);
        
        const res = await fetch(`/api/assets?${query.toString()}`);
        const data = await res.json();
        setAssets(data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchAssets, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Assets</h2>
          <p className="text-sm text-muted-foreground">Manage and track your organizational assets</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 text-sm w-fit"
        >
          <Plus size={16} /> Add Asset
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or serial..." 
            className="input pl-10 h-10 border-transparent bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={category}
            onChange={setCategory}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map(c => ({ value: c, label: c }))
            ]}
            className="w-full md:w-48"
            placeholder="Category"
          />

          {/* View Toggle */}
          <div className="flex items-center bg-white border border-border rounded-md p-1 shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-1.5 rounded transition-colors", view === 'grid' ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('table')}
              className={cn("p-1.5 rounded transition-colors", view === 'table' ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="pt-2 border-t border-border/50 flex justify-between">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="p-4 space-y-4">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                 <div key={i} className="flex gap-4">
                   <Skeleton className="h-10 w-1/6" />
                   <Skeleton className="h-10 w-1/6" />
                   <Skeleton className="h-10 w-1/6" />
                   <Skeleton className="h-10 w-1/6" />
                   <Skeleton className="h-10 w-1/6" />
                 </div>
               ))}
            </div>
          </div>
        )
      ) : assets.length === 0 ? (
        <div className="card p-20 text-center space-y-4">
          <div className="text-4xl">🔎</div>
          <h3 className="font-semibold text-lg">No assets found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button onClick={() => {setSearch(''); setCategory('');}} className="btn btn-secondary text-sm">Clear Filters</button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset._id} asset={asset} />
          ))}
        </div>
      ) : (
        <AssetTable assets={assets} />
      )}

      {showModal && (
        <AssetForm 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            // Re-fetch assets
            const query = new URLSearchParams();
            if (search) query.append('search', search);
            if (category) query.append('category', category);
            fetch(`/api/assets?${query.toString()}`).then(res => res.json()).then(setAssets);
          }} 
        />
      )}
    </div>
  );
}
