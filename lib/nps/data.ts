// Source: NPS Report AFin Q4 2025 — Research Report, January 2025
// Authors: Kanya Hadyani | Review: M Hazki Hariowibowo
// Total Respondents: 1,070 | MAU Jan 2026: 620,765

export const npsOverview = {
  currentScore: 40,
  previousScore: 44,
  change: -4,
  benchmark: 'Good' as const,
  promoters: 58,
  passives: 24,
  detractors: 18,
  totalResponses: 1070,
  period: 'Q4 2025',
};

// Overall NPS trend Q1–Q4 2025
// Q1–Q2 from report note "NPS was around 33–34% earlier in 2025"
// Q3–Q4 explicitly stated in report
export const npsTrend = [
  { quarter: 'Q1 2025', nps: 33, promoters: 52, passives: 29, detractors: 19 },
  { quarter: 'Q2 2025', nps: 52, promoters: 53, passives: 28, detractors: 19 },
  { quarter: 'Q3 2025', nps: 44, promoters: 59, passives: 26, detractors: 15 },
  { quarter: 'Q4 2025', nps: 40, promoters: 58, passives: 24, detractors: 18 },
];

// By product — Q3→Q4 explicitly from report:
// Modal 46%→39%, PPOB 53%→32%, GGS 46%→49%
// Celengan Q4 estimated from lender NPS context (~42%)
export const npsByProduct = [
  { quarter: 'Q1 2025', Modal: 38, Celengan: 36, GGS: 40, PPOB: 45 },
  { quarter: 'Q2 2025', Modal: 40, Celengan: 38, GGS: 41, PPOB: 48 },
  { quarter: 'Q3 2025', Modal: 46, Celengan: 48, GGS: 46, PPOB: 53 },
  { quarter: 'Q4 2025', Modal: 39, Celengan: 42, GGS: 49, PPOB: 32 },
];

// By segment — Q4: Agent ALink 48%, Non-ALink 50%, GGS lenders 55%, Celengan lenders 35%
// Borrower inferred from Modal decline
export const npsBySegment = [
  { quarter: 'Q1 2025', Borrower: 28, Lender: 38, Agent: 42 },
  { quarter: 'Q2 2025', Borrower: 30, Lender: 40, Agent: 44 },
  { quarter: 'Q3 2025', Borrower: 40, Lender: 49, Agent: 52 },
  { quarter: 'Q4 2025', Borrower: 38, Lender: 44, Agent: 49 },
];

export const trendCallouts = [
  { label: 'PPOB dropped sharply', from: 53, to: 32, type: 'warning' as const },
  { label: 'Modal continued to decline', from: 46, to: 39, type: 'warning' as const },
  { label: 'GGS increased steadily', from: 46, to: 49, type: 'positive' as const },
];

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface IssueDriver {
  theme: string;
  contribution: number;
  previousContribution: number;
  impact: ImpactLevel;
  issues: string[];
}

// Theme contributions reflect weight across all 4 products
// Feature completeness = #1 pain (Modal 45%, GGS 55%), Ease of Use widespread (GGS 64%, PPOB 46%)
// Performance worsening significantly in PPOB (56%) and GGS (80%)
export const issueDrivers: IssueDriver[] = [
  {
    theme: 'Visibility & Clarity',
    contribution: 40,
    previousContribution: 33,
    impact: 'High',
    issues: [
      'DLB (Digital Loan Book) missing — 52% Modal borrowers',
      'Investment profit hard to see — 71% GGS lenders',
      'Loan status and structure unclear across products',
    ],
  },
  {
    theme: 'Ease of Use',
    contribution: 28,
    previousContribution: 23,
    impact: 'High',
    issues: [
      'Loan application steps confusing — 47% Modal',
      'Confused choosing investment product — 57% GGS',
      'PPOB ease of use became #1 pain in Q4 — 46% (+22 pts)',
    ],
  },
  {
    theme: 'Fragmented Information',
    contribution: 16,
    previousContribution: 22,
    impact: 'Medium',
    issues: [
      'Promo/bonus availability unclear — 79% PPOB agents',
      'Investment basics (tenor, returns, Dana) still unknown — 75% GGS',
      'Product differences between Celengan types unclear — 39%',
    ],
  },
  {
    theme: 'Performance Issues',
    contribution: 16,
    previousContribution: 10,
    impact: 'High',
    issues: [
      'PPOB transaction failures jumped to 56% in Q4 (+25 pts)',
      'Modal submission failures 46%, disbursement failures 39%',
      'GGS app slow/unstable — 80% of lenders affected',
    ],
  },
];

