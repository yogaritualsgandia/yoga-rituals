/**
 * Las copias pequeñas y medianas de las fotos y del logotipo.
 *
 * La web se exporta como sitio estático y no tiene optimizador en el servidor:
 * el navegador solo puede elegir entre los anchos que existan en `public/`. Las
 * fotos venían en 800 y 1600 px, y para la foto de portada eso era demasiado:
 * a 372 px de ancho, un móvil de densidad 1 descargaba la de 800 y un móvil de
 * densidad 2,6 seguía descargando la de 1600. Faltaban los dos extremos.
 *
 * Este script añade 400, 700 y 1200 px a todas las fotos, y 128 y 256 px al
 * logotipo. Los anchos que ya había no se tocan. Se puede repetir: sobrescribe
 * las copias y no toca los originales.
 *
 * Los 700 px son para el móvil de densidad 1,75: la foto de portada mide unos
 * 372 px de ancho, así que necesita 651 px reales. Sin ese escalón el navegador
 * subía a 800 y Lighthouse lo seguía marcando como imagen más grande de lo
 * necesario.
 *
 *   node scripts/imagenes-responsive.mjs
 *
 * `sharp` viene con Next, así que no hay que instalar nada.
 */

import { readdir } from "node:fs/promises"
import { join } from "node:path"

import sharp from "sharp"

const RAIZ = process.cwd()
const FOTOS = join(RAIZ, "public", "fotos")
const MARCA = join(RAIZ, "public", "marca")

/** Los anchos nuevos. Los que ya había —800 y 1600— se quedan como están. */
const ANCHOS_FOTOS = [400, 700, 1200]

const FORMATOS = [
  { salida: "avif", opciones: { quality: 60, effort: 9 } },
  { salida: "webp", opciones: { quality: 74, effort: 6 } },
  { salida: "jpeg", extension: "jpg", opciones: { quality: 78, mozjpeg: true } },
]

async function fotos() {
  const archivos = await readdir(FOTOS)
  const bases = archivos
    .filter((nombre) => nombre.endsWith("-1600.jpg"))
    .map((nombre) => nombre.slice(0, -"-1600.jpg".length))

  for (const base of bases) {
    const origen = join(FOTOS, `${base}-1600.jpg`)

    for (const ancho of ANCHOS_FOTOS) {
      for (const { salida, extension = salida, opciones } of FORMATOS) {
        const destino = join(FOTOS, `${base}-${ancho}.${extension}`)
        const info = await sharp(origen)
          .resize({ width: ancho })
          [salida](opciones)
          .toFile(destino)

        console.log(
          `fotos/${base}-${ancho}.${extension} — ${(info.size / 1024).toFixed(1)} KB, ${info.width}×${info.height}`,
        )
      }
    }
  }
}

async function logos() {
  const origenes = ["logo-sin-fondo", "logo-sin-fondo-oscuro"]

  for (const base of origenes) {
    const origen = join(MARCA, `${base}-400.png`)

    for (const ancho of [128, 256]) {
      const destino = join(MARCA, `${base}-${ancho}.avif`)
      const info = await sharp(origen)
        .resize({ width: ancho })
        .avif({ quality: 82, effort: 9 })
        .toFile(destino)

      console.log(
        `marca/${base}-${ancho}.avif — ${(info.size / 1024).toFixed(1)} KB, ${info.width}×${info.height}`,
      )
    }
  }
}

await fotos()
await logos()
