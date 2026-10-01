const $ = (s) => document.querySelector(s);

// Tema
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch {}
$('#theme').onclick = () => {
  const dark = getComputedStyle(root).getPropertyValue('--bg').trim() === '#0e1014';
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
};
$('#y').textContent = new Date().getFullYear();

// Texto animado
const words = ['datos accionables', 'dashboards claros', 'procesos automatizados', 'decisiones a tiempo'];
let wi = 0, ci = 0, del = false;
(function type() {
  const w = words[wi];
  $('#typed').textContent = w.slice(0, ci);
  if (!del && ci === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
  ci += del ? -1 : 1;
  setTimeout(type, del ? 35 : 70);
})();

// Contadores y reveal
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll?.('[data-count]').forEach(count);
}), { threshold: 0.15 });
function count(el) {
  const n = +el.dataset.count, t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(n * p) + (p === 1 ? el.dataset.suffix || '' : '');
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
document.querySelectorAll('section, .stats').forEach((el) => { el.classList.add('reveal'); io.observe(el); });

// Match con la vacante
const reqs = [
  ['Profesional en Administración de Empresas o afines', 'Administración de Empresas, Universidad Tecnológica de Chile (2023–2025).'],
  ['Experiencia en roles analíticos, ideal operaciones o retail', 'Services Specialist y Finance Administrative en IKEA: indicadores, SLA, coordinación de proveedores y procesos de compras en retail.'],
  ['Dominio de Excel', 'Excel nivel avanzado, usado en reportería, cálculo de incentivos y validaciones.'],
  ['SQL o herramientas de BI (Tableau, Looker)', 'Looker Studio en producción (SLA y trazabilidad de compras), Power BI y SQL intermedio para cálculo y validación de incentivos.'],
  ['Conocimientos generales de Inteligencia Artificial', 'Desarrollé una app web con IA generativa usada por más de 100 colaboradores. Uso Claude Code, Codex, Gemini y Google AI Studio.'],
  ['Desarrollar herramientas, dashboards y alertas con IA', 'Evolucioné una solución en Power Apps a una app web con IA; automaticé flujos y reportes con Power Automate.'],
  ['Coordinarse con operación y transporte', 'Coordino proveedores de armado, medición e instalación y resuelvo incidencias con áreas internas en 3 países.'],
];
$('#reqs').innerHTML = reqs.map(([r, e]) =>
  `<li><div class="h"><i>✔</i>${r}</div><div class="ev">${e}</div></li>`).join('');
$('#reqs').onclick = (e) => e.target.closest('li')?.classList.toggle('open');
const pct = Math.round((reqs.length / reqs.length) * 100);
new IntersectionObserver((es, o) => es[0].isIntersecting && (
  $('#ring').style.strokeDashoffset = 327 * (1 - pct / 100),
  $('#pct').textContent = pct + '%', o.disconnect()), { threshold: 0.4 }).observe($('.meter'));

// Simulador de agenda de inbound
const hours = Array.from({ length: 16 }, (_, i) => i + 6);
const weights = [.02, .04, .07, .09, .10, .10, .09, .08, .07, .08, .09, .08, .06, .04, .03, .02];
const wsum = weights.reduce((a, b) => a + b, 0);
let surge = false, optimized = false;

function model() {
  const D = +$('#D').value, C = +$('#C').value, M = +$('#M').value / 100;
  const cap = C * (1 - M);
  let dem = weights.map((w, i) => (D * w) / wsum * (surge && i >= 4 && i <= 6 ? 1.25 : 1));
  let moved = 0;
  if (optimized) {
    for (let i = 0; i < dem.length; i++) {
      let over = dem[i] - cap;
      for (let d = 1; over > 0 && d < dem.length; d++) {
        for (const j of [i - d, i + d]) {
          if (over <= 0 || j < 0 || j >= dem.length) continue;
          const give = Math.min(over, Math.max(0, cap - dem[j]));
          dem[j] += give; dem[i] -= give; over -= give; moved += give;
        }
      }
    }
  }
  return { D, C, M, cap, dem, moved };
}

function render() {
  const { D, C, M, cap, dem, moved } = model();
  $('#oD').textContent = D + ' uds'; $('#oC').textContent = C + ' uds/h'; $('#oM').textContent = Math.round(M * 100) + '%';
  const W = 640, H = 340, L = 40, B = 36, T = 16, bw = (W - L - 10) / dem.length;
  const max = Math.max(C * 1.1, ...dem) * 1.05, y = (v) => T + (H - T - B) * (1 - v / max);
  const color = (v) => v / cap > 1.0001 ? 'var(--bad)' : v / cap >= .8 ? 'var(--warn)' : 'var(--ok)';
  let svg = '';
  for (let k = 0; k <= 4; k++) {
    const v = max * k / 4;
    svg += `<line x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
  }
  dem.forEach((v, i) => {
    const x = L + i * bw + 3;
    svg += `<rect x="${x}" width="${bw - 6}" y="${y(v)}" height="${H - B - y(v)}" rx="4" fill="${color(v)}"><title>${hours[i]}:00 · ${Math.round(v)} uds · ${Math.round(v / cap * 100)}%</title></rect>`;
    svg += `<text x="${x + (bw - 6) / 2}" y="${H - 18}" text-anchor="middle">${hours[i]}h</text>`;
  });
  svg += `<line x1="${L}" x2="${W - 10}" y1="${y(cap)}" y2="${y(cap)}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 4"/>`;
  $('#chart').innerHTML = svg;

  const risk = dem.filter((v) => v / cap >= .8).length, over = dem.filter((v) => v / cap > 1.0001).length;
  const unserved = dem.reduce((a, v) => a + Math.max(0, v - cap), 0);
  $('#kOcc').textContent = Math.round(dem.reduce((a, b) => a + b, 0) / (cap * dem.length) * 100) + '%';
  $('#kRisk').textContent = risk + ' / ' + dem.length;
  $('#kAvail').textContent = Math.round((1 - over / dem.length) * 100) + '%';
  $('#kOver').textContent = Math.round(unserved);

  const peak = dem.indexOf(Math.max(...dem)), a = [];
  if (over) a.push(['bad', `🚨 ${over} franja(s) sobre capacidad; pico a las ${hours[peak]}:00. ${Math.round(unserved)} uds sin cupo. Reasignar citas o subir margen/capacidad.`]);
  else if (risk) a.push(['warn', `⚠️ ${risk} franja(s) sobre 80%. Pico a las ${hours[peak]}:00: vigilar imprevistos.`]);
  else a.push(['ok', '✅ Agenda saludable: hay holgura en todas las franjas.']);
  if (optimized && moved > 0) a.push(['ok', `🔁 Optimización: ${Math.round(moved)} uds movidas a franjas con holgura.`]);
  if (optimized && over) a.push(['warn', 'La demanda supera la capacidad total efectiva. Se requiere más capacidad o ampliar horarios.']);
  if (!optimized && over) a.push(['warn', 'Sugerencia: pulsa «Optimizar agenda» para redistribuir.']);
  $('#alerts').innerHTML = a.map(([c, t]) => `<li class="${c}">${t}</li>`).join('');
}
['D', 'C', 'M'].forEach((id) => $('#' + id).addEventListener('input', () => { optimized = false; render(); }));
$('#surge').onclick = () => { surge = !surge; optimized = false; $('#surge').textContent = surge ? '⚡ Quitar imprevisto' : '⚡ Simular imprevisto (+25% en punta)'; render(); };
$('#opt').onclick = () => { optimized = true; render(); };
$('#reset').onclick = () => { surge = optimized = false; $('#D').value = 1400; $('#C').value = 150; $('#M').value = 15; $('#surge').textContent = '⚡ Simular imprevisto (+25% en punta)'; render(); };
render();

// Stack
['Power BI', 'Excel (avanzado)', 'SQL', 'Looker Studio', 'SAP S/4HANA', 'Microsoft Dynamics NAV', 'Power Apps', 'Power Automate', 'SharePoint', 'Claude Code', 'Codex', 'Gemini', 'Google AI Studio', 'Six Sigma', 'Metodologías ágiles', 'Análisis financiero']
  .forEach((s) => $('#chips').insertAdjacentHTML('beforeend', `<span class="chip">${s}</span>`));
