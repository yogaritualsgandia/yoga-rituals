import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal de YOGA Rituals: información del titular de yogarituals.es, el sitio del estudio de yoga en Gandia (Valencia).",
  alternates: { canonical: "/aviso-legal" },
}
export default function PaginaAvisoLegal() {
  return (
    <Pagina
      etiqueta="Legal"
      titulo="Aviso legal"

    >
      <EnPreparacion pendiente="Falta el texto legal, que tiene que redactar o revisar quien lleve la parte legal. Aquí no se copia una plantilla de internet." />
    </Pagina>
  )
}