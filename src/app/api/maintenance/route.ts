import dbConnect from '@/lib/db';
import Maintenance from '@/models/Maintenance';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    
    let query: any = {};
    if (assetId) query.asset = assetId;

    const maintenance = await Maintenance.find(query).sort({ date: -1 });
    return NextResponse.json(maintenance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const log = await Maintenance.create(body);
    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
