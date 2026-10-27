(() => {
const C = window.CONFIG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

/* ---------- Estado (localStorage con respaldo en memoria) ---------- */
let mem = null;
const blankMod = () => ({ done: {}, checks: {}, reveals: {} });
const blank = () => ({ started: null, videos: {}, mods: {}, evalClicked: false });
function load() { try { const r = localStorage.getItem(C.storageKey); if (r) { const o = JSON.parse(r); return Object.assign(blank(), { started: o.started || null, videos: o.videos || {}, mods: o.mods || {}, evalClicked: o.evalClicked || false }); } } catch (e) {} return mem || blank(); }
let S = load(), CM = null;
const modState = id => S.mods[id] || (S.mods[id] = blankMod());
const ms = () => modState(CM.id);
function save() { mem = S; try { localStorage.setItem(C.storageKey, JSON.stringify(S)); } catch (e) {} updateChrome(); }

/* ---------- Requisitos por tema ---------- */
function reqs(lesson) {
  const out = { checks: 0, checksDone: 0, reveals: 0, revealsDone: 0, videos: 0, videosDone: 0 };
  const st = modState(MODULES.find(m => m.lessons.some(l => l.id === lesson.id)).id);
  lesson.blocks.forEach((b, i) => {
    const k = lesson.id + ":" + i;
    if (b.t === "check") { out.checks++; if (st.checks[k]) out.checksDone++; }
    if (b.t === "reveal") { out.reveals++; if (st.reveals[k]) out.revealsDone++; }
    if (b.t === "video") { out.videos++; if ((S.videos[b.id] || 0) >= 0.85) out.videosDone++; }
  });
  return out;
}
const total = r => r.checks + r.reveals + r.videos, doneN = r => r.checksDone + r.revealsDone + r.videosDone;
const ready = l => { const r = reqs(l); return doneN(r) === total(r); };
function lessonPct(l) {
  const m = MODULES.find(m => m.lessons.some(x => x.id === l.id));
  if (modState(m.id).done[l.id]) return 100;
  const r = reqs(l), t = total(r); return t ? Math.round(doneN(r) / t * 100) : 0;
}
function modPct(m) { const st = modState(m.id); return Math.round(m.lessons.filter(l => st.done[l.id]).length / m.lessons.length * 100); }
function overallPct() { if (CM) return modPct(CM); const totalL = MODULES.reduce((a, m) => a + m.lessons.length, 0); const doneL = MODULES.reduce((a, m) => a + m.lessons.filter(l => modState(m.id).done[l.id]).length, 0); return Math.round(doneL / totalL * 100); }
const allTopicsDone = () => MODULES.every(m => m.lessons.every(l => modState(m.id).done[l.id]));
const nVideos = m => m.lessons.reduce((a, l) => a + l.blocks.filter(b => b.t === "video").length, 0);
const nMin = m => m.lessons.reduce((a, l) => a + l.min, 0);
const nextTarget = m => { const st = modState(m.id), l = m.lessons.find(x => !st.done[x.id]); return l ? `#/${m.id}/tema/${l.id}` : `#/${m.id}`; };

/* ---------- Chrome (barra superior, menú) ---------- */
function updateChrome() {
  const p = overallPct();
  $("#pbar").style.width = p + "%"; $("#ppct").textContent = p + "%";
  $("#pbar").parentElement.setAttribute("aria-valuenow", p);
  $(".prog").setAttribute("aria-label", CM ? "Avance de " + CM.short : "Avance total");
  const nav = $("#nav"), cur = (location.hash.match(/^#\/m\d+\/(?:tema\/)?(\w+)/) || [])[1] || "";
  if (!CM) {
    $(".side-h").textContent = "Módulos";
    nav.innerHTML = MODULES.map(m => `<a href="#/${m.id}" class="nav-i ${modPct(m) === 100 ? "done" : modPct(m) > 0 ? "part" : ""}"><span class="nav-n">${modPct(m) === 100 ? "✓" : m.n}</span><span class="nav-t">${esc(m.short)} · ${esc(m.title)}<small class="nav-s">${modPct(m)}% completado</small></span></a>`).join("")
      + `<a href="#/evaluacion" class="nav-i exam ${allTopicsDone() ? (S.evalClicked ? "done" : "") : "locked"}"><span class="nav-n">${S.evalClicked ? "✓" : "★"}</span><span class="nav-t">Evaluación final${allTopicsDone() ? "" : " 🔒"}</span></a>`;
  } else {
    const st = modState(CM.id);
    $(".side-h").textContent = CM.short;
    nav.innerHTML = `<a href="#/" class="nav-i back"><span class="nav-n">←</span><span class="nav-t">Todos los módulos</span></a>`
      + CM.lessons.map((l, i) => {
        const s2 = st.done[l.id] ? "done" : lessonPct(l) > 0 ? "part" : "";
        return `<a href="#/${CM.id}/tema/${l.id}" class="nav-i ${s2}" data-id="${l.id}"><span class="nav-n">${st.done[l.id] ? "✓" : i + 1}</span><span class="nav-t">${esc(l.title)}</span></a>`;
      }).join("");
    $$(".nav-i", nav).forEach(a => a.classList.toggle("cur", a.dataset.id === cur));
  }
}

/* ---------- Router ---------- */
const main = $("#main");
function route() {
  let h = location.hash || "#/";
  const old = h.match(/^#\/tema\/(\w+)/);
  if (old) { const m = MODULES.find(x => x.lessons.some(l => l.id === old[1])); if (m) { location.replace(`#/${m.id}/tema/${old[1]}`); return; } }
  closeMenu(); window.scrollTo({ top: 0 }); document.querySelectorAll("video").forEach(v => v.pause());
  const m = h.match(/^#\/(m\d+)(?:\/(.*))?$/);
  if (h === "#/evaluacion") { CM = null; return renderEvalFinal(); }
  CM = m ? MODULES.find(x => x.id === m[1]) || null : null;
  if (!CM) return renderLanding();
  const rest = m[2] || "";
  if (rest.startsWith("tema/")) return renderLesson(rest.split("/")[1]);
  renderModuleHome();
}
window.addEventListener("hashchange", route);

/* ---------- Inicio ---------- */
const ring = p => `<div class="hero-c"><div class="ring" style="--p:${p}"><div><strong>${p}%</strong><span>completado</span></div></div></div>`;

function renderLanding() {
  if (!S.started) { S.started = new Date().toISOString(); save(); }
  const first = MODULES.find(m => modPct(m) < 100) || MODULES[0];
  main.innerHTML = `
  <section class="hero"><div class="hero-t"><span class="chip">${MODULES.length} módulos · Autoguiado</span>
    <h1>${esc(C.titulo)}<br><em>Atención al alumno de Postgrado</em></h1>
    <div class="instrucciones">
      <h3>📋 ¿Cómo funciona esta capacitación?</h3>
      <ul>
        <li><strong>Avanza a tu ritmo:</strong> la capacitación es asíncrona. Puedes pausar y retomar cuando lo necesites.</li>
        <li><strong>2 módulos con temas:</strong> cada tema incluye videos, casos prácticos y preguntas de verificación que debes completar para avanzar.</li>
        <li><strong>Videos obligatorios:</strong> debes ver al menos el 85 % de cada video para que se marque como completado.</li>
        <li><strong>Evaluación final:</strong> al completar todos los temas de ambos módulos se habilitará una evaluación final en Microsoft Forms.</li>
        <li><strong>Progreso guardado:</strong> tu avance se guarda automáticamente en este navegador.</li>
      </ul>
    </div>
    <a class="btn" href="${nextTarget(first)}">Comenzar →</a>
  </div>${ring(overallPct())}</section>
  <h2 class="sec">Elige tu módulo</h2>
  <div class="mods">${MODULES.map(m => { const p = modPct(m), st = modState(m.id);
    return `<a class="mod ${p === 100 ? "ok" : ""}" href="#/${m.id}"><div class="mod-top"><span class="ico">${m.icon}</span><span class="num">${esc(m.short)}</span></div>
      <h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p>
      <ul>${m.lessons.map(l => `<li class="${st.done[l.id] ? "d" : ""}">${esc(l.title)}</li>`).join("")}</ul>
      <div class="card-f"><span>📚 ${m.lessons.length} temas · 🎬 ${nVideos(m)} videos · ⏱ ~${nMin(m)} min</span><span class="stt">${p === 100 ? "Completado" : p > 0 ? p + "%" : "Pendiente"}</span></div><div class="mini"><i style="width:${p}%"></i></div></a>`; }).join("")}</div>
  ${allTopicsDone() ? `<div class="eval-banner"><a class="btn" href="#/evaluacion">★ Ir a la evaluación final →</a></div>` : `<div class="eval-banner locked"><span>🔒 Completa todos los temas de ambos módulos para habilitar la evaluación final.</span></div>`}
  <p class="foot-note">Contenido de uso interno para capacitación. Si algo no coincide con tu proceso actual, avisa al equipo de Capacitación.</p>`;
  updateChrome();
}

function renderModuleHome() {
  const st = modState(CM.id), p = modPct(CM), started = p > 0;
  const firstPending = CM.lessons.find(l => !st.done[l.id]);
  main.innerHTML = `
  <div class="crumbs"><a href="#/">Módulos</a> › ${esc(CM.short)}</div>
  <section class="hero"><div class="hero-t"><span class="chip">${esc(CM.short)} de ${MODULES.length}</span>
    <h1>${esc(CM.title)}<br><em>${esc(C.titulo)} · Postgrado</em></h1><p>${esc(CM.summary)}</p>
    <div class="hero-meta"><span>📚 ${CM.lessons.length} temas</span>${nVideos(CM) ? `<span>🎬 ${nVideos(CM)} videos</span>` : ""}<span>⏱️ ~${nMin(CM)} min</span></div>
    ${firstPending ? `<a class="btn" href="#/${CM.id}/tema/${firstPending.id}">${started ? "Continuar →" : "Comenzar →"}</a>` : `<a class="btn ghost" href="#/">✓ Módulo completado · Volver</a>`}
  </div>${ring(p)}</section>
  <h2 class="sec">Contenido</h2>
  <div class="grid">${CM.lessons.map((l, i) => {
    const lp = lessonPct(l), t = st.done[l.id] ? "Completado" : lp > 0 ? lp + "% · En curso" : "Pendiente";
    return `<a class="card ${st.done[l.id] ? "ok" : ""}" href="#/${CM.id}/tema/${l.id}"><div class="card-top"><span class="ico">${l.icon}</span><span class="num">Tema ${i + 1}</span></div>
      <h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p><div class="card-f"><span>⏱ ${l.min} min</span><span class="stt">${t}</span></div><div class="mini"><i style="width:${lp}%"></i></div></a>`; }).join("")}
  </div>
  <p class="foot-note"><a href="#/">← Ver todos los módulos</a></p>`;
  updateChrome();
}

/* ---------- Bloques ---------- */
function blockHTML(b, lesson, i) {
  const m = MODULES.find(m => m.lessons.some(l => l.id === lesson.id));
  const st = modState(m.id);
  const k = lesson.id + ":" + i;
  switch (b.t) {
    case "html": return `<div class="blk">${b.h}</div>`;
    case "img": return `<figure class="blk fig ${b.cls || ""}"><img loading="lazy" src="${b.src}" alt="${esc(b.cap || "")}" data-zoom>${b.cap ? `<figcaption>${esc(b.cap)}</figcaption>` : ""}</figure>`;
    case "imgs": return `<div class="blk figs">${b.items.map(x => `<figure class="fig"><img loading="lazy" src="${x.src}" alt="${esc(x.cap)}" data-zoom><figcaption>${esc(x.cap)}</figcaption></figure>`).join("")}</div>`;
    case "video": { const p = Math.round((S.videos[b.id] || 0) * 100);
      return `<div class="blk vid" data-vid="${b.id}"><h3>🎬 ${esc(b.title)}</h3><video controls preload="none" playsinline poster="${b.poster}" src="${b.src}"></video>
      <div class="vstat"><div class="mini"><i style="width:${Math.min(100, p)}%"></i></div><span>${p >= 85 ? "✓ Visto" : "Visto " + p + "% (se marca al llegar al 85%)"}</span></div></div>`; }
    case "programs": return `<div class="blk progs">${b.items.map(x => `<div class="pcard ${x.c}"><span class="tag">${x.tag}</span><h4>${x.name}</h4><p>${x.dur}</p>${x.hrs !== "—" ? `<p class="h">${x.hrs}</p>` : ""}<div class="pz"><small>Emisión masiva</small><strong>${x.plazo}</strong></div></div>`).join("")}</div>`;
    case "accordion": return `<div class="blk">${b.items.map(x => `<details class="acc"><summary>${x.q}</summary><div>${x.a}</div></details>`).join("")}</div>`;
    case "steps": return `<ol class="blk steps">${b.items.map((s, n) => `<li><span class="sn">${n + 1}</span><div><p class="sh">${s.h}</p>${s.p ? `<p class="muted">${s.p}</p>` : ""}${s.img ? `<img loading="lazy" src="${s.img}" alt="Paso ${n + 1}" data-zoom>` : ""}</div></li>`).join("")}</ol>`;
    case "table": return `<div class="blk">${b.search ? `<input class="tsearch" type="search" placeholder="🔎 Buscar documento o programa…" aria-label="Buscar en la tabla">` : ""}<div class="tw"><table class="tbl"><thead><tr>${b.head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map((c, n) => n === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
    case "reveal": { const open = st.reveals[k];
      return `<div class="blk reveal ${open ? "open" : ""}" data-k="${k}"><span class="tag">${b.title}</span><p>${b.q}</p><button class="btn ghost sm rv">${open ? "Ocultar respuesta" : "Ver respuesta"}</button>
      <div class="ans" ${open ? "" : "hidden"}><p><strong>Respuesta:</strong> ${b.a}</p>${b.img ? `<img loading="lazy" src="${b.img}" alt="Captura del ejemplo" data-zoom>` : ""}</div></div>`; }
    case "check": { const chk = st.checks[k]; const opts = b.kind === "tf" ? ["Verdadero", "Falso"] : b.opts;
      const ai = b.kind === "tf" ? (b.a ? 0 : 1) : b.a;
      return `<div class="blk check ${chk ? "answered" : ""}" data-k="${k}" data-a="${ai}"><span class="tag">${b.kind === "tf" ? "Verdadero o falso" : "Comprueba lo aprendido"}</span><p class="cq">${b.q}</p>
      <div class="opts">${opts.map((o, n) => `<button class="opt ${chk ? (n === ai ? "right" : chk.pick === n ? "wrong" : "") : ""}" data-n="${n}" ${chk ? "disabled" : ""}>${o}</button>`).join("")}</div>
      <div class="fb ${chk ? (chk.ok ? "ok" : "ko") : ""}" ${chk ? "" : "hidden"}>${chk ? (chk.ok ? "✅ ¡Correcto! " : "❌ No exactamente. ") + b.fb : ""}</div></div>`; }
    case "calc": return `<div class="blk calc"><h3>🧮 Simulador de liquidación</h3><p class="muted">Practica con el ejemplo del retiro temporal. Fórmula: <code>Saldo = E − (D + F + G)</code>, donde D = avance del programa, F = préstamo de iPad, G = costos por retiro (2,5 % de la inversión) y E = monto cancelado.</p>
      <div class="cg"><label>Inversión total (S/)<input type="number" step="0.01" id="c_inv" value="26530"></label><label>D · Avance del programa (S/)<input type="number" step="0.01" id="c_d" value="3316.25"></label>
      <label>F · Préstamo de iPad (S/)<input type="number" step="0.01" id="c_f" value="0"></label><label>E · Monto cancelado (S/)<input type="number" step="0.01" id="c_e" value="5306"></label></div>
      <div class="cr"><div><small>G · Costos por retiro (2,5 %)</small><strong id="c_g"></strong></div><div><small>D + F + G</small><strong id="c_s"></strong></div><div class="big"><small id="c_l"></small><strong id="c_r"></strong></div></div>
      <p class="muted" id="c_n"></p></div>`;
  }
  return "";
}

/* ---------- Lección ---------- */
function renderLesson(id) {
  const idx = CM.lessons.findIndex(l => l.id === id); if (idx < 0) return renderModuleHome();
  const l = CM.lessons[idx], prev = CM.lessons[idx - 1], next = CM.lessons[idx + 1];
  main.innerHTML = `<article class="lesson">
    <div class="crumbs"><a href="#/">Módulos</a> › <a href="#/${CM.id}">${esc(CM.short)}</a> › Tema ${idx + 1} de ${CM.lessons.length}</div>
    <header class="lh"><span class="ico big">${l.icon}</span><div><h1>${esc(l.title)}</h1><p>${esc(l.summary)}</p></div></header>
    ${l.blocks.map((b, i) => blockHTML(b, l, i)).join("")}
    <footer class="lf"><div class="req" id="req"></div><div class="lbtns">
      ${prev ? `<a class="btn ghost" href="#/${CM.id}/tema/${prev.id}">← Anterior</a>` : `<a class="btn ghost" href="#/${CM.id}">← Inicio del módulo</a>`}
      <button class="btn" id="finish">${ms().done[l.id] ? (next ? "Siguiente tema →" : "Volver al módulo →") : (next ? "Completar y continuar →" : "Completar tema →")}</button></div></footer></article>`;
  wireLesson(l, next); updateReq(l); updateChrome();
}
function updateReq(l) {
  const r = reqs(l), box = $("#req"), btn = $("#finish"); if (!box) return;
  const parts = [];
  if (r.checks) parts.push(`Preguntas ${r.checksDone}/${r.checks}`);
  if (r.reveals) parts.push(`Práctica ${r.revealsDone}/${r.reveals}`);
  if (r.videos) parts.push(`Videos ${r.videosDone}/${r.videos}`);
  const ok = ready(l);
  box.innerHTML = ms().done[l.id] ? "✓ Tema completado" : parts.length ? (ok ? "✓ Listo para continuar" : "Para continuar: " + parts.join(" · ")) : "";
  box.classList.toggle("ready", !!(ok || ms().done[l.id]));
  btn.disabled = !(ok || ms().done[l.id]);
}
function wireLesson(l, next) {
  // checks
  $$(".check").forEach(el => $$(".opt", el).forEach(btn => btn.addEventListener("click", () => {
    const k = el.dataset.k, i = +k.split(":")[1], b = l.blocks[i], ai = +el.dataset.a, pick = +btn.dataset.n, ok = pick === ai;
    ms().checks[k] = { ok, pick }; save();
    $$(".opt", el).forEach((o, n) => { o.disabled = true; if (n === ai) o.classList.add("right"); else if (n === pick) o.classList.add("wrong"); });
    const fb = $(".fb", el); fb.hidden = false; fb.className = "fb " + (ok ? "ok" : "ko"); fb.textContent = (ok ? "✅ ¡Correcto! " : "❌ No exactamente. ") + b.fb;
    el.classList.add("answered"); updateReq(l);
  })));
  // reveal
  $$(".reveal").forEach(el => $(".rv", el).addEventListener("click", () => {
    const a = $(".ans", el), open = a.hidden; a.hidden = !open; el.classList.toggle("open", open);
    $(".rv", el).textContent = open ? "Ocultar respuesta" : "Ver respuesta"; if (open) { ms().reveals[el.dataset.k] = true; save(); updateReq(l); }
  }));
  // videos
  $$(".vid").forEach(el => {
    const v = $("video", el), id = el.dataset.vid, bar = $(".mini i", el), lab = $(".vstat span", el);
    let maxT = 0;
    v.addEventListener("timeupdate", () => {
      if (!v.duration) return;
      if (v.currentTime > maxT && v.currentTime - maxT < 4) maxT = v.currentTime;
      const p = Math.min(1, maxT / v.duration), prevP = S.videos[id] || 0;
      if (p > prevP + 0.01 || (p >= .85 && prevP < .85)) { S.videos[id] = Math.max(prevP, p); save(); updateReq(l); }
      const q = Math.round((S.videos[id] || 0) * 100); bar.style.width = Math.min(100, q) + "%"; lab.textContent = q >= 85 ? "✓ Visto" : `Visto ${q}% (se marca al llegar al 85%)`;
    });
    v.addEventListener("ended", () => { S.videos[id] = 1; save(); updateReq(l); bar.style.width = "100%"; lab.textContent = "✓ Visto"; });
    v.addEventListener("loadedmetadata", () => { const pr = S.videos[id] || 0; if (pr > 0 && pr < .95) v.currentTime = pr * v.duration * .98; maxT = v.currentTime; });
  });
  // tabla buscador
  $$(".tsearch").forEach(inp => inp.addEventListener("input", () => { const q = inp.value.toLowerCase(); $$("tbody tr", inp.parentElement).forEach(tr => tr.hidden = q && !tr.textContent.toLowerCase().includes(q)); }));
  // calculadora
  if ($(".calc")) {
    const g = id => parseFloat($(id).value) || 0, f = n => "S/ " + n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const run = () => { const inv = g("#c_inv"), d = g("#c_d"), fx = g("#c_f"), e = g("#c_e"), G = inv * .025, s = d + fx + G, r = e - s;
      $("#c_g").textContent = f(G); $("#c_s").textContent = f(s); $("#c_l").textContent = r >= 0 ? "Saldo por reembolsar" : "Saldo pendiente de pago"; $("#c_r").textContent = f(Math.abs(r));
      $(".cr .big").className = "big " + (r >= 0 ? "pos" : "neg");
      $("#c_n").textContent = r >= 0 ? "El alumno tiene saldo a favor: debe solicitar la devolución en Trámites EPG (máx. 30 días hábiles desde la nota de crédito)." : "El alumno mantiene un importe pendiente de pago según la liquidación."; };
    $$(".calc input").forEach(i => i.addEventListener("input", run)); run();
  }
  // finalizar
  $("#finish").addEventListener("click", () => {
    if (!ms().done[l.id]) { ms().done[l.id] = new Date().toISOString(); save(); toast("✓ Tema completado"); }
    if (next) { location.hash = `#/${CM.id}/tema/${next.id}`; }
    else if (allTopicsDone()) { location.hash = "#/evaluacion"; }
    else { location.hash = `#/${CM.id}`; }
  });
}

/* ---------- Evaluación Final (Forms) ---------- */
function renderEvalFinal() {
  updateChrome();
  if (!allTopicsDone()) {
    const pending = [];
    MODULES.forEach(m => m.lessons.forEach(l => { if (!modState(m.id).done[l.id]) pending.push({ mod: m.short, title: l.title }); }));
    main.innerHTML = `<article class="lesson"><div class="crumbs"><a href="#/">Módulos</a> › Evaluación final</div>
      <header class="lh"><span class="ico big">🔒</span><div><h1>Evaluación final</h1><p>Debes completar todos los temas antes de acceder a la evaluación.</p></div></header>
      <div class="callout warn"><div class="ci">⚠️</div><div><strong>Temas pendientes:</strong><ul>${pending.map(p => `<li>${esc(p.mod)} · ${esc(p.title)}</li>`).join("")}</ul></div></div>
      <div class="lbtns"><a class="btn" href="#/">← Volver a los módulos</a></div></article>`;
    return;
  }
  main.innerHTML = `<article class="lesson eval-page">
    <div class="crumbs"><a href="#/">Módulos</a> › Evaluación final</div>
    <header class="lh"><span class="ico big">★</span><div><h1>Evaluación final</h1><p>Has completado todos los temas de ambos módulos. ¡Felicitaciones!</p></div></header>
    <div class="callout info"><div class="ci">✅</div><div><strong>Todos los temas completados.</strong> Ya puedes rendir tu evaluación final.</div></div>
    <div class="eval-card">
      <div class="eval-card-in">
        <img src="assets/img/logo_upc.webp" alt="Logo" class="eval-logo">
        <h2>Evaluación final</h2>
        <p>${esc(C.titulo)} · Atención al alumno de Postgrado</p>
        <ul>
          <li>La evaluación se realizará en <strong>Microsoft Forms</strong>.</li>
          <li>Se abrirá en una nueva pestaña.</li>
          <li>Responde todas las preguntas y envía el formulario al terminar.</li>
        </ul>
        <a class="btn eval-btn" id="goForms" href="${EVAL_FORMS_URL}" target="_blank" rel="noopener">Iniciar evaluación ↗</a>
      </div>
    </div>
    <div class="lbtns" style="margin-top:20px"><a class="btn ghost" href="#/">← Volver a los módulos</a></div>
    <p class="muted" style="margin-top:14px">Tu progreso de los temas está guardado en este navegador.</p></article>`;
  const goBtn = $("#goForms");
  if (goBtn) goBtn.addEventListener("click", () => { S.evalClicked = true; save(); confetti(); });
}

/* ---------- Utilidades UI ---------- */
function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1800); }
function confetti() {
  const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c); const x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
  const cols = ["#E30613", "#F6A21A", "#1B2A4A", "#7B2D8E", "#2E7D32"], ps = Array.from({ length: 120 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height / 2, r: 4 + Math.random() * 5, v: 2 + Math.random() * 4, w: Math.random() * 2 - 1, c: cols[Math.random() * 5 | 0] }));
  let f = 0; (function step() { x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.y += p.v; p.x += p.w * 2; x.fillStyle = p.c; x.fillRect(p.x, p.y, p.r, p.r * 1.6); }); if (++f < 170) requestAnimationFrame(step); else c.remove(); })();
}
// zoom de imágenes
document.addEventListener("click", e => {
  const im = e.target.closest("img[data-zoom]"); if (!im) return;
  const lb = $("#lb"); $("img", lb).src = im.src; $("img", lb).alt = im.alt; lb.hidden = false; document.body.classList.add("noscroll");
});
$("#lb").addEventListener("click", () => { $("#lb").hidden = true; document.body.classList.remove("noscroll"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { $("#lb").hidden = true; document.body.classList.remove("noscroll"); closeMenu(); } });
function closeMenu() { document.body.classList.remove("menu-open"); $("#burger").setAttribute("aria-expanded", "false"); }
$("#burger").addEventListener("click", () => { const o = document.body.classList.toggle("menu-open"); $("#burger").setAttribute("aria-expanded", o); });
$("#scrim").addEventListener("click", closeMenu);

route(); updateChrome();
})();
