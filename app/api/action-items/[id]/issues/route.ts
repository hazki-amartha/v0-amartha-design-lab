import { NextRequest, NextResponse } from 'next/server';
import { getLinkedIssues, linkIssue, unlinkIssue } from '@/lib/action-items/supabase';

// GET - Issues linked to this action item
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issues = await getLinkedIssues(id);
    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error('Linked issues GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch linked issues' },
      { status: 500 }
    );
  }
}

// POST - Link an issue to this action item
// Body: { issue_id: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { issue_id } = await request.json();
    if (!issue_id) {
      return NextResponse.json({ error: 'Missing issue_id' }, { status: 400 });
    }
    await linkIssue(id, issue_id);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Link issue POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to link issue' },
      { status: 500 }
    );
  }
}

// DELETE - Unlink an issue from this action item
// Body: { issue_id: string }
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { issue_id } = await request.json();
    if (!issue_id) {
      return NextResponse.json({ error: 'Missing issue_id' }, { status: 400 });
    }
    await unlinkIssue(id, issue_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unlink issue DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unlink issue' },
      { status: 500 }
    );
  }
}
