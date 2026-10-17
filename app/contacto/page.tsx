import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Reserva tu clase de prueba",
  description: "Reserva tu clase de prueba gratuita en YOGA Rituals, Gandia. Teléfono, WhatsApp, correo y dirección.",
  alternates: { canonical: "/contacto" },
}
export default function PaginaContacto() {
  return (
    <Pagina
      etiqueta="Contacto y reserva"
      titulo="Reserva tu clase de prueba"
      entradilla="Dinos qué día te viene bien y te esperamos unos minutos antes para enseñarte el centro."
    >
      <EnPreparacion pendiente="Falta el formulario de reserva (nombre, teléfono, día preferido y poco más) con su validación y su envío, además del mapa del estudio." />
    </Pagina>
  )
}