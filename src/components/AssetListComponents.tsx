import { cn } from "@/lib/utils";

interface Asset {
  _id: string;
  name: string;
  category: string;
  serialNumber?: string;
  condition: string;
  location: string;
  quantity: { total: number; available: number };
  photos: string[];
}

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <div className="card group cursor-pointer hover:border-primary/50 transition-colors">
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {asset.photos?.[0] ? (
          <img 
            src={asset.photos[0]} 
            alt={asset.name} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl opacity-20">📦</div>
        )}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm",
            asset.condition === 'New' ? "bg-green-100 text-green-700" :
            asset.condition === 'Broken' ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {asset.condition}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-sm truncate">{asset.name}</h3>
          <p className="text-xs text-muted-foreground">{asset.category}</p>
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
          <span>{asset.location}</span>
          <span className="font-medium text-primary">{asset.quantity.available} / {asset.quantity.total}</span>
        </div>
      </div>
    </div>
  );
}

export function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border">
          <tr>
            <th className="px-4 py-3 font-semibold">Asset Name</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Condition</th>
            <th className="px-4 py-3 font-semibold text-right">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {assets.map((asset) => (
            <tr key={asset._id} className="hover:bg-secondary/50 transition-colors cursor-pointer capitalize">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs">
                    {asset.photos?.[0] ? '🖼️' : '📦'}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{asset.serialNumber || 'No Serial'}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{asset.category}</td>
              <td className="px-4 py-3">{asset.location}</td>
              <td className="px-4 py-3">
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm",
                  asset.condition === 'New' ? "bg-green-100 text-green-700" :
                  asset.condition === 'Broken' ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {asset.condition}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {asset.quantity.available} <span className="text-muted-foreground text-[10px]">/ {asset.quantity.total}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
