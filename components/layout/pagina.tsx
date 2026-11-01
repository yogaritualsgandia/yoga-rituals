import type { ReactNode } from "react"

import { Revelar, Titular } from "@/components/movimiento/revelar"

import { Contenedor } from "./contenedor"

/**
 * Cabeza de página común.
 *
 * Todas las páginas empiezan igual —antetítulo, titular y entradilla— para que
 * quien navega reconozca dónde está sin pensarlo. El ritmo de arriba es más
 * corto que el de una sección normal porque debajo siempre viene contenido.
 *
 * Y entra con la misma animación que la portada, que es de CSS y arranca sola.
 * Eso importa más aquí que en ningún sitio: las páginas de dentro son a las que
 * se llega desde un buscador, sin pasar por la portada, y la primera impresión
 * de la web es esta. Al ser CSS no espera a ningún archivo, y como cada página
 * vuelve a crear estos elementos, también se ve al navegar de una a otra.
 */
export function Pagina({
  etiqueta,
  titulo,
  entradilla,
  aparte,
  children,
}: {
  etiqueta?: string
  titulo: string
  entradilla?: string
  /** Contenido que acompaña a la cabecera a la derecha: hoy, la foto del estilo. */
  aparte?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <section className="pt-[clamp(2.5rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4.5rem)]">
        <Contenedor
          className={
            aparte
              ? "grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10"
              : undefined
          }
        >
          <div className={aparte ? "lg:col-span-7" : undefined}>
            {etiqueta ? (
              <Revelar as="p" cuando="entrada" retardo={0} className="etiqueta">
                {etiqueta}
              </Revelar>
            ) : null}

            <Titular
              as="h1"
              cuando="entrada"
              retardo={1}
              className="paso-titular mt-5 max-w-[22ch]"
              texto={titulo}
            />

            {entradilla ? (
              <Revelar
                as="p"
                cuando="entrada"
                retardo={2}
                className="paso-entrada medida mt-7 text-ink-soft"
              >
                {entradilla}
              </Revelar>
            ) : null}
          </div>

          {aparte ? (
            <div className="lg:col-span-5">{aparte}</div>
          ) : null}
        </Contenedor>
      </section>

      {children}
    </>
  )
}
