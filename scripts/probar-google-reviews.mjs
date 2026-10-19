import { chromium } from "playwright"

const AUTORES = ["Karly", "Cento", "Ana Carla"]

const navegador = await chromium.launch()
const contexto = await navegador.newContext({
  locale: "es-ES",
  viewport: { width: 1400, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
})

await contexto.addCookies([
  { name: "CONSENT", value: "YES+cb", domain: ".google.com", path: "/" },
  { name: "SOCS", value: "CAESHAgBEhJnd3NfMjAyMzA4MTAtMF9SQzIaAmVzIAEaBgiA_LyaBg", domain: ".google.com", path: "/" },
])

for (const autor of AUTORES) {
  const pagina = await contexto.newPage()
  await pagina.goto(
    "https://www.google.com/maps/place/YOGA+Rituals/@38.9675205,-0.1826086,17z/data=!4m8!3m7!1s0xd61e835e4700001:0x6e2adf5929d2ecd4!8m2!3d38.9675205!4d-0.1826086!9m1!1b1!16s%2Fg%2F11fxx4p1m9?hl=es",
    { waitUntil: "domcontentloaded", timeout: 60000 },
  )
  await pagina.waitForTimeout(6000)

  // Cargar más reseñas para que aparezca la que se busca.
  for (let i = 0; i < 6; i++) {
    await pagina.evaluate(() => {
      const panel =
        document.querySelector('.m6QErb[tabindex="-1"]') ??
        document.querySelector('[role="main"]') ??
        document.body
      panel.scrollBy(0, 1400)
    })
    await pagina.waitForTimeout(700)
    if (await pagina.getByRole("button", { name: new RegExp(`Compartir reseña de ${autor}`, "i") }).count()) break
  }

  const boton = pagina.getByRole("button", { name: new RegExp(`Compartir reseña de ${autor}`, "i") })
  if (!(await boton.count())) {
    console.log(`${autor}: sin botón`)
    await pagina.close()
    continue
  }

  await boton.first().click()
  await pagina.waitForTimeout(1500)

  const copiar = pagina.getByRole("button", { name: /Copy Link|Copiar enlace/i }).first()
  if (await copiar.count()) {
    await copiar.click()
    await pagina.waitForTimeout(1000)
  }

  const valor = await pagina.evaluate(() => navigator.clipboard.readText())
  console.log(`${autor} → ${valor}`)
  await pagina.close()
}

await navegador.close()
