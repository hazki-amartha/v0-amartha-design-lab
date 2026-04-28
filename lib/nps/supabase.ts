import type { NPSRow, NPSDataRecord, NPSPeriodData } from './types';
import { npsRowToIssue } from '@/lib/issues/types';
import { upsertIssuesForPeriod } from '@/lib/issues/supabase';

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

export async function uploadNPSData(
  period: string,
  filename: string,
  rows: NPSRow[]
): Promise<NPSDataRecord> {
  const supabase = await getSupabase();

  // Delete existing record for this period (upsert pattern)
  await supabase.from('nps_data').delete().eq('period', period);

  const { data, error } = await supabase
    .from('nps_data')
    .insert({
      period,
      filename,
      data: rows,
      row_count: rows.length,
      uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to upload NPS data: ${error.message}`);

  // Derive and upsert issues from uploaded rows
  const issues = rows.map(row => npsRowToIssue(row, period));
  await upsertIssuesForPeriod('nps', period, issues);

  return data as NPSDataRecord;
}

export async function listNPSPeriods(): Promise<NPSPeriodData[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('nps_data')
    .select('period, filename, uploaded_at, row_count')
    .order('uploaded_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch NPS periods: ${error.message}`);
  return (data || []) as NPSPeriodData[];
}

export async function getNPSPeriodData(period: string): Promise<NPSDataRecord | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('nps_data')
    .select('*')
    .eq('period', period)
    .single();

  if (error && error.code !== 'PGRST116')
    throw new Error(`Failed to fetch NPS period data: ${error.message}`);
  return (data || null) as NPSDataRecord | null;
}

export async function deleteNPSPeriod(period: string): Promise<void> {
  const supabase = await getSupabase();

  // Issues cascade-delete via the upsertIssuesForPeriod delete-before-insert pattern
  const { error: issueError } = await supabase
    .from('issues')
    .delete()
    .match({ source: 'nps', period });
  if (issueError) throw new Error(`Failed to delete NPS issues: ${issueError.message}`);

  const { error } = await supabase.from('nps_data').delete().eq('period', period);
  if (error) throw new Error(`Failed to delete NPS period: ${error.message}`);
}
