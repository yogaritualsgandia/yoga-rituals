/**
 * Copia los segmentos RSC que Next exporta con otro nombre.
 *
 * Con `output: "export"`, Next escribe el trozo de página que usa la navegación
 * sin recargar en `out/<ruta>/__next.<ruta>/__PAGE__.txt`, pero el navegador lo
 * pide en `out/<ruta>/__next.<ruta>.__PAGE__.txt`. En un servidor de Next eso
 * lo resuelve el enrutador; en un export estático no hay quien lo resuelva, así
 * que las cinco rutas del menú devolvían un 404 en la consola de cada página.
 * La navegación seguía funcionando —Next acaba tirando del `.txt` de la raíz—
 * pero se perdía la precarga y quedaban cinco errores rojos que no son de la
 * web.
 *
 * Esto no toca ningún contenido: duplica un archivo con el nombre que se pide.
 * Se ejecuta solo, como `postbuild`.
 */
import { copyFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const RAIZ = join(process.cwd(), "out")

let copiados = 0

for (const entrada of await readdir(RAIZ, { withFileTypes: true })) {
  if (!entrada.isDirectory()) continue
  const carpeta = join(RAIZ, entrada.name)

  for (const sub of await readdir(carpeta, { withFileTypes: true })) {
    // El nombre del segmento lleva el de la ruta: __next.horarios
    if (!sub.isDirectory() || !sub.name.startsWith("__next.")) continue

    const origen = join(carpeta, sub.name, "__PAGE__.txt")
    const destino = join(carpeta, `${sub.name}.__PAGE__.txt`)

    try {
      await copyFile(origen, destino)
      copiados++
    } catch {
      // Si esa ruta no tiene segmento de página, no hay nada que copiar.
    }
  }
}

console.log(`Segmentos RSC con el nombre que pide el navegador: ${copiados}`)
