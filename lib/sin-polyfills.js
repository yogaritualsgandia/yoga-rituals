/**
 * Los polyfills que Next mete en el paquete del cliente.
 *
 * Next importa `next/dist/build/polyfills/polyfill-module` desde su arranque y
 * ese archivo rellena `Array.prototype.at`, `flat`, `flatMap`,
 * `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimStart/trimEnd` y
 * `URL.canParse`. Los navegadores que declara `browserslist` en `package.json`
 * —Chrome, Edge y Firefox 111, Safari 16.4— ya traen todos menos
 * `URL.canParse`, que no se usa en la web.
 *
 * Este archivo vacío sustituye al de Next con `turbopack.resolveAlias`. Si algún
 * día se usa `URL.canParse` o se baja el suelo de navegadores, hay que quitar el
 * alias de `next.config.ts` y volver a dejar que Next inyecte su archivo.
 */
export {}
