import { NextRequest, NextResponse } from 'next/server';
import { parseCSV } from '@/lib/insights/utils';
import { uploadCSVData, listAllMonths, getMonthData, deleteMonthData } from '@/lib/insights/supabase';

// GET - List all months or get specific month data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (month) {
      // Get specific month data
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
    }

    // List all months
    const months = await listAllMonths();
    return NextResponse.json({
      success: true,
      data: months,
    });
  } catch (error) {
    console.error('[v0] Insights GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Upload CSV file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const month = formData.get('month') as string;
    const year = formData.get('year') as string;

    if (!file || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields: file, month, year' },
        { status: 400 }
      );
    }

    const fileText = await file.text();
    const rows = parseCSV(fileText);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file contains no valid data rows' },
        { status: 400 }
      );
    }

    // Format month as YYYY-MM
    const monthNumber = String(month).padStart(2, '0');
    const monthString = `${year}-${monthNumber}`;

    const result = await uploadCSVData(monthString, file.name, rows);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Uploaded ${rows.length} rows for ${monthString}`,
    });
  } catch (error) {
    console.error('[v0] Insights POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a month's data
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
    console.error('[v0] Insights DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete data' },
      { status: 500 }
    );
  }
}
