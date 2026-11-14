/**
 * Loader de Turbopack que vacía un módulo.
 *
 * Se usa una sola vez, para `next/dist/build/polyfills/polyfill-module`: Next lo
 * importa desde su arranque y no hay opción de configuración para quitarlo. El
 * módulo solo rellena funciones que los navegadores de `browserslist` ya traen,
 * así que se sustituye por un módulo vacío. El porqué, en `next.config.ts`.
 */
module.exports = function vaciarModulo() {
  this.cacheable?.(true)
  return "module.exports = {};"
}
