"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"

/**
 * Botón imantado.
 *
 * El botón se acerca un poco al puntero cuando el puntero está encima, y vuelve
 * a su sitio cuando se va. Ocho píxeles como mucho: se tiene que notar en la
 * mano, no verse desde lejos.
 *
 * Se hace con un bucle propio y no con una transición de CSS porque una
 * transición solo va de un sitio a otro: aquí el destino cambia en cada
 * movimiento del ratón, y hace falta que el botón vaya detrás del puntero sin
 * saltos. El bucle se para solo cuando llega, y vuelve a arrancar al siguiente
 * movimiento; no se queda girando en vacío.
 *
 * No se enciende en pantallas táctiles —ahí no hay puntero que atraiga nada—,
 * ni con «menos movimiento» puesto, ni con el movimiento parado a mano: ocho
 * píxeles de más siguen siendo movimiento. El botón conserva su sombra y su
 * cambio de color al pasar por encima, así que sigue respondiendo.
 */
export function Magnetico({
  children,
  fuerza = 8,
}: {
  children: ReactNode
  fuerza?: number
}) {
  const caja = useRef<HTMLDivElement>(null)
  const { conMovimiento, pausado } = useMovimiento()

  useEffect(() => {
    const elemento = caja.current
    if (!elemento || !conMovimiento || pausado) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let bucle: number | null = null
    let destino = { x: 0, y: 0 }
    const actual = { x: 0, y: 0 }

    const paso = () => {
      actual.x += (destino.x - actual.x) * 0.2
      actual.y += (destino.y - actual.y) * 0.2

      const llego =
        Math.abs(destino.x - actual.x) < 0.1 &&
        Math.abs(destino.y - actual.y) < 0.1

      if (llego) {
        actual.x = destino.x
        actual.y = destino.y
      }

      elemento.style.transform = `translate3d(${actual.x.toFixed(2)}px, ${actual.y.toFixed(2)}px, 0)`
      bucle = llego ? null : requestAnimationFrame(paso)
    }

    const arrancar = () => {
      if (bucle === null) bucle = requestAnimationFrame(paso)
    }

    const alMover = (evento: PointerEvent) => {
      const marco = elemento.getBoundingClientRect()

      destino = {
        x:
          ((evento.clientX - (marco.left + marco.width / 2)) /
            (marco.width / 2)) *
          fuerza,
        y:
          ((evento.clientY - (marco.top + marco.height / 2)) /
            (marco.height / 2)) *
          fuerza,
      }

      arrancar()
    }

    const alSalir = () => {
      destino = { x: 0, y: 0 }
      arrancar()
    }

    elemento.addEventListener("pointermove", alMover)
    elemento.addEventListener("pointerleave", alSalir)

    return () => {
      elemento.removeEventListener("pointermove", alMover)
      elemento.removeEventListener("pointerleave", alSalir)
      if (bucle !== null) cancelAnimationFrame(bucle)
      elemento.style.transform = ""
    }
  }, [conMovimiento, pausado, fuerza])

  return (
    <div ref={caja} className="inline-flex">
      {children}
    </div>
  )
}
