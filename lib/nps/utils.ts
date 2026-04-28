import type { NPSRow } from './types';

export function generateNPSTemplate(): string {
  const headers = ['product_area', 'business_unit', 'feature', 'tag', 'title', 'percentage', 'impact', 'count'];
  const exampleRows = [
    ['Modal', 'Lending', 'Monitoring', 'DLB', 'DLB needed — loan status & installment breakdown missing', '52', 'High', ''],
    ['Modal', 'Lending', 'Application', 'Onboarding', 'Confused with loan application steps', '47', 'High', ''],
    ['GGS', 'Funding', 'Monitoring', 'Profit Visibility', 'Investment profit hard to see on homepage', '71', 'High', ''],
    ['GGS', 'Funding', 'Onboarding', 'Promo', 'Promo/bonus availability info needed', '100', 'High', ''],
    ['PPOB', 'Payments', 'Application', 'Performance', 'Long loading time or transaction failures', '56', 'High', ''],
  ];

  return [headers.join(','), ...exampleRows.map(r => r.join(','))].join('\n');
}

export function downloadNPSTemplate(): void {
  const csv = generateNPSTemplate();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'nps-issues-template.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseNPSCSV(text: string): NPSRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows: NPSRow[] = [];

  const idx = (name: string, fallback: number) =>
    headers.indexOf(name) !== -1 ? headers.indexOf(name) : fallback;

  const iProductArea   = idx('product_area', 0);
  const iBusinessUnit  = idx('business_unit', 1);
  const iFeature       = idx('feature', 2);
  const iTag           = idx('tag', 3);
  const iTitle         = idx('title', 4);
  const iPercentage    = idx('percentage', 5);
  const iImpact        = idx('impact', 6);
  const iCount         = headers.indexOf('count'); // optional column

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle commas inside quoted fields
    const values = splitCSVLine(line);
    const rawCount = iCount !== -1 ? values[iCount]?.trim() : '';

    rows.push({
      product_area:  values[iProductArea]?.trim() || '',
      business_unit: values[iBusinessUnit]?.trim() || '',
      feature:       values[iFeature]?.trim() || '',
      tag:           values[iTag]?.trim() || '',
      title:         values[iTitle]?.trim() || '',
      percentage:    parseFloat(values[iPercentage] || '0') || 0,
      impact:        values[iImpact]?.trim() || '',
      count:         rawCount ? (parseInt(rawCount, 10) || null) : null,
    });
  }

  return rows.filter(r => r.title && r.product_area);
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
