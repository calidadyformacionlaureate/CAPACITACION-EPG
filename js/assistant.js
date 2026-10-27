/* Asistente del portal: búsqueda local (costo cero) + IA opcional vía /api/ask */
(() => {
  if (typeof MODULES === "undefined" || typeof KB === "undefined") return;
  const A = Object.assign({ activo: true, ia: true, endpoint: "/api/ask", minScore: 2.2 }, (window.CONFIG || {}).asistente);
  if (!A.activo) return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const chunks = KB.buildChunks(MODULES), idx = KB.makeIndex(chunks);
  const lessonInfo = {}; MODULES.forEach(m => m.lessons.forEach(l => lessonInfo[l.id] = { m, l }));
  const SUGGEST = ["¿Cuánto demora en llegar el certificado de un curso?", "¿Qué diferencia hay entre retiro de asignatura y retiro temporal?", "¿Cómo valido si ya se enviaron los documentos de un alumno?", "¿Cómo consulto el horario de un alumno de posgrado?"];
  let aiOff = !A.ia, aiSeen = false, busy = false; const history = [];

  /* ---------- UI ---------- */
  const root = document.createElement("div"); root.className = "asst no-print";
  root.innerHTML = `
    <button class="asst-fab" aria-label="Abrir asistente" aria-expanded="false" aria-controls="asst-panel"><span class="asst-fab-i">💬</span><span class="asst-fab-t">Pregúntale al asistente</span></button>
    <section class="asst-panel" id="asst-panel" role="dialog" aria-label="Asistente EPG" hidden>
      <header><div class="asst-av">🎓</div><div class="asst-h"><strong>Asistente EPG</strong><small id="asst-sub">Responde con la información de este portal</small></div><button class="asst-x" aria-label="Cerrar">✕</button></header>
      <div class="asst-log" id="asst-log" aria-live="polite"></div>
      <div class="asst-chips" id="asst-chips"></div>
      <form class="asst-form" autocomplete="off"><input id="asst-in" type="text" maxlength="400" placeholder="Escribe tu consulta…" aria-label="Tu consulta"><button class="btn sm" type="submit" aria-label="Enviar">➤</button></form>
      <p class="asst-foot">No escribas datos personales de alumnos. Ante dudas, confirma con tu líder o el equipo de Capacitación.</p>
    </section>`;
  document.body.appendChild(root);
  const fab = $(".asst-fab", root), panel = $(".asst-panel", root), log = $("#asst-log"), input = $("#asst-in"), chipsEl = $("#asst-chips");

  const open = () => { panel.hidden = false; fab.setAttribute("aria-expanded", "true"); document.body.classList.add("asst-open"); if (!log.children.length) welcome(); setTimeout(() => input.focus(), 50); };
  const close = () => { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); document.body.classList.remove("asst-open"); fab.focus(); };
  fab.addEventListener("click", () => panel.hidden ? open() : close());
  $(".asst-x", root).addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });

  function scroll() { log.scrollTop = log.scrollHeight; }
  function bubble(who, html, extra) { const d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = `<div class="bub">${html}</div>${extra || ""}`; log.appendChild(d); scroll(); return d; }
  function firstName() { try { return String((JSON.parse(localStorage.getItem((window.CONFIG || {}).storageKey) || "{}").name || "")).split(" ")[0]; } catch (e) { return ""; } }
  function welcome() {
    const n = firstName();
    bubble("bot", `¡Hola${n ? ", " + esc(n) : ""}! Soy el asistente de la capacitación. Pregúntame sobre lo que aparece en el portal: programas, plazos de documentos, retiros, pagos, etc.`);
    showChips(SUGGEST);
  }
  function showChips(list) { chipsEl.innerHTML = list.map(q => `<button type="button" class="chip-q">${esc(q)}</button>`).join(""); }
  chipsEl.addEventListener("click", e => { const b = e.target.closest(".chip-q"); if (b) ask(b.textContent); });
  $(".asst-form", root).addEventListener("submit", e => { e.preventDefault(); const q = input.value.trim(); if (q) { input.value = ""; ask(q); } });

  /* ---------- Render de texto seguro ---------- */
  function linkify(t) { return t.replace(/(https?:\/\/[^\s)<]+)/g, u => `<a href="${u}" target="_blank" rel="noopener">${u.length > 46 ? u.slice(0, 44) + "…" : u}</a>`); }
  function md(text) { // escapa y aplica negritas / viñetas / saltos
    const lines = esc(text).split("\n"); let out = "", ul = false;
    lines.forEach(l => {
      const li = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)/);
      if (li) { if (!ul) { out += "<ul>"; ul = true; } out += `<li>${li[1]}</li>`; }
      else { if (ul) { out += "</ul>"; ul = false; } if (l.trim()) out += `<p>${l}</p>`; }
    });
    if (ul) out += "</ul>";
    return linkify(out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
  }
  function sourcesHTML(ids) {
    const seen = [], items = ids.filter(id => lessonInfo[id] && !seen.includes(id) && seen.push(id)).slice(0, 3);
    if (!items.length) return "";
    return `<div class="src"><small>Ver en el portal:</small>${items.map(id => { const x = lessonInfo[id]; return `<a class="src-a" href="#/${x.m.id}/tema/${id}">${x.l.icon} ${esc(x.l.title)} <em>${esc(x.m.short)}</em></a>`; }).join("")}</div>`;
  }
  const typing = () => bubble("bot", `<span class="dots"><i></i><i></i><i></i></span>`);

  /* ---------- Respuesta local ---------- */
  function ctxLesson() { const m = (location.hash || "").match(/^#\/m\d+\/tema\/(\w+)/); return m ? m[1] : null; }
  function localAnswer(q) {
    const res = KB.search(idx, q, { k: 5, ctx: ctxLesson() }).filter(r => r.score >= A.minScore);
    if (!res.length) return { html: `No encontré eso en el contenido del portal. Prueba con otras palabras (por ejemplo “retiro”, “plazo”, “certificado”, “pago”) o consúltalo con tu líder o el equipo de Capacitación.`, ids: [] };
    const top = res[0], c = top.chunk;
    if (c.heading.startsWith("Video:")) { // resumen del video: se muestran todos los pasos
      const ls = c.text.split("\n"), steps = ls.filter(l => l.startsWith("•")).map(l => l.replace(/^•\s*/, "")), extra = ls.filter(l => !l.startsWith("•") && !/^(Video:|Resumen)/.test(l));
      return { html: `<p><strong>${esc(c.heading.replace(/^Video:\s*/, ""))}</strong></p><ol>${steps.map(x => `<li>${linkify(esc(x))}</li>`).join("")}</ol>${extra.map(x => `<p class="muted">${esc(x)}</p>`).join("")}<p class="muted">Está explicado en el video del tema.</p>`, ids: res.map(r => r.chunk.id) };
    }
    const lines = c.type === "qa" ? [c.text.split("→").slice(1).join("→").trim() || c.text] : KB.bestLines(c.text, q, 3);
    const body = lines.filter(l => l.trim() !== c.heading).map(l => `<p>${linkify(esc(l.replace(/^•\s*/, "")))}</p>`).join("");
    const ids = res.map(r => r.chunk.id);
    return { html: `<p class="lead-s"><strong>${esc(c.heading === "Repaso" ? c.lesson : c.heading)}</strong></p>${body}`, ids };
  }

  /* ---------- IA opcional ---------- */
  async function askAI(q) {
    const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 25000);
    try {
      const r = await fetch(A.endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q, history: history.slice(-6) }), signal: ctrl.signal });
      if ([404, 405, 501, 503].includes(r.status)) { aiOff = true; throw new Error("off"); }
      if (r.status === 429) { const e = new Error("rate"); e.rate = true; throw e; }
      if (!r.ok) throw new Error("http " + r.status);
      const j = await r.json(); if (!j.answer) throw new Error("empty");
      return String(j.answer);
    } finally { clearTimeout(to); }
  }
  function splitIds(text) { const ids = []; const clean = text.replace(/\[\[([\w-]+)\]\]/g, (m, id) => { ids.push(id); return ""; }).replace(/\n{3,}/g, "\n\n").trim(); return { clean, ids }; }

  /* ---------- Flujo ---------- */
  async function ask(q) {
    if (busy) return; busy = true; chipsEl.innerHTML = "";
    bubble("user", esc(q)); const t = typing();
    let html, ids = [];
    try {
      if (aiOff) throw new Error("off");
      const raw = await askAI(q), s = splitIds(raw);
      html = md(s.clean); ids = s.ids; aiSeen = true; $("#asst-sub").textContent = "Asistente con IA · basado en el contenido del portal";
      history.push({ role: "user", content: q }, { role: "assistant", content: s.clean });
    } catch (e) {
      if (e.rate) { html = "<p>Se hicieron muchas consultas seguidas. Espera unos minutos e inténtalo de nuevo.</p>"; }
      else { const l = localAnswer(q); html = l.html; ids = l.ids; if (!aiSeen) $("#asst-sub").textContent = "Búsqueda en el contenido del portal"; }
    }
    t.remove(); bubble("bot", html, sourcesHTML(ids)); busy = false; input.focus();
  }

  window.EPGAssistant = { open, close, ask, localAnswer }; // útil para pruebas
})();
