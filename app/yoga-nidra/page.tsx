import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Yoga Nidra",
  description: "Yoga Nidra en Gandia: práctica guiada para descansar y dormir mejor.",
  alternates: { canonical: "/yoga-nidra" },
}
export default function PaginaYogaNidra() {
  return (
    <Pagina
      etiqueta="Actividades"
      titulo="Yoga Nidra"
      entradilla="Una práctica guiada tumbada, para soltar el cuerpo y dormir mejor."
    >
      <EnPreparacion pendiente="Falta el texto de la actividad: en qué consiste la sesión y cada cuánto se hace." />
    </Pagina>
  )
}