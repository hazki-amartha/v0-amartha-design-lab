/**
 * One-time backfill: derive pain-point issues from existing csat_data rows
 * and insert them into the issues table.
 *
 * Safe to re-run — deletes existing CSAT issues for each period before re-inserting.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-csat-issues.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function aggregateByFeature(rows) {
  const featureMap = new Map();

  for (const row of rows) {
    const feature = row.trigger_event || 'Unknown';
    if (!featureMap.has(feature)) {
      featureMap.set(feature, {
        scores: { dissatisfied: 0, total: 0 },
        pain_points: new Map(),
        business_unit: row.business_unit || 'Unknown',
        product_area: row.product_area || '',
      });
    }
    const fd = featureMap.get(feature);
    const count = row.Occurrences || 1;
    fd.scores.total += count;

    const category = (row.csat_category || '').toLowerCase();
    if (category === 'dissatisfied') {
      fd.scores.dissatisfied += count;
      const feedback = (row.detailed_feedback || '').trim();
      if (feedback) {
        fd.pain_points.set(feedback, (fd.pain_points.get(feedback) || 0) + count);
      }
    }
  }

  return Array.from(featureMap.entries()).map(([feature_name, data]) => ({
    feature_name,
    business_unit: data.business_unit,
    product_area: data.product_area,
    total_responses: data.scores.total,
    dissatisfied_score: data.scores.total > 0
      ? Math.round((data.scores.dissatisfied / data.scores.total) * 100)
      : 0,
    pain_points: Array.from(data.pain_points.entries()).map(([text, count]) => ({
      text,
      count,
      percentage: Math.round((count / data.scores.total) * 100),
    })).sort((a, b) => b.count - a.count),
  }));
}

async function main() {
  // Fetch all uploaded months
  const { data: months, error: monthsError } = await supabase
    .from('csat_data')
    .select('month, row_count')
    .order('month', { ascending: true });

  if (monthsError) throw new Error(`Failed to list months: ${monthsError.message}`);
  if (!months || months.length === 0) {
    console.log('No CSAT data found. Nothing to backfill.');
    return;
  }

  console.log(`Backfilling issues for ${months.length} CSAT month(s)...\n`);

  for (const { month } of months) {
    // Fetch full data for this month
    const { data: record, error: fetchError } = await supabase
      .from('csat_data')
      .select('data')
      .eq('month', month)
      .single();

    if (fetchError) {
      console.error(`  ✗ ${month}: ${fetchError.message}`);
      continue;
    }

    const rows = record.data || [];
    const features = aggregateByFeature(rows);
    const issues = features.flatMap(feature =>
      feature.pain_points.map(item => ({
        source: 'csat',
        period: month,
        title: item.text,
        tag: null,
        impact: null,
        business_unit: feature.business_unit,
        product_area: feature.product_area || null,
        feature: feature.feature_name,
        count: item.count,
        percentage: item.percentage,
        metadata: {
          total_feature_responses: feature.total_responses,
          dissatisfied_score: feature.dissatisfied_score,
        },
      }))
    );

    // Delete existing issues for this month then re-insert
    await supabase.from('issues').delete().match({ source: 'csat', period: month });

    if (issues.length > 0) {
      const { error: insertError } = await supabase.from('issues').insert(issues);
      if (insertError) {
        console.error(`  ✗ ${month}: ${insertError.message}`);
        continue;
      }
    }

    console.log(`  ✓ ${month}: ${issues.length} issues from ${features.length} features`);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
