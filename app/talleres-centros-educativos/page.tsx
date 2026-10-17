import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Talleres en centros educativos",
  description: "Talleres de yoga, mindfulness y relajación en colegios e institutos de Gandia y La Safor. Más de 500 talleres realizados.",
  alternates: { canonical: "/talleres-centros-educativos" },
}
export default function PaginaTalleresCentrosEducativos() {
  return (
    <Pagina
      etiqueta="Fuera del estudio"
      titulo="Talleres en centros educativos"
      entradilla="Más de 500 talleres hechos en colegios e institutos desde 2017."
    >
      <EnPreparacion pendiente="Falta el detalle de cada taller (posturas, mindfulness y Yoga Nidra), su duración y cómo se pide uno para un centro." />
    </Pagina>
  )
}