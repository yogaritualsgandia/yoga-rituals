"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { CirculoRespiracion } from "@/components/tres/circulo-respiracion"
import { useMontado } from "@/hooks/use-montado"
import { puedeDibujarObjeto } from "@/lib/movimiento"

/**
 * El escenario: decide si aquí se dibuja una esfera o un círculo.
 *
 * La decisión se toma en el navegador y en este orden, que es el de las ganas
 * de gastar: primero se pregunta si el aparato puede (ver
 * `puedeDibujarObjeto`), y solo si puede se pide el trozo de JavaScript que
 * trae el lienzo. En una visita que no lo vaya a ver no se descarga ni
 * three.js: no es que no se dibuje, es que no llega.
 *
 * Y SE DIBUJA SOLO CUANDO SE MIRA. Un lienzo de WebGL no se para porque esté
 * fuera de la pantalla: sigue repintando sesenta veces por segundo aunque no
 * haya nadie delante, y eso se paga en batería y en que la página entera vaya
 * más lenta —se notó, y mucho, al medirla—. Así que se vigila si el
 * escenario está a la vista, y cuando no lo está el lienzo deja de pintar. Al
 * volver, vuelve; y como la respiración va por tiempo y no por fotogramas, no
 * se queda a medias ni da un salto.
 *
 * El envoltorio lleva `role="img"` y un texto que dice el ritmo que hay
 * marcado. El objeto no es decoración —dice algo— así que quien no lo ve tiene
 * que poder leerlo. Con eso, el lienzo de dentro se puede saltar sin más.
 */

const LienzoRespiracion = dynamic(
  () =>
    import("@/components/tres/lienzo-respiracion").then(
      (modulo) => modulo.LienzoRespiracion,
    ),
  /* Sin servidor: el lienzo no existe hasta que hay navegador. */
  { ssr: false },
)

export function EscenaRespiracion({
  inspirar,
  espirar,
  descripcion,
}: {
  inspirar: number
  espirar: number
  descripcion: string
}) {
  const montado = useMontado()
  const { pausado, conMovimiento } = useMovimiento()
  const marco = useRef<HTMLDivElement>(null)
  const [aLaVista, setALaVista] = useState(false)

  const conObjeto = montado && puedeDibujarObjeto()

  useEffect(() => {
    const elemento = marco.current
    if (!elemento || !conObjeto) return

    /* El margen hace que el lienzo arranque un poco antes de asomar, para que
       cuando se vea ya esté pintado. */
    const observador = new IntersectionObserver(
      ([entrada]) => setALaVista(entrada.isIntersecting),
      { rootMargin: "240px" },
    )

    observador.observe(elemento)

    return () => observador.disconnect()
  }, [conObjeto])

  return (
    <div ref={marco} role="img" aria-label={descripcion} className="size-full">
      {conObjeto ? (
        <LienzoRespiracion
          inspirar={inspirar}
          espirar={espirar}
          pausado={pausado}
          activo={aLaVista}
        />
      ) : (
        <CirculoRespiracion
          inspirar={inspirar}
          espirar={espirar}
          /* Con «menos movimiento» el círculo se queda quieto. El CSS ya
             apagaría su animación, pero el latido de verdad lo lleva un bucle
             de JavaScript, y ese no lo apaga ninguna hoja de estilos: hay que
             decírselo. Queda una esfera del color del estudio, que sigue
             diciendo lo que es; lo que no hace es moverse. */
          animar={montado && conMovimiento && !pausado}
        />
      )}
    </div>
  )
}
