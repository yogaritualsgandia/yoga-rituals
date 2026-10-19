import { readFileSync } from "node:fs"
import { join } from "node:path"

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { REDIRECCIONES_ANTIGUAS } from "../next.config"
import { abrirMenu, esperarAlMovimiento } from "./apoyo"

/** Rutas que tiene que haber en pie al final de la Fase 2. */
const RUTAS = [
  "/",
  "/clases",
  "/hatha",
  "/vinyasa",
  "/mindfulness",
  "/yoga-nidra",
  "/breathwork",
  "/yoga-oncologico",
  "/retiros",
  "/talleres-centros-educativos",
  "/horarios",
  "/precios",
  "/primera-vez",
  "/sobre-mi",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
]

/**
 * Las que se revisan con axe.
 *
 * Al principio eran cuatro: la portada y las tres que tienen tablas o listas
 * largas, con la idea de que el resto dan el mismo pie y la misma cabecera. Se
 * quedó corto: en cuanto cinco de esas «otras» dejaron de ser plantillas y
 * pasaron a tener texto de verdad, con listas, cifras, citas y fotos, la
 * accesibilidad dejó de estar cubierta por el pie. Ahora están todas las que
 * tienen contenido propio.
 */
const RUTAS_CON_AXE = [
  "/",
  "/horarios",
  "/precios",
  "/primera-vez",
  "/clases",
  "/hatha",
  "/vinyasa",
  "/yoga-nidra",
  "/breathwork",
  "/mindfulness",
  "/yoga-oncologico",
  "/retiros",
  "/talleres-centros-educativos",
  "/sobre-mi",
]

function recogerErrores(page: Page) {
  const errores: string[] = []
  page.on("console", (mensaje) => {
    if (mensaje.type() === "error") errores.push(mensaje.text())
  })
  page.on("pageerror", (error) => errores.push(error.message))
  return errores
}

/**
 * Navega y espera a que la página esté de verdad pintada.
 *
 * En desarrollo la primera visita a una ruta la compila al vuelo: si se mide
 * sin esperar, se mide una hoja de estilos a medias y cualquier test de
 * geometría (desbordes, tamaños táctiles) falla sin que nada esté mal. Por eso
 * se espera al contenido, a las tipografías y a un fotograma completo.
 */
async function irA(page: Page, ruta: string) {
  // Se espera a `domcontentloaded` y no a `load`: en producción `load` espera
  // a que bajen todas las imágenes, y aquí no se está midiendo eso.
  await page.goto(ruta, { waitUntil: "domcontentloaded" })
  await page.locator("main#contenido").waitFor({ state: "visible" })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () =>
      new Promise<void>((listo) =>
        requestAnimationFrame(() => requestAnimationFrame(() => listo())),
      ),
  )

  /* Y se espera a que pare lo que se mueve. Medir a media entrada da
     resultados que no son los de la web: un contraste que todavía no es el
     suyo, una altura que todavía no es la suya. */
  await esperarAlMovimiento(page)
}

/* ── Que exista todo, y que exista bien ─────────────────────────────────── */

test.describe("Todas las rutas", () => {
  /* Estas tres pruebas recorren las diecisiete páginas una detrás de otra, y
     cada una espera —a propósito— a que se pinten las tipografías, a un
     fotograma completo y a que pare la entrada de página. Es trabajo honesto, y
     por eso son las más lentas de la suite: en el ancho de 1920 llegaban a los
     sesenta segundos y se quedaban a medias sin que hubiera nada mal. Se les da
     el doble, que es lo mismo que se hace con las capturas y por el mismo
     motivo: son un repaso, no una alarma. */
  test.describe.configure({ timeout: 120_000 })

  test("existe y tiene un solo h1", async ({ page }) => {
    const errores = recogerErrores(page)

    for (const ruta of RUTAS) {
      await irA(page, ruta)
      await expect(page.locator("h1"), `h1 en ${ruta}`).toHaveCount(1)
      await expect(page.locator("main#contenido"), `main en ${ruta}`).toBeVisible()
    }

    expect(errores, "errores de consola").toEqual([])
  })

  test("el documento está en español y tiene título y descripción", async ({
    page,
  }) => {
    for (const ruta of RUTAS) {
      await irA(page, ruta)
      await expect(page.locator("html")).toHaveAttribute("lang", "es")

      const titulo = await page.title()
      expect(titulo.length, `título en ${ruta}`).toBeGreaterThan(10)

      const descripcion = await page
        .locator('meta[name="description"]')
        .getAttribute("content")
      expect(descripcion?.length ?? 0, `descripción en ${ruta}`).toBeGreaterThan(
        40,
      )
    }
  })

  test("no hay desbordamiento horizontal", async ({ page }) => {
    for (const ruta of RUTAS) {
      await irA(page, ruta)
      const desborde = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(desborde, `desborde en ${ruta}`).toBeLessThanOrEqual(1)
    }
  })
})

