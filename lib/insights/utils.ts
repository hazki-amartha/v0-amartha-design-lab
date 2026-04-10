import { CSATRow, BUScorecard, FeatureDetail, FeedbackItem, FeatureScore } from './types';

export function generateCSVTemplate(): string {
  const headers = ['OS', 'trigger_event', 'business_unit', 'csat_category', 'detailed_feedback', 'csat_label', 'app_segments', 'Occurrences'];
  const exampleRows = [
    ['Android', 'CSAT Kirim Uang', 'Payments', 'delighted', 'Biaya transfer gratis, uang langsung masuk', 'Sangat puas', 'afin_active_borrowers', '1'],
    ['iOS', 'CSAT Top-up Poket', 'Payments', 'satisfied', 'Proses transfer cepat', 'Puas', 'afin_promo_landing_page_rollout', '5'],
    ['Android', 'CSAT Create Majelis', 'Lending', 'dissatisfied', 'Proses pembuatan majelis terlalu rumit', 'Tidak puas', 'afin_active_borrowers', '2'],
  ];
  
  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.join(',')),
  ].join('\n');
  
  return csvContent;
}

export function downloadCSVTemplate(): void {
  const csv = generateCSVTemplate();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'csat-template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(text: string): CSATRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CSATRow[] = [];

  // Map header indices for flexible parsing
  const headerIndices: Record<string, number> = {};
  headers.forEach((header, index) => {
    headerIndices[header.toLowerCase()] = index;
  });

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim());
    
    // Use header mapping to extract values flexibly
    const row: CSATRow = {
      OS: values[headerIndices['os'] || 0] || '',
      trigger_event: values[headerIndices['trigger_event'] || 1] || '',
      business_unit: values[headerIndices['business_unit'] || 2] || '',
      csat_category: values[headerIndices['csat_category'] || 3] || '',
      detailed_feedback: values[headerIndices['detailed_feedback'] || 4] || '',
      csat_label: values[headerIndices['csat_label'] || 5] || '',
      app_segments: values[headerIndices['app_segments'] || 6] || '',
      Occurrences: parseInt(values[headerIndices['occurrences'] || 7] || '1', 10),
    };
    rows.push(row);
  }

  return rows;
}

export function aggregateByBU(rows: CSATRow[]): BUScorecard[] {
  const buMap = new Map<string, { delighted: number; satisfied: number; dissatisfied: number; total: number }>();

  for (const row of rows) {
    const bu = row.business_unit || 'Unknown';
    if (!buMap.has(bu)) {
      buMap.set(bu, { delighted: 0, satisfied: 0, dissatisfied: 0, total: 0 });
    }

    const bu_data = buMap.get(bu)!;
    const count = row.Occurrences || 1;
    bu_data.total += count;

    const category = (row.csat_category || '').toLowerCase();
    if (category === 'delighted') {
      bu_data.delighted += count;
    } else if (category === 'satisfied') {
      bu_data.satisfied += count;
    } else if (category === 'dissatisfied') {
      bu_data.dissatisfied += count;
    }
  }

  return Array.from(buMap.entries())
    .map(([business_unit, data]) => ({
      business_unit,
      delighted_count: data.delighted,
      satisfied_count: data.satisfied,
      dissatisfied_count: data.dissatisfied,
      total_responses: data.total,
      delighted_percentage: Math.round((data.delighted / data.total) * 100),
      satisfied_percentage: Math.round((data.satisfied / data.total) * 100),
      dissatisfied_percentage: Math.round((data.dissatisfied / data.total) * 100),
    }))
    .sort((a, b) => b.total_responses - a.total_responses);
}

export function aggregateByFeature(
  rows: CSATRow[],
  buFilter?: string
): FeatureDetail[] {
  const filtered = buFilter
    ? rows.filter(r => r.business_unit === buFilter)
    : rows;

  const featureMap = new Map<
    string,
    {
      scores: { delighted: number; satisfied: number; dissatisfied: number; total: number };
      pain_points: Map<string, number>;
      positive: Map<string, number>;
    }
  >();

  for (const row of filtered) {
    // CHANGE THIS LINE: Use trigger_event instead of app_segments
    const feature = row.trigger_event || 'Unknown'; 
    
    if (!featureMap.has(feature)) {
      featureMap.set(feature, {
        scores: { delighted: 0, satisfied: 0, dissatisfied: 0, total: 0 },
        pain_points: new Map(),
        positive: new Map(),
      });
    }

    const feature_data = featureMap.get(feature)!;
    const count = row.Occurrences || 1;
    feature_data.scores.total += count;

    const category = (row.csat_category || '').toLowerCase();
    if (category === 'delighted') {
      feature_data.scores.delighted += count;
      const feedback = row.detailed_feedback.trim();
      if (feedback) {
        feature_data.positive.set(feedback, (feature_data.positive.get(feedback) || 0) + count);
      }
    } else if (category === 'satisfied') {
      feature_data.scores.satisfied += count;
    } else if (category === 'dissatisfied') {
      feature_data.scores.dissatisfied += count;
      const feedback = row.detailed_feedback.trim();
      if (feedback) {
        feature_data.pain_points.set(feedback, (feature_data.pain_points.get(feedback) || 0) + count);
      }
    }
  }

  return Array.from(featureMap.entries())
    .map(([feature_name, data]) => {
      const total = data.scores.total;
      return {
        feature_name,
        business_unit: buFilter || 'All',
        score: {
          delighted: Math.round((data.scores.delighted / total) * 100),
          satisfied: Math.round((data.scores.satisfied / total) * 100),
          dissatisfied: Math.round((data.scores.dissatisfied / total) * 100),
        },
        total_responses: total,
        pain_points: Array.from(data.pain_points.entries())
          .map(([text, count]) => ({
            text,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count),
        positive_feedback: Array.from(data.positive.entries())
          .map(([text, count]) => ({
            text,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count),
      };
    })
    .sort((a, b) => b.total_responses - a.total_responses);
}

export function calculateScores(items: { csat_label: string; Occurrences: number }[]): FeatureScore {
  let delighted = 0,
    satisfied = 0,
    dissatisfied = 0,
    total = 0;

  for (const item of items) {
    const count = item.Occurrences || 1;
    total += count;
    if (item.csat_label === 'Delighted') delighted += count;
    else if (item.csat_label === 'Satisfied') satisfied += count;
    else if (item.csat_label === 'Dissatisfied') dissatisfied += count;
  }

  return {
    delighted: total > 0 ? Math.round((delighted / total) * 100) : 0,
    satisfied: total > 0 ? Math.round((satisfied / total) * 100) : 0,
    dissatisfied: total > 0 ? Math.round((dissatisfied / total) * 100) : 0,
  };
}

export function getTopFeedback(
  rows: CSATRow[],
  category: string,
  limit: number = 5
): FeedbackItem[] {
  const feedbackMap = new Map<string, number>();

  for (const row of rows) {
    if (row.csat_label === category && row.detailed_feedback.trim()) {
      const feedback = row.detailed_feedback.trim();
      feedbackMap.set(feedback, (feedbackMap.get(feedback) || 0) + (row.Occurrences || 1));
    }
  }

  const total = rows.reduce((sum, r) => sum + (r.Occurrences || 1), 0);

  return Array.from(feedbackMap.entries())
    .map(([text, count]) => ({
      text,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
