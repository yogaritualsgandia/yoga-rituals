import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  aTenerEnCuenta,
  cierrePrimeraVez,
  preguntasFrecuentes,
  preguntasPendientes,
  primeraVez,
  queNecesitas,
} from "@/content/primeraVez"
import { accionPrincipal, site, whatsappUrl } from "@/content/site"

export const metadata: Metadata = {
  title: "Primera vez",
  description:
    "Vienes por primera vez a YOGA Rituals, en Gandia: qué llevar, cómo empezar sin prisa y las dudas más habituales antes de tu primera clase.",
  alternates: { canonical: "/primera-vez" },
}

/**
 * Primera vez.
 *
 * Es la página que más trabaja de toda la web. Quien nunca ha hecho yoga no
 * duda del yoga: duda de sí misma. Todo el texto es el que Susana ya tiene
 * publicado, palabra por palabra, y está puesto en el orden en el que se
 * pregunta: ¿me hará falta algo?, ¿cómo me tengo que comportar?, ¿y si me
 * pasa esto?
 *
 * Los dos «ganchos» —lo de la flexibilidad y lo de los horarios libres— van
 * arriba y en grande porque son las dos objeciones que frenan el primer paso.
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
      {/* ── Las dos objeciones que frenan el primer paso ─────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {primeraVez.ganchos.map((gancho) => (
              <li
                key={gancho}
                className="border-t-2 border-brand pt-6 font-heading text-xl text-ink"
              >
                {gancho}
              </li>
            ))}
          </ul>

          <p className="mt-10">
            <Link
              href="/horarios"
              className="text-brand underline underline-offset-4 hover:text-brand-hover"
            >
              Ver el horario completo
            </Link>
          </p>
        </Contenedor>
      </section>

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

      {/* ── El cuestionario ──────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <div className="max-w-[46rem] rounded-[var(--radius)] bg-surface-2/70 p-8 sm:p-11">
            <h2 className="font-heading text-2xl">
              ¿No sabes por dónde empezar?
            </h2>
            <p className="medida paso-base mt-5 text-ink-soft">
              {primeraVez.cuestionarioTexto}
            </p>
            <Button asChild size="lg" className="mt-8">
              {/* El cuestionario vive fuera, en Tally. Se abre en otra
                  pestaña para no perder lo que estabas leyendo. */}
              <a
                href={site.cuestionario}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rellenar el cuestionario
              </a>
            </Button>
          </div>
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
              <AccordionItem key={pregunta.pregunta} value={pregunta.pregunta}>
                <AccordionTrigger>{pregunta.pregunta}</AccordionTrigger>
                <AccordionContent>{pregunta.respuesta}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Contenedor>
      </section>

      {/* ── Lo que aún no tiene respuesta ────────────────────────────────── */}
      <EnPreparacion
        pendiente={`Hay tres dudas que todavía no tienen respuesta, y no me las voy a inventar. Quedan aquí a la vista para que no se pierdan: ${preguntasPendientes.join(" ")}`}
      />

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
            <Button asChild size="lg">
              <Link href={accionPrincipal.href}>
                {accionPrincipal.etiqueta}
              </Link>
            </Button>
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
