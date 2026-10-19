import type { Metadata } from "next"

import { ControlConsentimiento } from "@/components/consentimiento/control-consentimiento"
import { PaginaLegal } from "@/components/layout/pagina-legal"
import { documentosLegales } from "@/content/legal"
import { metadatosDePagina } from "@/lib/metadatos"

const documento = documentosLegales.cookies

export const metadata: Metadata = metadatosDePagina({
  titulo: documento.titulo,
  descripcion: documento.descripcion,
  ruta: documento.ruta,
})

/**
 * Cookies.
 *
 * El texto cuenta qué se mide y qué no. Debajo va el control para desdecirse:
 * retirar el permiso tiene que costar lo mismo que darlo, y el sitio donde se
 * explica qué son las cookies es el sitio donde tiene que estar el botón. Sin
 * él, aceptar sería un botón en la primera visita y arrepentirse, un trámite
 * escondido en la configuración del navegador.
 */
export default function PaginaCookies() {
  return (
    <PaginaLegal documento={documento}>
      <ControlConsentimiento />
    </PaginaLegal>
  )
}
