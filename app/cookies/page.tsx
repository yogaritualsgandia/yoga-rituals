import type { Metadata } from "next"

import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Política de cookies de yogarituals.es: qué cookies se usan, con qué finalidad y cómo puedes configurarlas o desactivarlas.",
  alternates: { canonical: "/cookies" },
}
export default function PaginaCookies() {
  return (
    <Pagina
      etiqueta="Legal"
      titulo="Cookies"

    >
      <EnPreparacion pendiente="Falta el texto legal y decidir si la web va a usar cookies de medición. Sin analítica no hace falta aviso de cookies." />
    </Pagina>
  )
}