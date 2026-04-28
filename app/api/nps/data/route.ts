import { NextRequest, NextResponse } from 'next/server';
import { parseNPSCSV } from '@/lib/nps/utils';
import { uploadNPSData, listNPSPeriods, getNPSPeriodData, deleteNPSPeriod } from '@/lib/nps/supabase';

// GET - List all periods or get specific period data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');

    if (period) {
      const data = await getNPSPeriodData(period);
      if (!data) {
        return NextResponse.json({ error: 'Period not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data });
    }

    const periods = await listNPSPeriods();
    return NextResponse.json({ success: true, data: periods });
  } catch (error) {
    console.error('NPS data GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Upload NPS issues CSV
// FormData fields: file (File), quarter (1–4), year (e.g. 2025)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quarter = formData.get('quarter') as string;
    const year = formData.get('year') as string;

    if (!file || !quarter || !year) {
      return NextResponse.json(
        { error: 'Missing required fields: file, quarter, year' },
        { status: 400 }
      );
    }

    const fileText = await file.text();
    const rows = parseNPSCSV(fileText);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file contains no valid data rows' },
        { status: 400 }
      );
    }

    const period = `Q${quarter}-${year}`;
    const result = await uploadNPSData(period, file.name, rows);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Uploaded ${rows.length} issues for ${period}`,
    });
  } catch (error) {
    console.error('NPS data POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a period and its issues
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');

    if (!period) {
      return NextResponse.json({ error: 'Missing period parameter' }, { status: 400 });
    }

    await deleteNPSPeriod(period);
    return NextResponse.json({ success: true, message: `Deleted NPS data for ${period}` });
  } catch (error) {
    console.error('NPS data DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete data' },
      { status: 500 }
    );
  }
}
