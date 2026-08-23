/** 既往歴・常用薬「なし」チップと最新公開版の保持を静的に検査する。 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
let failed = 0;

function check(condition, message) {
  if (condition) console.log(`OK: ${message}`);
  else { console.error(`FAIL: ${message}`); failed++; }
}

check(html.includes('v3.9.6 (2026/08/24)'), 'app version is v3.9.6');
check(serviceWorker.includes("doctorcar-pwa-v3.9.6"), 'PWA cache version is v3.9.6');
check(html.includes("const PATIENT_HISTORY_ITEMS = ['なし',"), 'history chips start with none');
check(html.includes("else if (item === 'なし')"), 'history none has an exclusive branch');
check(html.includes("selectedItems.delete('なし')"), 'selecting another history removes none');
check(html.includes("noneChip.textContent = 'なし'"), 'medication none chip exists');
check(html.includes("state.patient.anticoagulant_drugs = []"), 'medication none clears anticoagulant drugs');
check(html.includes("state.patient.antiplatelet_drugs = []"), 'medication none clears antiplatelet drugs');
check((html.match(/removeMedicationNone\(\);/g) || []).length >= 2, 'structured medication chips remove overall none');
check(html.includes('renderMedicationChips();\n        updateState();'), 'manual medication edits refresh chips');

// v3.9.5で導入された重要機能を巻き戻していないことも同時に確認する。
check(html.includes('<option value="現着後要請">現着後要請</option>'), 'correct on-scene request label is retained');
check(!html.includes('現着後要選項'), 'old on-scene request typo is absent');
check(html.includes('title="要請キャンセルとして終了"'), 'request cancellation remains in the header');
check(html.includes('const METRICS_SCHEMA_VERSION = 3'), 'metrics schema v3 is retained');
check(html.includes('clinical_time_capture_version: 1'), 'clinical milestone metrics are retained');
check(html.includes("activityEndMissingReason = 'i_turn_not_observable'"), 'I-turn end-time safeguard is retained');

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll patient none-chip checks passed');
