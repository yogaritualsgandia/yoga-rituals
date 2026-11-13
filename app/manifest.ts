export const dynamic = "force-static"

import type { MetadataRoute } from "next"

/**
 * Manifiesto web.
 *
 * No es una app: es una web. Pero el manifiesto hace dos cosas útiles en móvil
 * —que al añadirla a la pantalla de inicio tenga nombre y color, y que el
 * navegador sepa qué icono usar— y no cuesta nada mantenerlo.
 *
 * `start_url` es la portada y `display: "browser"` a propósito: esto no
 * pretende abrirse sin barra de direcciones, porque no hay ninguna función de
 * app detrás. Declarar `standalone` sería vender algo que no existe.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YOGA Rituals · Estudio de yoga en Gandia",
    short_name: "YOGA Rituals",
    description:
      "Estudio de yoga en el centro de Gandia: Hatha, Vinyasa, Yoga Nidra, mindfulness y yoga oncológico. Horario libre y primera clase gratis.",
    start_url: "/",
    display: "browser",
    background_color: "#F4EFE7",
    theme_color: "#14708F",
    lang: "es",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