/* ── Accesibilidad ──────────────────────────────────────────────────────── */

test.describe("Accesibilidad", () => {
  for (const ruta of RUTAS_CON_AXE) {
    test(`${ruta} sin violaciones graves`, async ({ page }) => {
      await irA(page, ruta)
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

      const graves = violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      )

      expect(
        graves.map((v) => `${v.id} · ${v.help} · ${v.nodes.length} nodo(s)`),
      ).toEqual([])
    })
  }

  test("el primer elemento enfocable es «Saltar al contenido» y se ve al enfocarlo", async ({
    page,
  }) => {
    await irA(page, "/")

    const salto = page.locator("a.salto-contenido")

    // Sin enfocar no se ve, y eso no es un detalle: si se viera siempre,
    // taparía el principio de la página. Aparece con el teclado y solo con el
    // teclado, así que se comprueban las dos mitades.
    await expect(salto).not.toBeInViewport()

    await page.keyboard.press("Tab")
    await expect(salto).toBeFocused()
    await expect(salto).toBeInViewport()

    const caja = await salto.boundingBox()
    expect(caja, "el enlace tiene que ser visible al enfocarlo").not.toBeNull()
    expect(caja!.y).toBeGreaterThanOrEqual(0)
  })

  test("se puede llegar al contenido y a la reserva solo con el teclado", async ({
    page,
  }) => {
    await irA(page, "/")
    await page.keyboard.press("Tab")
    await expect(page.locator("a.salto-contenido")).toBeFocused()
    await page.keyboard.press("Enter")

    await expect(page.locator("main#contenido")).toBeInViewport()

    const enlaces = page.getByRole("link", { name: /Reserva tu clase de prueba/ })
    await expect(enlaces.first()).toBeVisible()
  })

  test("los controles táctiles miden 44 px como mínimo", async ({ page }) => {
    await irA(page, "/")

    const controles = page.locator(
      'button:visible, [data-slot="button"]:visible, a[data-slot="button"]:visible',
    )
    const cuantos = await controles.count()
    expect(cuantos, "tiene que haber controles que medir").toBeGreaterThan(2)

    const pequeños: string[] = []
    for (let i = 0; i < cuantos; i++) {
      const control = controles.nth(i)
      const caja = await control.boundingBox()
      if (!caja) continue
      if (caja.height < 44 - 0.5 || caja.width < 44 - 0.5) {
        const texto = ((await control.textContent()) ?? "").trim().slice(0, 30)
        const etiqueta = await control.evaluate(
          (el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`,
        )
        pequeños.push(
          `«${texto || "(sin texto)"}» ${Math.round(caja.width)}x${Math.round(caja.height)} — ${etiqueta}`,
        )
      }
    }

    expect(pequeños).toEqual([])
  })
})

/* ── Cabecera, pie y acción fija ────────────────────────────────────────── */

test.describe("Estructura", () => {
  test("la cabecera lleva al inicio y el pie no cita a nadie", async ({
    page,
  }) => {
    await irA(page, "/")

    await expect(
      page.getByRole("link", { name: "YOGA Rituals, ir al inicio" }).first(),
    ).toBeVisible()

    /* El pie llevó durante un tiempo un crédito a Skiper UI, porque el
       subrayado que crece de los enlaces salía de uno de sus componentes
       gratuitos y su licencia pide citarlos. Ya no sale de ahí: el componente
       se borró y el subrayado está escrito en casa, así que la obligación
       tampoco existe y el crédito se ha ido con ella.

       Esta prueba lo vigila a propósito, y en la dirección incómoda, porque es
       justo la clase de línea que vuelve sola: alguien copia un componente,
       pega también su comentario de atribución y nadie se entera. */
    await expect(page.getByRole("link", { name: /Skiper/i })).toHaveCount(0)
  })

  test("todos los enlaces internos del pie responden", async ({ page }) => {
    await irA(page, "/")

    const destinos = await page
      .locator('footer a[href^="/"]')
      .evaluateAll((enlaces) =>
        [...new Set(enlaces.map((e) => (e as HTMLAnchorElement).getAttribute("href")!))],
      )

    // Cuatro: el logotipo y los tres textos legales. El pie tuvo trece
    // mientras fue un mapa del sitio, y ya no lo es; la página de contacto
    // también se quitó, porque el contacto vive en el propio pie.
    expect(destinos.length, "el pie tiene que enlazar a algún sitio").toBeGreaterThan(3)

    for (const destino of destinos) {
      const respuesta = await page.request.get(destino)
      expect(respuesta.status(), `${destino}`).toBe(200)
    }
  })

  test("la dirección y el teléfono están como texto real", async ({ page }) => {
    await irA(page, "/")

    const pie = page.locator("footer")
    await expect(pie).toContainText("Sant Francesc de Borja")
    await expect(pie).toContainText("46701")
    await expect(pie).toContainText("Gandia")
    await expect(pie.getByRole("link", { name: /656 18 77 61/ })).toHaveAttribute(
      "href",
      "tel:+34656187761",
    )
  })

  test("hay datos estructurados del negocio con la dirección y el horario", async ({
    page,
  }) => {
    await irA(page, "/")

    const crudo = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent()
    expect(crudo).toBeTruthy()

    const datos = JSON.parse(crudo!)
    expect(datos["@type"]).toBe("HealthAndBeautyBusiness")
    expect(datos.address.addressLocality).toBe("Gandia")
    expect(datos.telephone).toBe("+34656187761")
    expect(datos.openingHoursSpecification.length).toBe(9)
    expect(datos.foundingDate).toBe("2017-03-01")
  })
})

/* ── Contenido real en el DOM ───────────────────────────────────────────── */

test.describe("Contenido real", () => {
  test("el horario está como texto, no como imagen", async ({ page }) => {
    await irA(page, "/horarios")

    const tabla = page.getByRole("table")
    await expect(tabla).toBeVisible()
    await expect(tabla).toContainText("Lunes")
    await expect(tabla).toContainText("19:00")
    await expect(tabla).toContainText("20:15")
    await expect(tabla).toContainText("09:10")
    await expect(tabla).toContainText("Cerrado")
    await expect(page.getByRole("table")).toContainText("exprés")
  })

  test("los precios están como texto", async ({ page }) => {
    await irA(page, "/precios")

    const tabla = page.getByRole("table")
    await expect(tabla).toContainText("40 €")
    await expect(tabla).toContainText("105 €")
    await expect(tabla).toContainText("60 €")
    await expect(tabla).toContainText("165 €")
    await expect(tabla).toContainText("70 €")
    await expect(tabla).toContainText("195 €")

    await expect(page.locator("main")).toContainText("65 €")
    await expect(page.locator("main")).toContainText("15 €")
    await expect(page.locator("main")).toContainText("prueba")
  })
})

/* ── Móvil ──────────────────────────────────────────────────────────────── */

test.describe("Móvil", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, "solo móvil y tablet")

  test("la barra fija aparece al bajar y lleva a la reserva", async ({ page }) => {
    await irA(page, "/")

    const barra = page.locator("[data-accion-fija]")
    await expect(barra).toBeAttached()

    // Aparece al bajar, no de entrada: tapar la portada con una barra antes de
    // que nadie haya leído nada es empezar pidiendo. Escondida quiere decir
    // empujada por debajo del borde de abajo, no «borrada».
    const alto = await page.evaluate(() => window.innerHeight)
    expect((await barra.boundingBox())!.y).toBeGreaterThan(alto)

    await page.evaluate(() => window.scrollTo(0, 1200))
    await expect
      .poll(async () => (await barra.boundingBox())!.y)
      .toBeLessThan(alto)

    /* Y lleva a la reserva de verdad: a WhatsApp, en otra pestaña. El segundo
       botón de la barra es el teléfono, no otro WhatsApp. */
    const reserva = barra.getByRole("link", { name: "Reserva tu clase de prueba" })
    await expect(reserva).toHaveAttribute("href", /^https:\/\/wa\.me\/34656187761/)
    await expect(reserva).toHaveAttribute("target", "_blank")

    await expect(
      barra.getByRole("link", { name: /Llamar al estudio/ }),
    ).toHaveAttribute("href", "tel:+34656187761")
  })

  test("el menú se abre, atrapa el foco y se cierra con Escape", async ({ page }) => {
    await irA(page, "/")

    await abrirMenu(page)

    const dialogo = page.getByRole("dialog")
    await expect(dialogo).toBeVisible()
    await expect(
      dialogo.getByRole("link", { name: "Horarios" }),
    ).toBeVisible()

    // El foco tiene que estar dentro del diálogo, no detrás.
    const focoDentro = await page.evaluate(() =>
      !!document.activeElement?.closest('[role="dialog"]'),
    )
    expect(focoDentro, "el foco se queda dentro del menú").toBe(true)

    await page.keyboard.press("Escape")
    await expect(dialogo).toBeHidden()
  })

  test("todos los enlaces del menú son alcanzables", async ({ page }) => {
    await irA(page, "/")
    await abrirMenu(page)

    const ultimo = page
      .getByRole("dialog")
      .getByRole("link", { name: "Sobre mí" })
      .last()

    // El panel se desplaza. Lo que no cabe tiene que poder alcanzarse, no
    // quedarse cortado detrás del bloque de la reserva.
    await ultimo.scrollIntoViewIfNeeded()
    await expect(ultimo).toBeInViewport()
  })

  test("el menú se cierra y navega al elegir una sección", async ({ page }) => {
    await irA(page, "/")
    await abrirMenu(page)
    await page.getByRole("dialog").getByRole("link", { name: "Horarios" }).click()

    await expect(page).toHaveURL(/\/horarios$/)
    await expect(page.getByRole("dialog")).toBeHidden()
  })
})

/* ── Preguntas frecuentes ───────────────────────────────────────────────── */

test.describe("Preguntas frecuentes", () => {
  test("el acordeón se abre y se cierra con el teclado", async ({ page }) => {
    await irA(page, "/primera-vez")

    const pregunta = page.getByRole("button", {
      name: "No soy flexible, ¿puedo hacer yoga?",
    })

    await expect(pregunta).toHaveAttribute("aria-expanded", "false")

    // Con el teclado, no con el ratón: es la forma en la que se rompe un
    // acordeón cuando alguien le pone `outline-none` al botón.
    await pregunta.focus()
    await page.keyboard.press("Enter")

    await expect(pregunta).toHaveAttribute("aria-expanded", "true")
    await expect(
      page.getByText("La flexibilidad llega con la práctica"),
    ).toBeVisible()
  })
})

/* ── Imagen para compartir ──────────────────────────────────────────────── */

test.describe("Imagen para compartir", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) !== 1440,
    "solo hace falta una vez",
  )

  test("el enlace lleva imagen y la imagen existe de verdad", async ({
    page,
    request,
  }) => {
    await irA(page, "/")

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /compartir\.png/,
    )

    // Que la etiqueta esté no significa que el archivo esté. Una ruta mal
    // escrita deja la vista previa sin imagen durante meses sin que nadie se
    // entere, así que se pide de verdad y se comprueba que es un PNG con
    // contenido.
    const respuesta = await request.get("/compartir.png")
    expect(respuesta.status()).toBe(200)
    expect(respuesta.headers()["content-type"]).toContain("image/png")
    expect((await respuesta.body()).byteLength).toBeGreaterThan(20_000)
  })
})

/* ── Buscadores ─────────────────────────────────────────────────────────── */

test.describe("Buscadores", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) !== 1440,
    "solo hace falta una vez",
  )

  test("el mapa del sitio lleva todas las páginas", async ({ request }) => {
    const respuesta = await request.get("/sitemap.xml")
    expect(respuesta.status()).toBe(200)

    const mapa = await respuesta.text()

    for (const ruta of RUTAS) {
      expect(mapa, `falta ${ruta} en el mapa del sitio`).toContain(
        `<loc>https://yogarituals.es${ruta}</loc>`,
      )
    }
  })

  test("robots.txt deja pasar y apunta al mapa", async ({ request }) => {
    const respuesta = await request.get("/robots.txt")
    expect(respuesta.status()).toBe(200)

    const texto = await respuesta.text()

    expect(texto).toMatch(/^Allow: \/$/m)
    expect(texto).toMatch(/sitemap: https:\/\/yogarituals\.es\/sitemap\.xml/i)
  })

  /*
   * Un canonical mal puesto no da ningún error visible: la página se ve
   * perfecta y, por debajo, le está diciendo a Google que es una copia de
   * otra. Basta con que una página nueva se olvide de declarar el suyo para
   * heredar el de la portada —el del `layout`— y desaparecer del índice sin
   * que nadie se entere. Por eso se comprueba una a una.
   */
  test("cada página se declara a sí misma como la buena", async ({
    request,
  }) => {
    for (const ruta of RUTAS) {
      const respuesta = await request.get(ruta)
      expect(respuesta.status(), `${ruta} tendría que existir`).toBe(200)

      const html = await respuesta.text()
      const canonical = html.match(
        /<link rel="canonical" href="([^"]+)"/,
      )?.[1]

      // La portada no lleva barra final: `https://yogarituals.es` y
      // `https://yogarituals.es/` son la misma dirección, y Next resuelve la
      // raíz a la forma corta.
      const esperado =
        ruta === "/" ? "https://yogarituals.es" : `https://yogarituals.es${ruta}`

      expect(canonical, `${ruta} no declara cuál es su dirección buena`).toBe(
        esperado,
      )
    }
  })

  /*
   * Las redirecciones de verdad, no la lista.
   *
   * Se prueban las dos formas, con barra final y sin ella, porque son dos
   * peticiones distintas y cualquiera de las dos puede ser la que alguien
   * tenga guardada en favoritos desde hace años.
   *
   * La comprobación que importa es la primera: siguiendo todos los saltos se
   * llega a la página nueva. Da igual cuántos saltos dé por el camino; lo que
   * no puede pasar es que no se llegue, o que se llegue a un 404. Redirigir a
   * una página que no está es peor que no redirigir, porque el buscador sigue
   * el 301 y se encuentra un 404, y encima da el aviso por bueno.
   */
  test("las direcciones de la web antigua acaban donde tienen que acabar", async ({
    request,
  }) => {
    for (const { desde, hacia } of REDIRECCIONES_ANTIGUAS) {
      for (const forma of [desde, `${desde}/`]) {
        const final = await request.get(forma)

        expect(final.status(), `${forma} tendría que acabar en una página`).toBe(
          200,
        )
        expect(
          new URL(final.url()).pathname,
          `${forma} tendría que acabar en ${hacia}`,
        ).toBe(hacia)
      }

      // Y el primer salto es un 301. No un 302: un 302 dice «esto es
      // temporal», así que el buscador no traslada nada a la dirección nueva
      // y la antigua se queda en el índice. El 301 sí traslada.
      const primero = await request.get(desde, { maxRedirects: 0 })
      expect(primero.status(), `${desde} tendría que ser un 301`).toBe(301)
      expect(primero.headers()["location"] ?? "").toContain(hacia)
    }
  })

  /*
   * La lista y el archivo que de verdad se publica.
   *
   * Con `output: "export"` las redirecciones de `next.config.ts` no las aplica
   * nadie: el servidor de Netlify solo lee `_redirects` de la carpeta que se
   * publica. Tener la lista en la configuración daba la falsa impresión de que
   * estaba resuelto, y las direcciones viejas devolvían 404. Ahora la fuente es
   * `public/_redirects` y esta prueba impide que las dos se separen.
   */
  test("la lista de redirecciones y public/_redirects dicen lo mismo", () => {
    const texto = readFileSync(join(process.cwd(), "public", "_redirects"), "utf8")
    const lineas = texto
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter((linea) => linea && !linea.startsWith("#"))

    for (const { desde, hacia } of REDIRECCIONES_ANTIGUAS) {
      const regla = lineas.find((linea) => linea.split(/\s+/)[0] === desde)
      expect(regla, `${desde} falta en public/_redirects`).toBeTruthy()

      const [, destino, estado] = regla!.split(/\s+/)
      expect(destino, `${desde} apunta a otro sitio`).toBe(hacia)
      expect(estado, `${desde} tiene que ser un 301`).toBe("301")
    }
  })
})

