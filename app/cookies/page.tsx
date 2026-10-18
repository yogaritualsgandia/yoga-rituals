import type { Metadata } from "next"

import { PaginaLegal } from "@/components/layout/pagina-legal"
import { documentosLegales } from "@/content/legal"

const documento = documentosLegales.cookies

export const metadata: Metadata = {
  title: documento.titulo,
  description: documento.descripcion,
  alternates: { canonical: documento.ruta },
}

/**
 * Cookies.
 *
 * La página más corta de las tres, porque no hay nada que contar: esta web no
 * pone ninguna cookie. Lo único que se guarda en el navegador es el modo oscuro
 * que elige quien entra, y la propia Agencia Española de Protección de Datos
 * considera esa preferencia una cookie técnica exenta de consentimiento. Por eso
 * no hay cartel de aceptar, y esa es la parte que hay que explicar: la ausencia
 * de cartel se entiende mejor si se cuenta por qué no hace falta.
 */
export default function PaginaCookies() {
  return <PaginaLegal documento={documento} />
}
