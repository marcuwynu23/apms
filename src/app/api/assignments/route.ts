import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assetId = searchParams.get('assetId');
    
    let query: any = {};
    if (status) query.status = status;
    if (assetId) query.asset = assetId;

    const assignments = await Assignment.find(query)
      .populate('asset')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create the assignment
    const assignment = await Assignment.create(body);
    
    // Update asset availability
    const asset = await Asset.findById(body.asset);
    if (asset) {
      asset.quantity.available = Math.max(0, asset.quantity.available - 1);
      await asset.save();
    }
    
    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
