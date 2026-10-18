import type { Metadata } from "next"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { whatsappUrl } from "@/content/site"
import { yogaNidra } from "@/content/yogaNidra"

export const metadata: Metadata = {
  title: "Yoga Nidra",
  description:
    "Yoga Nidra en Gandia: meditación guiada y relajación profunda, tumbado y en Savasana. Sesiones de 90 minutos, sin experiencia previa. YOGA Rituals.",
  alternates: { canonical: "/yoga-nidra" },
}

/**
 * Yoga Nidra.
 *
 * Esta página ya tiene su texto: es el que está publicado en la web actual,
 * respetado palabra por palabra. Se ordena en cuatro bloques porque así se lee
 * mejor, no porque falte nada.
 *
 * El bloque de datos de la derecha existe por un motivo concreto: quien llega
 * aquí quiere saber si tiene que saber algo antes, si puede hacerlo con una
 * lesión y cuánto dura. Las tres respuestas están en su texto, pero estaban
 * enterradas en un párrafo, y ahí no las encuentra quien tiene prisa.
 */
export default function PaginaYogaNidra() {
  return (
    <Pagina
      etiqueta="Propuestas concretas"
      titulo="Yoga Nidra"
      entradilla={yogaNidra.entradilla}
    >
      {/* ── En qué consiste, y los datos ─────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-2xl">En qué consiste</h2>
            <p className="paso-base medida mt-5 text-ink-soft">
              {yogaNidra.queEs}
            </p>
          </div>

          <dl className="lg:col-span-4 lg:col-start-9">
            {yogaNidra.datos.map((dato) => (
              <div
                key={dato.etiqueta}
                className="border-t border-line py-4 first:border-t-0 first:pt-0"
              >
                <dt className="etiqueta">{dato.etiqueta}</dt>
                <dd className="paso-pequeno mt-1.5">{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Los beneficios, que son suyos y son siete ────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">Qué te llevas</h2>

          <ul className="mt-8 border-t border-line">
            {yogaNidra.beneficios.map((beneficio) => (
              <li
                key={beneficio}
                className="border-b border-line py-4 text-ink-soft"
              >
                {beneficio}
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Cómo es una sesión ───────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">Cómo es una sesión</h2>
          <p className="paso-base medida mt-5 text-ink-soft">
            {yogaNidra.comoEs}
          </p>
        </Contenedor>
      </section>

      {/* ── Reservar ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[22ch]">
            La primera vez que vengas, es gratis
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            El Yoga Nidra se anuncia aparte del horario de clases, así que
            escríbenos y te decimos cuándo es la próxima sesión.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappUrl("Hola Susana, me interesa el Yoga Nidra.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preguntar por la próxima sesión
              </a>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
