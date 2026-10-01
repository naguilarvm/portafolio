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

// Stack
['Power BI', 'Excel (avanzado)', 'SQL', 'Looker Studio', 'SAP S/4HANA', 'Microsoft Dynamics NAV', 'Power Apps', 'Power Automate', 'SharePoint', 'Claude Code', 'Codex', 'Gemini', 'Google AI Studio', 'Six Sigma', 'Metodologías ágiles', 'Análisis financiero']
  .forEach((s) => $('#chips').insertAdjacentHTML('beforeend', `<span class="chip">${s}</span>`));