/* ── Tema ───────────────────────────────────────────────────────────────── */

test.describe("Tema", () => {
  // El tema es de toda la web, no de un ancho: basta con mirarlo una vez.
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) !== 1440,
    "solo hace falta una vez",
  )

  test("el botón cambia el tema y dice a dónde va", async ({ page }) => {
    await irA(page, "/")

    // De entrada, claro: el navegador de las pruebas no pide oscuro.
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/)

    await page.getByRole("button", { name: "Cambiar a modo oscuro" }).click()

    await expect(page.locator("html")).toHaveClass(/\bdark\b/)
    // El nombre accesible anuncia a dónde lleva el botón, no dónde está el
    // tema: quien lo lee con lector de pantalla sabe qué consigue al pulsarlo.
    await expect(
      page.getByRole("button", { name: "Cambiar a modo claro" }),
    ).toBeVisible()

    await page.getByRole("button", { name: "Cambiar a modo claro" }).click()
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/)
  })
})

/* ── Menos movimiento ───────────────────────────────────────────────────── */

test.describe("Menos movimiento", () => {
  test("la animación de entrada de la barra fija queda desactivada", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "reduced-motion",
      "solo en el proyecto de movimiento reducido",
    )

    await irA(page, "/")
    await page.evaluate(() => window.scrollTo(0, 1200))

    const barra = page.locator("[data-accion-fija]")

    const duracion = await barra.evaluate(
      (el) => getComputedStyle(el as HTMLElement).transitionDuration,
    )

    // Chrome devuelve las duraciones en segundos, y la salvaguarda global deja
    // las transiciones en 0.01ms — que es 0.00001s. Se comprueba el valor, no
    // cómo esté escrito, para no atarse a la notación que elija el navegador.
    const segundos = duracion
      .split(",")
      .map((parte) => Number.parseFloat(parte))
      .filter((valor) => Number.isFinite(valor))

    expect(segundos.length).toBeGreaterThan(0)
    expect(Math.max(...segundos)).toBeLessThan(0.05)
  })
})

