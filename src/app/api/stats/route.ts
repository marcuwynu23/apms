import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Assignment from '@/models/Assignment';
import Maintenance from '@/models/Maintenance';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const [totalAssets, assets, totalAssignments, activeAssignments, maintenanceLogs] = await Promise.all([
      Asset.countDocuments(),
      Asset.find(),
      Assignment.countDocuments(),
      Assignment.countDocuments({ status: 'Active' }),
      Maintenance.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const availableAssets = assets.reduce((acc, curr) => acc + (curr.quantity.available || 0), 0);
    const maintenanceCount = await Asset.countDocuments({ condition: 'Broken' });

    // Calculate recent activity
    const recentAssignments = await Assignment.find()
      .populate('asset')
      .sort({ assignedDate: -1 })
      .limit(5);

    const stats = [
      { label: "Total Assets", value: totalAssets.toLocaleString(), change: "+0%", icon: "📦" },
      { label: "Assigned", value: activeAssignments.toLocaleString(), change: "+0%", icon: "👤" },
      { label: "Under Maintenance", value: maintenanceCount.toLocaleString(), change: "0%", icon: "🔧" },
      { label: "Available units", value: availableAssets.toLocaleString(), change: "+0%", icon: "✅" },
    ];

    const categoryCounts: Record<string, number> = {};
    assets.forEach(asset => {
      categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;
    });

    const categories = Object.entries(categoryCounts).map(([label, count]) => ({
      label,
      count,
      color: label === 'Electronics' ? 'bg-blue-500' : 
             label === 'Furniture' ? 'bg-green-500' : 
             label === 'Office Supplies' ? 'bg-yellow-500' : 'bg-purple-500'
    }));

    return NextResponse.json({
      stats,
      recentActivity: recentAssignments.map(as => ({
        id: as._id,
        title: `${(as.asset as any)?.name || 'Asset'} assigned to ${as.assignee.name}`,
        subtitle: `${as.assignee.type} • ${new Date(as.assignedDate).toLocaleDateString()}`,
        type: 'Assignment',
        icon: '💻'
      })),
      categories
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
