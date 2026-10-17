import { expect, type Page } from "@playwright/test"

/**
 * Deja una página lista para una captura.
 *
 * Recorre la página entera de arriba abajo y vuelve al principio antes de
 * esperar a las imágenes. Hace falta porque `next/image` sirve las que están
 * fuera de pantalla con carga diferida: sin el recorrido nunca llegan a
 * empezar, y esperar a que «todas estén completas» se queda colgado para
 * siempre. Pasó, y costó tres capturas.
 */
export async function prepararPagina(page: Page, ruta: string) {
  await page.goto(ruta, { waitUntil: "domcontentloaded" })
  await page.locator("main#contenido").waitFor({ state: "visible" })
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const paso = window.innerHeight
    const alto = document.documentElement.scrollHeight

    for (let y = 0; y < alto; y += paso) {
      window.scrollTo(0, y)
      await new Promise((listo) => setTimeout(listo, 80))
    }

    window.scrollTo(0, 0)
    await new Promise((listo) => setTimeout(listo, 120))
  })

  await page.waitForFunction(
    () =>
      Array.from(document.images).every(
        (imagen) => imagen.complete && imagen.naturalWidth > 0,
      ),
    undefined,
    { timeout: 20_000 },
  )
}

/**
 * Abre el menú de móvil.
 *
 * Pulsa y, si no se abre, vuelve a pulsar. No es un parche para tapar un
 * fallo: es una carrera de verdad. El botón lo pinta el servidor, pero quien
 * lo abre es React al hidratar, así que entre una cosa y la otra hay un
 * instante en el que pulsarlo no hace absolutamente nada. Playwright pulsa a
 * máquina y cae en ese hueco mucho más a menudo que una persona. Y cuando
 * cae, el clic se pierde sin remedio: la prueba se queda esperando un diálogo
 * que ya nadie va a abrir, hasta agotar los 60 segundos. Costó una tarde
 * encontrarlo, y por eso está escrito aquí.
 *
 * El segundo intento solo se da si el diálogo no está abierto: el botón va y
 * viene, y pulsarlo dos veces seguidas lo cerraría justo después de abrirlo.
 */
export async function abrirMenu(page: Page) {
  const boton = page.getByRole("button", { name: "Menú" })
  const dialogo = page.getByRole("dialog")

  await expect(async () => {
    if (!(await dialogo.isVisible())) {
      await boton.click()
    }
    await expect(dialogo).toBeVisible({ timeout: 1500 })
  }).toPass({ timeout: 20_000 })
}
