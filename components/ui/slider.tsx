"use client"

import * as React from "react"
import { cn } from "cn"
import { Slider as SliderPrimitive } from "radix-ui"

/**
 * Deslizador.
 *
 * Igual que el acordeón: por dentro es Radix, que ya trae el teclado —flechas
 * para moverse, Inicio y Fin para los extremos— y los `aria-valuenow` que
 * necesita un lector de pantalla. Por fuera no queda nada del original.
 *
 * Tres decisiones que no son de estilo:
 *
 *  · El tirador mide 44×44 y el punto que se ve dentro mide 24. El punto es lo
 *    que se mira; los 44 son lo que se toca, y son la medida mínima para que
 *    un dedo acierte. Se hace con un elemento dentro de otro y no con un
 *    `::before` para que el navegador mida de verdad los 44 y no haya que
 *    fiarse de un truco.
 *
 *  · La barra tiene 44 de alto por lo mismo, aunque la línea que se ve tenga
 *    seis. Así se puede tocar en cualquier punto de la fila, no solo en el
 *    punto exacto.
 *
 *  · No hay `outline-none`: el foco visible lo pone la regla global, y aquí
 *    hace más falta que en ningún sitio, porque este cacharro se maneja con el
 *    teclado.
 */

function Slider({
  className,
  nombre,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Nombre del tirador.
   *
   * Es lo único que oye quien usa un lector de pantalla, y por eso es
   * obligatorio. Un `<label>` no sirve aquí: asocia con campos de formulario, y
   * un deslizador no lo es. Radix ya pone un nombre por defecto —«Value»—, que
   * no dice nada.
   */
  nombre: string
}) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex h-11 w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-line"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-brand"
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={nombre}
        data-slot="slider-thumb"
        className="group/tirador grid size-11 place-items-center rounded-full"
      >
        <span
          aria-hidden="true"
          className="block size-6 rounded-full border-2 border-brand bg-surface transition-transform duration-[var(--dur-fast)] ease-out-soft group-hover/tirador:scale-110 group-focus-visible/tirador:scale-110"
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}

export { Slider }
