/**
 * Genera los archivos que leen los asistentes y los buscadores.
 *
 * Se ejecuta después de `next build`, cuando `out/` ya tiene el HTML real. De
 * ahí salen las versiones `.md` de cada página, `llms.txt`, `llms-full.txt`,
 * `robots.txt`, `sitemap.xml` y las cabeceras de los previews.
 *
 * La fuente de datos es la misma que usa la web: `content/site.ts`,
 * `content/horario.ts`, `content/precios.ts`, `content/clases.ts` y
 * `content/rutas.ts`. No hay una segunda lista de precios ni de horarios.
 *
 * Node 24 puede importar los `.ts` directamente; por eso las importaciones
 * llevan la extensión explícita.
 */
import { execFileSync } from "node:child_process"
import { readFile, stat, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { practicas } from "../content/clases.ts"
import { horario } from "../content/horario.ts"
import { bonos, formasDePago, planes } from "../content/precios.ts"
import { RUTAS_PUBLICAS } from "../content/rutas.ts"
import { SITE_URL, site } from "../content/site.ts"

const RAIZ = join(process.cwd(), "out")
const PROYECTO = process.cwd()

/** Fecha de revisión de la política de rastreo. Se cambia a mano. */
const REVISION_ROBOTS = "2026-11-13"
const PROXIMA_REVISION_ROBOTS = "2027-05-13"

/* ──────────────────────────────────────────────────────────────────────────
 * Utilidades de HTML → Markdown
 * ────────────────────────────────────────────────────────────────────────── */

const ENTIDADES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  copy: "©",
  reg: "®",
  trade: "™",
  euro: "€",
  pound: "£",
  middot: "·",
  bull: "•",
  deg: "°",
  iquest: "¿",
  iexcl: "¡",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  uuml: "ü",
  Aacute: "Á",
  Eacute: "É",
  Iacute: "Í",
  Oacute: "Ó",
  Uacute: "Ú",
  Ntilde: "Ñ",
  Uuml: "Ü",
}

function decodificar(texto) {
  return texto
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, numero) =>
      String.fromCodePoint(Number.parseInt(numero, 10)),
    )
    .replace(/&([a-zA-Z]+);/g, (original, nombre) => {
      const valor = ENTIDADES[nombre] ?? ENTIDADES[nombre.toLowerCase()]
      return valor ?? original
    })
}

