import { chromium } from "playwright"

const rutas = [
  "/",
  "/clases",
  "/hatha",
  "/vinyasa",
  "/horarios",
  "/precios",
  "/primera-vez",
  "/sobre-mi",
  "/mindfulness",
  "/yoga-nidra",
  "/breathwork",
  "/yoga-oncologico",
  "/retiros",
  "/talleres-centros-educativos",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/esta-no-existe",
]

;(async () => {
  const navegador = await chromium.launch()
  let fallos = 0

  for (const ruta of rutas) {
    /* La página que no existe se visita a propósito para comprobar que da un
       404 de verdad. Su 404 y el aviso de consola del navegador —«Failed to
       load resource»— son el resultado esperado, no un fallo: si se contaran,
       la comprobación nunca podría pasar. */
    const espera404 = ruta === "/esta-no-existe"

    const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } })
    const pagina = await contexto.newPage()
    const errores = []
    const rotas = []

    pagina.on("console", (m) => {
      if (m.type() !== "error") return
      if (espera404 && m.text().includes("Failed to load resource")) return
      errores.push(m.text())
    })
    pagina.on("pageerror", (e) => errores.push("pageerror: " + e.message))
    pagina.on("response", (r) => {
      if (r.status() < 400) return
      if (espera404 && r.status() === 404) return
      rotas.push(`${r.status()} ${r.url()}`)
    })

    const respuesta = await pagina.goto(`http://localhost:3100${ruta}`, {
      waitUntil: "networkidle",
    })

    await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await pagina.waitForTimeout(600)

    const estado = respuesta?.status()
    const okEstado = ruta === "/esta-no-existe" ? estado === 404 : estado === 200
    const ok = okEstado && errores.length === 0 && rotas.length === 0
    if (!ok) fallos++

    console.log(
      `${ok ? "OK " : "MAL"} ${ruta.padEnd(32)} ${estado}` +
        (errores.length ? `\n     consola: ${errores.join(" | ")}` : "") +
        (rotas.length ? `\n     respuestas: ${rotas.join(" | ")}` : ""),
    )

    await contexto.close()
  }

  await navegador.close()
  console.log(`\n${fallos} pÃ¡gina(s) con problemas`)
  process.exit(fallos ? 1 : 0)
})()

