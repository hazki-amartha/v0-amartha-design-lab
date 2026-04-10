import { CSATRow, CSATDataRecord, MonthData } from './types';
import {
  localUpload,
  localListMonths,
  localGetMonth,
  localDeleteMonth,
} from './local-store';

const isLocal =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

export async function uploadCSVData(
  month: string,
  filename: string,
  rows: CSATRow[]
): Promise<CSATDataRecord> {
  if (isLocal) return localUpload(month, filename, rows);

  const supabase = await getSupabase();

  // Delete existing record for this month first (upsert pattern)
  await supabase.from('csat_data').delete().eq('month', month);

  const { data, error } = await supabase
    .from('csat_data')
    .insert({
      month,
      filename,
      data: rows,
      row_count: rows.length,
      uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to upload CSAT data: ${error.message}`);
  return data as CSATDataRecord;
}

export async function listAllMonths(): Promise<MonthData[]> {
  if (isLocal) return localListMonths();

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('csat_data')
    .select('month, filename, uploaded_at, row_count')
    .order('uploaded_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch months: ${error.message}`);
  return (data || []).map((item) => ({
    month: item.month,
    filename: item.filename,
    uploaded_at: item.uploaded_at,
    row_count: item.row_count,
  })) as MonthData[];
}

export async function getMonthData(month: string): Promise<CSATDataRecord | null> {
  if (isLocal) return localGetMonth(month);

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('csat_data')
    .select('*')
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116')
    throw new Error(`Failed to fetch month data: ${error.message}`);
  return (data || null) as CSATDataRecord | null;
}

export async function deleteMonthData(month: string): Promise<void> {
  if (isLocal) return localDeleteMonth(month);

  const supabase = await getSupabase();
  const { error } = await supabase
    .from('csat_data')
    .delete()
    .eq('month', month);

  if (error) throw new Error(`Failed to delete month data: ${error.message}`);
}
