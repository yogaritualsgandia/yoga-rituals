import { expect, test, type Page } from "@playwright/test"

import { esperarAlMovimiento, prepararPagina } from "./apoyo"

/**
 * Fase 3 · el movimiento.
 *
 * Lo que se comprueba aquí no es que las cosas se muevan —eso se mira en las
 * capturas— sino las tres promesas que este trabajo puede romper sin que se
 * note:
 *
 *  1. QUE NO SE ESCONDA NADA. Todo el sistema de entradas parte de un estado
 *     invisible, y un fallo ahí deja la web en blanco. Se comprueba con
 *     «menos movimiento» puesto, que es el caso en el que el interruptor no se
 *     enciende: si con el interruptor apagado no hay nada escondido, es que el
 *     CSS no esconde nada por su cuenta.
 *
 *  2. QUE SE PUEDA PARAR. El botón del pie tiene que pararlo de verdad, y no
 *     tiene que existir cuando no hay nada que parar.
 *
 *  3. QUE EL OBJETO DIGA ALGO. No es decoración: dice el ritmo que hay
 *     marcado, y eso se puede leer pero también se puede oír.
 *
 * Casi todo se prueba en un solo ancho. No es por ahorrar: es que lo que se
 * prueba aquí no depende del ancho, y repetirlo cuatro veces solo multiplica
 * el tiempo de la suite. Lo que sí se mira en todos los anchos es la sección
 * del ritmo, que es lo único nuevo que cambia de forma con la pantalla.
 */

/** Solo en el proyecto de escritorio, que es donde hay movimiento. */
const SOLO_ESCRITORIO = "escritorio-1440"

async function irA(page: Page, ruta: string) {
  await page.goto(ruta, { waitUntil: "domcontentloaded" })
  await page.locator("main#contenido").waitFor({ state: "visible" })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () =>
      new Promise<void>((listo) =>
        requestAnimationFrame(() => requestAnimationFrame(() => listo())),
      ),
  )
  await esperarAlMovimiento(page)
}

/** El bloque de «Marca tu ritmo», que es donde está todo esto. */
function seccionDelRitmo(page: Page) {
  return page.locator("section", {
    has: page.getByRole("heading", { name: "Marca tu ritmo" }),
  })
}

/* ── El objeto y sus mandos ─────────────────────────────────────────────── */

test.describe("El objeto que respira", () => {
  test("la sección está, con su titular y su escena", async ({ page }) => {
    await irA(page, "/")

    const seccion = seccionDelRitmo(page)

    await expect(seccion).toHaveCount(1)
    await expect(seccion.locator('[role="img"]')).toHaveCount(1)
  })

  test("la escena dice el ritmo que hay marcado", async ({ page }) => {
    await irA(page, "/")

    await expect(seccionDelRitmo(page).locator('[role="img"]')).toHaveAttribute(
      "aria-label",
      /4 segundos al inspirar y 6 al espirar/,
    )
  })

  test("el ritmo se puede marcar con el teclado, y se anuncia", async ({
    page,
  }) => {
    await irA(page, "/")

    const inspirar = page.getByRole("slider", { name: "Inspirar, en segundos" })
    const espirar = page.getByRole("slider", { name: "Espirar, en segundos" })

    await expect(inspirar).toHaveAttribute("aria-valuenow", "4")
    await expect(espirar).toHaveAttribute("aria-valuenow", "6")

    /* Con las flechas, que es como se maneja un deslizador sin ratón. Radix ya
       lo trae hecho; lo que se comprueba es que sigue ahí después de haberle
       puesto nuestro aspecto por encima. */
    await inspirar.press("ArrowRight")
    await expect(inspirar).toHaveAttribute("aria-valuenow", "5")
    await expect(page.getByText("Una respiración cada 11 segundos")).toBeVisible()

    // Y que la escena se entera: es lo que la hace algo más que un adorno.
    await expect(seccionDelRitmo(page).locator('[role="img"]')).toHaveAttribute(
      "aria-label",
      /5 segundos al inspirar/,
    )

    await espirar.press("ArrowLeft")
    await expect(espirar).toHaveAttribute("aria-valuenow", "5")
    await expect(page.getByText("Una respiración cada 10 segundos")).toBeVisible()
  })

  test("el ritmo es legible sin tocar los mandos", async ({ page }) => {
    await irA(page, "/")

    /* Los mandos son un extra, no la única forma de leer la sección: si no
       estuvieran —sin JavaScript no estarían— el texto sigue diciendo el
       ritmo con palabras. */
    await expect(seccionDelRitmo(page)).toContainText(
      /cuatro segundos al inspirar y seis al espirar/,
    )
  })
})

