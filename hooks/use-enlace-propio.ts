"use client"

import { usePathname } from "next/navigation"
import { useCallback, type MouseEvent } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"

/**
 * El enlace de la sección en la que ya estás.
 *
 * Pulsar «Inicio» estando en la portada no lleva a ninguna parte: Next mira la
 * dirección, ve que es la misma y no navega. En la mano, sin embargo, el gesto
 * quiere decir «llévame al principio», y es lo que hace la gente para volver
 * arriba sin tocar la rueda. Así que aquí se atiende el gesto: se sube la
 * página, con el suavizado de siempre.
 *
 * Son dos cosas las que se devuelven, y salen del mismo dato:
 *
 *  · `propio` — el enlace apunta a la página en la que estás. Lo usa la barra
 *    para dejar el subrayado puesto y para anunciar «página actual».
 *
 *  · `alPulsar` — lo que hay que hacer al pulsarlo, ya atado al ratón y al
 *    teclado (los dos disparan `click`). Si el enlace lleva a otro sitio, no
 *    hace nada: navegar es cosa de Next.
 *
 * Se espera un fotograma antes de subir, y no es superstición: el menú de móvil
 * se cierra al pulsar, y mientras está abierto la página no se puede mover. Si
 * se sube en el mismo instante, la subida se pierde. Un fotograma después, la
 * página ya está suelta.
 */
export function useEnlacePropio() {
  const ruta = usePathname()
  const { subirArriba } = useMovimiento()

  /* La portada se separa del resto porque `startsWith` mentiría: toda
     dirección empieza por «/». */
  const propio = useCallback(
    (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href)),
    [ruta],
  )

  const alPulsar = useCallback(
    (href: string, evento: MouseEvent<HTMLElement>) => {
      if (!propio(href)) return

      evento.preventDefault()
      requestAnimationFrame(subirArriba)
    },
    [propio, subirArriba],
  )

  return { propio, alPulsar }
}
