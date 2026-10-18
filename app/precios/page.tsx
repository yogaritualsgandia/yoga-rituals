import type { Metadata } from "next"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { Pagina } from "@/components/layout/pagina"
import { bonos, formasDePago, planes, pruebaGratuita } from "@/content/precios"

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Precios de YOGA Rituals en Gandia: desde 40 € al mes por una clase semanal, con opción trimestral más económica. Bono de 6 clases y clase suelta. Primera clase de prueba gratuita.",
  alternates: { canonical: "/precios" },
}

const euros = (cantidad: number) => `${cantidad} €`

/**
 * El precio equivalente al mes de cada plan trimestral. No es un cálculo
 * decorativo: en la web actual los trimestres se anuncian así («35 €/mes»), y
 * ponerlo evita que cada visitante saque la calculadora.
 */
const alMesDelTrimestre = (trimestral: number) => Math.round(trimestral / 3)

export default function PaginaPrecios() {
  return (
    <Pagina
      etiqueta="Precios"
      titulo="Cuántas clases quieres a la semana"
      entradilla="Eliges el ritmo que te encaja y lo puedes cambiar. Si un mes vienes menos, tienes el bono; si vienes mucho, el plan de tres días sale mejor."
    >
      <section className="seccion pt-0">
        <Contenedor>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Precios mensuales y trimestrales de YOGA Rituals según el número
              de clases a la semana
            </caption>

            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="etiqueta py-3 pr-4 font-normal">
                  Plan
                </th>
                <th scope="col" className="etiqueta py-3 pr-4 font-normal">
                  Al mes
                </th>
                <th scope="col" className="etiqueta py-3 font-normal">
                  Trimestre
                </th>
              </tr>
            </thead>

            <tbody>
              {planes.map((plan) => (
                <tr key={plan.nombre} className="border-b border-line align-top">
                  <th scope="row" className="py-6 pr-4 font-normal">
                    <span className="block font-heading text-xl">
                      {plan.nombre}
                    </span>
                    <span className="paso-pequeno mt-1 block text-ink-soft">
                      {plan.para}
                    </span>
                  </th>

                  <td className="py-6 pr-4">
                    <span className="font-heading text-2xl tabular-nums">
                      {euros(plan.mensual)}
                    </span>
                    <span className="paso-pequeno mt-1 block text-ink-soft">
                      al mes
                    </span>
                  </td>

                  <td className="py-6">
                    <span className="font-heading text-2xl tabular-nums">
                      {euros(plan.trimestral)}
                    </span>
                    <span className="paso-pequeno mt-1 block text-ink-soft">
                      los tres meses · sale a{" "}
                      {euros(alMesDelTrimestre(plan.trimestral))} al mes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl">Sin compromiso</h2>
              <dl className="mt-6 flex flex-col gap-4">
                {bonos.map((bono) => (
                  <div
                    key={bono.nombre}
                    className="flex items-baseline justify-between gap-4 border-b border-line pb-4"
                  >
                    <dt>
                      <span className="block">{bono.nombre}</span>
                      <span className="paso-pequeno text-ink-soft">
                        {bono.nota}
                      </span>
                    </dt>
                    <dd className="font-heading text-xl tabular-nums">
                      {euros(bono.precio)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg bg-surface-2/60 p-7">
              <p className="etiqueta">{pruebaGratuita.etiqueta}</p>
              <p className="mt-4 font-heading text-2xl">
                {pruebaGratuita.nota}
              </p>
              <p className="paso-pequeno medida mt-4 text-ink-soft">
                Es la única vez que hay que reservar. Después ya puedes venir
                el día que quieras, sin avisar.
              </p>
              <BotonReserva className="mt-7" />
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ── Cómo se paga ─────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">{formasDePago.titulo}</h2>

          {/* Estas cuatro filas contestan lo que se pregunta por WhatsApp antes
              de apuntarse: con qué se paga, cuándo, qué pasa si un mes falta
              una clase y qué se gana pagando el trimestre. Estaban escritas en
              su web y aquí no se veían. */}
          <dl className="mt-8 border-t border-line">
            {[
              { etiqueta: "Con qué", texto: formasDePago.formas },
              { etiqueta: "Cuándo", texto: formasDePago.fecha },
              {
                etiqueta: "Si un día no vienes",
                texto: formasDePago.recuperacion,
              },
              {
                etiqueta: "Pago trimestral",
                texto: formasDePago.descuento,
              },
            ].map((fila) => (
              <div
                key={fila.etiqueta}
                className="border-b border-line py-5 sm:grid sm:grid-cols-12 sm:gap-8"
              >
                <dt className="etiqueta sm:col-span-3">{fila.etiqueta}</dt>
                <dd className="medida paso-base mt-2 text-ink-soft sm:col-span-8 sm:col-start-5 sm:mt-0">
                  {fila.texto}
                </dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>
    </Pagina>
  )
}
