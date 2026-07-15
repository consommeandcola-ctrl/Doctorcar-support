/** DrCar 搬送方法の必須・例外判定テスト
 * 実行: node scripts/_test_transport_scheme_drcar.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const start = html.indexOf('function isTransportSchemeExemptRequestType');
const end = html.indexOf('function restoreUI()', start);
const metricsStart = html.indexOf('function countMetricsActiveFlags');
const metricsEnd = html.indexOf('function getDrCarMetricsMode()', metricsStart);
if (start < 0 || end < 0 || metricsStart < 0 || metricsEnd < 0) {
  console.error('FAIL: transport scheme functions not found');
  process.exit(1);
}

const elements = {
  request_type: { value: '' },
  transport_method: { value: '', focus() {} },
  transport_scheme_block: { style: {} },
  transport_times: { style: {} }
};
const alerts = [];
const tabs = [];
const ctx = {
  state: { request: { type: '' }, car: { transport_method: null } },
  $: selector => elements[String(selector).replace(/^#/, '')] || null,
  alert: message => alerts.push(message),
  switchTab: tab => tabs.push(tab),
  setTimeout: callback => callback(),
};
vm.runInNewContext(html.slice(start, end), ctx);
vm.runInNewContext(html.slice(metricsStart, metricsEnd), ctx);

let failed = 0;
function check(condition, message) {
  if (condition) console.log(`OK: ${message}`);
  else { console.error(`FAIL: ${message}`); failed++; }
}

function setRequest(type, scheme) {
  elements.request_type.value = type;
  elements.transport_method.value = scheme;
  ctx.state.request.type = type;
  ctx.state.car.transport_method = scheme || null;
  ctx.syncRequestModeUI();
}

setRequest('施設間搬送', 'Iターン');
check(elements.transport_scheme_block.style.display === 'none', 'facility transfer hides the scheme block');
check(elements.transport_method.value === '' && ctx.state.car.transport_method === null, 'facility transfer clears the scheme');
check(ctx.ensureTransportSchemeSelected() === true, 'facility transfer activity report works without a scheme');
check(ctx.ensureReferralRequired() === false, 'facility transfer referral is not created');
let props = ctx.collectDrCarMetricsProperties();
check(props.transport_scheme === null && props.scheme_required === false, 'facility transfer metrics keep the scheme unselected');
check(props.report_required === true && props.referral_required === false, 'facility transfer metrics require only the activity report');

setRequest('ドクターデリバリー', 'Jターン');
check(elements.transport_scheme_block.style.display === 'none', 'doctor delivery hides the scheme block');
check(elements.transport_method.value === '' && ctx.state.car.transport_method === null, 'doctor delivery clears the scheme');
check(ctx.ensureTransportSchemeSelected() === true, 'doctor delivery activity report works without a scheme');
check(ctx.ensureReferralRequired() === false, 'doctor delivery referral is not created');
props = ctx.collectDrCarMetricsProperties();
check(props.transport_scheme === null && props.scheme_required === false, 'doctor delivery metrics keep the scheme unselected');
check(props.report_required === true && props.referral_required === false, 'doctor delivery metrics require only the activity report');

setRequest('キーワード要請', '');
check(elements.transport_scheme_block.style.display === '', 'keyword request shows the scheme block');
check(ctx.ensureTransportSchemeSelected() === false, 'keyword request requires a scheme');

setRequest('現着後要請', 'Iターン');
check(ctx.ensureTransportSchemeSelected() === true, 'on-scene request accepts a selected scheme');
check(ctx.ensureReferralRequired() === true, 'I-turn referral is created');

setRequest('キーワード要請', 'Uターン');
check(ctx.ensureReferralRequired() === false, 'U-turn referral is not created');

console.log(failed ? `\n${failed} failed` : '\nAll DrCar transport scheme tests passed');
process.exit(failed ? 1 : 0);
