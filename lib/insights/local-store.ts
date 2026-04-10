/**
 * Local file-based store used when Supabase env vars are not configured.
 * Data is written to .local-data/insights/ at the project root.
 * This directory is gitignored.
 */
import fs from 'fs';
import path from 'path';
import { CSATRow, CSATDataRecord, MonthData } from './types';

const DATA_DIR = path.join(process.cwd(), '.local-data', 'insights');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function monthFilePath(month: string) {
  return path.join(DATA_DIR, `${month}.json`);
}

export async function localUpload(
  month: string,
  filename: string,
  rows: CSATRow[]
): Promise<CSATDataRecord> {
  ensureDir();
  const record: CSATDataRecord = {
    id: month,
    month,
    filename,
    data: rows,
    row_count: rows.length,
    uploaded_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(monthFilePath(month), JSON.stringify(record, null, 2));
  return record;
}

export async function localListMonths(): Promise<MonthData[]> {
  ensureDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const record: CSATDataRecord = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')
      );
      return {
        month: record.month,
        filename: record.filename,
        uploaded_at: record.uploaded_at,
        row_count: record.row_count,
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month));
}

export async function localGetMonth(month: string): Promise<CSATDataRecord | null> {
  const filePath = monthFilePath(month);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CSATDataRecord;
}

export async function localDeleteMonth(month: string): Promise<void> {
  const filePath = monthFilePath(month);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
