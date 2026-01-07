import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const wasActive = assignment.status === 'Active' || assignment.status === 'Overdue';
    const isReturned = body.status === 'Returned';

    const updatedAssignment = await Assignment.findByIdAndUpdate(id, body, { new: true });

    // If returning the asset, increment availability
    if (wasActive && isReturned) {
      const asset = await Asset.findById(assignment.asset);
      if (asset) {
        asset.quantity.available = Math.min(asset.quantity.total, asset.quantity.available + 1);
        await asset.save();
      }
    }

    return NextResponse.json(updatedAssignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
