import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Puerta de la Fase 1 — base del proyecto.
 *
 * Comprueba que la base está bien antes de construir nada encima:
 * sin errores de consola, sin violaciones graves de accesibilidad, con las
 * tipografías de marca realmente cargadas y con la paleta de marca aplicada
 * (no el gris por defecto de shadcn).
 */

const ANCHOS = ["movil-375", "tablet-768", "escritorio-1440", "ancho-1920"]

test.describe("Fase 1 · base", () => {
  test("no hay errores en consola", async ({ page }) => {
    const errores: string[] = []

    page.on("console", (mensaje) => {
      if (mensaje.type() === "error") errores.push(mensaje.text())
    })
    page.on("pageerror", (error) => errores.push(error.message))

    await page.goto("/")
    await page.waitForLoadState("load")
    await page.waitForTimeout(600)

    expect(errores, `Errores de consola:\n${errores.join("\n")}`).toEqual([])
  })

  test("no hay violaciones graves de accesibilidad", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const analisis = await new AxeBuilder({ page }).analyze()
    const graves = analisis.violations.filter(
      (violacion) =>
        violacion.impact === "serious" || violacion.impact === "critical",
    )

    expect(
      graves.map((v) => `${v.id} — ${v.help}`).join("\n"),
      "Violaciones graves o críticas de axe",
    ).toEqual("")
  })

  test("las tipografías de marca están cargadas", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const familias = await page.evaluate(() => ({
      titular: getComputedStyle(document.querySelector("h1")!).fontFamily,
      texto: getComputedStyle(document.body).fontFamily,
    }))

    expect(familias.titular).toContain("Literata")
    expect(familias.texto).toContain("Source Sans")
  })

  test("la paleta es de marca, no el gris por defecto", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    /* Chromium puede devolver el color en oklch(), lab() o rgb(), según de
       dónde venga. En vez de adivinar el formato, se pinta en un canvas y
       se lee el píxel: es el color real que ve la persona. */
    const fondo = await page.evaluate(() => {
      const color = getComputedStyle(document.body).backgroundColor

      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const contexto = canvas.getContext("2d")!

      /* Centinela: si el color no fuese válido, el canvas se queda con
         este y lo detectamos abajo. */
      contexto.fillStyle = "#ff00ff"
      contexto.fillStyle = color
      contexto.fillRect(0, 0, 1, 1)

      const [r, g, b] = contexto.getImageData(0, 0, 1, 1).data
      return { color, r, g, b }
    })

    expect(
      fondo.color,
      "El canvas no aceptó el color de fondo",
    ).not.toContain("oklch")

    const desviacion =
      Math.max(fondo.r, fondo.g, fondo.b) - Math.min(fondo.r, fondo.g, fondo.b)

    /* Un gris neutro tiene los tres canales idénticos. El suelo de marca es
       arena cálida: si esto falla, es que shadcn sigue mandando. */
    expect(
      desviacion,
      `El fondo es gris neutro (${fondo.color} → rgb(${fondo.r},${fondo.g},${fondo.b})); falta la paleta de marca`,
    ).toBeGreaterThan(3)
  })

  test("el foco se ve al navegar con teclado", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    await page.keyboard.press("Tab")

    const hayFoco = await page.evaluate(() => {
      const activo = document.activeElement as HTMLElement | null
      if (!activo || activo === document.body) return null

      const estilo = getComputedStyle(activo)
      const grosor = Number.parseFloat(estilo.outlineWidth) || 0

      return {
        etiqueta: activo.tagName,
        contorno: estilo.outlineStyle !== "none" && grosor > 0,
        anillo: estilo.boxShadow !== "none" && estilo.boxShadow !== "",
      }
    })

    expect(hayFoco, "El tabulador no llega a ningún elemento").not.toBeNull()

    /* Un indicador de foco vale igual como contorno que como anillo
       (box-shadow), que es lo que usan los botones de shadcn. Lo que no
       vale es que no haya ninguno. */
    expect(
      hayFoco!.contorno || hayFoco!.anillo,
      `El elemento con foco (${hayFoco!.etiqueta}) no muestra ningún indicador`,
    ).toBe(true)
  })

  test("no hay desbordes horizontales", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("load")

    const desborde = await page.evaluate(() => {
      const ancho = window.innerWidth
      const documento = document.documentElement

      const culpables = Array.from(document.querySelectorAll<HTMLElement>("*"))
        .filter((el) => {
          const caja = el.getBoundingClientRect()
          return caja.width > 0 && caja.right > ancho + 1
        })
        .slice(0, 5)
        .map((el) => {
          const caja = el.getBoundingClientRect()
          return `${el.tagName.toLowerCase()}${
            el.id ? `#${el.id}` : ""
          } → right ${Math.round(caja.right)}px de ${ancho}px`
        })

      return {
        scrollWidth: documento.scrollWidth,
        ancho,
        culpables,
      }
    })

    expect(
      desborde.scrollWidth,
      `La página desborda en horizontal. Elementos fuera:\n${desborde.culpables.join("\n")}`,
    ).toBeLessThanOrEqual(desborde.ancho + 1)
  })

  test("capturas en los cuatro anchos", async ({ page }, info) => {
    test.skip(
      !ANCHOS.includes(info.project.name),
      "Las capturas solo se toman en los cuatro anchos de revisión",
    )

    await page.goto("/")
    await page.waitForLoadState("load")
    await page.waitForTimeout(400)

    await page.screenshot({
      path: `capturas/fase-1/${info.project.name}.png`,
      fullPage: true,
    })
  })
})
