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
 *  2. QUE SE PUEDA PARAR, Y QUE PARAR NO ROMPA NADA. El botón del pie tiene
 *     que pararlo de verdad, y no tiene que existir cuando no hay nada que
 *     parar. Con la pausa puesta la web tiene que seguir leyéndose y viéndose:
 *     los dos fallos que ha tenido esta parte —la página clavada y la página en
 *     blanco— se colaron por dar la pausa por hecha.
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

  test("si el foco llega a algo escondido, se enseña", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await irA(page, "/")

    /* La línea donde se enseña un bloque está al 88 % de la pantalla, y el
       navegador, cuando se llega con el tabulador a algo de más abajo, no sube
       el elemento hasta ahí: lo asoma justo por el borde. El foco se quedaba
       sobre algo invisible.

       El foco se pone aquí con `preventScroll`, o sea sin desplazar nada: así
       el disparador no se entera y el bloque solo puede verse por la regla de
       `:focus-within`. Si esto se pone en rojo, la salida de emergencia del CSS
       ha dejado de funcionar y hay que arreglarla, porque el fallo es
       invisible: pasa con el teclado. */
    const resultado = await page.evaluate(() => {
      const dentro =
        "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"

      const bloques = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-revelar="bloque"]:not([data-revelado])',
        ),
      ).filter((bloque) => bloque.querySelector(dentro))

      const pruebas = bloques.map((bloque) => {
        const foco = bloque.querySelector<HTMLElement>(dentro)!

        foco.focus({ preventScroll: true })

        const prueba = {
          seLeDioElFoco: document.activeElement === foco,
          opacidadDelBloque: Number(getComputedStyle(bloque).opacity),
          /* Si esto fuera `true`, lo estaría enseñando el disparador y la
             prueba no diría nada de la regla de CSS. */
          loEnsenoElDisparador: bloque.hasAttribute("data-revelado"),
        }

        foco.blur()

        return prueba
      })

      return { cuantos: pruebas.length, pruebas }
    })

    expect(
      resultado.cuantos,
      "la página tiene que tener bloques escondidos con algo dentro",
    ).toBeGreaterThan(0)

    for (const prueba of resultado.pruebas) {
      expect(prueba.seLeDioElFoco, "el foco entra").toBe(true)
      expect(
        prueba.loEnsenoElDisparador,
        "el disparador no se ha enterado",
      ).toBe(false)
      expect(
        prueba.opacidadDelBloque,
        "un bloque con el foco dentro no puede quedarse invisible",
      ).toBe(1)
    }
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

  test("parado, la página se sigue leyendo y sigue apareciendo", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "la rueda es cosa de escritorio",
    )

    await irA(page, "/")

    const parar = page.getByRole("button", { name: "Parar el movimiento" })
    await parar.scrollIntoViewIfNeeded()
    await parar.click()

    /* Parar el movimiento no puede parar la lectura, y no sale gratis: parando
       la instancia de Lenis, la rueda se quedaba sin hacer nada con ella y la
       página se clavaba. Lo que se hace es dejarle la rueda al navegador.
       Comprobado en el navegador antes de arreglarlo, y aquí queda fijo. */
    const antes = await page.evaluate(() => Math.round(window.scrollY))
    await page.mouse.move(700, 400)
    await page.mouse.wheel(0, -600)

    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)))
      .toBeLessThan(antes - 100)

    /* Y bajando hasta el final, lo de abajo se sigue enseñando: parado no
       quiere decir escondido. */
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    )

    await expect(page.locator('[data-revelar="bloque"]').last()).toHaveCSS(
      "opacity",
      "1",
    )
  })

  test("parado, la página nueva se ve entera", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "el caso es el mismo en todos los anchos",
    )

    await irA(page, "/")

    const parar = page.getByRole("button", { name: "Parar el movimiento" })
    await parar.scrollIntoViewIfNeeded()
    await parar.click()

    /* Las entradas llevan relleno hacia atrás, así que congelarlas —que es lo
       primero que se hizo— las dejaba en su primer fotograma, o sea en opacidad
       cero. Parado el movimiento y cambiando de página, la página nueva entraba
       en blanco y el titular no se veía. Se reproducía en el navegador; esto es
       lo que lo mantiene arreglado. */
    await page
      .locator("header")
      .getByRole("link", { name: "Clases", exact: true })
      .click()
    await expect(page).toHaveURL(/\/clases$/)

    await expect(page.locator(".transicion-pagina")).toHaveCSS("opacity", "1")
    await expect(page.locator("h1")).toHaveCSS("opacity", "1")
    await expect(page.locator("h1 .palabra").first()).toBeVisible()
    await expect(page.locator("h1 .palabra").first()).toHaveCSS("opacity", "1")
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

    await page.locator("footer").getByRole("link", { name: "Aviso legal" }).click()

    await expect(page).toHaveURL(/\/aviso-legal$/)
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)))
      .toBe(0)
  })
})
