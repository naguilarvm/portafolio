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

// Stack
['Power BI', 'Excel (avanzado)', 'SQL', 'Looker Studio', 'SAP S/4HANA', 'Microsoft Dynamics NAV', 'Power Apps', 'Power Automate', 'SharePoint', 'Claude Code', 'Codex', 'Gemini', 'Google AI Studio', 'Six Sigma', 'Metodologías ágiles', 'Análisis financiero']
  .forEach((s) => $('#chips').insertAdjacentHTML('beforeend', `<span class="chip">${s}</span>`));
