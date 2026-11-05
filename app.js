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
document.querySelectorAll('section:not(.hero), .stats').forEach((el) => { el.classList.add('reveal'); io.observe(el); });

// Stack agrupado por categoría
const stack = [
  ["Datos y BI", [["Power BI", "powerbi"], ["Looker Studio", "looker"], ["Excel (avanzado)", "excel"], ["SQL", "sql"]]],
  ["ERP y finanzas", [["SAP S/4HANA", "sap"], ["Microsoft Dynamics NAV", "dynamics"], ["Análisis financiero"]]],
  ["Automatización y apps", [["Power Apps", "powerapps"], ["Power Automate", "powerautomate"], ["SharePoint", "sharepoint"]]],
  ["IA", [["Claude Code", "claude"], ["Codex", "codex"], ["Gemini", "gemini"], ["Google AI Studio", "aistudio"]]],
  ["Metodologías", [["Six Sigma"], ["Metodologías ágiles"]]],
];
$("#chips").innerHTML = stack.map(([g, items]) =>
  `<div class="group"><h3>${g}</h3><div class="items">${items.map(([n, i]) =>
    `<span class="chip">${i ? `<img src="logos/${i}.svg" alt="" width="20" height="20" loading="lazy"${i === "codex" ? " class=\"mono\"" : ""}>` : ""}${n}</span>`).join("")}</div></div>`).join("");

// scroll-spy: marca el link de la sección visible
const links=[...document.querySelectorAll(".nav nav a")];
const spy=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting)links.forEach((a)=>a.classList.toggle("on",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("section[id]").forEach((s)=>spy.observe(s));
