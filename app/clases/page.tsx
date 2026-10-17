import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Hatha, Vinyasa y Yoga Nidra",
  description: "Clases de Hatha, Vinyasa y Yoga Nidra en Gandia, con horarios libres y sin reserva previa.",
  alternates: { canonical: "/clases" },
}
export default function PaginaClases() {
  return (
    <Pagina
      etiqueta="Clases"
      titulo="Hatha, Vinyasa y Yoga Nidra"
      entradilla="Tres formas de practicar, todas con horarios libres: vienes el día que puedes."
    >
      <EnPreparacion pendiente="Falta la descripción de cada estilo: qué se hace en una clase de Hatha, en una de Vinyasa y en una de Yoga Nidra, contado por Susana." />
    </Pagina>
  )
}