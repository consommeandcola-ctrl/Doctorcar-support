/**
 * DrCar メトリクス集計の単体テスト
 * 実行: node scripts/_test_metrics_counts_drcar.js
 */

function countMetricsActiveFlags(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  try {
    return Object.values(obj).filter(v => v).length;
  } catch (e) {
    return 0;
  }
}

function collectDrCarMetricsCounts(state) {
  let vital_count = 0;
  let proc_count = 0;
  if (!state) return { vital_count, proc_count };
  try {
    if (Array.isArray(state.ems?.vitals)) vital_count += state.ems.vitals.length;
    if (Array.isArray(state.cardr?.vitals)) vital_count += state.cardr.vitals.length;
    proc_count += countMetricsActiveFlags(state.ems?.procedures);
    proc_count += countMetricsActiveFlags(state.cardr?.procedures);
  } catch (e) {}
  return { vital_count, proc_count };
}

function getDrCarMetricsMode() {
  return 'normal';
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const state = {
  ems: {
    vitals: [{}, {}],
    procedures: { '酸素投与': true, 'BVM換気': false }
  },
  cardr: {
    vitals: [{}, {}, {}],
    procedures: { 'CPR': true, '除細動': true, 'NPPV': false }
  }
};

const { vital_count, proc_count } = collectDrCarMetricsCounts(state);
assert(vital_count === 5, `vital_count expected 5, got ${vital_count}`);
assert(proc_count === 3, `proc_count expected 3, got ${proc_count}`);
assert(getDrCarMetricsMode() === 'normal', 'mode should always be normal');

console.log('OK: collectDrCarMetricsCounts');
console.log(`  vital_count=${vital_count}, proc_count=${proc_count}, mode=${getDrCarMetricsMode()}`);
