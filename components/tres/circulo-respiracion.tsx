"use client"

import { useEffect, useRef } from "react"

import { useMontado } from "@/hooks/use-montado"
import { AMPLITUD_RESPIRACION, escalaDeRespiracion } from "@/lib/respiracion"
import { cn } from "@/lib/utils"

/**
 * El círculo que respira, para cuando no hay objeto 3D.
 *
 * No es un cartel que diga «aquí no hay 3D». Es la misma cosa, más barata: un
 * círculo del color de la marca que se abre al inspirar y se recoge al
 * espirar, con la misma curva y el mismo ritmo que la esfera. Se ve en tres
 * casos —un móvil modesto, alguien con ahorro de datos, quien ha pedido menos
 * movimiento— y en los tres tiene que estar a la altura.
 *
 * Cómo se mueve, según lo que haya:
 *
 *  · SIN JAVASCRIPT no hay deslizadores ni forma de cambiar el ritmo, así que
 *    respira con la animación de CSS, a diez segundos, que es el ritmo que
 *    traen puestos los deslizadores. Nada puede contradecirse.
 *
 *  · CON JAVASCRIPT el mando lo coge este efecto y sigue el ritmo exacto que
 *    haya marcado quien esté mirando, con la misma función que usa la esfera.
 *    Se coge el mando quitando la clase, no tapándola: dos animaciones sobre
 *    el mismo `transform` se pelearían.
 *
 *  · SI SE PARA, se para donde esté. No vuelve al principio.
 */

export function CirculoRespiracion({
  inspirar,
  espirar,
  animar,
}: {
  inspirar: number
  espirar: number
  animar: boolean
}) {
  const montado = useMontado()
  const circulo = useRef<HTMLDivElement>(null)

  /* El ritmo se guarda en una referencia para que el bucle no tenga que
     reiniciarse cada vez que alguien mueve un deslizador: se reiniciaría el
     ciclo y el círculo daría un salto. Se lee el valor de ahora en cada
     fotograma y ya está. */
  const ritmo = useRef({ inspirar, espirar })

  useEffect(() => {
    ritmo.current = { inspirar, espirar }
  }, [inspirar, espirar])

  useEffect(() => {
    const elemento = circulo.current
    if (!elemento || !animar) return

    let fotograma = 0
    const principio = performance.now()

    const latido = (ahora: number) => {
      const aire = escalaDeRespiracion(
        ahora - principio,
        ritmo.current.inspirar,
        ritmo.current.espirar,
      )

      elemento.style.transform = `scale(${1 + AMPLITUD_RESPIRACION * aire})`
      fotograma = requestAnimationFrame(latido)
    }

    fotograma = requestAnimationFrame(latido)

    return () => cancelAnimationFrame(fotograma)
  }, [animar])

  return (
    <div aria-hidden="true" className="grid h-full place-items-center">
      <div
        ref={circulo}
        className={cn(
          "aspect-square w-[70%] max-w-[26rem] rounded-full",
          !montado && "circulo-respira",
        )}
        /* Se pinta con un degradado radial y no con un color plano para que
           parezca una esfera con luz, como la de verdad. Los dos extremos del
           degradado son el mismo turquesa mezclado con blanco y con negro, así
           que el tema oscuro también lo cambia.
           
           Las mezclas están medidas contra el objeto de tres dimensiones: con
           más blanco, el círculo se aclaraba y parecía de plástico al lado de
           la esfera. Los dos tienen que poder ser la misma cosa, porque según
           el aparato se ve uno u otro. */
        style={{
          background:
            "radial-gradient(circle at 36% 30%, color-mix(in oklab, var(--brand-vivid) 74%, white) 0%, var(--brand-vivid) 58%, color-mix(in oklab, var(--brand-vivid) 84%, black) 100%)",
        }}
      />
    </div>
  )
}
