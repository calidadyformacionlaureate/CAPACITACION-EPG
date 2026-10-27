/* Base de conocimiento del asistente: se genera a partir de MODULES (js/content.js).
   Se usa en el navegador (búsqueda local) y en el servidor (api/ask.js) para dar contexto a la IA. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(); else root.KB = factory();
})(this, function () {
  const ENT = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
  function htmlToText(h) {
    return String(h || "")
      .replace(/<a [^>]*href="(https?:[^"]+)"[^>]*>(.*?)<\/a>/gi, (m, u, t) => t.replace(/<[^>]+>/g, "") + " (" + u + ")")
      .replace(/<img [^>]*alt="([^"]*)"[^>]*>/gi, "\n$1: ")
      .replace(/<li[^>]*>/gi, "\n• ").replace(/<\/(p|div|h[1-6]|tr|ul|ol)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(td|th)>/gi, " | ")
      .replace(/<[^>]+>/g, "").replace(/&(amp|lt|gt|quot|#39|nbsp);/g, m => ENT[m])
      .replace(/^[^\p{L}\p{N}]+$/gmu, "").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{2,}/g, "\n").trim();
  }

  /* ---- Convierte los módulos en fragmentos {id, mod, lesson, heading, text, type} ---- */
  function buildChunks(MODS) {
    const out = [];
    MODS.forEach(m => m.lessons.forEach(l => {
      let heading = l.title, buf = [];
      const base = { id: l.id, mod: m.id, modTitle: m.short + ": " + m.title, lesson: l.title };
      const flush = () => { const t = buf.join("\n").trim(); if (t) out.push(Object.assign({}, base, { heading, text: t, type: "text" })); buf = []; };
      const add = t => { if (t) { buf.push(t); if (buf.join("\n").length > 1400) flush(); } };
      l.blocks.forEach(b => {
        switch (b.t) {
          case "html": {
            const h = b.h.match(/<h3[^>]*>(.*?)<\/h3>/);
            if (h) { flush(); heading = htmlToText(h[1]); }
            add(htmlToText(b.h)); break; }
          case "programs": flush(); heading = "Tipos de programa y plazos de emisión";
            add(b.items.map(x => `${x.name} (${x.tag}): ${htmlToText(x.dur)}${x.hrs !== "—" ? ", " + x.hrs : ""}. Emisión masiva: ${x.plazo}.`).join("\n")); break;
          case "accordion": add(b.items.map(x => htmlToText(x.q).replace(/^[^\p{L}\p{N}]+/u, "") + ":\n" + htmlToText(x.a)).join("\n")); break;
          case "steps": add(b.items.map((s, n) => `Paso ${n + 1}: ${htmlToText(s.h)}${s.p ? " " + htmlToText(s.p) : ""}`).join("\n")); break;
          case "table": flush(); heading = "Tabla: " + (heading || l.title);
            add(b.rows.map(r => r.map((c, n) => (b.head[n] ? b.head[n] + ": " : "") + htmlToText(c)).join(" · ")).join("\n")); flush(); break;
          case "reveal": add(`Caso práctico — ${htmlToText(b.q)}\nRespuesta: ${htmlToText(b.a)}`); break;
          case "video": if (b.sumario) { flush(); heading = "Video: " + b.title; add(`Video: ${b.title}. Resumen paso a paso:`); } else add(`Video: ${b.title}. (El detalle paso a paso está en el video; no hay transcripción en el portal.)`); break;
          case "img": case "imgs": (b.items || [b]).forEach(x => x.cap && add("Imagen: " + x.cap)); break;
          case "calc": add("Simulador de liquidación: Saldo = E − (D + F + G); D = avance del programa, F = préstamo de iPad, G = costos por retiro (2,5 % de la inversión total), E = monto cancelado. Si el resultado es positivo hay saldo por reembolsar; si es negativo, queda un importe pendiente."); break;
          case "check": {
            const ans = b.kind === "tf" ? (b.a ? "Verdadero" : "Falso") : b.opts[b.a];
            flush();
            out.push(Object.assign({}, base, { heading: "Repaso", type: "qa", text: `${htmlToText(b.q)} → ${ans}. ${b.fb}` })); break; }
        }
      });
      flush();
    }));
    return out;
  }

  /* ---- Texto para el prompt de la IA (omite las preguntas de repaso para ahorrar tokens) ---- */
  function toPrompt(chunks) {
    let cur = "", s = "";
    chunks.filter(c => c.type === "text").forEach(c => {
      if (c.id !== cur) { cur = c.id; s += `\n\n## [${c.id}] ${c.modTitle} — Tema: ${c.lesson}`; }
      s += `\n### ${c.heading}\n${c.text}`;
    });
    return s.trim();
  }

  /* ---- Búsqueda local (BM25 + raíces + sinónimos) ---- */
  const STOP = new Set("a al algo ante con como cual cuales cuando cuanto cuantos de del donde el ella en es esta estan este esto ha han hay la las le les lo los me mi mis muy no o para pero por porque que se si sin sobre son su sus te tu un una uno unos y ya yo puedo puede pueden debo debe deben hacer hago hace dime quiero necesito saber sirve seria ser hacerlo mas menos tengo tiene tienen".split(" "));
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const SYN = { // raíz → raíces equivalentes
    paga: ["pago"], pagar: ["pago"], dine: ["pago", "reem", "deud"], plat: ["pago", "deud"], banc: ["pago"], cuot: ["pago"],
    devo: ["reem"], devu: ["reem", "devo"], reem: ["devo", "devu"], liqu: ["reem"],
    tard: ["plaz"], demo: ["plaz"], cuan: ["plaz"], dias: ["plaz"], tiem: ["plaz"],
    dipl: ["cert", "docu"], cert: ["docu"], docu: ["cert"],
    clav: ["cred"], pass: ["cred"], usua: ["cred"], acce: ["cred"], ingr: ["cred"],
    sali: ["reti"], dar: ["reti"], baja: ["reti"], aban: ["reti"],
    nota: ["calif"], hora: ["hora"], asis: ["asis"], falt: ["asis"],
    corr: ["dato"], cambi: ["actu"], actu: ["dato"], modi: ["actu"], dato: ["actu"],
    ingl: ["idio"], idio: ["ingl"], deud: ["pago"], mora: ["deud"]
  };
  const stem = w => { w = w.replace(/(es|s)$/, m => (w.length > 5 || m === "s" ? "" : m)); return w.length >= 5 ? w.slice(0, 4) : w; };
  function tokens(s) { return norm(s).split(/[^a-z0-9ñ]+/).filter(w => w.length > 1 && !STOP.has(w)).map(stem); }
  function expand(ts) { const o = new Set(ts); ts.forEach(t => (SYN[t] || []).forEach(x => o.add(x))); return [...o]; }

  function makeIndex(chunks) {
    const docs = chunks.map(c => { const t = tokens(c.text).concat(tokens(c.heading + " " + c.lesson), tokens(c.heading + " " + c.lesson)); const tf = {}; t.forEach(x => tf[x] = (tf[x] || 0) + 1); return { tf, len: t.length }; });
    const df = {}; docs.forEach(d => Object.keys(d.tf).forEach(k => df[k] = (df[k] || 0) + 1));
    const avg = docs.reduce((a, d) => a + d.len, 0) / (docs.length || 1);
    return { chunks, docs, df, avg, N: docs.length };
  }
  function search(idx, query, opts) {
    opts = opts || {}; const base = tokens(query); if (!base.length) return [];
    const q = expand(base), k1 = 1.2, b = .75;
    const res = idx.chunks.map((c, i) => {
      const d = idx.docs[i]; let s = 0, hit = 0;
      q.forEach(t => { const f = d.tf[t]; if (!f) return; const idf = Math.log(1 + (idx.N - idx.df[t] + .5) / (idx.df[t] + .5)); s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / idx.avg)); if (base.includes(t)) hit++; });
      if (c.type === "qa") s *= .55;
      if (opts.ctx && c.id === opts.ctx) s *= 1.25;
      return { chunk: c, score: s, cover: hit / base.length };
    }).filter(r => r.score > 0).sort((a, b2) => b2.score - a.score);
    return res.slice(0, opts.k || 5);
  }
  /* Elige las líneas más relevantes dentro de un fragmento */
  function bestLines(text, query, n) {
    const q = expand(tokens(query)), lines = text.split("\n").filter(Boolean);
    const sc = lines.map(l => { const t = new Set(tokens(l)); return q.reduce((a, x) => a + (t.has(x) ? 1 : 0), 0); });
    let best = 0, bi = 0; n = n || 3;
    for (let i = 0; i < lines.length; i++) { let s = 0; for (let j = i; j < Math.min(lines.length, i + n); j++) s += sc[j]; if (s > best) { best = s; bi = i; } }
    return lines.slice(bi, bi + n);
  }
  return { htmlToText, buildChunks, toPrompt, makeIndex, search, bestLines, tokens };
});