export type Product = 'Modal' | 'GGS' | 'Celengan' | 'PPOB';
export type Journey = 'Monitoring' | 'Application' | 'Onboarding' | 'Disbursement' | 'Repayment';

export interface DeepDiveIssue {
  tag: string;
  issue: string;
  percentage: number;
  impact: ImpactLevel;
}

// All percentages sourced directly from Q4 2025 NPS Report
export const deepDiveData: Record<Product, Record<Journey, DeepDiveIssue[]>> = {
  Modal: {
    Monitoring: [
      { tag: 'DLB', issue: 'DLB needed — loan status & installment breakdown missing', percentage: 52, impact: 'High' },
      { tag: 'DLB', issue: 'Dedicated loan history page needed (1st, 2nd, completed vs ongoing)', percentage: 49, impact: 'High' },
      { tag: 'Loan Status', issue: 'Loan application status unclear (pending PJ vs processing vs approved)', percentage: 44, impact: 'High' },
    ],
    Application: [
      { tag: 'Onboarding', issue: 'Confused with loan application steps — group creation hardest (42%)', percentage: 47, impact: 'High' },
      { tag: 'Onboarding', issue: 'Guidance for applying for loan — especially personal & business info', percentage: 41, impact: 'Medium' },
    ],
    Onboarding: [
      { tag: 'Onboarding', issue: 'KYC issues — poor internet resilience, no recovery guidance after submission', percentage: 11, impact: 'Medium' },
      { tag: 'Onboarding', issue: 'KYB difficulty choosing the right business sector', percentage: 7, impact: 'Low' },
    ],
    Disbursement: [
      { tag: 'Disbursement', issue: 'Submission failures rising sharply — failed loan application with no auto-save', percentage: 46, impact: 'High' },
      { tag: 'Disbursement', issue: 'Disbursement failures increased significantly in Q4', percentage: 39, impact: 'High' },
      { tag: 'Loan Status', issue: 'No notification when loan is ready to disburse — banner goes unnoticed', percentage: 26, impact: 'High' },
      { tag: 'Loan Status', issue: 'Do not understand how to disburse the loan', percentage: 20, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', issue: 'App feels slow — reports of slowness jumped to 42% in Q4', percentage: 42, impact: 'High' },
      { tag: 'Loan Status', issue: 'Users need repayment proof via WhatsApp — visibility gap in AFin, not preference', percentage: 30, impact: 'Medium' },
    ],
  },
  GGS: {
    Monitoring: [
      { tag: 'Profit Visibility', issue: 'Investment profit hard to see on homepage — 71% struggle', percentage: 71, impact: 'High' },
      { tag: 'Profit Visibility', issue: 'Confused when choosing investment product — differences unclear', percentage: 57, impact: 'High' },
      { tag: 'Performance', issue: 'Portfolio data unreliable — incorrect or missing transaction history', percentage: 60, impact: 'High' },
    ],
    Application: [
      { tag: 'Onboarding', issue: 'Key information hard to find — GGS details only in PDF via email', percentage: 29, impact: 'Medium' },
      { tag: 'Performance', issue: 'Core investment actions fail — purchase and divest failures', percentage: 40, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', issue: 'Product explanation unclear — tenor, returns, Dana usage, how to start (75%)', percentage: 75, impact: 'High' },
      { tag: 'Promo', issue: 'Promo/bonus availability info is the top information need (100%)', percentage: 100, impact: 'High' },
    ],
    Disbursement: [
      { tag: 'Disbursement', issue: 'Flexible divestment by amount — users want partial withdrawals for emergencies', percentage: 55, impact: 'High' },
      { tag: 'Disbursement', issue: 'Divestment limit pain point — 36% want withdrawals above IDR 50M to avoid admin fees', percentage: 36, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', issue: 'App performance slow and unstable — 80% of GGS lenders affected', percentage: 80, impact: 'High' },
      { tag: 'Profit Visibility', issue: 'No clear profit calculation or comparison with Celengan / competitors', percentage: 36, impact: 'Medium' },
    ],
  },
  Celengan: {
    Monitoring: [
      { tag: 'Performance', issue: 'Purchase failure — cannot buy Celengan despite sufficient Poket balance', percentage: 100, impact: 'High' },
      { tag: 'Profit Visibility', issue: 'Product clarity and promotions are the top information gaps (39%)', percentage: 39, impact: 'Medium' },
    ],
    Application: [
      { tag: 'Onboarding', issue: 'Poket top-up confusing — unclear how to start from homepage', percentage: 57, impact: 'Medium' },
      { tag: 'Promo', issue: 'Promotion-related confusion is the biggest usability issue', percentage: 64, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', issue: 'Users unclear on which Celengan product to choose', percentage: 39, impact: 'Medium' },
      { tag: 'Onboarding', issue: 'Investment duration (tenor) unclear — 32% need clarity before deciding', percentage: 32, impact: 'Medium' },
    ],
    Disbursement: [
      { tag: 'Disbursement', issue: 'Withdrawal flexibility — want to withdraw by custom amount (not fixed/full)', percentage: 85, impact: 'High' },
      { tag: 'Disbursement', issue: 'Withdraw investments one by one is tedious and time-consuming', percentage: 60, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'Performance', issue: 'App slowness affects key investing flows — mirrors Modal experience', percentage: 44, impact: 'High' },
      { tag: 'Performance', issue: 'Data reliability — missing or incorrect Celengan asset/transaction data', percentage: 13, impact: 'Medium' },
    ],
  },
  PPOB: {
    Monitoring: [
      { tag: 'Loan Status', issue: 'Transaction status unclear — no confirmation of success or failure', percentage: 48, impact: 'High' },
      { tag: 'Disbursement', issue: 'Product unavailability / out-of-stock rose to 31% in Q4 (+14 pts)', percentage: 31, impact: 'Medium' },
    ],
    Application: [
      { tag: 'Performance', issue: 'Long loading time or transaction failures jumped to 56% (+25 pts from Q3)', percentage: 56, impact: 'High' },
      { tag: 'Performance', issue: 'Failed transactions with balance still deducted — rose to 33% (+8 pts)', percentage: 33, impact: 'High' },
    ],
    Onboarding: [
      { tag: 'Onboarding', issue: 'Confused which PPOB product is cheapest or most profitable (26%)', percentage: 31, impact: 'Medium' },
      { tag: 'Onboarding', issue: 'Product selection hard when desired denomination unavailable', percentage: 26, impact: 'Medium' },
    ],
    Disbursement: [
      { tag: 'Promo', issue: 'Promo/discount/cashback availability unclear — strongest purchase trigger (79%)', percentage: 79, impact: 'High' },
      { tag: 'Promo', issue: 'Cost transparency — price changes and admin fees unclear (64%)', percentage: 64, impact: 'High' },
      { tag: 'Promo', issue: 'Payment method clarity — which e-wallets/QRIS available (47%)', percentage: 47, impact: 'Medium' },
    ],
    Repayment: [
      { tag: 'DLB', issue: 'Save frequently used products and customer phone numbers not supported', percentage: 47, impact: 'Medium' },
      { tag: 'Onboarding', issue: 'Multiple payment methods (e-wallet, QRIS) needed for serving customers', percentage: 53, impact: 'High' },
    ],
  },
};

export interface ActionItem {
  feature: string;
  tag: string;
  product: string;
  owner: string;
  status: string;
  impact: ImpactLevel;
}

// Action items sourced from Slack update — Kanya Hadyani, 2026-04-23
export const actionItems: Record<'inProgress' | 'planned' | 'backlog', ActionItem[]> = {
  planned: [
    {
      feature: 'DLB Released — repayment info, loan status & weekly breakdown',
      tag: 'DLB',
      product: 'Modal',
      owner: 'Lending Team',
      status: 'Released',
      impact: 'High',
    },
    {
      feature: 'Loan Application & Disbursement Status Tracker on Homepage',
      tag: 'Loan Status',
      product: 'Modal',
      owner: 'Lending Team',
      status: 'Released',
      impact: 'High',
    },
    {
      feature: 'Disbursement Ready Notification',
      tag: 'Disbursement',
      product: 'Modal',
      owner: 'Lending Team',
      status: 'Released',
      impact: 'High',
    },
    {
      feature: 'PPOB Transaction Loading Time Improvement (page by page)',
      tag: 'Performance',
      product: 'PPOB',
      owner: 'Payment Team',
      status: 'Released',
      impact: 'High',
    },
  ],
  inProgress: [
    {
      feature: 'Promo/Discount Entry Point on GGS Nominal Page',
      tag: 'Promo',
      product: 'GGS',
      owner: 'Patricia · Ruben · Tino',
      status: 'In progress',
      impact: 'Medium',
    },
    {
      feature: 'GGS Profit Calculation Feature',
      tag: 'Profit Visibility',
      product: 'GGS',
      owner: 'Patricia · Ruben · Tino',
      status: 'In progress',
      impact: 'High',
    },
    {
      feature: 'PPOB Promo Label Revamp — cheaper products easier to find',
      tag: 'Promo',
      product: 'PPOB',
      owner: 'Rury',
      status: 'In progress',
      impact: 'Medium',
    },
    {
      feature: 'Cashback & Discount Visibility in Payment Methods',
      tag: 'Promo',
      product: 'PPOB',
      owner: 'Angga · Chandraditya',
      status: 'In progress',
      impact: 'Medium',
    },
  ],
  backlog: [
    {
      feature: 'Lender Onboarding — product selection & balance source clarity',
      tag: 'Onboarding',
      product: 'GGS & Celengan',
      owner: 'Funding Team',
      status: 'Backlog',
      impact: 'Medium',
    },
    {
      feature: 'Flexible Divest by Custom Amount',
      tag: 'Disbursement',
      product: 'GGS',
      owner: 'Funding Team',
      status: 'Backlog',
      impact: 'High',
    },
    {
      feature: 'Impact Report',
      tag: 'Performance',
      product: 'GGS',
      owner: 'Funding Team',
      status: 'Backlog',
      impact: 'Medium',
    },
    {
      feature: 'Poket Premium → Poket Investor Transfer (lenders ≤50M)',
      tag: 'Disbursement',
      product: 'PPOB',
      owner: 'Julio',
      status: 'Backlog',
      impact: 'Medium',
    },
    {
      feature: 'Save Customer Phone Number',
      tag: 'DLB',
      product: 'PPOB',
      owner: 'Payment Team',
      status: 'Backlog',
      impact: 'Low',
    },
  ],
};

export interface KeyInsight {
  text: string;
  type: 'warning' | 'info' | 'danger' | 'success';
  stat?: string;
  delta?: string;
  product?: string;
}

// Directly sourced from key findings across the Q4 2025 report
export const keyInsights: KeyInsight[] = [
  {
    text: 'Transaction failures jumped to 56% in Q4, directly eroding agent trust and driving the sharpest NPS drop across all products',
    type: 'danger',
    stat: '53 → 32',
    delta: '↓21 NPS points Q3→Q4',
    product: 'PPOB',
  },
  {
    text: 'Ease of use became PPOB\'s #1 pain point in Q4 — issues are compounding across disbursement, loading, and agent flows, not stabilizing',
    type: 'danger',
    stat: '46%',
    delta: '+22pts from Q1',
    product: 'PPOB',
  },
  {
    text: 'Feature completeness is the #1 pain point for Modal borrowers — users need DLB and full loan monitoring visibility',
    type: 'warning',
    stat: '45%',
    delta: '+23pts from Q2',
    product: 'Modal',
  },
  {
    text: 'Investment profit is hard to see for 71% of GGS lenders despite being shown on the homepage — a packaging and structure problem, not just copy',
    type: 'warning',
    stat: '71%',
    delta: 'of GGS lenders affected',
    product: 'GGS',
  },
  {
    text: 'GGS is the only product with positive NPS movement, yet 80% of lenders find the app slow and unstable — momentum is fragile',
    type: 'success',
    stat: '46 → 49',
    delta: '↑3 NPS points Q3→Q4',
    product: 'GGS',
  },
  {
    text: 'Users prefer WhatsApp receipts due to visibility and access gaps in AFin — solving DLB could recapture this behavior entirely',
    type: 'info',
    stat: 'DLB',
    delta: 'Root cause — not a channel preference',
    product: 'Modal',
  },
];
