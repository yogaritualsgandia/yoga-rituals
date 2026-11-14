/**
 * Vacía el bloque de polyfills que Next copia al export.
 *
 * Además del `polyfill-module` que se quita con el loader de Turbopack, Next
 * copia `polyfill-nomodule` tal cual a `out/_next/static/chunks/` y lo enlaza
 * desde el HTML con `<script noModule>`. Ese archivo no pasa por Turbopack, así
 * que ninguna regla de módulos lo alcanza. Los navegadores actuales no lo
 * descargan —solo lo hacen los que no entienden módulos—, pero Lighthouse lo
 * lee y lo cuenta como JavaScript heredado en el informe de PageSpeed.
 *
 * Se sustituye su contenido por un comentario. Los navegadores que declara
 * `browserslist` en `package.json` no llegan a pedirlo, y los que sí lo piden
 * tampoco podrían ejecutar el resto de la web, que va en módulos.
 *
 * Se ejecuta solo, como parte del `postbuild`.
 */

import { readdir, readFile, writeFile } from "node:fs/promises"
import { join, relative } from "node:path"

const RAIZ = join(process.cwd(), "out")
const VACIO =
  "/* Polyfills legacy vaciados en el postbuild: los navegadores soportados no los necesitan. */\n"

/** Todas las páginas HTML del export. */
async function paginas(directorio) {
  const encontradas = []

  for (const entrada of await readdir(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name)

    if (entrada.isDirectory()) {
      encontradas.push(...(await paginas(ruta)))
    } else if (entrada.name.endsWith(".html")) {
      encontradas.push(ruta)
    }
  }

  return encontradas
}

const bloques = new Set()

for (const pagina of await paginas(RAIZ)) {
  const html = await readFile(pagina, "utf8")

  /* Next escribe `src` antes que `noModule`; se buscan los dos por separado
     para no depender del orden de los atributos. */
  for (const etiqueta of html.match(/<script\b[^>]*\bnoModule\b[^>]*>/g) ?? []) {
    const src = etiqueta.match(/\bsrc="([^"]+)"/)

    if (src) bloques.add(src[1])
  }
}

for (const src of bloques) {
  const archivo = join(RAIZ, src.replace(/^\//, ""))

  await writeFile(archivo, VACIO, "utf8")
  console.log(`Polyfills legacy vaciados: ${relative(RAIZ, archivo)}`)
}

if (bloques.size === 0) {
  console.log("No hay ningún bloque de polyfills legacy en el export.")
}
