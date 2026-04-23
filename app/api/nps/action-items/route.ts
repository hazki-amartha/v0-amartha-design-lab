import { NextResponse } from 'next/server';
import { actionItems } from '@/lib/nps/data';

const SHEET_ID = '1Wyxzyc8db8M75lo0GbxlDA-IoFEx52ZH8RwUTQva34k';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

type Status = 'backlog' | 'inProgress' | 'planned';

function mapStatus(raw: string): Status {
  const s = raw.trim();
  if (s === 'In Progress') return 'inProgress';
  if (s === 'Released') return 'planned';
  return 'backlog';
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let cur = '';
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

export async function GET() {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Sheet returned ${res.status}`);

    const text = await res.text();
    const [, ...dataRows] = parseCSV(text);

    const grouped: Record<Status, object[]> = { backlog: [], inProgress: [], planned: [] };

    for (const row of dataRows) {
      if (!row[0]) continue;
      grouped[mapStatus(row[4] ?? '')].push({
        feature: row[0] ?? '',
        tag:     row[1] ?? '',
        product: row[2] ?? '',
        impact:  (row[3] ?? 'Medium') as 'High' | 'Medium' | 'Low',
        status:  row[4] ?? 'Backlog',
        owner:   '',
        notes:   row[5] || undefined,
      });
    }

    return NextResponse.json(grouped);
  } catch {
    // Sheet not yet public or unavailable — return hardcoded fallback
    return NextResponse.json(actionItems);
  }
}
