import { NextRequest, NextResponse } from 'next/server';
import { listAllMonths, getMonthData, deleteMonthData } from '@/lib/insights/supabase';

export async function GET(request: NextRequest) {
  try {
    const months = await listAllMonths();

    return NextResponse.json({
      success: true,
      data: months,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch months' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { month } = await request.json();

    if (!month) {
      return NextResponse.json(
        { error: 'Missing month parameter' },
        { status: 400 }
      );
    }

    const data = await getMonthData(month);

    if (!data) {
      return NextResponse.json(
        { error: 'Month not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: 'Missing month parameter' },
        { status: 400 }
      );
    }

    await deleteMonthData(month);

    return NextResponse.json({
      success: true,
      message: `Deleted data for ${month}`,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete data' },
      { status: 500 }
    );
  }
}
