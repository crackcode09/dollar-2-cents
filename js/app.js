/* ── Constants ──────────────────────────────── */
const QUARTER = 25, DIME = 10, NICKEL = 5, PENNY = 1;
const D2C_COINS = [
  { value: QUARTER, key: 'quarter' },
  { value: DIME,    key: 'dime'    },
  { value: NICKEL,  key: 'nickel'  },
  { value: PENNY,   key: 'penny'   },
];
const C2D_COINS = [
  { value: QUARTER, key: 'quarter', inputId: 'ci-quarter' },
  { value: DIME,    key: 'dime',    inputId: 'ci-dime'    },
  { value: NICKEL,  key: 'nickel',  inputId: 'ci-nickel'  },
  { value: PENNY,   key: 'penny',   inputId: 'ci-penny'   },
];
const MAX_PIPS = 20;
const RAIN = [
  { bg: 'radial-gradient(circle at 35% 30%,#C0C8D0,#8A9198)', s: 14 },
  { bg: 'radial-gradient(circle at 35% 30%,#E8A87C,#C47843)', s: 11 },
  { bg: 'radial-gradient(circle at 35% 30%,#F97316,#EA580C)', s: 10 },
  { bg: 'radial-gradient(circle at 35% 30%,#C8C4B8,#9A9488)', s: 12 },
];

/* ── DOM ────────────────────────────────────── */
const $inp        = document.getElementById('dollar-input');
const $convertBtn = document.getElementById('convert-btn');
const $irow       = document.getElementById('input-row');
const $d2cErr     = document.getElementById('d2c-error');
const $calcBtn    = document.getElementById('calc-btn');
const $c2dErr     = document.getElementById('c2d-error');

const $resultsD2C    = document.getElementById('results-d2c');
const $resultsC2D    = document.getElementById('results-c2d');
const $empty         = document.getElementById('empty-state');
const $panelR        = document.getElementById('panel-right');
const $sr            = document.getElementById('sr-announce');

const $d2cTotal      = document.getElementById('d2c-total');
const $d2cCoinTot    = document.getElementById('d2c-coin-total');
const $c2dAmount     = document.getElementById('c2d-amount');
const $c2dCentsLine  = document.getElementById('c2d-cents-line');
const $c2dCount      = document.getElementById('c2d-count');
const $c2dCentsTotal = document.getElementById('c2d-cents-total');

const $viewD2C  = document.getElementById('view-d2c');
const $viewC2D  = document.getElementById('view-c2d');
const $modeBtns = document.querySelectorAll('.mode-btn');

let mode    = 'd2c';
let d2cDone = false;
let c2dDone = false;

/* ── Results visibility helpers ─────────────── */
function hidePanel(panel) {
  panel.classList.remove('visible');
  panel.style.display = 'none';
}

function showResultsPanel(panel) {
  $empty.classList.add('gone');
  panel.style.display = '';
  panel.classList.remove('visible');
  void panel.offsetWidth;
  panel.classList.add('visible');
}

/* ── Mode switching ─────────────────────────── */
$modeBtns.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));

function switchMode(next) {
  if (next === mode) return;
  mode = next;

  $modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === next));

  const incoming = next === 'd2c' ? $viewD2C : $viewC2D;
  const outgoing = next === 'd2c' ? $viewC2D : $viewD2C;

  outgoing.classList.add('hidden');
  incoming.classList.remove('hidden');
  incoming.classList.remove('entering');
  void incoming.offsetWidth;
  incoming.classList.add('entering');

  /* Always hide both panels first, then restore the one that has results */
  hidePanel($resultsD2C);
  hidePanel($resultsC2D);

  if (next === 'd2c' && d2cDone) {
    $empty.classList.add('gone');
    $resultsD2C.style.display = 'flex';
  } else if (next === 'c2d' && c2dDone) {
    $empty.classList.add('gone');
    $resultsC2D.style.display = 'flex';
  } else {
    $empty.classList.remove('gone');
  }
}

/* ── Shared helpers ─────────────────────────── */
function toCents(n) { return Math.round(n * 100); }

function makeChange(cents) {
  const out = {}; let rem = cents;
  for (const { value, key } of D2C_COINS) { out[key] = Math.floor(rem / value); rem %= value; }
  return out;
}

