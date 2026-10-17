import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright se ejecuta al cierre de cada fase.
 *
 * Se prueba contra el BUILD DE PRODUCCIÓN, no contra el servidor de
 * desarrollo. Tres motivos, y los tres importan:
 *
 *  1. El servidor de desarrollo compila cada ruta la primera vez que se pide.
 *     Con 130 pruebas y varios procesos a la vez, eso provoca esperas de 30
 *     segundos que no tienen nada que ver con la web y hacen fallar pruebas
 *     que estaban bien.
 *
 *  2. El servidor de desarrollo inyecta su propio indicador en la esquina, que
 *     es un botón de 32×32 sin texto. Al medir los tamaños táctiles, ese botón
 *     aparecía como un problema de la web cuando no lo era.
 *
 *  3. Es el artefacto que se publica. Si algo va mal solo en producción, aquí
 *     es donde tiene que salir.
 *
 * El puerto es 3100 para no chocar con un `npm run dev` que esté abierto.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "movil-375",
      use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } },
    },
    {
      name: "tablet-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "escritorio-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "ancho-1920",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
    },
    {
      /* El mismo escritorio, pero pidiendo menos movimiento: aquí el 3D
         tiene que apagarse y quedar la versión estática. */
      name: "reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],

  webServer: {
    command: "npm run build && npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 240_000,
  },
})
