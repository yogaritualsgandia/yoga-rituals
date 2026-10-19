import type { Metadata } from "next"

import { site } from "@/content/site"

/**
 * Los metadatos de una página, de una vez.
 *
 * Existe por un fallo concreto que se vio en el HTML exportado: cada página
 * declaraba su `title` y su `description`, pero NO su `openGraph`. Next mezcla
 * los metadatos del layout con los de la página, y en ese reparto lo que la
 * página no dice se queda con lo del layout. Resultado: al compartir /precios
 * por WhatsApp salía el titular de la portada y, peor, `og:url` apuntaba
 * siempre a https://yogarituals.es. Cualquier enlace compartido se convertía
 * en un enlace a la portada.
 *
 * La solución no es copiar seis campos en dieciséis archivos —ahí es cuestión
 * de tiempo que uno se quede atrás—, sino que los seis salgan de los tres
 * datos que de verdad cambian: el título, la descripción y la ruta.
 *
 * El título completo se compone aquí con el mismo separador que la plantilla
 * del layout, porque `openGraph.title` NO pasa por la plantilla: si se dejara
 * el título corto, la tarjeta de WhatsApp diría «Precios» y nada más.
 */
export function metadatosDePagina({
  titulo,
  descripcion,
  ruta,
}: {
  /** Título corto, sin la marca. El layout le añade «· YOGA Rituals». */
  titulo: string
  descripcion: string
  /** Ruta absoluta dentro del sitio, con barra inicial. */
  ruta: string
}): Metadata {
  const tituloCompleto = `${titulo} · ${site.nombre}`
  const imagen = {
    url: "/compartir.png",
    width: 1200,
    height: 630,
    alt: "YOGA Rituals, estudio de yoga en Gandia",
  }

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: ruta,
      siteName: site.nombre,
      title: tituloCompleto,
      description: descripcion,
      images: [imagen],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: descripcion,
      images: [imagen.url],
    },
  }
}
