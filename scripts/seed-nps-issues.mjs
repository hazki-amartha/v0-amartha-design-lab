/**
 * One-time migration: insert hardcoded NPS deepDiveData (Q4 2025) into Supabase issues table.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-nps-issues.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PERIOD = 'Q4-2025';

// Company BU mapping for NPS products
const PRODUCT_BU = {
  Modal:    'Lending',
  GGS:      'Funding',
  Celengan: 'Funding',
  PPOB:     'Payments',
};

// Source: NPS Report AFin Q4 2025
const deepDiveData = {
  Modal: {
    Monitoring: [
      { tag: 'DLB', title: 'DLB needed — loan status & installment breakdown missing', percentage: 52, impact: 'High' },
      { tag: 'DLB', title: 'Dedicated loan history page needed (1st, 2nd, completed vs ongoing)', percentage: 49, impact: 'High' },
      { tag: 'Loan Status', title: 'Loan application status unclear (pending PJ vs processing vs approved)', percentage: 44, impact: 'High' },
    ],
    Application: [
      { tag: 'Onboarding', title: 'Confused with loan application steps — group creation hardest (42%)', percentage: 47, impact: 'High' },
      { tag: 'Onboarding', title: 'Guidance for applying for loan — especially personal & business info', percentage: 41, impact: 'Medium' },
    ],
    Onboarding: [
      { tag: 'Onboarding', title: 'KYC issues — poor internet resilience, no recovery guidance after submission', percentage: 11, impact: 'Medium' },
      { tag: 'Onboarding', title: 'KYB difficulty choosing the right business sector', percentage: 7, impact: 'Low' },
    ],
    Disbursement: [
      { tag: 'Disbursement', title: 'Submission failures rising sharply — failed loan application with no auto-save', percentage: 46, impact: 'High' },
      { tag: 'Disbursement', title: 'Disbursement failures increased significantly in Q4', percentage: 39, impact: 'High' },
      { tag: 'Loan Status', title: 'No notification when loan is ready to disburse — banner goes unnoticed', percentage: 26, impact: 'High' },
      { tag: 'Loan Status', title: 'Do not understand how to disburse the loan', percentage: 20, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', title: 'App feels slow — reports of slowness jumped to 42% in Q4', percentage: 42, impact: 'High' },
      { tag: 'Loan Status', title: 'Users need repayment proof via WhatsApp — visibility gap in AFin, not preference', percentage: 30, impact: 'Medium' },
    ],
  },
  GGS: {
    Monitoring: [
      { tag: 'Profit Visibility', title: 'Investment profit hard to see on homepage — 71% struggle', percentage: 71, impact: 'High' },
      { tag: 'Profit Visibility', title: 'Confused when choosing investment product — differences unclear', percentage: 57, impact: 'High' },
      { tag: 'Performance', title: 'Portfolio data unreliable — incorrect or missing transaction history', percentage: 60, impact: 'High' },
    ],
    Application: [
      { tag: 'Onboarding', title: 'Key information hard to find — GGS details only in PDF via email', percentage: 29, impact: 'Medium' },
      { tag: 'Performance', title: 'Core investment actions fail — purchase and divest failures', percentage: 40, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', title: 'Product explanation unclear — tenor, returns, Dana usage, how to start (75%)', percentage: 75, impact: 'High' },
      { tag: 'Promo', title: 'Promo/bonus availability info is the top information need (100%)', percentage: 100, impact: 'High' },
    ],
    Disbursement: [
      { tag: 'Disbursement', title: 'Flexible divestment by amount — users want partial withdrawals for emergencies', percentage: 55, impact: 'High' },
      { tag: 'Disbursement', title: 'Divestment limit pain point — 36% want withdrawals above IDR 50M to avoid admin fees', percentage: 36, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', title: 'App performance slow and unstable — 80% of GGS lenders affected', percentage: 80, impact: 'High' },
      { tag: 'Profit Visibility', title: 'No clear profit calculation or comparison with Celengan / competitors', percentage: 36, impact: 'Medium' },
    ],
  },
  Celengan: {
    Monitoring: [
      { tag: 'Performance', title: 'Purchase failure — cannot buy Celengan despite sufficient Poket balance', percentage: 100, impact: 'High' },
      { tag: 'Profit Visibility', title: 'Product clarity and promotions are the top information gaps (39%)', percentage: 39, impact: 'Medium' },
    ],
    Application: [
      { tag: 'Onboarding', title: 'Poket top-up confusing — unclear how to start from homepage', percentage: 57, impact: 'Medium' },
      { tag: 'Promo', title: 'Promotion-related confusion is the biggest usability issue', percentage: 64, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', title: 'Users unclear on which Celengan product to choose', percentage: 39, impact: 'Medium' },
      { tag: 'Onboarding', title: 'Investment duration (tenor) unclear — 32% need clarity before deciding', percentage: 32, impact: 'Medium' },
    ],
    Disbursement: [
      { tag: 'Disbursement', title: 'Withdrawal flexibility — want to withdraw by custom amount (not fixed/full)', percentage: 85, impact: 'High' },
      { tag: 'Disbursement', title: 'Withdraw investments one by one is tedious and time-consuming', percentage: 60, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', title: 'App slowness affects key investing flows — mirrors Modal experience', percentage: 44, impact: 'High' },
      { tag: 'Performance', title: 'Data reliability — missing or incorrect Celengan asset/transaction data', percentage: 13, impact: 'Medium' },
    ],
  },
  PPOB: {
    Monitoring: [
      { tag: 'Loan Status', title: 'Transaction status unclear — no confirmation of success or failure', percentage: 48, impact: 'High' },
      { tag: 'Disbursement', title: 'Product unavailability / out-of-stock rose to 31% in Q4 (+14 pts)', percentage: 31, impact: 'Medium' },
    ],
    Application: [
      { tag: 'Performance', title: 'Long loading time or transaction failures jumped to 56% (+25 pts from Q3)', percentage: 56, impact: 'High' },
      { tag: 'Performance', title: 'Failed transactions with balance still deducted — rose to 33% (+8 pts)', percentage: 33, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', title: 'Confused which PPOB product is cheapest or most profitable (26%)', percentage: 31, impact: 'Medium' },
      { tag: 'Onboarding', title: 'Product selection hard when desired denomination unavailable', percentage: 26, impact: 'Medium' },
    ],
    Disbursement: [
      { tag: 'Promo', title: 'Promo/discount/cashback availability unclear — strongest purchase trigger (79%)', percentage: 79, impact: 'High' },
      { tag: 'Promo', title: 'Cost transparency — price changes and admin fees unclear (64%)', percentage: 64, impact: 'High' },
      { tag: 'Promo', title: 'Payment method clarity — which e-wallets/QRIS available (47%)', percentage: 47, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'DLB', title: 'Save frequently used products and customer phone numbers not supported', percentage: 47, impact: 'Medium' },
      { tag: 'Onboarding', title: 'Multiple payment methods (e-wallet, QRIS) needed for serving customers', percentage: 53, impact: 'High' },
    ],
  },
};

async function main() {
  console.log(`Seeding NPS issues for period ${PERIOD}...`);

  // Delete existing NPS issues for this period
  const { error: delError } = await supabase
    .from('issues')
    .delete()
    .match({ source: 'nps', period: PERIOD });
  if (delError) throw new Error(`Delete failed: ${delError.message}`);

  const rows = [];
  for (const [product_area, journeys] of Object.entries(deepDiveData)) {
    for (const [feature, issues] of Object.entries(journeys)) {
      for (const issue of issues) {
        rows.push({
          source: 'nps',
          period: PERIOD,
          title: issue.title,
          tag: issue.tag,
          impact: issue.impact,
          business_unit: PRODUCT_BU[product_area] ?? null,
          product_area,
          feature,
          count: null,
          percentage: issue.percentage,
          metadata: {},
        });
      }
    }
  }

  const { error } = await supabase.from('issues').insert(rows);
  if (error) throw new Error(`Insert failed: ${error.message}`);

  console.log(`✓ Inserted ${rows.length} NPS issues for ${PERIOD}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
