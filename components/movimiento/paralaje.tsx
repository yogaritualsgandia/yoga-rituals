"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { cn } from "@/lib/utils"

/**
 * Paralaje.
 *
 * Mueve lo de dentro un poco más despacio que la página mientras pasa. Es lo
 * único de la web que va atado al scroll, y va atado de verdad: con `scrub` la
 * posición depende de por dónde se esté y no del tiempo, así que si alguien
 * sube, el movimiento se deshace solo. No hay forma de «quedarse a medias».
 *
 * Cuesta casi nada, porque se mueve una capa entera de una pieza. La capa va
 * ampliada un 6 % para que al desplazarse no asome el borde por ningún lado.
 *
 * En móvil no se enciende. Ahí el desplazamiento ya es bastante ajetreado de
 * por sí, y añadirle una capa que se mueve a otra velocidad marea más de lo que
 * aporta.
 */
export function Paralaje({
  children,
  className,
  recorrido = 12,
}: {
  children: ReactNode
  className?: string
  /** Cuántos píxeles sube y baja. Poco: se tiene que notar, no verse. */
  recorrido?: number
}) {
  const marco = useRef<HTMLDivElement>(null)
  const capa = useRef<HTMLDivElement>(null)
  const { conMovimiento } = useMovimiento()

  useEffect(() => {
    const elMarco = marco.current
    const elCapa = capa.current
    if (!elMarco || !elCapa || !conMovimiento) return
    if (!window.matchMedia("(min-width: 1024px)").matches) return

    let vivo = true
    let matar = () => {}

    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (!vivo) return

      gsap.registerPlugin(ScrollTrigger)

      const movimiento = gsap.fromTo(
        elCapa,
        { y: -recorrido, scale: 1.06 },
        {
          y: recorrido,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: elMarco,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )

      matar = () => {
        movimiento.scrollTrigger?.kill()
        movimiento.kill()
      }
    })

    return () => {
      vivo = false
      matar()
    }
  }, [conMovimiento, recorrido])

  return (
    <div ref={marco} className={cn("relative overflow-hidden", className)}>
      <div ref={capa} className="size-full">
        {children}
      </div>
    </div>
  )
}
