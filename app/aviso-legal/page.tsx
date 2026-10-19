import type { Metadata } from "next"

import { PaginaLegal } from "@/components/layout/pagina-legal"
import { documentosLegales } from "@/content/legal"
import { metadatosDePagina } from "@/lib/metadatos"

const documento = documentosLegales.avisoLegal

export const metadata: Metadata = metadatosDePagina({
  titulo: documento.titulo,
  descripcion: documento.descripcion,
  ruta: documento.ruta,
})

/**
 * Aviso legal.
 *
 * Es el sitio donde la ley pide que se diga quién está detrás de la web
 * (artículo 10 de la LSSI). El texto está en `content/legal.ts`, con los otros
 * dos documentos legales, y lo pinta `PaginaLegal`.
 */
export default function PaginaAvisoLegal() {
  return <PaginaLegal documento={documento} />
}
