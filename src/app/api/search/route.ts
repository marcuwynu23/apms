import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Assignment from '@/models/Assignment';
import Maintenance from '@/models/Maintenance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const searchRegex = new RegExp(query, 'i');

    // Search assets
    const assets = await Asset.find({
      $or: [
        { name: searchRegex },
        { serialNumber: searchRegex },
        { category: searchRegex },
      ],
    })
      .limit(5)
      .lean();

    // Search assignments
    const assignments = await Assignment.find({
      $or: [
        { assignedTo: searchRegex },
        { department: searchRegex },
      ],
    })
      .populate('asset', 'name')
      .limit(5)
      .lean();

    // Search maintenance
    const maintenance = await Maintenance.find({
      $or: [
        { type: searchRegex },
        { performedBy: searchRegex },
      ],
    })
      .populate('asset', 'name')
      .limit(5)
      .lean();

    // Format results
    const results = [
      ...assets.map((asset: any) => ({
        type: 'asset',
        title: asset.name,
        description: `${asset.category} • ${asset.serialNumber}`,
        url: `/assets/${asset._id}`,
      })),
      ...assignments.map((assignment: any) => ({
        type: 'assignment',
        title: `Assignment to ${assignment.assignedTo}`,
        description: `${assignment.asset?.name || 'Asset'} • ${assignment.department}`,
        url: `/assignments`,
      })),
      ...maintenance.map((maint: any) => ({
        type: 'maintenance',
        title: `${maint.type} Maintenance`,
        description: `${maint.asset?.name || 'Asset'} • ${maint.performedBy || 'Pending'}`,
        url: `/maintenance`,
      })),
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
