import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Esqueleto de carga.
 *
 * Es la forma gris que se enseña en el hueco de lo que todavía no ha llegado.
 * Viene de shadcn —como todo lo demás, se ha reescrito entero— y de allí se
 * queda solo la idea: un bloque con el color del sitio que late despacio.
 *
 * TRES COSAS QUE NO SON OBVIAS:
 *
 *  · EL COLOR ES EL DEL ESTUDIO. El esqueleto de shadcn es gris azulado, el
 *    típico de una aplicación de gestión. Aquí es el mismo gris cálido que los
 *    fondos de las tarjetas, así que la página no cambia de color mientras
 *    carga: se queda del color que es y las piezas van apareciendo encima.
 *
 *  · LATE CON EL MOVIMIENTO DE LA CASA. El latido es una animación de CSS, así
 *    que entra en el interruptor de siempre: con «menos movimiento» puesto no
 *    late —queda un gris quieto, que es igual de útil— y con el botón de «Parar
 *    el movimiento» se para con todo lo demás, sin quedarse palpitando solo.
 *
 *  · NO SE ANUNCIA. Un lector de pantalla no tiene nada que hacer con una caja
 *    vacía: lo que se anuncia es el conjunto, y de eso se encarga la página que
 *    los junta. Aquí, `aria-hidden`.
 */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-full bg-surface-2",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
