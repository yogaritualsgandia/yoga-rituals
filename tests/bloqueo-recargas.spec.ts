import { expect, test, type Page } from "@playwright/test"

/**
 * El bloqueo por recargas.
 *
 * Netlify corta con una ventana móvil y se suelta sola; lo que de verdad
 * sostiene el minuto de espera es la pantalla de aviso, que guarda su estado en
 * `localStorage` y lo respeta el resto del sitio. Eso no se ve en una captura:
 * hay que recargar, esperar y mirar el reloj. Es justo lo que se prueba aquí.
 *
 * Se prueba en un solo ancho: lo que se comprueba es tiempo y estado guardado,
 * no maquetación, y repetirlo en los cinco proyectos multiplicaría la suite por
 * cinco sin añadir nada.
 */

const SOLO_ESCRITORIO = "escritorio-1440"
const PAGINA = "/demasiadas-peticiones.html"
const CLAVE = "yr-recargas"

const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const estado = (parcial: Record<string, unknown> = {}) => ({
  dia: hoy(),
  cupo: 20,
  hasta: 0,
  refrescos: 0,
  castigos: 0,
  enPantalla: false,
  hastaManana: 0,
  ...parcial,
})

/**
 * Deja un estado guardado antes de que corra ningún guion de la página.
 * Solo escribe la primera vez: si no, cada recarga borraría lo que la propia
 * pantalla acaba de apuntar, y la prueba del `+5 s` mediría el sembrado.
 */
async function sembrar(page: Page, valor: unknown) {
  const crudo = JSON.stringify(valor)
  await page.addInitScript(
    ([clave, json]) => {
      if (!sessionStorage.getItem("sembrado")) {
        localStorage.setItem(clave, json)
        sessionStorage.setItem("sembrado", "1")
      }
    },
    [CLAVE, crudo] as const,
  )
}

const guardado = (page: Page) =>
  page.evaluate((clave) => JSON.parse(localStorage.getItem(clave) || "null"), CLAVE)

/** Segundos que quedan según la cuenta atrás escrita en pantalla. */
async function restante(page: Page) {
  const texto = await page.locator("#cuenta").innerText()
  const m = texto.match(/(\d+):(\d+)(?::(\d+))?/)
  if (!m) return NaN
  return m[3] !== undefined
    ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])
    : Number(m[1]) * 60 + Number(m[2])
}

test.describe("El aviso por recargas", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== SOLO_ESCRITORIO,
      "basta con un ancho: se prueba el reloj, no la maqueta",
    )
    await page.goto(PAGINA)
  })

  test("la primera vez abre un minuto con el botón bloqueado", async ({
    page,
  }) => {
    await expect(page.locator("#volver")).toHaveAttribute(
      "aria-disabled",
      "true",
    )
    await expect(page.locator("#cuenta")).toContainText("Puedes volver en")

    const restanteAhora = await restante(page)
    expect(restanteAhora).toBeGreaterThan(55)
    expect(restanteAhora).toBeLessThanOrEqual(60)

    expect((await guardado(page)).enPantalla).toBe(true)

    /* La dirección pasa a ser la de la pantalla para que el siguiente F5
       cargue esto y no la web. Sin esto, el minuto se lo saltaría cualquiera
       recargando. */
    expect(new URL(page.url()).pathname).toBe(PAGINA)
  })

  test("recargar no reinicia la cuenta: le suma cinco segundos", async ({
    page,
  }) => {
    await page.waitForTimeout(1500)
    const antes = await restante(page)

    await page.reload()

    const despues = await restante(page)
    expect(despues).toBeGreaterThanOrEqual(antes + 3)
    expect(despues).toBeLessThanOrEqual(antes + 7)
    expect((await guardado(page)).refrescos).toBe(1)
  })

  test("agotar el cupo en la pantalla pasa a castigo de cinco minutos", async ({
    page,
  }) => {
    await sembrar(
      page,
      estado({ cupo: 2, refrescos: 1, hasta: Date.now() + 30_000, enPantalla: true }),
    )
    await page.reload()

    const restanteAhora = await restante(page)
    expect(restanteAhora).toBeGreaterThan(290)
    expect(restanteAhora).toBeLessThanOrEqual(300)

    const despues = await guardado(page)
    expect(despues.cupo).toBe(1)
    expect(despues.castigos).toBe(1)

    await expect(page.locator("#titulo")).toContainText("Has seguido recargando")
    await expect(page.locator("#nota")).toContainText("1 de 20")
  })

  test("sin cupo no se entra hasta el día siguiente", async ({ page }) => {
    await sembrar(page, estado({ cupo: 0, hastaManana: 0 }))
    await page.reload()

    const cuenta = await page.locator("#cuenta").innerText()
    expect(cuenta).toContain("Se abre en")
    expect(await restante(page)).toBeGreaterThan(3600)
    expect((await guardado(page)).hastaManana).toBeGreaterThan(Date.now())
    await expect(page.locator("#volver")).toHaveAttribute(
      "aria-disabled",
      "true",
    )
  })

  test("cumplido el minuto, el botón se abre solo", async ({ page }) => {
    await sembrar(page, estado({ hasta: Date.now() - 1000, enPantalla: true }))
    await page.reload()

    await expect(page.locator("#volver")).not.toHaveAttribute(
      "aria-disabled",
      "true",
    )
    await expect(page.locator("#titulo")).toContainText("Puedes volver")
  })
})

test.describe("El guardia del resto del sitio", () => {
  test("devuelve a la pantalla mientras dura el castigo", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== SOLO_ESCRITORIO, "basta una vez")

    await sembrar(page, estado({ hasta: Date.now() + 45_000, enPantalla: true }))
    await page.goto("/")

    await expect(page).toHaveURL(new RegExp(`${PAGINA}$`))
    /* Entrar por otra dirección también es una recarga: cuenta y alarga. */
    expect((await guardado(page)).refrescos).toBe(1)
  })

  test("sin castigo, la portada se sirve normal", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== SOLO_ESCRITORIO, "basta una vez")

    await sembrar(page, estado({ hasta: Date.now() - 60_000 }))
    await page.goto("/")

    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator("main#contenido")).toBeVisible()
  })

  test("un estado de ayer no bloquea", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== SOLO_ESCRITORIO, "basta una vez")

    await sembrar(
      page,
      estado({ dia: "2026-1-1", cupo: 0, hastaManana: Date.now() + 3_600_000 }),
    )
    await page.goto("/")

    await expect(page).toHaveURL(/\/$/)
  })
})
