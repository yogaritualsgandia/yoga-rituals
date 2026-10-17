import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Respiración",
  description: "Breathwork (trabajo de respiración) en Gandia, con formación Inbreath.",
  alternates: { canonical: "/breathwork" },
}
export default function PaginaBreathwork() {
  return (
    <Pagina
      etiqueta="Actividades"
      titulo="Respiración"
      entradilla="El eje de todo lo que se hace en el estudio."
    >
      <EnPreparacion pendiente="Falta el texto de la actividad y si se ofrece como sesión suelta o como curso." />
    </Pagina>
  )
}