function textoPlano(html) {
  return decodificar(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Deshace el texto troceado para la animación de escritura.
 *
 * `Parrafo` y el titular envuelven cada letra en un `<span class="letra">` para
 * poder retrasarla. Al pasar el HTML a texto, cada etiqueta se convierte en un
 * espacio y la respuesta queda como «¡ P o r  s u p u e s t o !». Aquí se quitan
 * esos envoltorios antes de extraer el texto, para que el Markdown se lea igual
 * que la página.
 */
function sinAnimacion(html) {
  return html
    .replace(
      /<span\b[^>]*class=["'][^"']*\bletra\b[^"']*["'][^>]*>([^<]*)<\/span>/gi,
      "$1",
    )
    .replace(
      /<span\b[^>]*class=["'][^"']*\bpalabra\b[^"']*["'][^>]*>/gi,
      "",
    )
}

/**
 * Separa los datos que la página apila con `span.block`.
 *
 * En una ficha de precio, «Bono de 6 clases» y «Válido 3 meses» van uno encima
 * del otro. Sin separación, el Markdown los lee como una sola frase. Se busca
 * la clase exacta `block`: `inline-block` no apila nada y no debe separarse.
 */
function separarBloques(html) {
  return html.replace(
    /<span\b[^>]*class=["']([^"']*)["'][^>]*>((?:(?!<span\b)[\s\S])*?)<\/span>/gi,
    (original, clases, contenido) =>
      clases.split(/\s+/).includes("block")
        ? `${contenido} · `
        : original,
  )
}

/**
 * Texto de una celda de tabla.
 *
 * Los horarios con varias franjas usan una lista dentro de la celda. Sin
 * separador, las franjas se pegan y no se sabe dónde acaba una y empieza otra.
 */
function textoDeCelda(html) {
  return textoPlano(html.replace(/<\/li>\s*<li\b/gi, " · <li")).replace(
    /[ \t]*·[ \t]*$/,
    "",
  )
}

function normalizarMarkdown(texto) {
  return decodificar(texto)
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    /* Un separador al final de bloque o al principio de línea sobra. */
    .replace(/[ \t]*·[ \t]*(?=\n|$)/g, "")
    .replace(/(^|\n)[ \t]*·[ \t]*/g, "$1")
    /* El espacio que se añade tras un enlace o una etiqueta no debe separarse
       de la coma o el punto que venga detrás. */
    .replace(/\) (\s*)([.,;:!?])/g, ")$2")
    .replace(/ ([.,;:!?])/g, "$1")
    /* Un `-` suelto seguido de un bloque (las reseñas) deja el punto de lista
       huérfano. Se sube el primer párrafo al propio punto. */
    .replace(/(^|\n)-[ \t]*\n{2,}(?=\S)/g, "$1- ")
    /* Algunas tarjetas son un `<li>` con un `<h3>` dentro. El título manda: se
       queda como título, no como punto de lista. */
    .replace(/(^|\n)- (#{1,6} )/g, "$1$2")
    .trim()
}

/** Convierte una tabla HTML en una tabla Markdown. */
function convertirTablas(html) {
  return html.replace(
    /<table\b[^>]*>([\s\S]*?)<\/table>/gi,
    (_, tabla) => {
      const caption = tabla.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i)
      const filas = [...tabla.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
        .map((fila) =>
          [...fila[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(
            (celda) => textoDeCelda(celda[1]),
          ),
        )
        .filter((fila) => fila.length > 0)

      if (filas.length === 0) return ""

      const ancho = Math.max(...filas.map((fila) => fila.length))
      const completar = (fila) => [
        ...fila,
        ...Array(Math.max(0, ancho - fila.length)).fill(""),
      ]

      const lineas = []
      if (caption) {
        lineas.push(`_${textoPlano(caption[1])}_`, "")
      }
      lineas.push(`| ${completar(filas[0]).join(" | ")} |`)
      lineas.push(`| ${Array(ancho).fill("---").join(" | ")} |`)
      for (const fila of filas.slice(1)) {
        lineas.push(`| ${completar(fila).join(" | ")} |`)
      }

      return `\n\n${lineas.join("\n")}\n\n`
    },
  )
}

/** Convierte el cuerpo de una página a Markdown legible. */
function htmlAMarkdown(html) {
  let texto = html

  texto = texto.replace(/<!--[\s\S]*?-->/g, "")
  texto = texto.replace(/<script\b[\s\S]*?<\/script>/gi, "")
  texto = texto.replace(/<style\b[\s\S]*?<\/style>/gi, "")
  texto = texto.replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
  texto = texto.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
  texto = texto.replace(/<template\b[\s\S]*?<\/template>/gi, "")
  texto = texto.replace(/<picture\b[\s\S]*?<\/picture>/gi, "")
  texto = texto.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
  texto = texto.replace(/<video\b[\s\S]*?<\/video>/gi, "")
  texto = texto.replace(/<audio\b[\s\S]*?<\/audio>/gi, "")
  texto = texto.replace(/<form\b[\s\S]*?<\/form>/gi, "")
  texto = texto.replace(/<img\b[^>]*>/gi, "")
  texto = texto.replace(/<input\b[^>]*>/gi, "")
  texto = texto.replace(/<br\s*\/?>/gi, "\n")
  texto = texto.replace(/<hr\s*\/?>/gi, "\n\n---\n\n")

  /* Los datos apilados con `span.block` se separan antes de leer las tablas. */
  texto = separarBloques(texto)

  /* Las tablas se leen antes de tocar los `<span>`: sus celdas los usan para
     separar el dato principal del secundario. */
  texto = convertirTablas(texto)

  /* El texto animado se trocea letra a letra en el HTML; aquí se vuelve a unir. */
  texto = sinAnimacion(texto)

  /* La etiqueta pequeña que va justo encima del titular («Precios», «Horarios»)
     repite el título. En la página ayuda a orientarse; en Markdown solo es
     ruido. Solo se quita en ese caso: otras etiquetas («Clase de prueba»)
     aportan información. */
  texto = texto.replace(
    /<p\b[^>]*class=["'][^"']*\betiqueta\b[^"']*["'][^>]*>[\s\S]*?<\/p>\s*(?=<h1\b)/gi,
    "",
  )

  /* Enlaces: conserva el texto y resuelve las rutas internas. */
  texto = texto.replace(
    /<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, contenido) => {
      const visible = textoPlano(contenido).replace(/^\s*·\s*|\s*·\s*$/g, "")
      if (!visible) return ""
      if (href.startsWith("#")) return visible
      const absoluto = href.startsWith("/")
        ? `${SITE_URL}${href}`
        : href
      return `[${visible}](${absoluto}) `
    },
  )

  /* Títulos. */
  texto = texto.replace(
    /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, nivel, contenido) =>
      `\n\n${"#".repeat(Number(nivel))} ${textoPlano(contenido)}\n\n`,
  )

  /* Párrafos. */
  texto = texto.replace(
    /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    (_, contenido) => `\n\n${textoPlano(contenido)}\n\n`,
  )

  /* Listas de definición: término en negrita, definición debajo. */
  texto = texto.replace(/<dt\b[^>]*>([\s\S]*?)<\/dt>/gi, (_, contenido) => {
    return `\n\n**${textoPlano(contenido)}**\n`
  })
  texto = texto.replace(/<dd\b[^>]*>([\s\S]*?)<\/dd>/gi, (_, contenido) => {
    return `${textoPlano(contenido)}\n`
  })

  /* Listas normales. */
  texto = texto.replace(/<li\b[^>]*>/gi, "\n- ")
  texto = texto.replace(/<\/li>/gi, "\n")

  /* Citas. */
  texto = texto.replace(
    /<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, contenido) => {
      const lineas = textoPlano(contenido)
        .split("\n")
        .map((linea) => `> ${linea}`)
        .join("\n")
      return `\n\n${lineas}\n\n`
    },
  )

  /* Énfasis. */
  texto = texto.replace(
    /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, contenido) => `**${textoPlano(contenido)}**`,
  )
  texto = texto.replace(
    /<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, contenido) => `*${textoPlano(contenido)}*`,
  )
  texto = texto.replace(
    /<code\b[^>]*>([\s\S]*?)<\/code>/gi,
    (_, contenido) => `\`${textoPlano(contenido)}\``,
  )

  /* Saltos de bloque. */
  texto = texto.replace(
    /<\/(div|section|article|header|footer|main|figure|figcaption|address|details|summary)>/gi,
    "\n\n",
  )
  texto = texto.replace(
    /<(div|section|article|header|footer|main|figure|figcaption|address|details|summary)\b[^>]*>/gi,
    "\n\n",
  )

  /* Lo que quede de etiquetas. */
  texto = texto.replace(/<[^>]+>/g, " ")

  return normalizarMarkdown(texto)
}

function extraerMeta(html) {
  const title = textoPlano(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
  )

  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(
    (coincidencia) => coincidencia[0],
  )
  const etiquetaDescripcion = metas.find((etiqueta) =>
    /name=["']description["']/i.test(etiqueta),
  )
  const description = decodificar(
    etiquetaDescripcion?.match(/content=["']([^"']*)["']/i)?.[1] ?? "",
  )

  const enlaces = [...html.matchAll(/<link\b[^>]*>/gi)].map(
    (coincidencia) => coincidencia[0],
  )
  const etiquetaCanonical = enlaces.find((etiqueta) =>
    /rel=["']canonical["']/i.test(etiqueta),
  )
  const canonical = decodificar(
    etiquetaCanonical?.match(/href=["']([^"']*)["']/i)?.[1] ?? "",
  )

  const h1 = textoPlano(
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "",
  )

  return { title, description, canonical, h1 }
}

function extraerCuerpo(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  return main?.[1] ?? body?.[1] ?? html
}

function archivoMarkdown(ruta) {
  return ruta === "/" ? "index.md" : `${ruta.slice(1)}.md`
}

function urlDe(ruta) {
  return ruta === "/" ? `${SITE_URL}/` : `${SITE_URL}${ruta}`
}

function urlMarkdown(ruta) {
  return `${SITE_URL}/${archivoMarkdown(ruta)}`
}

/* ──────────────────────────────────────────────────────────────────────────
 * Fechas reales para el sitemap
 * ────────────────────────────────────────────────────────────────────────── */

async function fechaDeArchivo(archivo) {
  try {
    const info = await stat(join(PROYECTO, archivo))
    return info.mtime.toISOString().slice(0, 10)
  } catch {
    return null
  }
}

function fechaDeGit(archivo) {
  try {
    const salida = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", archivo],
      { cwd: PROYECTO, encoding: "utf8" },
    ).trim()
    return salida || null
  } catch {
    return null
  }
}

async function ultimaFecha(fuentes) {
  const fechas = []

  for (const fuente of fuentes) {
    const deGit = fechaDeGit(fuente)
    if (deGit) {
      fechas.push(deGit)
      continue
    }
    const deArchivo = await fechaDeArchivo(fuente)
    if (deArchivo) fechas.push(deArchivo)
  }

  if (fechas.length === 0) return null
  return fechas.sort().at(-1) ?? null
}

/* ──────────────────────────────────────────────────────────────────────────
 * Generadores
 * ────────────────────────────────────────────────────────────────────────── */

function resumenNegocio() {
  return `Estudio de yoga en Gandia (Valencia, España), en el centro, en ${site.direccion.calle}, ${site.direccion.piso}. Abierto desde el ${site.aperturaTexto}. Lo dirige ${site.fundadora} (${site.rol}). No hay grupos cerrados ni reservas: el horario son las horas a las que el estudio está abierto y cada persona viene cuando le encaja. La primera clase de prueba es gratuita.`
}

function datosNegocioComoLineas() {
  const { calle, piso, codigoPostal, ciudad, provincia, pais } = site.direccion
  const planesTexto = planes
    .map((plan) => `${plan.nombre}: ${plan.mensual} €/mes o ${plan.trimestral} €/trimestre`)
    .join("; ")
  const bonosTexto = bonos
    .map(
      (bono) =>
        `${bono.nombre}: ${bono.precio} € (${bono.nota.replace(/\.$/, "")})`,
    )
    .join("; ")
  const horarioTexto = horario
    .map((dia) => {
      const franjas = dia.franjas.length
        ? dia.franjas.map((franja) => `${franja.inicio}–${franja.fin}`).join(", ")
        : "cerrado"
      return `${dia.dia}: ${franjas}`
    })
    .join("; ")

  return [
    `- Nombre: ${site.nombre}`,
    `- Qué es: estudio de yoga y bienestar, presencial, en Gandia. No es una franquicia ni una plataforma online.`,
    `- Dirección: ${calle}, ${piso} · ${codigoPostal} ${ciudad} · ${provincia} · ${pais}`,
    `- Teléfono y WhatsApp: ${site.contacto.telefonoVisible}`,
    `- Correo: ${site.contacto.email}`,
    `- Instagram: ${site.redes.instagram.url}`,
    `- Reservas: solo por WhatsApp. No hay formulario, ni cuenta de usuario, ni pago online.`,
    `- Servicios: ${practicas.map((practica) => practica.nombre).join(", ")}.`,
    `- Planes: ${planesTexto}.`,
    `- Bonos: ${bonosTexto}.`,
    `- Primera clase de prueba: gratuita, con reserva previa por WhatsApp.`,
    `- Formas de pago: ${formasDePago.formas}`,
    `- Horario: ${horarioTexto}.`,
    `- Idiomas: español y valenciano.`,
  ]
}

async function generarMarkdown() {
  const paginas = []

  for (const ruta of RUTAS_PUBLICAS) {
    const html = await readFile(join(RAIZ, ruta.html), "utf8")
    const meta = extraerMeta(html)
    const titulo = meta.title || meta.h1 || ruta.ruta
    const descripcion = meta.description || meta.h1 || titulo
    const canonical = meta.canonical || urlDe(ruta.ruta)
    const fecha = (await ultimaFecha(ruta.fuentes)) ?? ""

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(titulo)}`,
      `description: ${JSON.stringify(descripcion)}`,
      `canonical: ${JSON.stringify(canonical)}`,
      ...(fecha ? [`updated: ${JSON.stringify(fecha)}`] : []),
      'lang: "es-ES"',
      "---",
      "",
      `> Versión en texto de ${canonical}. Generada desde la página publicada.`,
      "",
      "",
    ].join("\n")

    const cuerpo = htmlAMarkdown(extraerCuerpo(html))
    const markdown = `${frontmatter}${cuerpo}\n`
    const archivo = archivoMarkdown(ruta.ruta)

    await writeFile(join(RAIZ, archivo), markdown, "utf8")
    paginas.push({ ...ruta, archivo, titulo, descripcion, canonical, fecha })
  }

  return paginas
}

function generarLlmsTxt(paginas) {
  const lineas = [
    "# YOGA Rituals",
    "",
    `> ${resumenNegocio()}`,
    "",
    `Contenido completo de todas las páginas: ${SITE_URL}/llms-full.txt`,
    "",
    "## Datos del negocio",
    "",
    ...datosNegocioComoLineas(),
    "",
    "## Páginas",
    "",
    ...paginas.map(
      (pagina) =>
        `- [${pagina.titulo}](${pagina.canonical}): ${pagina.descripcion} — [Markdown](${urlMarkdown(pagina.ruta)})`,
    ),
    "",
    "## Notas para quien cite esta web",
    "",
    "- Los datos de horario y precios cambian: la fuente de verdad es la página de horarios y la de precios.",
    "- No hay servicios online, ni suscripción digital, ni app. Todo se practica en el estudio de Gandia.",
    "- Las fotografías son las del estudio y de su archivo; los créditos y el origen de cada una están en CREDITOS-FOTOS.md.",
    "- Las opiniones que aparecen en la portada son reseñas reales de Google y enlazan a la reseña original.",
    "- Para cualquier duda sobre horarios, plazas o precios, la vía real es el WhatsApp del estudio.",
    "",
    "## Contacto para modelos de lenguaje",
    "",
    `Para cualquier duda sobre horarios, plazas o precios, la vía real es el WhatsApp del estudio: ${site.contacto.telefonoVisible}.`,
    "",
    `Última generación: ${new Date().toISOString().slice(0, 10)}.`,
    "",
  ]

  return lineas.join("\n")
}

async function generarLlmsFull(paginas) {
  const partes = [
    "# YOGA Rituals — contenido completo",
    "",
    `> ${resumenNegocio()}`,
    "",
    "## Datos del negocio",
    "",
    ...datosNegocioComoLineas(),
    "",
    "## Índice",
    "",
    ...paginas.map(
      (pagina) => `- ${pagina.titulo}: ${pagina.canonical}`,
    ),
    "",
  ]

  for (const pagina of paginas) {
    const markdown = await readFile(join(RAIZ, pagina.archivo), "utf8")
    const cuerpo = markdown
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .trim()
      .replace(/^> Versión en texto de [^\n]*\n+/, "")
      /* El título de la página ya va como `##`; el H1 del cuerpo lo repite. */
      .replace(/^# .+$/m, "")
      /* Las secciones bajan un nivel para colgar del título de la página. */
      .replace(/^(#{1,6}) /gm, (_, almohadillas) =>
        `${"#".repeat(Math.min(6, almohadillas.length + 1))} `,
      )

    partes.push("---", "")
    partes.push(`## ${pagina.titulo}`, "")
    partes.push(`Canonical: ${pagina.canonical}`, "")
    if (pagina.fecha) partes.push(`Última revisión: ${pagina.fecha}`, "")
    partes.push("")
    partes.push(cuerpo, "")
  }

  return `${partes.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`
}

function generarRobots() {
  const buscadores = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-User",
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Bingbot",
    "DuckDuckBot",
    "YandexBot",
  ]

  const entrenamiento = [
    "GPTBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Amazonbot",
    "meta-externalagent",
    "Bytespider",
    "cohere-ai",
    "Diffbot",
    "Omgilibot",
  ]

  const lineas = [
    "# robots.txt de YOGA Rituals",
    `# Última revisión: ${REVISION_ROBOTS}`,
    `# Próxima revisión prevista: ${PROXIMA_REVISION_ROBOTS}`,
    "#",
    "# La web se puede leer, indexar y citar. El resumen para modelos está en /llms.txt.",
    "",
    "User-Agent: *",
    "Allow: /",
    "",
    "# Buscadores y asistentes que responden con enlaces.",
    ...buscadores.flatMap((bot) => [
      `User-Agent: ${bot}`,
      "Allow: /",
      "",
    ]),
    "# Política de entrenamiento: por defecto se permite.",
    "# Para bloquear el uso del contenido para entrenar modelos, descomentar",
    "# la línea 'Disallow: /' de cada grupo. No hay que cambiar nada más.",
    ...entrenamiento.flatMap((bot) => [
      `User-Agent: ${bot}`,
      "Allow: /",
      "# Disallow: /",
      "",
    ]),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `# Resumen para modelos: ${SITE_URL}/llms.txt`,
    "",
  ]

  return lineas.join("\n")
}

async function generarSitemap() {
  const urls = []

  for (const ruta of RUTAS_PUBLICAS) {
    const lastmod = await ultimaFecha(ruta.fuentes)
    urls.push(
      [
        "  <url>",
        `    <loc>${urlDe(ruta.ruta).replace(/&/g, "&amp;")}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        "  </url>",
      ].join("\n"),
    )
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n")
}

async function generarHeaders() {
  const base = await readFile(join(PROYECTO, "public", "_headers"), "utf8")
  let cabeceras = `${base.trimEnd()}\n`

  const contexto = process.env.CONTEXT
  const noindex =
    process.env.NOINDEX === "1" || (contexto && contexto !== "production")

  if (noindex) {
    cabeceras += [
      "",
      "# Mientras la web viva en el dominio provisional, no se indexa.",
      "# Quitar `NOINDEX` de netlify.toml al publicar el dominio definitivo.",
      "/*",
      "  X-Robots-Tag: noindex",
      "",
    ].join("\n")
  }

  await writeFile(join(RAIZ, "_headers"), cabeceras, "utf8")
}

/* ──────────────────────────────────────────────────────────────────────────
 * Ejecución
 * ────────────────────────────────────────────────────────────────────────── */

const paginas = await generarMarkdown()

await writeFile(join(RAIZ, "llms.txt"), generarLlmsTxt(paginas), "utf8")
await writeFile(join(RAIZ, "llms-full.txt"), await generarLlmsFull(paginas), "utf8")
await writeFile(join(RAIZ, "robots.txt"), generarRobots(), "utf8")
await writeFile(join(RAIZ, "sitemap.xml"), await generarSitemap(), "utf8")
await generarHeaders()

console.log(
  `Archivos para IA y buscadores: ${paginas.length} páginas .md, llms.txt, llms-full.txt, robots.txt, sitemap.xml y _headers.`,
)
