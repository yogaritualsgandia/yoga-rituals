import { test } from "@playwright/test"

import { abrirMenu, prepararPagina } from "./apoyo"

/**
 * Capturas de cierre de fase.
 *
 * No comprueban nada: existen para mirar el resultado. Cada proyecto de
 * Playwright aporta su ancho, así que una sola pasada deja los cuatro anchos
 * (375, 768, 1440 y 1920) más la versión de movimiento reducido.
 *
 * Se guardan en capturas/fase-2/<proyecto>/, que está en .gitignore.
 *
 * Y llevan su propio tiempo de espera, más largo que el de las pruebas que
 * comprueban cosas. Esta recorre siete páginas enteras dos veces —una para que
 * carguen las imágenes y otra para el pie— y en un móvil eso son más de
 * sesenta segundos de trabajo honesto; con el limite general se quedaba a
 * medias no por un fallo, sino por lenta. Es una captura, no una alarma.
 */

test.describe.configure({ timeout: 240_000 })

const PAGINAS = [
  ["inicio", "/"],
  ["horarios", "/horarios"],
  ["precios", "/precios"],
  ["mindfulness", "/mindfulness"],
  ["sobre-mi", "/sobre-mi"],
  ["clases", "/clases"],
  ["primera-vez", "/primera-vez"],
  ["retiros", "/retiros"],
  ["yoga-oncologico", "/yoga-oncologico"],
] as const

test("capturas de la fase", async ({ page }, testInfo) => {
  const proyecto = testInfo.project.name

  for (const [nombre, ruta] of PAGINAS) {
    await prepararPagina(page, ruta)
    await page.screenshot({
      path: `capturas/fase-2/${proyecto}/${nombre}.png`,
      fullPage: true,
      animations: "disabled",
    })
  }

  // Estados que solo se ven interactuando.
  if ((page.viewportSize()?.width ?? 0) < 1024) {
    await prepararPagina(page, "/")

    await abrirMenu(page)
    await page.waitForTimeout(400)
    await page.screenshot({
      path: `capturas/fase-2/${proyecto}/menu-abierto.png`,
      animations: "disabled",
    })
    await page.keyboard.press("Escape")

    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(600)
    await page.screenshot({
      path: `capturas/fase-2/${proyecto}/barra-fija.png`,
      animations: "disabled",
    })
  }

  // El pie, que es donde vive el SEO local y la atribución.
  await prepararPagina(page, "/")
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  )
  await page.waitForTimeout(400)
  await page.screenshot({
    path: `capturas/fase-2/${proyecto}/pie.png`,
    animations: "disabled",
  })
})

test("captura del modo oscuro", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "escritorio-1440",
    "solo hace falta una vez",
  )

  await prepararPagina(page, "/")
  await page.getByRole("button", { name: "Cambiar a modo oscuro" }).click()

  // Pulsar el botón lleva el foco al pie, y la captura de página completa
  // sale entonces con la cabecera fija pintada donde no toca.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)

  await page.screenshot({
    path: "capturas/fase-2/modo-oscuro/inicio.png",
    fullPage: true,
    animations: "disabled",
  })
})
