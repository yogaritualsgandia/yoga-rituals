import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Mindfulness",
  description: "Mindfulness en Gandia con Susana Estruch, monitora de Mindfulness MBTB.",
  alternates: { canonical: "/mindfulness" },
}
export default function PaginaMindfulness() {
  return (
    <Pagina
      etiqueta="Actividades"
      titulo="Mindfulness"
      entradilla="Parar la cabeza y volver a lo que está pasando ahora mismo."
    >
      <EnPreparacion pendiente="Falta el texto de la actividad y el formato en que se ofrece (sesiones abiertas, cursos, talleres)." />
    </Pagina>
  )
}