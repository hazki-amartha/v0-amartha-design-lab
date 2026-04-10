import { supabase } from '@/lib/supabase';
import { CSATRow, CSATDataRecord, MonthData } from './types';

export async function uploadCSVData(
  month: string,
  filename: string,
  rows: CSATRow[]
): Promise<CSATDataRecord> {
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

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload CSAT data: ${error.message}`);
  }

  return data as CSATDataRecord;
}

export async function listAllMonths(): Promise<MonthData[]> {
  const { data, error } = await supabase
    .from('csat_data')
    .select('month, filename, uploaded_at, row_count')
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Supabase list error:', error);
    throw new Error(`Failed to fetch months: ${error.message}`);
  }

  return (data || []).map((item) => ({
    month: item.month,
    filename: item.filename,
    uploaded_at: item.uploaded_at,
    row_count: item.row_count,
  })) as MonthData[];
}

export async function getMonthData(month: string): Promise<CSATDataRecord | null> {
  const { data, error } = await supabase
    .from('csat_data')
    .select('*')
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "no rows found" which is fine
    console.error('Supabase fetch error:', error);
    throw new Error(`Failed to fetch month data: ${error.message}`);
  }

  return (data || null) as CSATDataRecord | null;
}

export async function deleteMonthData(month: string): Promise<void> {
  const { error } = await supabase
    .from('csat_data')
    .delete()
    .eq('month', month);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Failed to delete month data: ${error.message}`);
  }
}
