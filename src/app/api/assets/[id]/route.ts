import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const asset = await Asset.findById(id);
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Fetch assignment history for this asset
    const history = await Assignment.find({ asset: id }).sort({ createdAt: -1 });

    return NextResponse.json({ asset, history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const asset = await Asset.findByIdAndUpdate(id, body, { new: true });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json(asset);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const asset = await Asset.findByIdAndDelete(id);
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    // Also mark active assignments as 'Returned' or delete them? 
    // Usually, we should probably prevent deletion if there are active assignments.
    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
