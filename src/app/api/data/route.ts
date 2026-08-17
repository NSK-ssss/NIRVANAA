import { NextResponse } from 'next/server';
import { getDatabasePayload } from '@/lib/db';

export async function GET() {
  try {
    const payload = getDatabasePayload();
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch database data' }, { status: 500 });
  }
}
