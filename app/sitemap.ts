import type { MetadataRoute } from "next"

import { site } from "@/content/site"

/**
 * Mapa del sitio.
 *
 * Va escrito a mano, y no sacado del menú, porque son dos listas distintas: el
 * menú responde a cómo se navega la web, y esto responde a qué páginas existen
 * y merecen salir en Google. Derivar una de la otra da siempre una de las dos
 * mal.
 *
 * Lo que NO lleva, y por qué:
 *
 *  · `priority` y `changeFrequency`. Google las ignora desde hace años. Poner
 *    un 0.8 en la portada no la sube, y mantenerlas actualizadas es trabajo
 *    para nada.
 *
 *  · `lastModified`. Next lo rellenaría con la fecha del build, así que cada
 *    despliegue le diría a Google que las diecisiete páginas han cambiado,
 *    aunque solo se haya tocado una. Decir una fecha falsa es peor que no
 *    decir ninguna.
 *
 * Lo único que sí lleva es la dirección de cada página, que es lo único que
 * hace falta de verdad.
 */
const RUTAS = [
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
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS.map((ruta) => ({ url: `${site.url}${ruta}` }))
}
