import { NextRequest, NextResponse } from 'next/server';
import { listIssues } from '@/lib/issues/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      source: (searchParams.get('source') as 'csat' | 'nps') || undefined,
      period: searchParams.get('period') || undefined,
      product_area: searchParams.get('product_area') || undefined,
      feature: searchParams.get('feature') || undefined,
      tag: searchParams.get('tag') || undefined,
      impact: searchParams.get('impact') || undefined,
    };

    const issues = await listIssues(filters);
    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error('Issues GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}
