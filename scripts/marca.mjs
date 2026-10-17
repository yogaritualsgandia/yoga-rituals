/**
 * Marca · de hex a OKLCH y comprobación de contraste WCAG.
 *
 * Existe porque los valores de los tokens no se estiman a ojo: se calculan
 * a partir de los colores reales de marca, y el contraste se mide. Si un par
 * no llega a 4.5:1 para texto normal, aquí se ve antes de que llegue a la web.
 *
 * Uso:  node scripts/marca.mjs
 */

const HEX = {
  "crema (suelo)": "#F5F1EA",
  blanco: "#FFFFFF",
  "tinta (texto)": "#333333",
  "gris (secundario)": "#7A7A7A",
  "salvia": "#8FAF9D",
  "terracota": "#D9A17B",
  "turquesa logo (vivo)": "#1E91BA",
  "turquesa logo (medio)": "#61B3D1",
}

/* --- Conversión ---------------------------------------------------------- */

const aLineal = (v) => {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

const hexARgb = (hex) => {
  const h = hex.replace("#", "")
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16))
}

/** Luminancia relativa WCAG. */
export const luminancia = (hex) => {
  const [r, g, b] = hexARgb(hex).map(aLineal)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Razón de contraste WCAG entre dos colores. */
export const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/** sRGB → OKLCH. */
export const aOklch = (hex) => {
  const [r, g, b] = hexARgb(hex).map(aLineal)

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const C = Math.sqrt(A * A + B * B)
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360

  return { L, C, H }
}

/* --- Informe ------------------------------------------------------------- */

if (process.argv[1]?.endsWith("marca.mjs")) {
  console.log("\nPaleta real → OKLCH\n" + "─".repeat(58))
  for (const [nombre, hex] of Object.entries(HEX)) {
    const { L, C, H } = aOklch(hex)
    console.log(
      `${nombre.padEnd(22)} ${hex}  oklch(${(L * 100).toFixed(2)}% ${C.toFixed(
        4,
      )} ${H.toFixed(2)})`,
    )
  }

  const texto = "#333333"
  const suelo = "#F5F1EA"

  console.log("\nContraste sobre el suelo crema (#F5F1EA)\n" + "─".repeat(58))
  for (const [nombre, hex] of Object.entries(HEX)) {
    if (hex === suelo) continue
    const c = contraste(hex, suelo)
    const veredicto =
      c >= 4.5 ? "AA texto ✓" : c >= 3 ? "solo grande/UI" : "inservible"
    console.log(`${nombre.padEnd(22)} ${c.toFixed(2)}:1   ${veredicto}`)
  }

  console.log("\nContraste con texto blanco encima\n" + "─".repeat(58))
  for (const [nombre, hex] of Object.entries(HEX)) {
    if (["#FFFFFF", suelo, "#F5F1EA"].includes(hex)) continue
    const c = contraste(hex, "#FFFFFF")
    const veredicto =
      c >= 4.5 ? "AA texto ✓" : c >= 3 ? "solo grande/UI" : "inservible"
    console.log(`${nombre.padEnd(22)} ${c.toFixed(2)}:1   ${veredicto}`)
  }

  console.log(
    `\nReferencia · tinta sobre suelo: ${contraste(texto, suelo).toFixed(2)}:1`,
  )

  /* --- Candidatos para los dos papeles que no llegan a AA ---------------- */
  console.log("\nCandidatos\n" + "─".repeat(58))

  const candidatos = {
    "tinta secundaria (texto sobre crema, necesita 4.5)": [
      "#7A7A7A",
      "#6E655C",
      "#6B625A",
      "#665D55",
      "#5F574F",
    ],
    "turquesa de acción (texto blanco encima, necesita 4.5)": [
      "#1E91BA",
      "#18789C",
      "#14708F",
      "#0F6683",
      "#0B5C77",
    ],
  }

  for (const [papel, lista] of Object.entries(candidatos)) {
    console.log(`\n${papel}`)
    for (const hex of lista) {
      const { L, C, H } = aOklch(hex)
      const sobreCrema = contraste(hex, suelo)
      const sobreBlanco = contraste(hex, "#FFFFFF")
      const marca = sobreCrema >= 4.5 ? "✓" : " "
      console.log(
        `  ${hex}  oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(
          2,
        )})   crema ${sobreCrema.toFixed(2)}:1   blanco ${sobreBlanco.toFixed(
          2,
        )}:1  ${marca}`,
      )
    }
  }

  /* --- Campos de color ---------------------------------------------------
     Un campo es un fondo de color sobre el que va texto. Lo que hay que
     comprobar aquí no es su contraste con el suelo, sino con la tinta que se
     le pone encima: en claro la tinta es #333, en oscuro es la crema. */
  console.log(
    "\nCampos · contraste con la tinta que va encima\n" + "─".repeat(58),
  )

  const campos = {
    "salvia (campo claro)": ["#8FAF9D", "#333333"],
    "terracota (campo claro)": ["#D9A17B", "#333333"],
    "cálido claro · candidato A": ["#EFDFD3", "#333333"],
    "cálido claro · candidato B": ["#E9D6C6", "#333333"],
    "cálido claro · candidato C": ["#F2E4D8", "#333333"],
    "cálido oscuro · candidato A": ["#3A322B", "#F5F1EA"],
    "cálido oscuro · candidato B": ["#42382F", "#F5F1EA"],
    "cálido oscuro · candidato C": ["#332C26", "#F5F1EA"],
  }

  for (const [nombre, [fondo, tinta]] of Object.entries(campos)) {
    const c = contraste(fondo, tinta)
    const veredicto = c >= 4.5 ? "AA texto ✓" : c >= 3 ? "solo grande/UI" : "inservible"
    const { L, C, H } = aOklch(fondo)
    console.log(
      `${nombre.padEnd(28)} ${fondo}  oklch(${(L * 100).toFixed(2)}% ${C.toFixed(
        4,
      )} ${H.toFixed(2)})  ${c.toFixed(2)}:1  ${veredicto}`,
    )
  }
}
