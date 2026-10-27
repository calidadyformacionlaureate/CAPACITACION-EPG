/* ============ CONTENIDO DEL MÓDULO ============
   Para editar textos, preguntas o enlaces modifica este archivo.
   Tipos de bloque: html, img, imgs, video, check, reveal, programs, table, calc, steps, accordion, links
*/
const L = {
  explora: "https://explora.upc.edu.pe/emision-de-documentos-epg/emision-de-documentos-epg",
  exploraDocs: "https://explora.upc.edu.pe/emision-de-documentos-epg/emision-de-documentos-epg-copy-228",
  retAsig: "https://explora.upc.edu.pe/retiros-academicos-epg/%C2%BFcomo-solicito-un-retiro-de-asignatura?from_search=228720856",
  reprog: "https://explora.upc.edu.pe/retiros-academicos-epg/me-retire-de-una-asignatura-%C2%BFque-debo-hacer-para-llevar-el-curso-nuevamente?from_search=228720856",
  tramitator: "https://mistramites.upc.edu.pe/autenticar/LoginEPG",
  diplomas: "https://upc.plussigner.com/login",
  pagos: "https://cerbero.upc.edu.pe/apps/gmailingpregrado/Mailing.aspx?idMailing=56768&idTele=1"
};

const LESSONS = [
/* ---------------------------------------------------------------- 1 */
{
  id: "programas", icon: "🎓", min: 6,
  title: "Programas y emisión de documentos",
  summary: "Conoce los tipos de programa de la EPG y los plazos de emisión masiva.",
  blocks: [
    { t: "html", h: `<p class="lead">La EPG ofrece diversos tipos de programas. Cada uno tiene una duración distinta y un <strong>plazo de emisión masiva</strong> de documentos. Conocerlos te permitirá orientar al alumno sin tener que escalar.</p>` },
    { t: "programs", items: [
      { c: "red",    tag: "CE · EEG", name: "Cursos Especializados", dur: "Cursos de 6 y 8 semanas", hrs: "24 horas lectivas", plazo: "20 días hábiles" },
      { c: "orange", tag: "EX",       name: "Programas Especializados / Certificaciones", dur: "Compuesto de una malla curricular · dura 2 meses", hrs: "48 horas lectivas", plazo: "45 días hábiles" },
      { c: "navy",   tag: "DG",       name: "Diplomados", dur: "Compuesto de una malla curricular", hrs: "—", plazo: "45 días hábiles" },
      { c: "purple", tag: "MA",       name: "Maestrías", dur: "Compuesto de una malla curricular", hrs: "—", plazo: "Todo documento es previa solicitud en Mi UPC EPG y tiene un costo" }
    ]},
    { t: "html", h: `<div class="callout info"><div class="ci">📄</div><div><strong>Documentos masivos (en caso corresponda)</strong>
      <ul><li>Certificado de Estudios</li><li>Certificado por haber aprobado</li><li>Constancia de los primeros 3 puestos</li></ul>
      <p class="muted">Los documentos masivos emitidos llevan <strong>firma simple</strong>.</p></div></div>` },
    { t: "check", kind: "mc", q: "¿Cuál es el plazo de emisión masiva de documentos de un Curso Especializado?",
      opts: ["10 días hábiles", "20 días hábiles", "45 días hábiles", "60 días calendario"], a: 1,
      fb: "Los cursos especializados (6 y 8 semanas) tienen emisión masiva en 20 días hábiles. Programas especializados y Diplomados: 45 días hábiles." },
    { t: "check", kind: "tf", q: "Los documentos masivos emitidos llevan firma digital.", a: false,
      fb: "Llevan firma simple." },
    { t: "check", kind: "mc", q: "Un alumno de Maestría necesita un documento. ¿Cómo lo obtiene?",
      opts: ["Se emite de forma masiva al terminar", "Previa solicitud en Mi UPC EPG, con un costo", "Lo recoge en oficina", "Lo pide al asesor de ventas"], a: 1,
      fb: "En Maestrías todo documento es previa solicitud en Mi UPC EPG y tiene un costo." }
  ]
},
/* ---------------------------------------------------------------- 2 */
{
  id: "accesos", icon: "🔑", min: 7,
  title: "Accesos y programa matriculado",
  summary: "Qué hacer cuando no llegan las credenciales y cómo identificar el programa de un alumno.",
  blocks: [
    { t: "html", h: `<h3>Sobre los accesos</h3>
      <div class="callout quote"><div class="ci">💬</div><div><em>“Me inscribí a un curso especializado y aún no recibo mis credenciales, ¿qué debo hacer?”</em></div></div>
      <div class="split"><div><p>Debe contactar a su <strong>asesor de ventas</strong>, es decir, a la persona que gestionó su matrícula.</p><p>Ese asesor podrá revisar el caso y brindar el soporte necesario para la entrega de las credenciales.</p></div></div>` },
    { t: "img", src: "assets/img/acceso.webp", cap: "", cls: "narrow" },
    { t: "html", h: `<h3>¿Cómo identificar a qué programa está matriculado?</h3>` },
    { t: "steps", items: [
      { h: "Ingresa a <strong>Historial de Notas</strong> en Intranet Sócrates EPG.", p: "Usa el menú Alumnos → Historial de Notas.", img: "assets/img/menu.webp" },
      { h: "Escribe el <strong>código del alumno sin la letra “E”</strong>.", p: "Por ejemplo, para E202310498 ingresas 202310498.", img: "assets/img/hist1.webp" },
      { h: "Revisa el programa y el periodo.", p: "Aquí vemos que el alumno Rolando estuvo matriculado en una maestría desde el 2023.", img: "assets/img/login.webp" }
    ]},
    { t: "reveal", title: "Practiquemos", q: "Ingresa a Historial de Notas de Intranet Sócrates EPG con el código <strong>E202525906</strong> (sin la letra ‘E’) y responde: ¿en qué programa está matriculada?",
      a: "La alumna Lesly está matriculada en un <strong>Curso Especializado</strong>.", img: "assets/img/hist2.webp" },
    { t: "check", kind: "tf", q: "Para buscar a un alumno en Historial de Notas se ingresa el código completo, incluida la letra “E”.", a: false,
      fb: "Se ingresa el código sin la letra “E”." },
    { t: "check", kind: "mc", q: "Un alumno no recibe sus credenciales de un curso especializado. ¿A quién debe contactar?",
      opts: ["Al área de Finanzas", "A su asesor de ventas (quien gestionó su matrícula)", "A Soporte TI", "Debe volver a matricularse"], a: 1,
      fb: "El asesor de ventas puede revisar su caso y apoyar con la entrega de credenciales." }
  ]
},
/* ---------------------------------------------------------------- 3 */
{
  id: "horario", icon: "🗓️", min: 8,
  title: "Horario, asistencia y notas",
  summary: "Tres videos cortos para validar horario, asistencia y notas de un alumno EPG.",
  blocks: [
    { t: "html", h: `<p class="lead">Mira los tres videos. Cada uno muestra paso a paso cómo consultar la información en los sistemas. El avance de cada video queda registrado.</p>` },
    { t: "video", id: "v1", src: "assets/video/v1.mp4", poster: "assets/img/p1.webp", title: "¿Cómo podemos validar el horario de un alumno EPG?", sumario: true },
    { t: "accordion", items: [{ q: "📝 Resumen paso a paso en texto", a: `<ol class="plain"><li>Obtén el <strong>ID Banner</strong> del alumno: ingresa a <strong>SHACRSE</strong>, en el campo ID selecciona los tres puntos (…) y busca al estudiante por nombres y apellidos. Haz clic en <strong>IR</strong>.</li><li>Ingresa a <strong>SFAREGS</strong>. Coloca el <strong>periodo</strong>: para posgrado es el año 2026 más <strong>90</strong> como últimos dígitos (<strong>2026-90</strong>) y luego el ID Banner del alumno. Verás los cursos matriculados y sus <strong>NRC</strong>.</li><li>Identifica el <strong>NRC</strong> del curso cuyo horario quieres consultar.</li><li>Ingresa a <strong>SSASECT</strong> y coloca nuevamente el periodo y el NRC.</li><li>Abre la opción <strong>INSTRUCTOR Y HORAS DE REUNIÓN</strong>: verás la fecha de inicio y fin del curso, los días y horas de clase y los datos del instructor.</li></ol>` }] },
    { t: "video", id: "v2", src: "assets/video/v2.mp4", poster: "assets/img/p2.webp", title: "¿Cómo podemos validar la asistencia de un alumno EPG?", sumario: true },
    { t: "accordion", items: [{ q: "📝 Resumen paso a paso en texto", a: `<ol class="plain"><li>En <strong>SHACRSE</strong> obtén el <strong>ID Banner</strong> del alumno con sus apellidos y nombres.</li><li>Con el ID Banner, ingresa a <strong>SFAREGS</strong> para ver los cursos en los que está matriculado e identifica el <strong>NRC</strong> del curso a consultar.</li><li>Con el NRC, ingresa a <strong>SSASECT</strong> para consultar los datos del curso. Necesitarás el <strong>campus</strong>.</li><li>Ingresa al <strong>portal Dirección UPC</strong> → <strong>REPORTES</strong> → <strong>REPORTE DE ASISTENCIA DE ALUMNO POR CLASE</strong>.</li><li>Completa <strong>campus, nivel, periodo y NRC</strong> y selecciona <strong>Visualizar</strong>. El reporte muestra a todos los alumnos registrados en el NRC.</li><li>Para encontrar al estudiante más rápido, <strong>exporta a Excel</strong> y filtra por ID Banner o apellidos.</li><li>Revisa su registro de asistencias por clase e identifica alguna inasistencia.</li></ol>` }] },
    { t: "video", id: "v3", src: "assets/video/v3.mp4", poster: "assets/img/p3.webp", title: "¿Cómo validar notas individuales de un alumno EPG?", sumario: true },
    { t: "accordion", items: [{ q: "📝 Resumen paso a paso en texto", a: `<ol class="plain"><li>En <strong>SHACRSE</strong> obtén el <strong>ID Banner</strong> del alumno con sus apellidos y nombres.</li><li>Con el ID Banner, ingresa a <strong>SFAREGS</strong>, revisa los cursos matriculados e identifica el <strong>NRC</strong> del curso.</li><li>Con el NRC, ingresa a <strong>SSASECT</strong> para consultar los datos del curso. Presta atención al <strong>campus</strong> y al <strong>apellido del docente</strong>.</li><li>Ingresa al <strong>portal Dirección UPC</strong> → <strong>REPORTES</strong> → <strong>REPORTES DE NOTAS POR CLASE</strong>. Completa <strong>campus, nivel y periodo</strong>, selecciona el <strong>apellido del docente</strong> y en <strong>Clase</strong> coloca el NRC (en el ejemplo: 0890).</li><li>Selecciona <strong>Visualizar</strong>: verás las notas individuales y los promedios finales de cada alumno. Si hay mucha información, expórtala a Excel.</li></ol><p class="muted">Si el docente aún no ha ingresado notas, no aparecerá información en el portal Dirección.</p>` }] },
    { t: "html", h: `<div class="callout tip"><div class="ci">💡</div><div>Tip: antes de revisar horario, asistencia o notas, confirma el <strong>programa</strong> del alumno en Historial de Notas (tema anterior).</div></div>` },
    { t: "check", kind: "mc", q: "Para buscar a un alumno EPG en banner en este 2026, ¿qué terminología se utiliza en el periodo?", opts: ["2026-25", "2026-20", "2026-30", "2026-90"], a: 3, fb: "Para posgrado se usa el año 2026 y se agregan 90 como últimos dígitos: 2026-90." },
    { t: "check", kind: "mc", q: "Para visualizar el reporte de asistencia en el portal Dirección UPC, además de campus, nivel y periodo, necesitas…", opts: ["El DNI del alumno", "El NRC del curso", "El correo UPC", "El código de lote"], a: 1, fb: "Se completan campus, nivel, periodo y NRC del curso, y luego Visualizar." },
    { t: "check", kind: "tf", q: "Si el docente aún no ha ingresado notas, el portal Dirección no mostrará información de notas.", a: true, fb: "Correcto: sin notas registradas por el docente no aparece información." }
  ]
},
/* ---------------------------------------------------------------- 4 */
{
  id: "masivos", icon: "✉️", min: 12,
  title: "Documentos masivos: validar si ya se enviaron",
  summary: "Cursos, programas y diplomados: cómo revisar el envío en la Plataforma de Diplomas.",
  blocks: [
    { t: "html", h: `<p class="lead">Los documentos de <strong>Cursos Especializados, Programas Especializados / Certificaciones y Diplomados</strong> se generan y envían en un proceso de <strong>emisión masiva</strong>, una vez finalizado el programa o curso.</p>
      <div class="callout tip"><div class="ci">💡</div><div>Antes de orientar al alumno sobre su documento, validemos si ya fue enviado.</div></div>` },
    { t: "html", h: `<div class="flow"><div class="flow-i"><span class="n">1</span><strong>Identifica el curso o programa</strong><br>Confirma qué tipo de programa finalizó el alumno.</div><div class="flow-a">➜</div><div class="flow-i"><span class="n">2</span><strong>Revisa el registro de emisión / envío</strong><br>Valida en la Plataforma de Diplomas.</div></div>` },
    { t: "html", h: `<h3>Caso práctico 1</h3>
      <div class="callout quote"><div class="ci">💬</div><div><em>“E202525906 terminé mi curso, pero aún no me remiten el certificado.”</em></div></div>
      <ol class="plain"><li>Verifica el curso/programa en <strong>Historial de Notas</strong> de Intranet Sócrates EPG.</li>
      <li>Para cursos especializados el plazo de envío masivo es de <strong>20 días hábiles</strong>. Se cuentan desde la fecha de su <strong>última evaluación</strong>, siempre que tenga <strong>nota mínima aprobatoria</strong> y <strong>no tenga deuda</strong>.</li>
      <li>En primera línea, lo ideal es explicarle que le llegará a su <strong>correo UPC EPG</strong> desde el remitente <code>postmaster@plussigner.com</code> en el plazo señalado.</li></ol>
      <p><a class="btn ghost sm" target="_blank" rel="noopener" href="${L.explora}">Ver en Explora ↗</a></p>` },
    { t: "html", h: `<h3>Plataforma de Diplomas UPC</h3>
      <p>Para los <strong>Cursos Especializados de la campaña 202601 en adelante</strong>, y los <strong>Programas y Diplomados que hayan finalizado a partir de abril 2026</strong>, se valida en la Plataforma de Diplomas UPC.</p>
      <div class="callout warn"><div class="ci">🔐</div><div>Las credenciales de la plataforma <strong>no se publican aquí</strong>. Solicítalas a tu líder o al equipo de Capacitación.</div></div>
      <p><a class="btn ghost sm" target="_blank" rel="noopener" href="${L.diplomas}">Abrir Plataforma de Diplomas ↗</a></p>` },
    { t: "imgs", items: [
      { src: "assets/img/dash.webp", cap: "1 · Dashboard del operador: entra a Trazabilidad → Seguimiento" },
      { src: "assets/img/seg.webp", cap: "2 · Seguimiento documental: busca por código de alumno" } ] },
    { t: "html", h: `<h3>Estados que verás en la plataforma</h3>
      <div class="states"><div class="state"><span>✉️</span><strong>Envío</strong>El correo fue enviado a la bandeja del estudiante.</div>
      <div class="state"><span>👁️</span><strong>Clic</strong>El estudiante abrió el correo, pero aún no ha descargado los documentos.</div>
      <div class="state"><span>📥</span><strong>PDF</strong>El estudiante descargó los documentos enviados.</div></div>
      <p class="muted">En el caso práctico, la plataforma muestra que los documentos ya fueron enviados a la bandeja UPC de la estudiante y que ya los descargó.</p>` },
    { t: "reveal", title: "Practiquemos", q: "Ingresa a la Plataforma de Diplomas con el código <strong>E202521574</strong> (sin la ‘E’) y responde: ¿ya le entregaron los documentos masivos?, ¿a qué programa pertenece? y ¿en qué estado se encuentran?",
      a: "El alumno Pabel llevó un <strong>Programa Especializado en Gestión BIM para el Sector Público</strong>. Ya recibió sus documentos en su correo UPC EPG, sin embargo <strong>aún no ha abierto el correo ni los ha descargado</strong>.", img: "assets/img/pabel.webp" },
    { t: "check", kind: "mc", q: "En la Plataforma de Diplomas el estado indica “Clic”. ¿Qué significa?", opts: ["El correo no fue enviado", "El alumno abrió el correo pero aún no descargó los documentos", "El alumno ya descargó los documentos", "El documento fue rechazado"], a: 1,
      fb: "Envío = enviado a la bandeja. Clic = abrió el correo. PDF = descargó los documentos." },
    { t: "check", kind: "mc", q: "¿Desde qué remitente le llegan al alumno los documentos masivos?", opts: ["postmaster@plussigner.com", "notas@upc.edu.pe", "asesor@epg.pe", "No se envían por correo"], a: 0,
      fb: "Le llegan a su correo UPC EPG desde postmaster@plussigner.com." },
    { t: "check", kind: "tf", q: "El plazo de 20 días hábiles para cursos especializados se cuenta desde la fecha de matrícula.", a: false,
      fb: "Se cuenta desde la fecha de su última evaluación, siempre que tenga nota aprobatoria y no tenga deuda." }
  ]
},
/* ---------------------------------------------------------------- 4b (slide 14) */
{
  id: "deuda", icon: "⏳", min: 4,
  title: "Documentos no recibidos por deuda",
  summary: "Qué responder cuando el alumno no recibió su documento porque tenía una deuda.",
  blocks: [
    { t: "html", h: `<p class="lead">En el Módulo 1 aprendiste a validar si un documento masivo ya fue enviado. Ahora veamos qué hacer cuando <strong>no se envió</strong>.</p>` },
    { t: "html", h: `<h3>¿Qué hacer si no recibió sus documentos?</h3>
      <div class="callout quote"><div class="ci">💬</div><div><em>“No recibí mi documento porque tenía una deuda. Si ya regularicé el pago, ¿cuándo lo recibiré?”</em></div></div>
      <p>Uno de los requisitos para la emisión es <strong>no mantener deudas pendientes</strong>. Esta información está publicada en <a target="_blank" rel="noopener" href="${L.explora}">Explora UPC</a>.</p>
      <p>Si regularizó recientemente su pago, será considerado en el <strong>siguiente corte de validación de deuda</strong>, que toma aproximadamente <strong>2 semanas</strong>.</p>
      <div class="callout warn"><div class="ci">📌</div><div><strong>Importante:</strong> este plazo es referencial. Como asesores, debemos reforzar la importancia de mantener los pagos al día para evitar retrasos en la emisión de sus documentos.</div></div>` },
    { t: "check", kind: "mc", q: "¿Cuál es uno de los requisitos para la emisión masiva de documentos por haber finalizado el programa?", opts: ["Haber asistido al 100 % de las clases", "No mantener deudas pendientes", "Haber solicitado el documento en Trámites EPG", "Tener correo personal registrado"], a: 1,
      fb: "Uno de los requisitos es no mantener deudas pendientes. Está publicado en Explora UPC." },
    { t: "check", kind: "tf", q: "Si el alumno regularizó su deuda hace poco, entra al siguiente corte de validación de deuda (aprox. 2 semanas).", a: true,
      fb: "Correcto. El plazo es referencial." }
  ]
},
/* ---------------------------------------------------------------- 5 */
{
  id: "otros", icon: "📑", min: 6,
  title: "Otros documentos que pueden solicitar",
  summary: "Catálogo de trámites en Trámites EPG y qué hacer ante una incidencia.",
  blocks: [
    { t: "html", h: `<p class="lead">El alumno EPG solicita documentos mediante la plataforma <strong>Trámites EPG</strong>. Todos se emiten en <strong>formato digital</strong> (ya no se entregan físicos) y llevan <strong>firma electrónica</strong>.</p>
      <p><a class="btn ghost sm" target="_blank" rel="noopener" href="${L.exploraDocs}">Ver formatos en Explora ↗</a></p>` },
    { t: "table", search: true, head: ["Documento – Trámite", "Programa", "Descripción"], rows: [
      ["Constancia de Matrícula", "Todos los programas", "Indica que el alumno está o estuvo matriculado en un determinado programa."],
      ["Constancia de Orden de mérito (Tercio / Quinto / Décimo Superior)", "Programa Especializado – Diplomado – Maestría", "Indica que el alumno está ubicado en alguna pertenencia o tiene primer puesto de su promoción (excepto EEG)."],
      ["Constancia de Participación", "Todos los programas", "Documento que constata la participación del alumno en un determinado programa."],
      ["Certificación de documentos", "Todos los programas", "Permite certificar algún documento emitido por UPC con anterioridad."],
      ["Diploma o Certificado de 1°, 2° y 3° puesto", "EEG – Programas Especializados – Diplomado", "Acredita la obtención del 1°, 2° y 3° puesto. Aplica para programas que culminaron desde noviembre de 2021 en adelante."],
      ["Certificado de Especialización", "Cursos Especializados", "Acredita la especialización alcanzada tras aprobar 5 cursos especializados de una rama específica y 1 curso de liderazgo."],
      ["Constancia de Diploma de Grado Académico en Trámite", "Maestría", "Acredita que el alumno sustentó y aprobó su tesis para obtener el grado de maestro, pero está en proceso de emisión."],
      ["Certificado de Estudio (notas)", "Maestría – Diplomados", "Indica las asignaturas cursadas por ciclo, el promedio final y el número de créditos de cada una."],
      ["Certificado de Estudios y Diploma o Certificado", "EEG – Programas Especializados – Diplomados", "Tras haber aprobado el programa del que participó: EEG – EX – DG."],
      ["Constancia de Cumplimiento de Inglés", "Maestría", "Acredita el cumplimiento del requisito de inglés solicitado por la universidad únicamente por la modalidad WeTALK."],
      ["Constancia de Suficiencia de Segundo Idioma", "Maestría", "Indica que el alumno ha cumplido con el requisito de inglés."],
      ["Constancia de Egresado", "Maestría – Diplomado", "Indica que el alumno ha cumplido con la totalidad de requisitos exigidos por la EPG para obtener la condición de egresado."]
    ]},
    { t: "html", h: `<div class="callout info"><div class="ci">🛠️</div><div><strong>Ante una incidencia</strong>, podemos ayudar al alumno con el ingreso de solicitudes a través de <a target="_blank" rel="noopener" href="${L.tramitator}">Tramitator EPG</a>. De persistir el error, generamos un <strong>ticket</strong> detallando el documento que solicita y el programa.</div></div>` },
    { t: "check", kind: "tf", q: "Los documentos solicitados en Trámites EPG se entregan en formato físico.", a: false, fb: "Todos se emiten en formato digital y llevan firma electrónica." },
    { t: "check", kind: "mc", q: "¿Qué documento acredita que el alumno cumplió con todos los requisitos para obtener la condición de egresado?", opts: ["Constancia de Matrícula", "Constancia de Egresado", "Constancia de Participación", "Certificación de documentos"], a: 1,
      fb: "La Constancia de Egresado aplica para Maestría y Diplomado." },
    { t: "check", kind: "mc", q: "Un alumno intenta ingresar una solicitud y la plataforma muestra un error. ¿Qué hacemos?", opts: ["Le pedimos que espere un mes", "Ingresamos la solicitud en Tramitator EPG y, si persiste, generamos un ticket", "Emitimos el documento manualmente", "Le indicamos que vaya presencialmente"], a: 1,
      fb: "Se apoya con Tramitator EPG; si persiste, ticket con documento y programa." }
  ]
},
/* ---------------------------------------------------------------- 6 */
{
  id: "datos", icon: "🧾", min: 5,
  title: "Actualización de datos",
  summary: "La ruta que sigue el alumno y cómo verificar que sus datos se actualizaron.",
  blocks: [
    { t: "video", id: "v4", src: "assets/video/v4.mp4", poster: "assets/img/p4.webp", title: "¿Cómo realizan los alumnos EPG un trámite de actualización de datos?", sumario: true },
    { t: "accordion", items: [{ q: "📝 Resumen paso a paso en texto", a: `<ol class="plain"><li>Ingresa a <strong>Mi UPC EPG</strong> → <strong>Trámites</strong> → <strong>Mis Trámites</strong> e inicia sesión con usuario y contraseña.</li><li>Selecciona el <strong>tipo de programa</strong> que está cursando (en el ejemplo, Maestría).</li><li>En <strong>Programa</strong>, elige el nombre de su programa.</li><li>En <strong>Elegir Trámite</strong>, selecciona <strong>Actualización de datos</strong>.</li></ol><div class="callout warn"><div class="ci">⚠️</div><div>Si el alumno desea modificar datos personales, la información debe <strong>coincidir exactamente con su DNI o carné de extranjería</strong> y debe <strong>adjuntar este documento como sustento</strong>.</div></div>` }] },
    { t: "html", h: `<h3>¿Cómo puedo verificar que se actualizaron los datos?</h3>
      <p>Como administrativos podemos validar si los datos de un alumno EPG se actualizaron correctamente en el sistema de <strong>dos maneras</strong>:</p>` },
    { t: "imgs", items: [
      { src: "assets/img/crm.webp", cap: "✅ Opción 1 · CRM 365 (datos de identificación)" },
      { src: "assets/img/resumen.webp", cap: "✅ Opción 2 · Intranet Sócrates → Resumen Historial Académico" } ] },
    { t: "html", h: `<p class="muted">Los datos personales de las capturas están difuminados por privacidad.</p>` },
    { t: "check", kind: "tf", q: "Si el alumno quiere modificar datos personales, la información debe coincidir exactamente con su DNI o carné de extranjería y debe adjuntar el documento como sustento.", a: true, fb: "Correcto: debe coincidir exactamente y adjuntar el DNI o carné de extranjería." },
    { t: "check", kind: "mc", q: "¿Cuáles son las dos formas de verificar que los datos de un alumno se actualizaron?", opts: ["Correo y teléfono", "CRM 365 e Intranet Sócrates", "Mi UPC EPG y Explora", "Plataforma de Diplomas y Tramitator"], a: 1, fb: "CRM 365 (Opción 1) e Intranet Sócrates, en Resumen Historial Académico (Opción 2)." }
  ]
},
/* ---------------------------------------------------------------- 7 */
{
  id: "retiros", icon: "↩️", min: 15,
  title: "Retiros académicos",
  summary: "Retiro de asignatura vs. retiro temporal de programa, liquidación y reembolsos.",
  blocks: [
    { t: "html", h: `<p class="lead">Hay dos tipos de retiro y tienen efectos muy distintos. Aprende a diferenciarlos antes de orientar al alumno.</p>` },
    { t: "table", head: ["", "Retiro de Asignatura", "Retiro Temporal de Programa"], rows: [
      ["¿Qué implica?", "Sirve para retirarse de una asignatura específica.", "Sirve para retirarse del programa completo. Solo para Maestría, Diplomados, Programas Especializados y Certificaciones."],
      ["Impacto académico", "✅ Deja de llevar solo el curso retirado. Continúa con el resto de sus asignaturas.", "⏸️ Interrumpe temporalmente sus estudios en el programa."],
      ["Continuidad de estudios", "Puede seguir avanzando en las demás asignaturas matriculadas.", "Suspende temporalmente su avance académico."],
      ["Reincorporación", "🔄 Debe reprogramar el curso para llevarlo nuevamente asumiendo el costo por el trámite de reprogramación.", "🔄 Requiere reanudación de estudios para regresar."],
      ["¿Impacto en los pagos?", "💰 No modifica el cronograma de pagos actuales, sin embargo, el trámite de reprogramación sí tiene costo según el tarifario vigente.", "💰 Puede generar cobros según las condiciones y el momento del retiro."]
    ]},
    { t: "html", h: `<h3>Caso · Retiro de asignatura</h3>
      <div class="callout quote"><div class="ci">💬</div><div><em>“E202211004 me quiero retirar de un curso, ¿qué debo hacer?”</em></div></div>
      <ol class="plain"><li>La información está publicada en <a target="_blank" rel="noopener" href="${L.retAsig}">Explora</a>. Recuérdale que debe <strong>especificar el nombre de la asignatura</strong> que desea retirar.</li>
      <li>Informa que el retiro <strong>no modifica el cronograma de pagos</strong>. Luego deberá hacer su <a target="_blank" rel="noopener" href="${L.reprog}">Reprogramación de Curso</a> y en <strong>15 días hábiles</strong> recibirá los horarios disponibles en su correo UPC.</li></ol>` },
    { t: "imgs", items: [
      { src: "assets/img/ret_a1.webp", cap: "Verifica el programa y las asignaturas en Intranet Sócrates" },
      { src: "assets/img/ret_a2.webp", cap: "Estado de la solicitud en Tramitator" },
      { src: "assets/img/ret_a3.webp", cap: "Observación del evaluador: falta el nombre exacto del curso" } ] },
    { t: "html", h: `<h3>Caso · Retiro temporal de programa</h3>
      <div class="callout quote"><div class="ci">💬</div><div><em>“E201710139 quiero consultar el estado de trámite de retiro.”</em></div></div>
      <ol class="plain"><li>Verifica el curso/programa en el que está inscrito en <strong>Intranet Sócrates EPG</strong>.</li>
      <li>Verifica en <a target="_blank" rel="noopener" href="${L.tramitator}">Tramitator EPG</a> el estado de su solicitud de retiro.</li></ol>
      <div class="callout info"><div class="ci">ℹ️</div><div><strong>Retiro temporal de programa:</strong> solo aplica para Maestría, Diplomados, Programas Especializados y Certificaciones. En la misma solicitud, el alumno accede a su <strong>evaluación financiera</strong>, que indica si tiene saldo a favor o un importe pendiente de pago.</div></div>` },
    { t: "imgs", items: [
      { src: "assets/img/ret_t1.webp", cap: "1 · Intranet Sócrates: programa del alumno" },
      { src: "assets/img/ret_t2.webp", cap: "2 · Tramitator EPG: bandeja de consulta" },
      { src: "assets/img/ret_t3.webp", cap: "3 · Detalle de la evaluación: archivo adjunto con la evaluación financiera" } ] },
    { t: "html", h: `<h3>Liquidación de cuenta</h3>
      <ul><li>Se considera el <strong>avance o el costo total de la asignatura(s) tomada(s)</strong>, sea total o parcial, <strong>más el 2,5 % del total de la inversión</strong> por costos de retiro (penalidad).</li>
      <li><strong>Reembolsos:</strong> el estudiante solicita la devolución de pago en <strong>Trámites EPG</strong>. Se efectúa en un plazo máximo de <strong>30 días hábiles</strong> contados desde la emisión de la nota de crédito.</li>
      <li>Si el alumno no está de acuerdo con los montos (dice que las horas son diferentes a las tomadas o que no asistió), se <strong>escala al owner del proceso (Rebeca Godoy)</strong> para su revisión.</li></ul>` },
    { t: "imgs", items: [
      { src: "assets/img/liq2.webp", cap: "Resumen de horas y montos" },
      { src: "assets/img/liq3.webp", cap: "Ejemplo de liquidación de cuenta" } ] },
    { t: "html", h: `<h3>Consideraciones importantes · Retiro temporal</h3>
      <div class="considera"><div class="co"><span>📅</span><div>Para retomar estudios, debe hacer el trámite de <strong>reanudación antes del inicio de clases</strong>.</div></div>
      <div class="co"><span>📚</span><div>La reincorporación se realiza con el <strong>plan de estudios vigente</strong> y el <strong>costo actual</strong> del programa.</div></div>
      <div class="co"><span>🏷️</span><div>Los beneficios iniciales (fraccionamiento u otros) <strong>no se mantienen</strong>.</div></div>
      <div class="co"><span>⏭️</span><div>No se puede volver a la misma edición; deberá esperar la <strong>siguiente versión</strong>.</div></div>
      <div class="co"><span>⚠️</span><div>Es importante <strong>explicar las implicancias</strong> del retiro temporal antes de confirmarlo.</div></div>
      <div class="co"><span>🤔</span><div>Si aún tiene dudas, puede evaluar un <strong>retiro de asignatura</strong> antes de solicitar el retiro temporal.</div></div></div>` },
    { t: "check", kind: "mc", q: "¿Qué porcentaje de la inversión total se cobra como costo de retiro (penalidad)?", opts: ["1 %", "2,5 %", "5 %", "10 %"], a: 1, fb: "Se suma el 2,5 % del total de la inversión." },
    { t: "check", kind: "tf", q: "El retiro de asignatura modifica el cronograma de pagos del alumno.", a: false, fb: "No lo modifica. Luego debe hacer su Reprogramación de Curso." },
    { t: "check", kind: "mc", q: "El reembolso se efectúa en un máximo de…", opts: ["10 días hábiles", "15 días hábiles", "30 días hábiles desde la emisión de la nota de crédito", "60 días calendario"], a: 2, fb: "Máximo 30 días hábiles contados desde la emisión de la nota de crédito." },
    { t: "check", kind: "tf", q: "Tras un retiro temporal, el alumno puede volver a la misma edición del programa con sus beneficios iniciales.", a: false, fb: "Debe esperar la siguiente versión y los beneficios iniciales no se mantienen." }
  ]
},
/* ---------------------------------------------------------------- 8 */
{
  id: "ingles", icon: "🌐", min: 4,
  title: "Nivel de inglés requerido",
  summary: "Cómo puede revisar el alumno EPG cuál es su nivel de inglés.",
  blocks: [
    { t: "html", h: `<p class="lead">¿Cómo puede revisar el alumno EPG cuál es su nivel de inglés? Mira el video con la <strong>vista del alumno</strong> (situación académica).</p>` },
    { t: "video", id: "v5", src: "assets/video/v5.mp4", poster: "assets/img/p5.webp", title: "Vista del alumno · nivel de inglés en situación académica", sumario: true },
    { t: "accordion", items: [{ q: "📝 Resumen paso a paso en texto", a: `<ol class="plain"><li>El alumno ingresa al portal <strong>Mi UPC EPG</strong>.</li><li>Selecciona <strong>INFORMACIÓN ACADÉMICA</strong> y luego <strong>Ir a INFORMACIÓN ACADÉMICA</strong>.</li><li>Selecciona <strong>SITUACIÓN ACADÉMICA</strong>.</li><li>Elige el <strong>nivel académico</strong> y el <strong>programa actual</strong> de consulta.</li><li>En la parte inferior verá el <strong>requisito de idioma</strong> exigido por el programa y el <strong>nivel de inglés</strong> que ha cumplido hasta el momento.</li></ol>` }] },
    { t: "check", kind: "mc", q: "¿Dónde puede ver el alumno su nivel de inglés cumplido y el requisito de idioma de su programa?", opts: ["En Información académica → Situación académica", "En Trámites → Mis Trámites", "En la Plataforma de Diplomas", "En Finanzas UPC"], a: 0, fb: "Mi UPC → Información académica → Ir a información académica → Situación académica; abajo aparece el requisito de idioma y el nivel cumplido." }
  ]
},
/* ---------------------------------------------------------------- 9 */
{
  id: "pagos", icon: "💳", min: 4,
  title: "Medios de pago",
  summary: "Bancos habilitados y cómo pagar desde Finanzas UPC.",
  blocks: [
    { t: "html", h: `<p class="lead">¿A través de qué medio realizan los pagos los alumnos EPG?</p>
      <div class="banks">
        <div class="bank"><img src="assets/img/bank_ib.webp" alt="Interbank"><p>Solo banca por internet y banca móvil</p></div>
        <div class="bank"><img src="assets/img/bank_sc.webp" alt="Scotiabank"><p>Banca por internet y banca móvil, <strong>y pagos presenciales en agencia (con comisión)</strong></p></div>
        <div class="bank"><img src="assets/img/bank_bcp.webp" alt="BCP"><p>Solo banca por internet y banca móvil</p></div>
      </div>
      <div class="callout info"><div class="ci">🏛️</div><div>También pueden efectuar sus pagos en <strong>Finanzas UPC</strong> ingresando a <strong>Mi UPC EPG</strong>.</div></div>` },
    { t: "img", src: "assets/img/fin.webp", cap: "Pagos pendientes en Finanzas UPC" },
    { t: "html", h: `<p><a class="btn ghost sm" target="_blank" rel="noopener" href="${L.pagos}">Ver comunicado de pagos ↗</a></p>` },
    { t: "check", kind: "mc", q: "¿Qué banco permite además pagos presenciales en agencia (con comisión)?", opts: ["Interbank", "Scotiabank", "BCP", "Ninguno"], a: 1, fb: "Scotiabank: banca por internet, banca móvil y agencia (con comisión)." },
    { t: "check", kind: "tf", q: "Los alumnos también pueden pagar desde Finanzas UPC ingresando a Mi UPC EPG.", a: true, fb: "Correcto." }
  ]
}
];

/* ============ EVALUACIÓN FINAL (Microsoft Forms) ============ */
const EVAL_FORMS_URL = "https://forms.cloud.microsoft/r/yAWAAjShGQ";

/* ============ MÓDULOS ============ */
const pick = ids => ids.map(id => LESSONS.find(l => l.id === id));
const MODULES = [
  { id: "m1", n: 1, short: "Módulo 1", icon: "📘", title: "Programas, accesos y documentos masivos",
    summary: "Conoce los programas de la EPG, cómo identificar al alumno y validar horario, asistencia, notas, documentos masivos y medios de pago.",
    lessons: pick(["programas", "accesos", "horario", "masivos", "pagos"]) },
  { id: "m2", n: 2, short: "Módulo 2", icon: "📗", title: "Trámites, datos y retiros académicos",
    summary: "Qué hacer cuando hay deuda, qué otros documentos se solicitan, cómo validar la actualización de datos y cómo orientar retiros y nivel de inglés.",
    lessons: pick(["deuda", "otros", "datos", "retiros", "ingles"]) }
];
