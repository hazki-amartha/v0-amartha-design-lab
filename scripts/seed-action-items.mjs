/**
 * One-time migration: insert hardcoded action items from lib/nps/data.ts into Supabase.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-action-items.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Source: Slack update — Kanya Hadyani, 2026-04-23
const actionItems = [
  // Released
  { title: 'DLB Released — repayment info, loan status & weekly breakdown', tag: 'DLB', product_area: 'Modal', owner: 'Lending Team', status: 'released', impact: 'High', notes: null },
  { title: 'Loan Application & Disbursement Status Tracker on Homepage', tag: 'Loan Status', product_area: 'Modal', owner: 'Lending Team', status: 'released', impact: 'High', notes: null },
  { title: 'Disbursement Ready Notification', tag: 'Disbursement', product_area: 'Modal', owner: 'Lending Team', status: 'released', impact: 'High', notes: null },
  { title: 'PPOB Transaction Loading Time Improvement (page by page)', tag: 'Performance', product_area: 'PPOB', owner: 'Payment Team', status: 'released', impact: 'High', notes: null },
  // In Progress
  { title: 'Promo/Discount Entry Point on GGS Nominal Page', tag: 'Promo', product_area: 'GGS', owner: 'Patricia · Ruben · Tino', status: 'in_progress', impact: 'Medium', notes: null },
  { title: 'GGS Profit Calculation Feature', tag: 'Profit Visibility', product_area: 'GGS', owner: 'Patricia · Ruben · Tino', status: 'in_progress', impact: 'High', notes: null },
  { title: 'PPOB Promo Label Revamp — cheaper products easier to find', tag: 'Promo', product_area: 'PPOB', owner: 'Rury', status: 'in_progress', impact: 'Medium', notes: null },
  { title: 'Cashback & Discount Visibility in Payment Methods', tag: 'Promo', product_area: 'PPOB', owner: 'Angga · Chandraditya', status: 'in_progress', impact: 'Medium', notes: null },
  // Backlog
  { title: 'Lender Onboarding — product selection & balance source clarity', tag: 'Onboarding', product_area: 'GGS & Celengan', owner: 'Funding Team', status: 'backlog', impact: 'Medium', notes: null },
  { title: 'Flexible Divest by Custom Amount', tag: 'Disbursement', product_area: 'GGS', owner: 'Funding Team', status: 'backlog', impact: 'High', notes: null },
  { title: 'Impact Report', tag: 'Performance', product_area: 'GGS', owner: 'Funding Team', status: 'backlog', impact: 'Medium', notes: null },
  { title: 'Poket Premium → Poket Investor Transfer (lenders ≤50M)', tag: 'Disbursement', product_area: 'PPOB', owner: 'Julio', status: 'backlog', impact: 'Medium', notes: null },
  { title: 'Save Customer Phone Number', tag: 'DLB', product_area: 'PPOB', owner: 'Payment Team', status: 'backlog', impact: 'Low', notes: null },
];

async function main() {
  console.log('Seeding action items...');

  const { data: existing } = await supabase.from('action_items').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Action items table already has data. Skipping to avoid duplicates.');
    console.log('To re-seed, delete existing rows first.');
    return;
  }

  const { error } = await supabase.from('action_items').insert(actionItems);
  if (error) throw new Error(`Insert failed: ${error.message}`);

  console.log(`✓ Inserted ${actionItems.length} action items`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
