import type { Metadata } from "next"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { BandaFoto } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Parrafo, atributoEscritura } from "@/components/movimiento/revelar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { metadatosDePagina } from "@/lib/metadatos"
import { Button } from "@/components/ui/button"
import { fotos } from "@/content/medios"
import {
  aTenerEnCuenta,
  cierrePrimeraVez,
  preguntasFrecuentes,
  primeraVez,
  queNecesitas,
} from "@/content/primeraVez"
import { whatsappUrl } from "@/content/site"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Primera vez",
  descripcion:
    "Vienes por primera vez a YOGA Rituals, en Gandia: qué llevar, cómo empezar sin prisa y las dudas más habituales antes de tu primera clase.",
  ruta: "/primera-vez",
})

/**
 * Primera vez.
 *
 * Es la página que más trabaja de toda la web. Quien nunca ha hecho yoga no
 * duda del yoga: duda de sí misma. Todo el texto es el que Susana ya tiene
 * publicado, palabra por palabra, y está puesto en el orden en el que se
 * pregunta: ¿me hará falta algo?, ¿cómo me tengo que comportar?, ¿y si me
 * pasa esto?
 *
 * Arriba hubo dos titulares en grande con las dos objeciones que frenan el
 * primer paso —la flexibilidad y los horarios libres—, y una vez contestadas
 * por el camino se quitaron: la flexibilidad la responde la primera pregunta
 * del acordeón y los horarios los cuenta la página de horarios, entera. Dos
 * respuestas repetidas arriba solo alargaban el camino hasta el primer dato
 * útil.
 *
 * Nota de diseño: las listas de «qué necesitas» y «a tener en cuenta» son
 * listas de definición con la etiqueta a la izquierda, no tres tarjetas
 * idénticas. Son seis puntos de texto, no seis productos.
 */
export default function PaginaPrimeraVez() {
  return (
    <Pagina
      etiqueta="Primera vez"
      titulo="Todo lo que necesitas saber"
      entradilla={primeraVez.entradilla}
    >
      {/* ── Qué necesitas ────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">{queNecesitas.titulo}</h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {queNecesitas.entradilla}
          </p>

          <dl className="mt-12 flex flex-col border-t border-line">
            {queNecesitas.puntos.map((punto) => (
              <div
                key={punto.etiqueta}
                className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-10"
              >
                <dt className="etiqueta md:col-span-3 md:pt-1">
                  {punto.etiqueta}
                </dt>
                <dd className="medida paso-base text-ink-soft md:col-span-8">
                  {punto.texto}
                </dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>

      <BandaFoto foto={fotos.primeraVezMaterial} aspecto="aspect-3/2" />

      {/* ── A tener en cuenta ────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">{aTenerEnCuenta.titulo}</h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {aTenerEnCuenta.entradilla}
          </p>

          <dl className="mt-12 flex flex-col border-t border-line">
            {aTenerEnCuenta.puntos.map((punto) => (
              <div
                key={punto.etiqueta}
                className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-10"
              >
                <dt className="etiqueta md:col-span-3 md:pt-1">
                  {punto.etiqueta}
                </dt>
                <dd className="medida paso-base text-ink-soft md:col-span-8">
                  {punto.texto}
                </dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Preguntas frecuentes ─────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[26ch]">Las dudas que más salen</h2>

          <Accordion
            type="single"
            collapsible
            className="mt-12 max-w-3xl border-t border-line"
          >
            {preguntasFrecuentes.map((pregunta) => (
              <AccordionItem
                key={pregunta.pregunta}
                value={pregunta.pregunta}
                /* El panel dura lo mismo que tarda la respuesta en escribirse.
                   El número sale del propio texto, así que no hay dos sitios
                   que puedan dejar de coincidir: los dos lo piden aquí. */
                style={atributoEscritura(pregunta.respuesta).estilo}
              >
                <AccordionTrigger>{pregunta.pregunta}</AccordionTrigger>
                <AccordionContent>
                  <Parrafo texto={pregunta.respuesta} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Contenedor>
      </section>

      {/* ── Cierre ───────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="paso-titular max-w-[20ch]">
              {cierrePrimeraVez.titular}
            </h2>
            <p className="paso-entrada medida mt-6 text-ink-soft">
              Escríbenos y te contamos lo que necesites. Para venir no hace
              falta reservar nada; la clase de prueba es la única que se pide
              con cita.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9 lg:justify-center">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cierrePrimeraVez.accion}
              </a>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