/* ── Fotografías provisionales ──────────────────────────────────────────── */

test.describe("Imágenes", () => {
  test("ninguna imagen se queda sin texto alternativo", async ({ page }) => {
    await irA(page, "/")

    const sinAlt = await page.locator("img").evaluateAll((imagenes) =>
      imagenes
        .filter((imagen) => imagen.getAttribute("alt") === null)
        .map((imagen) => (imagen as HTMLImageElement).currentSrc || "sin src"),
    )

    expect(sinAlt).toEqual([])
  })
})

/* ── La página que no existe ────────────────────────────────────────────── */

test.describe("Página no encontrada", () => {
  test("una dirección que no existe da un 404 y se puede volver", async ({
    page,
  }) => {
    const respuesta = await page.goto("/esta-direccion-no-existe", {
      waitUntil: "domcontentloaded",
    })

    /* Un 404 de verdad y no un 200 con la cara de un 404: es lo que hace que
       el buscador saque la dirección de su índice en lugar de guardarla como
       una página buena. */
    expect(respuesta?.status()).toBe(404)

    await expect(page.locator("h1")).toHaveText(
      "No se ha podido encontrar la página.",
    )

    /* El número grande va marcado como decorativo a propósito: quien oye la
       página ya sabe qué ha pasado con el titular, y anunciar «cuatrocientos
       cuatro» detrás solo alarga el anuncio. */
    await expect(page.locator('p[aria-hidden="true"]')).toHaveText("404")

    /* Y un 404 no se indexa. La página lleva dos etiquetas de robots: la que
       declara el armazón para todas y la que añade Next para este caso. Se
       busca la que decide, no la primera: cuando hay dos, el buscador se queda
       con la más restrictiva, y la restrictiva es esta. */
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1)

    await page.getByRole("link", { name: "Volver al inicio" }).click()
    await expect(page).toHaveURL("/")
    await expect(page.locator("h1")).toBeVisible()
  })
})
