/* ============ CONFIGURACIÓN (editable sin tocar el resto del código) ============ */
window.CONFIG = {
  titulo: "Capacitación EPG",
  subtitulo: "Escuela de Postgrado · Ciclo 2026-2",
  // Porcentaje mínimo para aprobar la evaluación final
  notaMinima: 70,
  // (Opcional) Enlace de Microsoft Forms / Google Forms para el registro oficial de cierre.
  // Si lo dejas vacío, el botón no se muestra. Admite {nombre} y {codigo} como variables.
  formUrl: "",
  // Asistente de consultas (botón flotante).
  //  - Sin configuración: busca en el contenido del portal (costo cero).
  //  - Con ANTHROPIC_API_KEY en Vercel: responde con IA usando solo el contenido del portal (ver README).
  asistente: { activo: true, ia: true, endpoint: "/api/ask" },
  // Prefijo de almacenamiento local (cambia si publicas otra capacitación en el mismo dominio)
  storageKey: "epg-capacitacion-2026-2"
};
