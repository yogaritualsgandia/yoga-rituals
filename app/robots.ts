export const dynamic = "force-static";

import type { MetadataRoute } from "next"

import { site } from "@/content/site"

/**
 * robots.txt.
 *
 * Deja pasar todo y apunta al mapa del sitio. No hay nada aquí que esconder:
 * esta web quiere que la encuentren.
 *
 * El día que haya una página que no deba salir en Google —un panel, una
 * gracias-por-reservar—, NO se resuelve con un `Disallow` aquí. Un `Disallow`
 * no quita una página de los resultados: solo impide que el robot la lea, así
 * que la página sigue pudiendo aparecer, sin título ni descripción. Lo que hay
 * que ponerle es un `robots: { index: false }` en su propio metadata, que es
 * lo que Google respeta.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
