"use client"

import { Pause, Play } from "lucide-react"

import { useMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { useMontado } from "@/hooks/use-montado"

/**
 * Parar el movimiento.
 *
 * Es una obligación, no un adorno: quien se marea con las animaciones tiene
 * derecho a pararlas sin tener que bucear en las preferencias del navegador,
 * y a poder hacerlo desde la propia página. Va discreto, en el pie, al lado
 * del tema.
 *
 * El nombre dice lo que va a pasar al pulsarlo («Parar el movimiento»), no el
 * estado en el que está, igual que el botón del tema.
 *
 * Si el navegador ya ha pedido menos movimiento no se pinta nada: no hay nada
 * que parar, y un botón que no hace nada es peor que no tenerlo.
 */
export function BotonPausa() {
  const { pausado, alternar, conMovimiento } = useMovimiento()
  const montado = useMontado()

  // Antes de saber nada, un hueco del mismo alto: así no salta el pie cuando
  // se decide si el botón va o no va.
  if (!montado) {
    return <span className="inline-block min-h-11" aria-hidden="true" />
  }

  if (!conMovimiento) return null

  return (
    <button
      type="button"
      onClick={alternar}
      className="inline-flex min-h-11 items-center gap-2.5 text-sm hover:text-ink"
    >
      {pausado ? (
        <Play aria-hidden="true" className="size-4" />
      ) : (
        <Pause aria-hidden="true" className="size-4" />
      )}

      {/* El ancho lo fija la etiqueta más larga —«Reanudar»—, que está puesta
          pero invisible. Así, al pulsar, el texto cambia sin que el botón
          cambie de tamaño y sin que el pie se recoloque a su alrededor. La
          visible y la invisible comparten celda, de modo que el alto también
          es el mismo. */}
      <span className="grid">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          Reanudar el movimiento
        </span>
        <span className="col-start-1 row-start-1">
          {pausado ? "Reanudar el movimiento" : "Parar el movimiento"}
        </span>
      </span>
    </button>
  )
}
