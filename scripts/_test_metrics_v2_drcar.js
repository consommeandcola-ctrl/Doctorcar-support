/** DrCar 利用メトリクス v2 の静的・構造テスト
 * 実行: node scripts/_test_metrics_v2_drcar.js
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
let failed = 0;

function check(condition, message) {
  if (condition) console.log(`OK: ${message}`);
  else { console.error(`FAIL: ${message}`); failed++; }
}

check(html.includes("const METRICS_SCHEMA_VERSION = 2"), 'schema version is v2');
check(html.includes("const APP_NAME = 'drcar'"), 'app name is drcar');
check(html.includes("event_id: createMetricsId()"), 'each event receives an event_id');
check(html.includes("installation_id: metricsRuntime.installationId"), 'installation_id is included');
check(html.includes("app_session_id: metricsRuntime.appSessionId"), 'app_session_id is included');
check(html.includes("case_id: caseId"), 'case_id is included');
check(html.includes("active_sec: timing.active_sec"), 'active time is included');
check(html.includes("properties: collectDrCarMetricsProperties(properties)"), 'workflow properties are included');
check(html.includes("queue.push({ payload, attempts: 0 })"), 'events enter the durable queue');
check(html.includes("item.attempts > 0 ? 1 : 0"), 'retried events are marked queued');
check(html.includes('readMetricsQueue().filter'), 'successful send reconciles against the latest queue');
check(html.includes('event_id !== item.payload.event_id'), 'only the acknowledged event is removed');
check(html.includes("trackMetricsEvent('referral_copy')"), 'referral copies have a distinct event');
check(html.includes("action === 'mail' ? 'mail_open'"), 'mail action maps to mail_open');
check(html.includes("sendMetrics('mail')"), 'referral mail send is tracked');
check(html.includes("trackMetricsEvent('referral_open')"), 'referral tab open is tracked');
check(html.includes("trackMetricsEvent('case_reset')"), 'case reset is recorded');
check(html.includes("trackMetricsEvent('case_complete'"), 'case completion is recorded');
check(html.includes("trackMetricsEvent('case_cancel'"), 'request cancellation is recorded separately');
check(html.includes("transport_scheme: transportScheme || null"), 'transport scheme is included in properties');
check(html.includes("referral_required: transportScheme ? transportScheme !== 'Uターン' : null"), 'U-turn referral requirement is false');
check(html.includes('function ensureTransportSchemeSelected()'), 'report output requires a selected transport scheme');
check(html.includes('function ensureReferralRequired()'), 'referral output checks whether a referral is required');
check(html.includes('<option value="現着後要請">現着後要請</option>'), 'on-scene request label matches its stored value');
check(!html.includes('現着後要選項'), 'incorrect on-scene request label is absent');
check(html.includes('onclick="cancelRequestAndReset()"'), 'request card has a dedicated cancellation action');
check(html.includes('METRICS_CASE_EXPIRY_MS'), 'stale cases expire automatically');
check(html.includes('METRICS_FIRST_INPUT_KEY'), 'first input is deduplicated across reloads');
check(html.includes("metricsRuntime.openedTabs.has(tab)"), 'tab events are deduplicated per page session');
check(!html.includes("const queueKey = 'metrics_queue_v1'"), 'legacy queue implementation was removed');
check(html.includes('resetMetricsCase();'), 'resetData clears the metrics case');
check(html.includes("state.cardr?.vitals"), 'doctor vitals come from cardr state');
check(!html.includes("getDrCarMetricsMode() {\n  return 'mci'"), 'mode is always normal for drcar');

const resetStart = html.indexOf('function resetMetricsCase(');
const resetEnd = html.indexOf("window.addEventListener('online'", resetStart);
const resetCode = html.slice(resetStart, resetEnd);
check(resetCode.includes('METRICS_CASE_KEY'), 'reset clears the v2 case id');
check(!resetCode.includes('METRICS_INSTALLATION_KEY'), 'reset preserves anonymous installation id');
check(!resetCode.includes('METRICS_QUEUE_KEY'), 'reset preserves unsent events');

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll DrCar metrics v2 tests passed');
