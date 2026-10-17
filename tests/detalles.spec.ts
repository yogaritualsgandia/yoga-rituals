import { test } from "@playwright/test"

import { abrirMenu, prepararPagina } from "./apoyo"

/**
 * Capturas de detalle, al doble de resolución.
 *
 * Existen porque una captura de página completa se ve reducida a la mitad y no
 * sirve para juzgar cosas pequeñas: la cabecera, el logotipo, el pie, los
 * tamaños de texto. Aquí se recorta cada pieza y se pinta a 2×, que es como se
 * ve de verdad en una pantalla con densidad alta.
 */

test.use({ deviceScaleFactor: 2 })

test.describe("Detalles en escritorio", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) !== 1440,
    "solo en escritorio",
  )

  test("piezas sueltas", async ({ page }) => {
    await prepararPagina(page, "/")

    await page.locator("header").screenshot({
      path: "capturas/fase-2/detalles/cabecera.png",
      animations: "disabled",
    })

    await page.locator("main section").first().screenshot({
      path: "capturas/fase-2/detalles/entrada.png",
      animations: "disabled",
    })

    await page.locator("main section").nth(2).screenshot({
      path: "capturas/fase-2/detalles/practicas.png",
      animations: "disabled",
    })

    // El pie entero es muy alto: se recorta la parte de dentro, que es la que
    // lleva la marca, la dirección y los enlaces.
    await page.locator("footer > div").screenshot({
      path: "capturas/fase-2/detalles/pie.png",
      animations: "disabled",
    })
  })

  test("acordeón abierto y respuesta heredada", async ({ page }) => {
    await prepararPagina(page, "/primera-vez")

    // El acordeón cerrado no enseña nada: lo que hay que mirar es el panel
    // abierto, que es donde puede aparecer un recorte de altura.
    await page
      .getByRole("button", { name: "No soy flexible, ¿puedo hacer yoga?" })
      .click()
    await page.waitForTimeout(400)

    await page
      .locator("main section")
      .filter({ hasText: "Las dudas que más salen" })
      .screenshot({
        path: "capturas/fase-2/detalles/acordeon-abierto.png",
        animations: "disabled",
      })

    await prepararPagina(page, "/yoga-oncologico")

    await page
      .locator("main section")
      .filter({ hasText: "Lo que ya está respondido" })
      .screenshot({
        path: "capturas/fase-2/detalles/oncologico-respuesta.png",
        animations: "disabled",
      })
  })
})

test.describe("Detalles en móvil", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) !== 375,
    "solo en móvil",
  )

  test("cabecera, menú y barra fija", async ({ page }) => {
    await prepararPagina(page, "/")

    await page.locator("header").screenshot({
      path: "capturas/fase-2/detalles/cabecera-movil.png",
      animations: "disabled",
    })

    await abrirMenu(page)
    await page.waitForTimeout(500)
    await page.locator('[role="dialog"]').screenshot({
      path: "capturas/fase-2/detalles/menu.png",
      animations: "disabled",
    })
    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)

    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(700)
    await page.locator("[data-accion-fija]").screenshot({
      path: "capturas/fase-2/detalles/barra-fija.png",
      animations: "disabled",
    })
  })
})
