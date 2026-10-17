import { expect, type Page } from "@playwright/test"

/**
 * Deja una página lista para una captura.
 *
 * Recorre la página entera de arriba abajo y vuelve al principio antes de
 * esperar a las imágenes. Hace falta porque `next/image` sirve las que están
 * fuera de pantalla con carga diferida: sin el recorrido nunca llegan a
 * empezar, y esperar a que «todas estén completas» se queda colgado para
 * siempre. Pasó, y costó tres capturas.
 *
 * Antes del recorrido se espera a que el que enseña lo escondido haya llegado,
 * y después a que todo se haya quedado quieto: una captura a media animación
 * sale con los textos a medio aparecer. Las dos cosas, explicadas, en
 * `esperarAlMotor` y `esperarAlMovimiento`.
 */
export async function prepararPagina(page: Page, ruta: string) {
  await page.goto(ruta, { waitUntil: "domcontentloaded" })
  await page.locator("main#contenido").waitFor({ state: "visible" })
  await page.evaluate(() => document.fonts.ready)

  await esperarAlMotor(page)

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

  await esperarAlMovimiento(page)
}

/**
 * Espera a que la web que se mueve esté lista para moverse.
 *
 * El suavizado de la rueda y las entradas de más abajo llegan con un `import()`
 * y no están en el primer paquete: durante medio segundo largo la página se
 * puede desplazar, pero el que enseña lo escondido todavía no ha llegado. Si
 * una prueba recorre la página dentro de ese hueco —y las capturas la recorren,
 * para que carguen las imágenes— se lo encuentra todo como estaba y luego no
 * hay quien lo despierte: los disparadores se crean cuando la página ya ha
 * vuelto arriba, y nadie baja otra vez.
 *
 * Por eso se espera al suavizado, que llega en el mismo paquete y en el mismo
 * instante que los disparadores: si Lenis está, lo otro también. Cuando el
 * interruptor del movimiento no está puesto no hay nada que esperar, porque no
 * hay nada escondido.
 */
export async function esperarAlMotor(page: Page) {
  await page
    .waitForFunction(
      () =>
        !document.documentElement.dataset.movimiento ||
        document.documentElement.classList.contains("lenis"),
      undefined,
      { timeout: 15_000, polling: 50 },
    )
    .catch(() => {
      /* Si no llega, se sigue: lo peor que puede pasar es una captura con un
         bloque de más escondido, y eso se ve a la primera mirada. */
    })
}

/**
 * Espera a que lo que se está moviendo se pare.
 *
 * Las entradas animan la opacidad, y a media animación el contraste de un
 * texto no es el suyo: quien mida ahí —axe, por ejemplo— se encuentra un
 * problema que no existe y que desaparece solo trescientos milisegundos
 * después. Se espera a que no quede ninguna animación corta corriendo.
 *
 * El círculo que respira no cuenta: no termina nunca y no lleva texto encima.
 */
export async function esperarAlMovimiento(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          document
            .getAnimations()
            .filter((animacion) => {
              const objetivo = (animacion.effect as KeyframeEffect | null)
                ?.target
              if (!(objetivo instanceof Element)) return false

              /* Solo cuentan las entradas. Todo lo demás que se mueve por la
                 página —un color que cambia, el círculo que respira, las
                 transiciones instantáneas que el navegador crea en cada
                 fotograma cuando alguien ha pedido menos movimiento— o no
                 lleva texto encima o no cambia ningún contraste, y esperarlas
                 es esperar a algo que no termina nunca. */
              const importa = objetivo.closest(
                "[data-revelar], .palabra, .transicion-pagina",
              )
              if (!importa) return false

              const tiempos = animacion.effect?.getComputedTiming()
              return (
                animacion.playState === "running" &&
                tiempos?.iterations !== Infinity
              )
            })
            .map(
              (animacion) =>
                `${(animacion.effect as KeyframeEffect | null)?.target?.className ?? "?"}`,
            ),
        ),
      { timeout: 10_000, message: "algo se ha quedado moviéndose" },
    )
    .toEqual([])
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
