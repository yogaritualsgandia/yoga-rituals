import type { Metadata } from "next"

import { PaginaDeEstilo } from "@/components/layout/pagina-de-estilo"
import { estilos } from "@/content/clases"
import { fotos } from "@/content/medios"

export const metadata: Metadata = {
  title: "Vinyasa Yoga en Gandia",
  description:
    "Clases de Vinyasa Yoga en YOGA Rituals, Gandia: secuencias fluidas que enlazan postura y respiración, con opciones para ajustar la intensidad. Horarios libres y primera clase gratis.",
  alternates: { canonical: "/vinyasa" },
}

/**
 * Vinyasa.
 *
 * La hermana de /hatha: mismo texto por bloques, misma maquetación, mismo botón.
 * Se cuentan igual a propósito, porque quien llega a una de las dos suele venir
 * decidiendo entre las dos.
 */
export default function PaginaVinyasa() {
  return <PaginaDeEstilo estilo={estilos.vinyasa} foto={fotos.material} />
}
