import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Susana Estruch Espinós",
  description: "Susana Estruch Espinós, directora de YOGA Rituals en Gandia. Formación, trayectoria y por qué abrió el estudio en 2017.",
  alternates: { canonical: "/sobre-mi" },
}
export default function PaginaSobreMi() {
  return (
    <Pagina
      etiqueta="Sobre mí"
      titulo="Susana Estruch Espinós"
      entradilla="Empecé con yoga por el dolor de espalda de una escoliosis. Sigo aquí."
    >
      <EnPreparacion pendiente="Falta montar la biografía con la formación real (profesora de yoga por AIPYS Madrid en 2005, Yoga Restaurativo, Yoga Nidra, Yoga Oncológico, Mindfulness MBTB, Breathwork Inbreath, Educadora de Masaje Infantil por AEMI, Reflexología podal) y la foto de Susana." />
    </Pagina>
  )
}