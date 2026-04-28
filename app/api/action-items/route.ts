import { NextRequest, NextResponse } from 'next/server';
import { listActionItems, createActionItem } from '@/lib/action-items/supabase';

// GET - List action items with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || undefined,
      product_area: searchParams.get('product_area') || undefined,
      tag: searchParams.get('tag') || undefined,
      impact: searchParams.get('impact') || undefined,
    };

    const items = await listActionItems(filters);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Action items GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch action items' },
      { status: 500 }
    );
  }
}

// POST - Create a new action item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, tag, product_area, owner, status, impact, notes } = body;

    if (!title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 });
    }

    const item = await createActionItem({
      title,
      tag: tag || null,
      product_area: product_area || null,
      owner: owner || null,
      status: status || 'backlog',
      impact: impact || null,
      notes: notes || null,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Action items POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create action item' },
      { status: 500 }
    );
  }
}
