import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de YOGA Rituals: qué datos se recogen a través del formulario de reserva, para qué se usan y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
}
export default function PaginaPrivacidad() {
  return (
    <Pagina
      etiqueta="Legal"
      titulo="Política de privacidad"

    >
      <EnPreparacion pendiente="Falta el texto legal, incluido lo que se hace con los datos del formulario de reserva." />
    </Pagina>
  )
}