"use client"

import { useState } from "react"

import { Contenedor } from "@/components/layout/contenedor"
import { Revelar, Titular } from "@/components/movimiento/revelar"
import { EscenaRespiracion } from "@/components/tres/escena-respiracion"
import { Slider } from "@/components/ui/slider"
import { respiracion } from "@/content/respiracion"
import { useMontado } from "@/hooks/use-montado"
import { RITMO_INICIAL } from "@/lib/respiracion"

/**
 * «Marca tu ritmo».
 *
 * La sección donde la web deja de contar cosas y deja hacer una. A la
 * izquierda, lo que hay que leer y los dos deslizadores; a la derecha, el
 * objeto, que se queda quieto en su sitio mientras se lee (`position: sticky`),
 * y respira al ritmo que le marquen.
 *
 * Tres decisiones:
 *
 *  · LOS DESLIZADORES NO SE PINTAN SIN JAVASCRIPT. Un deslizador que no se
 *    puede deslizar es peor que no tenerlo: se ve, se enfoca con el tabulador
 *    y no hace nada. Sin JavaScript queda el texto, que ya dice el ritmo con
 *    palabras, y el círculo, que respira igual. El hueco que dejan está
 *    reservado de antemano, así que no salta nada al aparecer.
 *
 *  · EL RITMO ES DEL VISITANTE, NO DE LA CASA. Los deslizadores empiezan en
 *    cuatro y seis, que es un ritmo lento y cómodo, pero se pueden llevar a
 *    donde cada uno quiera. No hay una posición correcta que alcanzar.
 *
 *  · EL OBJETO DICE EL RITMO EN VOZ ALTA. Lleva un texto que cambia con los
 *    deslizadores y que se anuncia, así que quien no lo ve se entera igual de
 *    lo que está pasando.
 */

const MINIMO = 2
const MAXIMO = 10

export function MarcaTuRitmo() {
  const montado = useMontado()
  const [inspirar, setInspirar] = useState<number>(RITMO_INICIAL.inspirar)
  const [espirar, setEspirar] = useState<number>(RITMO_INICIAL.espirar)

  return (
    <section className="seccion" aria-labelledby="marca-tu-ritmo">
      <Contenedor>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Lo que se lee ────────────────────────────── */}
          <div className="lg:col-span-5">
            <Titular
              id="marca-tu-ritmo"
              texto={respiracion.titular}
              className="paso-titular text-ink"
              retardo={0}
            />

            <Revelar
              as="p"
              retardo={1}
              className="paso-entrada text-ink-soft mt-6"
            >
              {respiracion.entradilla}
            </Revelar>

            <div className="medida mt-8 space-y-5">
              {respiracion.parrafos.map((parrafo, i) => (
                <Revelar as="p" key={parrafo.slice(0, 24)} retardo={i + 2}>
                  {parrafo}
                </Revelar>
              ))}
            </div>

            {/* Los mandos. Ver la nota de arriba: sin JavaScript no existen, y
                el hueco está reservado para que no salte la página. */}
            <div className="mt-10 min-h-[13.5rem]">
              {montado && (
                <div className="space-y-7">
                  <Mando
                    nombre={respiracion.controles.inspirar}
                    etiqueta={respiracion.controles.inspirar}
                    valor={inspirar}
                    onCambiar={setInspirar}
                  />
                  <Mando
                    nombre={respiracion.controles.espirar}
                    etiqueta={respiracion.controles.espirar}
                    valor={espirar}
                    onCambiar={setEspirar}
                  />

                  <p
                    aria-live="polite"
                    className="paso-pequeno text-ink-soft pt-1"
                  >
                    {respiracion.controles.ciclo(inspirar + espirar)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── El escenario ─────────────────────────────── */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="lg:sticky lg:top-28">
              {/* El alto del escenario se mide con el ancho, no con el alto de
                  la ventana. Con `svh`, en un móvil salían casi quinientos
                  píxeles de caja para una esfera de doscientos treinta, y
                  alrededor del objeto quedaba más aire que objeto: se leía
                  como un hueco, no como una pausa. Con el ancho, la caja
                  crece y mengua con la esfera, y el aire de alrededor es
                  siempre el mismo. */}
              <div className="relative h-[clamp(20rem,70vw,30rem)] w-full">
                {/* Un halo muy suave detrás, para que la esfera no parezca
                    pegada sobre el fondo. Es un degradado pintado una vez, no
                    un desenfoque recalculado en cada fotograma. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--brand-vivid) 15%, transparent) 0%, transparent 64%)",
                  }}
                />
                <EscenaRespiracion
                  inspirar={inspirar}
                  espirar={espirar}
                  descripcion={respiracion.descripcionObjeto(inspirar, espirar)}
                />
              </div>
            </div>
          </div>
        </div>
      </Contenedor>
    </section>
  )
}

function Mando({
  nombre,
  etiqueta,
  valor,
  onCambiar,
}: {
  nombre: string
  etiqueta: string
  valor: number
  onCambiar: (valor: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="etiqueta">{etiqueta}</span>
        <span className="paso-pequeno text-ink tabular-nums">
          {respiracion.controles.segundos(valor)}
        </span>
      </div>

      <Slider
        /* El nombre que oye un lector de pantalla, entero y con la unidad:
           «Inspirar, en segundos» y no «Inspirar». */
        nombre={`${nombre}, en segundos`}
        className="mt-2"
        min={MINIMO}
        max={MAXIMO}
        step={1}
        value={[valor]}
        onValueChange={([nuevo]) => onCambiar(nuevo)}
      />
    </div>
  )
}
