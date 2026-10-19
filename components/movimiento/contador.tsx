"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { cn } from "@/lib/utils"

/**
 * Una cifra que cuenta hasta ponerse en su sitio.
 *
 * Se usa dos veces en toda la web: los talleres que llevamos hechos, en la
 * portada y en su propia página. Se cuenta una sola vez, cuando la cifra entra
 * en pantalla, y no se vuelve a contar: un número que se pasa la vida contando
 * deja de ser un dato y pasa a ser un adorno.
 *
 * ANTES ESTO PESABA VEINTE KILOBYTES. Se hacía con framer-motion, que trae un
 * motor de muelles entero para animar un solo número. Lo que hace falta cabe en
 * treinta líneas: un `requestAnimationFrame`, una curva que frena al final y un
 * `IntersectionObserver` que avisa cuando la cifra se ve. Así el paquete de la
 * portada baja sin cambiar nada de lo que se ve.
 *
 * La curva es `easeOutQuart`: arranca deprisa y frena mucho al final, que es lo
 * que hacía el muelle. Tarda 1,9 segundos, lo mismo que antes.
 *
 * Las tres excepciones son la parte importante:
 *
 *  · Si el navegador pide menos movimiento, o si alguien ha parado el
 *    movimiento en la web, no hay cuenta: se enseña el número de verdad. Es lo
 *    correcto dos veces —no se anima nada que nadie haya pedido— y además un
 *    contador a medias en pantalla es un dato falso, y aquí los datos son
 *    reales.
 *
 *  · Sin JavaScript no hay nada de esto: el número ya viene escrito del
 *    servidor, así que se lee igual.
 *
 *  · Y el número de verdad también es el que oye un lector de pantalla, porque
 *    el nodo se actualiza con el texto final en cuanto termina la cuenta y no
 *    se anuncia nada mientras sube.
 */

/** El formato es el de aquí: quinientos se escribe 500, sin nada en medio. */
const FORMATO = new Intl.NumberFormat("es-ES")

/** Lo que tardaba el muelle en frenar del todo, más o menos. */
const DURACION = 1900

export function Contador({
  valor,
  className,
  ...props
}: { valor: number } & ComponentPropsWithoutRef<"span">) {
  const ref = useRef<HTMLSpanElement>(null)
  const { conMovimiento, pausado } = useMovimiento()

  /* Si la cuenta ya se ha hecho, no se repite. Se hace una vez en la vida de la
     página, y no cada vez que se vuelve a pasar por delante. */
  const yaCuento = useRef(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return

    if (!conMovimiento || pausado) {
      /* Con el movimiento parado —o pedido menos— el número que queda en
         pantalla es el de verdad, no uno a medias. Un dato a medias en pantalla
         es un dato falso, y este es un dato. */
      nodo.textContent = FORMATO.format(valor)
      return
    }

    if (yaCuento.current) return

    let fotograma = 0

    const contar = () => {
      yaCuento.current = true

      /* A cero y a contar. El cero y el primer fotograma van seguidos, así que
         el salto de quinientos a cero no se llega a ver. */
      nodo.textContent = FORMATO.format(0)
      const inicio = performance.now()

      const paso = (ahora: number) => {
        const avance = Math.min(1, (ahora - inicio) / DURACION)
        const suave = 1 - Math.pow(1 - avance, 4)

        nodo.textContent = FORMATO.format(Math.round(valor * suave))

        if (avance < 1) fotograma = requestAnimationFrame(paso)
      }

      fotograma = requestAnimationFrame(paso)
    }

    /* El umbral es alto a propósito: la cifra empieza a contar cuando se ve
       entera, no cuando asoma un píxel por el borde de abajo. */
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return
        observador.disconnect()
        contar()
      },
      { threshold: 0.6 },
    )

    observador.observe(nodo)

    return () => {
      observador.disconnect()
      cancelAnimationFrame(fotograma)
    }
  }, [conMovimiento, pausado, valor])

  return (
    /* `tabular-nums` no es un detalle: sin él cada dígito mide lo suyo, y el
       número cambia de ancho mientras cuenta, moviendo de sitio lo que tiene al
       lado. */
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {FORMATO.format(valor)}
    </span>
  )
}
