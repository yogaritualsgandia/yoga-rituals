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
 *
 * Y si alguien para el movimiento, esto también para: la capa vuelve a su sitio
 * y se queda ahí mientras dure la pausa. El suavizado de la rueda se apaga a la
 * vez, en el proveedor.
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
  const { conMovimiento, pausado } = useMovimiento()

  useEffect(() => {
    const elMarco = marco.current
    const elCapa = capa.current
    if (!elMarco || !elCapa || !conMovimiento || pausado) return
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

      /* La capa vuelve a su sitio. Al matar la animación, GSAP deja la última
         transformación escrita, que es la del último fotograma que se vio: si
         se acaba de parar el movimiento, la foto se quedaría desplazada doce
         píxeles y ampliada un 6 %, quieta y torcida. */
      elCapa.style.transform = ""
    }
  }, [conMovimiento, pausado, recorrido])

  return (
    <div ref={marco} className={cn("relative overflow-hidden", className)}>
      {/* La capa lleva `relative` por una razón que no se ve: la foto de dentro
          lleva `fill`, que la coloca en absoluto respecto al ancestro más
          cercano que esté posicionado. Sin esto el ancestro es el marco, y
          entonces la foto se sale de la capa que se mueve y el paralaje deja de
          notarse. Además Next avisa por consola de que el padre de una imagen
          `fill` no está posicionado, y tiene razón. */}
      <div ref={capa} className="relative size-full">
        {children}
      </div>
    </div>
  )
}
