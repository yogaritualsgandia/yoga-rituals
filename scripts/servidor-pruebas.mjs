/**
 * Servidor de pruebas.
 *
 * No es `next start`: con `output: "export"` no hay servidor de Next, solo una
 * carpeta con HTML. Durante un tiempo Playwright arrancaba `npm run start` igual
 * y por eso la tanda entera se caía antes de empezar.
 *
 * Este servidor hace lo mismo que Netlify, que es lo que hay que probar:
 *
 *  · Direcciones limpias: /precios sirve precios.html, con o sin barra final.
 *  · Las redirecciones de verdad: lee `public/_redirects` y devuelve el 301 que
 *    verá un buscador, no una lista en un archivo que nadie ejecuta.
 *  · El 404 con estado 404 y el HTML de 404, para que un enlace roto no se
 *    guarde como una página buena.
 *  · Las cabeceras de `public/_headers`, para que la CSP se pruebe aquí antes
 *    de que tumbe algo en producción.
 *
 * Sin dependencias: se arranca con `node scripts/servidor-pruebas.mjs`.
 */
import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join, resolve, sep } from "node:path"
import { brotliCompressSync, constants as zlibConstants, gzipSync } from "node:zlib"

const RAIZ = resolve(process.cwd(), "out")
const PUERTO = Number(process.env.PUERTO ?? 3100)

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
}

/** Solo se comprime lo que Netlify comprime: texto, no fotos ni fuentes. */
const COMPRIMIBLES = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".txt",
  ".xml",
  ".svg",
])

function comprimir(cuerpo, extension, acepta) {
  if (!COMPRIMIBLES.has(extension) || cuerpo.length < 1024) return null
  if (acepta.includes("br")) {
    return {
      cuerpo: brotliCompressSync(cuerpo, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 },
      }),
      codificacion: "br",
    }
  }
  if (acepta.includes("gzip")) {
    return { cuerpo: gzipSync(cuerpo, { level: 9 }), codificacion: "gzip" }
  }
  return null
}

/** Las líneas de `_redirects`: `desde  hacia  estado`. */
async function leerRedirecciones() {
  let texto = ""
  try {
    texto = await readFile(join(process.cwd(), "public", "_redirects"), "utf8")
  } catch {
    return new Map()
  }

  const mapa = new Map()
  for (const linea of texto.split(/\r?\n/)) {
    const limpia = linea.trim()
    if (!limpia || limpia.startsWith("#")) continue
    const [desde, hacia, estado] = limpia.split(/\s+/)
    // Las reglas con dominio (www → apex) no se pueden probar en localhost.
    if (!desde.startsWith("/")) continue
    mapa.set(desde.replace(/\/$/, ""), {
      hacia,
      estado: Number(estado ?? 301),
    })
  }
  return mapa
}

/** Las reglas de `_headers`: una ruta y debajo sus `Nombre: valor`. */
async function leerCabeceras() {
  let texto = ""
  try {
    texto = await readFile(join(process.cwd(), "public", "_headers"), "utf8")
  } catch {
    return []
  }

  const reglas = []
  let actual = null
  for (const linea of texto.split(/\r?\n/)) {
    if (!linea.trim() || linea.trim().startsWith("#")) continue
    if (!/^\s/.test(linea)) {
      actual = { ruta: linea.trim(), cabeceras: {} }
      reglas.push(actual)
    } else if (actual) {
      const i = linea.indexOf(":")
      if (i > -1) {
        actual.cabeceras[linea.slice(0, i).trim()] = linea.slice(i + 1).trim()
      }
    }
  }
  return reglas
}

function cabecerasPara(reglas, ruta) {
  const salida = {}
  for (const regla of reglas) {
    const comodin = regla.ruta.endsWith("/*")
    const patron = regla.ruta === "/*" ? null : regla.ruta.replace(/\*$/, "")
    if (patron === null || (comodin ? ruta.startsWith(patron) : ruta === patron)) {
      Object.assign(salida, regla.cabeceras)
    }
  }
  return salida
}

async function esArchivo(ruta) {
  try {
    return (await stat(ruta)).isFile()
  } catch {
    return false
  }
}

/** Traduce una URL a un archivo de `out/`, o null. */
async function buscarArchivo(url) {
  const ruta = decodeURIComponent(url.split("?")[0])
  const candidatos = []

  if (ruta.endsWith("/")) {
    candidatos.push(join(RAIZ, ruta, "index.html"))
    candidatos.push(join(RAIZ, `${ruta.slice(0, -1)}.html`))
  } else {
    candidatos.push(join(RAIZ, ruta))
    candidatos.push(join(RAIZ, `${ruta}.html`))
    candidatos.push(join(RAIZ, ruta, "index.html"))
  }

  for (const candidato of candidatos) {
    const absoluto = resolve(candidato)
    // Nada fuera de out/, ni con .. ni con rutas absolutas.
    if (absoluto !== RAIZ && !absoluto.startsWith(RAIZ + sep)) continue
    if (await esArchivo(absoluto)) return absoluto
  }
  return null
}

const redirecciones = await leerRedirecciones()
const cabeceras = await leerCabeceras()

const servidor = createServer(async (peticion, respuesta) => {
  const url = peticion.url ?? "/"
  const sinBarra = url.split("?")[0].replace(/\/$/, "")

  const redireccion = redirecciones.get(sinBarra || "/")
  if (redireccion) {
    respuesta.writeHead(redireccion.estado, { Location: redireccion.hacia })
    respuesta.end()
    return
  }

  const archivo = await buscarArchivo(url)
  const comunes = cabecerasPara(cabeceras, url.split("?")[0])

  if (!archivo) {
    const html = join(RAIZ, "404.html")
    try {
      const cuerpo = await readFile(html)
      respuesta.writeHead(404, {
        "Content-Type": TIPOS[".html"],
        ...comunes,
      })
      respuesta.end(peticion.method === "HEAD" ? undefined : cuerpo)
    } catch {
      respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
      respuesta.end("No encontrado")
    }
    return
  }

  try {
    const original = await readFile(archivo)
    const extension = extname(archivo).toLowerCase()
    const acepta = String(peticion.headers["accept-encoding"] ?? "")
    const comprimido = comprimir(original, extension, acepta)
    const cuerpo = comprimido?.cuerpo ?? original
    const cabecerasRespuesta = {
      "Content-Type": TIPOS[extension] ?? "application/octet-stream",
      ...comunes,
      ...(comprimido
        ? { "Content-Encoding": comprimido.codificacion, Vary: "Accept-Encoding" }
        : {}),
    }

    respuesta.writeHead(200, cabecerasRespuesta)
    respuesta.end(peticion.method === "HEAD" ? undefined : cuerpo)
  } catch {
    respuesta.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
    respuesta.end("Error")
  }
})

servidor.listen(PUERTO, () => {
  console.log(`Export servido en http://localhost:${PUERTO}`)
})
