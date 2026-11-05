const $ = (s) => document.querySelector(s);

// Tema
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch {}
$('#theme').onclick = () => {
  const dark = (root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
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

// Herramientas: filtro por categoría y tarjetas con logo
const tools = [
  ["Power BI", "powerbi", "Datos y BI"], ["Looker Studio", "looker", "Datos y BI"], ["Excel", "excel", "Datos y BI", "Avanzado"], ["SQL", "sql", "Datos y BI", "Intermedio"],
  ["SAP S/4HANA", "sap", "ERP y finanzas"], ["Microsoft Dynamics NAV", "dynamics", "ERP y finanzas"],
  ["Power Apps", "powerapps.png", "Automatización"], ["Power Automate", "powerautomate.png", "Automatización"], ["SharePoint", "sharepoint", "Automatización"],
  ["Claude Code", "claude", "IA"], ["Codex", "codex", "IA"], ["Gemini", "gemini", "IA"], ["Google AI Studio", "aistudio", "IA"], ["Google Flow", "flow", "IA"], ["Microsoft Copilot", "copilot", "IA"],
];
const cats = ["Todas", ...new Set(tools.map((t) => t[2]))];
$("#filters").innerHTML = cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-c="${c}">${c}<em>${c === "Todas" ? tools.length : tools.filter((t) => t[2] === c).length}</em></button>`).join("");
$("#tiles").innerHTML = tools.map(([n, i, c, lv]) =>
  `<div class="tile" data-c="${c}"><span class="logo-box"><img src="logos/${i.includes(".") ? i : i + ".svg"}" alt="" width="28" height="28" loading="lazy"${i === "codex" ? ' class="mono"' : ""}></span><div><b>${n}</b><small>${c}</small></div>${lv ? `<span class="lvl">${lv}</span>` : ""}</div>`).join("");
$("#filters").onclick = (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll("#filters button").forEach((x) => x.setAttribute("aria-selected", x === b));
  document.querySelectorAll("#tiles .tile").forEach((t) => t.classList.toggle("off", b.dataset.c !== "Todas" && t.dataset.c !== b.dataset.c));
};

// scroll-spy: marca el link de la sección visible
const links=[...document.querySelectorAll(".nav nav a")];
const spy=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting)links.forEach((a)=>a.classList.toggle("on",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("section[id]").forEach((s)=>spy.observe(s));

// Demo I-Kitchen (datos ficticios): iPad + modo pantalla completa
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

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function mountDemo(root, start = 0) {
  const kpis = root.querySelector(".mock-kpis"), steps = root.querySelector(".mock-steps"), panel = root.querySelector(".mock-panel");
  let cur = 0, timer, stopped = false;
  kpis.innerHTML = kit.kpis.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join("");
  steps.innerHTML = kit.stages.map(([n], i) => `<button type="button" role="tab" data-i="${i}"><i>${i + 1}</i>${n}</button>`).join("");
  const show = (i) => {
    cur = i;
    const [n, d, f, chip] = kit.stages[i];
    steps.querySelectorAll("button").forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i); b.setAttribute("aria-selected", k === i); });
    panel.innerHTML = `<h4>Paso ${i + 1} de 6 · ${n}</h4><p>${d}</p><div class="mock-fields">${f.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join("")}</div><span class="mock-chip">${chip}</span>`;
    panel.style.animation = "none"; panel.offsetHeight; panel.style.animation = "";
  };
  const stop = () => clearInterval(timer);
  const play = () => { if (stopped || reduceMotion) return; stop(); timer = setInterval(() => show((cur + 1) % kit.stages.length), 3200); };
  steps.onclick = (e) => { const b = e.target.closest("button"); if (!b) return; stopped = true; stop(); show(+b.dataset.i); };
  show(start);
  return { show, play, stop, get index() { return cur; } };
}

const inlineDevice = document.querySelector(".demo .device");
const demo = mountDemo(inlineDevice);
new IntersectionObserver(([e]) => { demo.stop(); if (e.isIntersecting) demo.play(); }, { threshold: 0.4 }).observe($("#ikitchen"));

// Botón "pantalla completa": el iPad crece desde su lugar y se abre la app
(() => {
  const btn = $("#expandDemo");
  let ov, bg, big, api, opener, k = 1, closing = false;
  const ease = "cubic-bezier(.22,.9,.24,1)";
  const offset = (r) => ({ dx: r.left + r.width / 2 - innerWidth / 2, dy: r.top + r.height / 2 - innerHeight / 2 });

  const open = () => {
    if (ov) return;
    opener = document.activeElement;
    demo.stop();
    const r = inlineDevice.getBoundingClientRect(), w = inlineDevice.offsetWidth;
    ov = document.createElement("div");
    ov.className = "overlay"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "I-Kitchen a pantalla completa (demo con datos ficticios)");
    bg = document.createElement("div"); bg.className = "ov-bg";
    const close = document.createElement("button");
    close.type = "button"; close.className = "ov-close"; close.innerHTML = 'Cerrar <span aria-hidden="true">✕</span>';
    big = inlineDevice.cloneNode(true);
    big.classList.add("big", "entering");
    big.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
    big.style.width = w + "px";
    big.querySelector(".screen").insertAdjacentHTML("beforeend", '<div class="splash" aria-hidden="true"><span>IK</span><b>I-Kitchen</b></div>');
    ov.append(bg, big, close);
    document.body.append(ov);
    document.body.classList.add("lock");
    const hh = big.offsetHeight;
    big.style.margin = `${-hh / 2}px 0 0 ${-w / 2}px`;
    k = Math.max(0.5, Math.min((innerWidth - 48) / w, (innerHeight - 110) / hh, 2));
    api = mountDemo(big, demo.index);
    const { dx, dy } = offset(r);
    inlineDevice.style.visibility = "hidden";
    const dur = reduceMotion ? 0 : 750;
    bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur ? 400 : 0, fill: "forwards" });
    big.animate([{ transform: `translate(${dx}px,${dy}px) scale(1)` }, { transform: `translate(0,0) scale(${k})` }], { duration: dur, easing: ease, fill: "forwards" });
    close.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur ? 300 : 0, delay: dur ? 450 : 0, fill: "backwards" });
    setTimeout(() => big && big.classList.remove("entering"), dur ? 2400 : 0);
    setTimeout(() => api && api.play(), dur ? 3200 : 800);
    close.focus();
  };

  const finish = () => {
    ov.remove(); ov = big = api = null; closing = false;
    inlineDevice.style.visibility = "";
    document.body.classList.remove("lock");
    demo.play();
    opener && opener.focus && opener.focus();
  };

  const close = () => {
    if (!ov || closing) return;
    closing = true; api.stop();
    big.classList.remove("entering"); big.classList.add("leaving");
    const dur = reduceMotion ? 0 : 520;
    big.getAnimations().forEach((a) => a.cancel());
    const { dx, dy } = offset(inlineDevice.getBoundingClientRect());
    bg.getAnimations().forEach((a) => a.cancel());
    bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, fill: "forwards" });
    const an = big.animate([{ transform: `translate(0,0) scale(${k})` }, { transform: `translate(${dx}px,${dy}px) scale(1)` }], { duration: dur, easing: ease, fill: "forwards" });
    an.onfinish = finish;
    if (!dur) finish();
  };

  btn.addEventListener("click", open);
  document.addEventListener("click", (e) => { if (ov && (e.target === bg || e.target.closest(".ov-close"))) close(); });
  document.addEventListener("keydown", (e) => {
    if (!ov) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const f = [...ov.querySelectorAll("button")].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addEventListener("resize", () => { if (ov && !closing) { closing = true; finish(); } });
})();

// Menú móvil
(() => {
  const nav = document.querySelector(".nav"), btn = $("#menu");
  const set = (open) => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); };
  btn.onclick = () => set(!nav.classList.contains("open"));
  nav.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
})();
