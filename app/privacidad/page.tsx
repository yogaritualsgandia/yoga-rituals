import type { Metadata } from "next"

import { PaginaLegal } from "@/components/layout/pagina-legal"
import { documentosLegales } from "@/content/legal"
import { metadatosDePagina } from "@/lib/metadatos"

const documento = documentosLegales.privacidad

export const metadata: Metadata = metadatosDePagina({
  titulo: documento.titulo,
  descripcion: documento.descripcion,
  ruta: documento.ruta,
})

/**
 * Privacidad.
 *
 * Escrita sobre lo que hace esta web y no sobre lo que suelen decir las
 * plantillas: aquí no hay formularios, ni cuentas, ni medición de visitas. Lo
 * que hay que contar es lo que llega por WhatsApp, por correo y por teléfono, y
 * lo que se hace con los datos de salud que alguien cuenta para que le adapten
 * la práctica. El texto está en `content/legal.ts`.
 */
export default function PaginaPrivacidad() {
  return <PaginaLegal documento={documento} />
}
