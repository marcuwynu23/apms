import { NextResponse } from 'next/server';
import { saveFile } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string || 'uploads'; // e.g. 'photos' or 'documents'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const fileUrls = await Promise.all(
      files.map(file => saveFile(file, `assets/${type}`))
    );

    return NextResponse.json({ urls: fileUrls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
