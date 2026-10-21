import type { Metadata } from "next"
import Link from "next/link"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { BandaFoto } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import {
  duracionEnPalabras,
  horario,
  horarioLibre,
} from "@/content/horario"
import { fotos } from "@/content/medios"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Horarios",
  descripcion:
    "Horario de YOGA Rituals en Gandia: clases de 35, 60 y 75 minutos de lunes a sábado. Horarios libres, sin reserva previa ni aviso.",
  ruta: "/horarios",
})

/**
 * Horario.
 *
 * Dos decisiones:
 *
 * 1. Es una <table> de verdad, con `scope` en cada cabecera, y no una rejilla
 *    de divs. Un horario es información tabular y así lo lee un lector de
 *    pantalla, anunciando «Lunes, 19:00 a 20:15» al moverse por las celdas.
 *
 * 2. Solo dos columnas. La duración va dentro de la celda de horas: tres
 *    columnas no caben a 375 px sin encoger el texto, y encoger el texto es
 *    peor que reordenarlo.
 */
export default function PaginaHorarios() {
  return (
    <Pagina
      etiqueta="Horarios"
      titulo="Tienes plena libertad para organizar tus horarios"
      entradilla={horarioLibre.entradilla}
    >
      <section className="seccion pt-0">
        <Contenedor>
          <table className="w-full max-w-4xl border-collapse text-left">
            <caption className="sr-only">
              Horario semanal del estudio YOGA Rituals, en Gandia
            </caption>

            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="etiqueta py-3 pr-4 font-normal">
                  Día
                </th>
                <th scope="col" className="etiqueta py-3 font-normal">
                  Horas
                </th>
              </tr>
            </thead>

            <tbody>
              {horario.map((dia) => (
                <tr key={dia.dia} className="border-b border-line align-top">
                  <th
                    scope="row"
                    className="py-5 pr-4 font-heading text-xl font-normal"
                  >
                    {dia.dia}
                  </th>

                  <td className="py-5">
                    {dia.franjas.length === 0 ? (
                      <span className="text-ink-soft">Cerrado</span>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {dia.franjas.map((franja) => (
                          <li
                            key={franja.inicio}
                            className="flex flex-wrap items-baseline gap-x-3"
                          >
                            <span className="tabular-nums">
                              {franja.inicio}–{franja.fin}
                            </span>
                            <span className="paso-pequeno text-ink-soft">
                              {duracionEnPalabras(franja.duracionMin)}
                              {franja.expres ? " · exprés" : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="paso-pequeno mt-6 max-w-[52ch] text-ink-soft">
            {horarioLibre.notaExpres}
          </p>
        </Contenedor>
      </section>

      <BandaFoto foto={fotos.horariosMaterial} aspecto="aspect-[16/7]" />

      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">Cómo funciona</h2>
          <dl className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {horarioLibre.escenarios.map((escenario) => (
              <div key={escenario.situacion}>
                <dt className="font-heading text-lg">{escenario.situacion}</dt>
                <dd className="paso-pequeno medida mt-2 text-ink-soft">
                  {escenario.respuesta}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex flex-wrap gap-3">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <Link href="/precios">Ver los precios</Link>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
