/**
 * Los AVIF del logotipo.
 *
 * Los PNG de `public/marca/` son los que salen de `logo-sin-fondo.ps1`, y son
 * la fuente. Este script saca de ellos las versiones que sirve la web: el
 * logotipo se pide en la primera pantalla, y en AVIF pesa la tercera parte.
 *
 * Se ejecuta a mano cuando cambie el logo:
 *
 *   node scripts/logo-avif.mjs
 *
 * `sharp` viene con Next, así que no hay que instalar nada.
 *
 * Este script solo deja el AVIF de 400 px. Los de 128 y 256 px que usan
 * `srcset` en la cabecera los saca `scripts/imagenes-responsive.mjs`; hay que
 * ejecutar los dos cuando cambie el logo.
 */

import { join } from "node:path"

import sharp from "sharp"

const ORIGENES = ["logo-sin-fondo-400", "logo-sin-fondo-oscuro-400"]

for (const nombre of ORIGENES) {
  const origen = join(process.cwd(), "public", "marca", `${nombre}.png`)
  const destino = join(process.cwd(), "public", "marca", `${nombre}.avif`)

  const info = await sharp(origen)
    .avif({ quality: 82, effort: 9 })
    .toFile(destino)

  console.log(
    `${nombre}.avif — ${(info.size / 1024).toFixed(1)} KB, ${info.width}×${info.height}`,
  )
}
