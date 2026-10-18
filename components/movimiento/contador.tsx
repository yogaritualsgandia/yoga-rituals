"use client"

import { useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { cn } from "@/lib/utils"

/**
 * Una cifra que cuenta hasta ponerse en su sitio.
 *
 * Se usa una vez en toda la web: los talleres que llevamos hechos. Se cuenta
 * una sola vez, cuando la cifra entra en pantalla, y no se vuelve a contar: un
 * número que se pasa la vida contando deja de ser un dato y pasa a ser un
 * adorno.
 *
 * Son dos números y no uno, porque la cuenta es un muelle: `destino` es lo que
 * se pide —quinientos— y `cuenta` es por dónde va, que llega sola y frena al
 * llegar. Con un solo número no habría frenada: sería una línea recta de cero a
 * quinientos, que se lee como un marcador y no como algo que llega.
 *
 * Se escribe en el nodo a mano, fotograma a fotograma y sin pasar por el estado
 * de React: un render por fotograma sería lo más caro de la página entera.
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
 *    quien lo enseña es un titular que declara su texto entero aparte (ver
 *    `Titular`, en `revelar.tsx`). El que va subiendo por la pantalla nunca se
 *    anuncia.
 */

/** El formato es el de aquí: quinientos se escribe 500, sin nada en medio. */
const FORMATO = new Intl.NumberFormat("es-ES")

export function Contador({
  valor,
  className,
  ...props
}: { valor: number } & ComponentPropsWithoutRef<"span">) {
  const ref = useRef<HTMLSpanElement>(null)
  const { conMovimiento, pausado } = useMovimiento()
  const enPantalla = useInView(ref, { once: true })

  const destino = useMotionValue(0)
  /* Los dos números del muelle son los que deciden cuánto dura la cuenta, y
     están puestos a ojo pero con una idea: que se vea llegar sin que se haga
     pesada. Con estos, la última cifra deja de moverse casi a los dos segundos.
     Antes frenaba en uno y Susana pidió que tardara más; se ha bajado la
     rigidez y se ha mantenido la frenada, así que sigue sin pasarse de
     quinientos ni quedarse corta. */
  const cuenta = useSpring(destino, { stiffness: 30, damping: 11 })

  /* Si la cuenta ya se ha hecho, no se repite. Se hace una vez en la vida de
     la página, y no cada vez que se vuelve a pasar por delante. */
  const yaCuento = useRef(false)

  /* El muelle da decimales y el número tiene que ser redondo, así que se
     redondea al pintarlo y no antes. */
  useEffect(
    () =>
      cuenta.on("change", (ultimo) => {
        if (ref.current) {
          ref.current.textContent = FORMATO.format(Math.round(ultimo))
        }
      }),
    [cuenta],
  )

  useEffect(() => {
    if (!conMovimiento || pausado) {
      /* Con el movimiento parado —o pedido menos— el número que queda en
         pantalla es el de verdad, no uno a medias. Un dato a medias en pantalla
         es un dato falso, y este es un dato. */
      destino.jump(valor)
      cuenta.jump(valor)
      return
    }

    /* Hasta que llega el momento de contar, el número se queda como vino del
       servidor, y eso importa más de lo que parece: el titular está a media
       página, así que un buscador que lea la página sin llegar hasta aquí
       abajo tiene que encontrar «500». Si el número se pusiera a cero al
       cargar, leería «0», que es justo lo contrario de lo que dice. */
    if (!enPantalla || yaCuento.current) return

    yaCuento.current = true

    /* A cero y a contar. Las dos cosas en el mismo fotograma: el número ya está
       en cero cuando el muelle arranca, así que el salto de quinientos a cero
       no se llega a ver. */
    if (ref.current) ref.current.textContent = FORMATO.format(0)
    destino.set(valor)
  }, [cuenta, destino, conMovimiento, pausado, enPantalla, valor])

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