function countUp(el, target, ms, done) {
  const t0   = performance.now();
  const from = parseInt(el.textContent, 10) || 0;
  const diff = target - from;
  (function step(now) {
    const p = Math.min((now - t0) / ms, 1);
    el.textContent = Math.round(from + diff * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
    else if (done) done();
  })(t0);
}

function countUpDollars(el, targetCents, ms, done) {
  const t0        = performance.now();
  const fromCents = Math.round(parseFloat(el.textContent) * 100) || 0;
  const diff      = targetCents - fromCents;
  (function step(now) {
    const p   = Math.min((now - t0) / ms, 1);
    const cur = Math.round(fromCents + diff * (1 - Math.pow(1 - p, 3)));
    el.textContent = (cur / 100).toFixed(2);
    if (p < 1) requestAnimationFrame(step);
    else if (done) done();
  })(t0);
}

function renderPips(id, key, n) {
  const c = document.getElementById(id);
  c.innerHTML = '';
  if (!n) return;
  const show = Math.min(n, MAX_PIPS);
  for (let i = 0; i < show; i++) {
    const d = document.createElement('div');
    d.className = 'pip ' + key;
    c.appendChild(d);
    setTimeout(() => d.classList.add('drop'), 90 + i * 28);
  }
  if (n > MAX_PIPS) {
    const s = document.createElement('span');
    s.className = 'pip-overflow';
    s.textContent = '+' + (n - MAX_PIPS);
    c.appendChild(s);
  }
}

function coinRain() {
  for (let i = 0; i < 8; i++) {
    const r  = RAIN[i % RAIN.length];
    const el = document.createElement('div');
    el.className = 'crp';
    const dur = (0.65 + Math.random() * 0.3).toFixed(2);
    const del = (i * 0.07).toFixed(2);
    el.style.cssText = [
      'left:' + (12 + Math.random() * 76) + '%',
      'top:0',
      'width:' + r.s + 'px',
      'height:' + r.s + 'px',
      'background:' + r.bg,
      'box-shadow:0 2px 6px rgba(0,0,0,0.5)',
      'animation:coin-fall ' + dur + 's ease-in ' + del + 's forwards',
    ].join(';');
    $panelR.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

function triggerPop(el) {
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

function showErr(errEl, shakEl, msg) {
  errEl.textContent = msg;
  errEl.classList.add('show');
  shakEl.classList.remove('shake');
  void shakEl.offsetWidth;
  shakEl.classList.add('shake');
  shakEl.addEventListener('animationend', () => shakEl.classList.remove('shake'), { once: true });
}
function clearErr(errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }

/* ── D2C: Dollar → Coins ────────────────────── */
function convert() {
  const raw = parseFloat($inp.value);
  if (isNaN(raw) || raw < 0) { return showErr($d2cErr, $irow, 'Enter a positive dollar amount (e.g. 2.75)'); }
  if (raw > 999999.99)        { return showErr($d2cErr, $irow, 'Max $999,999.99'); }
  clearErr($d2cErr);

  const cents  = toCents(raw);
  const change = makeChange(cents);
  const total  = Object.values(change).reduce((a, b) => a + b, 0);

  d2cDone = true;
  hidePanel($resultsC2D);
  showResultsPanel($resultsD2C);

  countUp($d2cTotal, cents, 520, () => triggerPop($d2cTotal));
  $d2cCoinTot.textContent = total;
  coinRain();

  D2C_COINS.forEach(({ key }, i) => {
    const row  = document.getElementById('row-' + key);
    const icon = document.getElementById('icon-' + key);
    const num  = document.getElementById('count-' + key);
    row.classList.remove('in', 'zero');
    icon.classList.remove('flip');
    countUp(num, change[key], 360);
    num.classList.toggle('zero', change[key] === 0);
    renderPips('pips-' + key, key, change[key]);
    setTimeout(() => {
      row.classList.add('in');
      if (change[key] === 0) row.classList.add('zero');
      if (change[key] > 0) {
        void icon.offsetWidth;
        icon.classList.add('flip');
        icon.addEventListener('animationend', () => icon.classList.remove('flip'), { once: true });
      }
    }, i * 70);
  });

  $sr.textContent = cents + ' cents: ' + change.quarter + ' quarters, ' + change.dime + ' dimes, ' + change.nickel + ' nickels, ' + change.penny + ' pennies. ' + total + ' coins total.';
}

/* ── C2D: Coins → Dollar ────────────────────── */
function calcTotal() {
  const counts = {};
  let totalCoins = 0;
  for (const { key, inputId } of C2D_COINS) {
    const v = parseInt(document.getElementById(inputId).value, 10);
    counts[key] = (isNaN(v) || v < 0) ? 0 : v;
    totalCoins += counts[key];
  }
  if (totalCoins === 0) { return showErr($c2dErr, document.querySelector('.ci-rows'), 'Enter at least one coin'); }
  clearErr($c2dErr);

  const totalCents =
    counts.quarter * QUARTER +
    counts.dime    * DIME    +
    counts.nickel  * NICKEL  +
    counts.penny   * PENNY;

  c2dDone = true;
  hidePanel($resultsD2C);
  showResultsPanel($resultsC2D);

  countUpDollars($c2dAmount, totalCents, 520, () => triggerPop($c2dAmount));
  $c2dCentsLine.textContent  = '= ' + totalCents + '¢';
  $c2dCount.textContent      = totalCoins;
  $c2dCentsTotal.textContent = totalCents;
  coinRain();

  C2D_COINS.forEach(({ value, key }, i) => {
    const row      = document.getElementById('vrow-' + key);
    const icon     = document.getElementById('vicon-' + key);
    const vmEl     = document.getElementById('vm-' + key);
    const vaEl     = document.getElementById('va-' + key);
    const n        = counts[key];
    const amtCents = n * value;

    row.classList.remove('in', 'zero');
    icon.classList.remove('flip');
    vmEl.textContent = '× ' + n;
    vaEl.textContent = '$' + (amtCents / 100).toFixed(2);
    vaEl.classList.toggle('zero', n === 0);

    setTimeout(() => {
      row.classList.add('in');
      if (n === 0) row.classList.add('zero');
      if (n > 0) {
        void icon.offsetWidth;
        icon.classList.add('flip');
        icon.addEventListener('animationend', () => icon.classList.remove('flip'), { once: true });
      }
    }, i * 70);
  });

  $sr.textContent =
    'Total value: $' + (totalCents / 100).toFixed(2) + ', ' + totalCents + ' cents. ' +
    counts.quarter + ' quarters, ' + counts.dime + ' dimes, ' + counts.nickel + ' nickels, ' + counts.penny + ' pennies. ' +
    totalCoins + ' coins total.';
}

/* ── Events ─────────────────────────────────── */
$convertBtn.addEventListener('click', convert);
$inp.addEventListener('keydown', e => e.key === 'Enter' && convert());
$inp.addEventListener('input', () => clearErr($d2cErr));

$calcBtn.addEventListener('click', calcTotal);
C2D_COINS.forEach(({ inputId }) => {
  document.getElementById(inputId).addEventListener('keydown', e => e.key === 'Enter' && calcTotal());
  document.getElementById(inputId).addEventListener('input', () => clearErr($c2dErr));
});
