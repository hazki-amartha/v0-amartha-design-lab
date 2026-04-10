/**
 * Seed script for local development — writes directly to .local-data/insights/
 * No running dev server needed.
 *
 * Usage:
 *   node scripts/seed-insights.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '.local-data', 'insights');

const BUS = ['Payments', 'Lending', 'Investment', 'Insurance'];

const FEATURES = {
  Payments: ['CSAT Top-up Poket', 'CSAT Kirim Uang', 'CSAT E-wallet', 'CSAT Bayar Tagihan'],
  Lending: ['CSAT Create Majelis', 'CSAT Pengajuan Pinjaman', 'CSAT Cicilan'],
  Investment: ['CSAT Reksa Dana', 'CSAT Obligasi'],
  Insurance: ['CSAT Klaim Asuransi', 'CSAT Beli Asuransi'],
};

const PAIN_POINTS = [
  'Proses terlalu lama',
  'Aplikasi sering error',
  'Antarmuka membingungkan',
  'Fitur tidak berfungsi',
  'Loading lama',
  'Tidak bisa melanjutkan transaksi',
  'OTP tidak terkirim',
  'Saldo tidak update',
];

const DELIGHT_POINTS = [
  'Proses cepat dan mudah',
  'Tampilan bersih dan intuitif',
  'Notifikasi real-time sangat membantu',
  'Biaya transfer gratis',
  'Customer service responsif',
  'Fitur lengkap',
  'Transaksi aman dan terpercaya',
];

const SEGMENTS = [
  'afin_active_borrowers',
  'afin_promo_landing_page_rollout',
  'afin_new_users',
  'afin_premium_users',
];

const OS_OPTIONS = ['Android', 'iOS'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedCategory() {
  const r = Math.random();
  if (r < 0.50) return 'delighted';
  if (r < 0.80) return 'satisfied';
  return 'dissatisfied';
}

function generateRows(count = 600) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const bu = pick(BUS);
    const trigger = pick(FEATURES[bu]);
    const category = weightedCategory();

    let feedback = '';
    let label = '';
    if (category === 'delighted') {
      feedback = pick(DELIGHT_POINTS);
      label = 'Sangat puas';
    } else if (category === 'satisfied') {
      feedback = '';
      label = 'Puas';
    } else {
      feedback = pick(PAIN_POINTS);
      label = 'Tidak puas';
    }

    rows.push({
      OS: pick(OS_OPTIONS),
      trigger_event: trigger,
      business_unit: bu,
      csat_category: category,
      detailed_feedback: feedback,
      csat_label: label,
      app_segments: pick(SEGMENTS),
      Occurrences: Math.floor(Math.random() * 8) + 1,
    });
  }
  return rows;
}

function seedMonth(month, year) {
  const label = `${year}-${String(month).padStart(2, '0')}`;
  const rows = generateRows(600);
  const record = {
    id: label,
    month: label,
    filename: `${label}-seed.csv`,
    data: rows,
    row_count: rows.length,
    uploaded_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${label}.json`), JSON.stringify(record, null, 2));
  console.log(`✓ Seeded ${label} — ${rows.length} rows`);
}

console.log('Seeding insights data...\n');
const now = new Date();
for (let i = 2; i >= 0; i--) {
  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
  seedMonth(d.getMonth() + 1, d.getFullYear());
}
console.log('\nDone. Refresh the Insights page.');
