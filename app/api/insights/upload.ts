import { NextRequest, NextResponse } from 'next/server';
import { parseCSV } from '@/lib/insights/utils';
import { uploadCSVData } from '@/lib/insights/supabase';

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
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
