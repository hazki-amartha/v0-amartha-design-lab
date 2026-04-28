import { NextRequest, NextResponse } from 'next/server';
import { updateActionItem, deleteActionItem } from '@/lib/action-items/supabase';

// PATCH - Update an action item (status, notes, owner, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await updateActionItem(id, body);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Action item PATCH error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update action item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove an action item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteActionItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Action item DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete action item' },
      { status: 500 }
    );
  }
}
