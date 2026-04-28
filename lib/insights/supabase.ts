import { CSATRow, CSATDataRecord, MonthData } from './types';
import { aggregateByFeature } from './utils';
import { csatFeedbackItemToIssue } from '@/lib/issues/types';
import { upsertIssuesForPeriod } from '@/lib/issues/supabase';

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

export async function uploadCSVData(
  month: string,
  filename: string,
  rows: CSATRow[]
): Promise<CSATDataRecord> {
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

  // Derive pain-point issues and persist to the canonical issues table
  const features = aggregateByFeature(rows);
  const issues = features.flatMap(feature =>
    feature.pain_points.map(item => csatFeedbackItemToIssue(item, feature, month))
  );
  await upsertIssuesForPeriod('csat', month, issues);

  return data as CSATDataRecord;
}

export async function listAllMonths(): Promise<MonthData[]> {
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
  const supabase = await getSupabase();

  // Remove derived issues first, then the raw data
  await supabase.from('issues').delete().match({ source: 'csat', period: month });

  const { error } = await supabase
    .from('csat_data')
    .delete()
    .eq('month', month);

  if (error) throw new Error(`Failed to delete month data: ${error.message}`);
}
