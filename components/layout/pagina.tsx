import type { ReactNode } from "react"

import { Contenedor } from "./contenedor"

/**
 * Cabeza de página común.
 *
 * Todas las páginas empiezan igual —antetítulo, titular y entradilla— para que
 * quien navega reconozca dónde está sin pensarlo. El ritmo de arriba es más
 * corto que el de una sección normal porque debajo siempre viene contenido.
 */
export function Pagina({
  etiqueta,
  titulo,
  entradilla,
  children,
}: {
  etiqueta?: string
  titulo: string
  entradilla?: string
  children: ReactNode
}) {
  return (
    <>
      <section className="pt-[clamp(2.5rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4.5rem)]">
        <Contenedor>
          {etiqueta ? <p className="etiqueta">{etiqueta}</p> : null}
          <h1 className="paso-titular mt-5 max-w-[22ch]">{titulo}</h1>
          {entradilla ? (
            <p className="paso-entrada medida mt-7 text-ink-soft">
              {entradilla}
            </p>
          ) : null}
        </Contenedor>
      </section>

      {children}
    </>
  )
}