/* ── Las entradas ───────────────────────────────────────────────────────── */

test.describe("Las entradas", () => {
  test("lo de abajo empieza escondido y se enseña al llegar", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "solo hace falta una vez",
    )

    await irA(page, "/")

    const ultimo = page.locator('[data-revelar="bloque"]').last()

    // Escondido de salida, y no porque sí: lo pone el CSS, y solo mientras el
    // interruptor del movimiento esté puesto.
    await expect(ultimo).toHaveCSS("opacity", "0")

    await ultimo.scrollIntoViewIfNeeded()

    await expect(ultimo).toHaveCSS("opacity", "1")
  })

  test("con «menos movimiento» no hay ni una cosa escondida", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    /* Esta es la prueba que de verdad importa de toda la fase. El estado
       escondido lo pone el CSS, pero solo cuando el documento lleva el
       atributo que enciende el interruptor. Si esa condición se rompiera —una
       regla sin acotar, un atributo puesto desde el sitio equivocado—, la web
       se quedaría en blanco para quien navegue sin JavaScript o con las
       animaciones apagadas, y no habría nada que la rescatara. */
    await page.emulateMedia({ reducedMotion: "reduce" })
    await irA(page, "/")

    const escondidos = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-revelar]"))
        .filter((elemento) => Number(getComputedStyle(elemento).opacity) === 0)
        .map((elemento) => elemento.tagName + "." + elemento.className),
    )

    expect(escondidos).toEqual([])
  })

  test("la entrada de página tampoco se enciende con «menos movimiento»", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await page.emulateMedia({ reducedMotion: "reduce" })
    await irA(page, "/")

    await expect(page.locator(".transicion-pagina")).toHaveCSS(
      "animation-name",
      "none",
    )
  })
})

/* ── Parar ──────────────────────────────────────────────────────────────── */

test.describe("Parar el movimiento", () => {
  test("el botón del pie lo para y lo vuelve a arrancar", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== SOLO_ESCRITORIO, "el botón es uno solo")

    await irA(page, "/")

    const parar = page.getByRole("button", { name: "Parar el movimiento" })
    await parar.scrollIntoViewIfNeeded()
    await parar.click()

    await expect(page.locator("html")).toHaveAttribute("data-pausado", "si")

    const seguir = page.getByRole("button", { name: "Reanudar el movimiento" })
    await expect(seguir).toBeVisible()
    await seguir.click()

    await expect(page.locator("html")).not.toHaveAttribute("data-pausado")
  })

  test("con «menos movimiento» no hay botón, porque no hay nada que parar", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await page.emulateMedia({ reducedMotion: "reduce" })
    await irA(page, "/")

    await expect(
      page.getByRole("button", { name: "Parar el movimiento" }),
    ).toHaveCount(0)
  })
})

/* ── El desplazamiento ──────────────────────────────────────────────────── */

test.describe("El desplazamiento", () => {
  test("con movimiento, la rueda la lleva Lenis", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "la rueda suave es cosa de escritorio",
    )

    await irA(page, "/")

    // `lenis` marca el <html> cuando toma el mando del desplazamiento.
    await expect(page.locator("html")).toHaveClass(/lenis/)
  })

  test("con «menos movimiento», Lenis ni entra", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await page.emulateMedia({ reducedMotion: "reduce" })
    await irA(page, "/")

    await expect(page.locator("html")).not.toHaveClass(/lenis/)
  })

  test("al cambiar de página se empieza por arriba", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await prepararPagina(page, "/")

    /* Se pincha un enlace del pie, que obliga a estar abajo del todo. Lo que
       se comprueba es que la página nueva no herede esa posición: con el
       desplazamiento suavizado, eso no sale gratis. */
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    )

    await page.locator("footer").getByRole("link", { name: "Tarifas" }).click()

    await expect(page).toHaveURL(/\/tarifas$/)
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)))
      .toBe(0)
  })
})
