/**
 * Pinta un bloque JSON-LD.
 *
 * El `<` se escapa porque dentro de un `<script>` cierra la etiqueta antes de
 * tiempo. El resto del JSON se deja tal cual: es válido y legible.
 */
export function DatosEstructurados({ datos }: { datos: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\\u003c"),
      }}
    />
  )
}
