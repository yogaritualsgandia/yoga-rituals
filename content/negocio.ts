/**
 * Punto único de importación para los datos de negocio.
 *
 * No duplica nada: reexporta lo que ya vive en `site.ts`, `horario.ts`,
 * `precios.ts` y `clases.ts`. Existe para que el marcado estructurado y los
 * generadores de build no tengan que recordar en qué archivo está cada dato.
 *
 * Las rutas de las páginas están en `rutas.ts`, y las preguntas frecuentes en
 * `faqs.ts`. Los scripts de `scripts/` importan los `.ts` directamente porque
 * Node necesita la extensión explícita; esta capa es para el código de Next.
 */

export * from "./site"
export * from "./horario"
export * from "./precios"
export * from "./clases"
