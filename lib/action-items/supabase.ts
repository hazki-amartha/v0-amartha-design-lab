import type { ActionItem, Issue } from '@/lib/issues/types';

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

export async function listActionItems(filters?: {
  status?: string;
  product_area?: string;
  tag?: string;
  impact?: string;
}): Promise<ActionItem[]> {
  const supabase = await getSupabase();
  let query = supabase.from('action_items').select('*').order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.product_area) query = query.eq('product_area', filters.product_area);
  if (filters?.tag) query = query.eq('tag', filters.tag);
  if (filters?.impact) query = query.eq('impact', filters.impact);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch action items: ${error.message}`);
  return (data || []) as ActionItem[];
}

export async function createActionItem(item: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>): Promise<ActionItem> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('action_items')
    .insert(item)
    .select()
    .single();

  if (error) throw new Error(`Failed to create action item: ${error.message}`);
  return data as ActionItem;
}

export async function updateActionItem(
  id: string,
  patch: Partial<Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>>
): Promise<ActionItem> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('action_items')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update action item: ${error.message}`);
  return data as ActionItem;
}

export async function deleteActionItem(id: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('action_items').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete action item: ${error.message}`);
}

export async function linkIssue(actionItemId: string, issueId: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('issue_action_links')
    .insert({ action_item_id: actionItemId, issue_id: issueId });
  if (error) throw new Error(`Failed to link issue: ${error.message}`);
}

export async function unlinkIssue(actionItemId: string, issueId: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('issue_action_links')
    .delete()
    .match({ action_item_id: actionItemId, issue_id: issueId });
  if (error) throw new Error(`Failed to unlink issue: ${error.message}`);
}

export async function getLinkedIssues(actionItemId: string): Promise<Issue[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('issue_action_links')
    .select('issues(*)')
    .eq('action_item_id', actionItemId);

  if (error) throw new Error(`Failed to fetch linked issues: ${error.message}`);
  // Supabase returns the nested relation as an object (not array) per row
  return (data || []).map((r: Record<string, unknown>) => r.issues as Issue).filter(Boolean);
}

export async function getLinkedActions(issueId: string): Promise<ActionItem[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('issue_action_links')
    .select('action_items(*)')
    .eq('issue_id', issueId);

  if (error) throw new Error(`Failed to fetch linked actions: ${error.message}`);
  return (data || []).map((r: Record<string, unknown>) => r.action_items as ActionItem).filter(Boolean);
}
