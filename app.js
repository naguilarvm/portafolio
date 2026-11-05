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
  ["Automatización y apps", [["Power Apps", "powerapps.png"], ["Power Automate", "powerautomate.png"], ["SharePoint", "sharepoint"]]],
  ["IA", [["Claude Code", "claude"], ["Codex", "codex"], ["Gemini", "gemini"], ["Google AI Studio", "aistudio"]]],
  ["Metodologías", [["Six Sigma"], ["Metodologías ágiles"]]],
];
$("#chips").innerHTML = stack.map(([g, items]) =>
  `<div class="group"><h3>${g}</h3><div class="items">${items.map(([n, i]) =>
    `<span class="chip">${i ? `<img src="logos/${i.includes(".") ? i : i + ".svg"}" alt="" width="20" height="20" loading="lazy"${i === "codex" ? " class=\"mono\"" : ""}>` : ""}${n}</span>`).join("")}</div></div>`).join("");

// scroll-spy: marca el link de la sección visible
const links=[...document.querySelectorAll(".nav nav a")];
const spy=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting)links.forEach((a)=>a.classList.toggle("on",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("section[id]").forEach((s)=>spy.observe(s));

// Demo interactiva I-Kitchen (datos ficticios)
const kit = {
  kpis: [["Proyectos planificados", 43], ["Total mediciones", 29], ["Compras / despachos", 17], ["Instalaciones", 9]],
  stages: [
    ["Planificación", "Se registra al cliente y se agenda el proyecto con el diseño y la cotización.", [["Cliente", "Cliente Demo"], ["RUT", "11.111.111-1"], ["Comuna", "Ñuñoa"], ["Cotización", "$3.500.000"], ["Diseño", "Enlace al planificador"], ["Contrato", "Enviado a firmar"]], "Contrato de planificación listo"],
    ["Medición", "Un equipo visita la obra y confirma si el diseño es factible.", [["Fecha de visita", "12-11-2026"], ["Responsable", "Equipo de medición"], ["Medidas", "Ingresadas"], ["Factibilidad", "Aprobada"]], "Factibilidad aprobada"],
    ["Compra y despacho", "Se compran los productos y se coordina la entrega.", [["Código de proyecto", "DEMO-0001"], ["Fecha de despacho", "20-11-2026"], ["Monto proyecto", "$3.200.000"], ["Productos pendientes", "2 por entregar"]], "Despacho coordinado"],
    ["Instalación", "Se asigna al proveedor de armado e instalación y se sigue la obra.", [["Proveedor", "Proveedor Demo"], ["Fecha de instalación", "25-11-2026"], ["Estado", "En curso"], ["Incidencias", "Ninguna"]], "Instalación en curso"],
    ["Cubierta", "Etapa opcional: se puede marcar como no aplicable si el cliente no la compra.", [["¿Lleva esta etapa?", "No"], ["Estado", "Omitida"]], "Etapa omitida, sin bloquear el proyecto"],
    ["Post venta", "Se cierra el proyecto y se hace seguimiento al cliente.", [["Revisión final", "Pendiente"], ["Satisfacción", "Por consultar"], ["Cierre", "Al completar"]], "Proyecto listo para cerrar"],
  ],
};
let ks = 0, kTimer, kStopped = false;
$("#mkKpis").innerHTML = kit.kpis.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join("");
$("#mkSteps").innerHTML = kit.stages.map(([n], i) => `<button role="tab" data-i="${i}"><i>${i + 1}</i>${n}</button>`).join("");
function kShow(i) {
  ks = i;
  const [n, d, f, chip] = kit.stages[i];
  document.querySelectorAll("#mkSteps button").forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i); b.setAttribute("aria-selected", k === i); });
  const p = $("#mkPanel");
  p.innerHTML = `<h4>Paso ${i + 1} de 6 · ${n}</h4><p>${d}</p><div class="mock-fields">${f.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join("")}</div><span class="mock-chip">${chip}</span>`;
  p.style.animation = "none"; p.offsetHeight; p.style.animation = "";
}
$("#mkSteps").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; kStopped = true; clearInterval(kTimer); kShow(+b.dataset.i); };
kShow(0);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
  new IntersectionObserver(([e]) => { clearInterval(kTimer); if (e.isIntersecting && !kStopped) kTimer = setInterval(() => kShow((ks + 1) % 6), 3200); }, { threshold: 0.4 }).observe($("#ikitchen"));
