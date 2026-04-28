import type { Issue } from './types';

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

export async function upsertIssuesForPeriod(
  source: 'csat' | 'nps',
  period: string,
  issues: Issue[]
): Promise<void> {
  if (issues.length === 0) return;
  const supabase = await getSupabase();

  await supabase.from('issues').delete().match({ source, period });

  const rows = issues.map(({ id: _id, created_at: _c, updated_at: _u, ...rest }) => rest);
  const { error } = await supabase.from('issues').insert(rows);
  if (error) throw new Error(`Failed to upsert issues: ${error.message}`);
}

export async function listIssues(filters?: {
  source?: 'csat' | 'nps';
  period?: string;
  product_area?: string;
  feature?: string;
  tag?: string;
  impact?: string;
}): Promise<Issue[]> {
  const supabase = await getSupabase();
  let query = supabase.from('issues').select('*').order('period', { ascending: false });

  if (filters?.source) query = query.eq('source', filters.source);
  if (filters?.period) query = query.eq('period', filters.period);
  if (filters?.product_area) query = query.eq('product_area', filters.product_area);
  if (filters?.feature) query = query.eq('feature', filters.feature);
  if (filters?.tag) query = query.eq('tag', filters.tag);
  if (filters?.impact) query = query.eq('impact', filters.impact);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch issues: ${error.message}`);
  return (data || []) as Issue[];
}

export async function getIssuesByIds(ids: string[]): Promise<Issue[]> {
  if (ids.length === 0) return [];
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('issues').select('*').in('id', ids);
  if (error) throw new Error(`Failed to fetch issues by ids: ${error.message}`);
  return (data || []) as Issue[];
}

export async function deleteIssuesForPeriod(
  source: 'csat' | 'nps',
  period: string
): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('issues').delete().match({ source, period });
  if (error) throw new Error(`Failed to delete issues: ${error.message}`);
}
