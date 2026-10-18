import type { Metadata } from "next"

import { PaginaDeEstilo } from "@/components/layout/pagina-de-estilo"
import { estilos } from "@/content/clases"
import { fotos } from "@/content/medios"

export const metadata: Metadata = {
  title: "Hatha Yoga en Gandia",
  description:
    "Clases de Hatha Yoga en YOGA Rituals, Gandia: posturas sostenidas con calma, respiración consciente y adaptaciones para cada cuerpo. Horarios libres y primera clase gratis.",
  alternates: { canonical: "/hatha" },
}

/**
 * Hatha.
 *
 * Tiene página propia desde que tiene texto. Antes era una línea en la lista de
 * clases y un aviso de que faltaba la descripción, y eso era lo honesto: no
 * había nada que contar. Ahora lo hay, y con texto viene lo demás —su dirección
 * propia, su enlace desde la portada y su botón de reserva—.
 *
 * El texto está en `content/clases.ts`, entero, y la maquetación en
 * `PaginaDeEstilo`, que es la misma para Vinyasa. Aquí solo se dice cuál es.
 */
export default function PaginaHatha() {
  return (
    <PaginaDeEstilo estilo={estilos.hatha} foto={fotos.esterillaNaranja} />
  )
}
