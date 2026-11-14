/**
 * Loader de Turbopack que vacía un módulo.
 *
 * Se usa para `polyfill-module` y `polyfill-nomodule`: Next los importa desde su
 * arranque y no hay opción de configuración para quitarlos. Solo rellenan
 * funciones que los navegadores de `browserslist` ya traen, así que se
 * sustituyen por un módulo vacío. El porqué, en `next.config.ts`.
 */
module.exports = function vaciarModulo() {
  this.cacheable?.(true)
  return "module.exports = {};"
}
