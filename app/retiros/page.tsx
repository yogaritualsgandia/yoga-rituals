import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { talleresColegios } from "@/content/clases"
import { whatsappUrl } from "@/content/site"

export const metadata: Metadata = {
  title: "Retiros y eventos",
  description:
    "Retiros y eventos de YOGA Rituals, el estudio de yoga de Gandia: salidas y encuentros que se organizan fuera de la sala, a lo largo del año.",
  alternates: { canonical: "/retiros" },
}

/**
 * Retiros y eventos.
 *
 * Sin texto propio todavía. Lo único que hay de verdad es que esta actividad
 * existe —figura en la web actual— y que forma parte de la lista de «otras
 * actividades» que Susana ha hecho: mindfulness en una biblioteca,
 * actividades en un hospital, retiros y eventos. Esa lista sí es real y se
 * muestra como lo que es: el historial, no la oferta del próximo trimestre.
 *
 * Faltan las fechas, los sitios y los precios, que son justo lo que se viene a
 * buscar aquí. No se ponen de ejemplo.
 */
export default function PaginaRetiros() {
  return (
    <Pagina
      etiqueta="Fuera de la sala"
      titulo="Retiros y eventos"
      entradilla="Salidas y encuentros que se organizan fuera del estudio."
    >
      <EnPreparacion pendiente="Falta el calendario: qué retiros hay previstos, dónde, cuándo, cuánto duran y cuánto cuestan. Sin fechas reales esta página no puede hacer su trabajo, y unas fechas inventadas serían peor que no tener ninguna." />

      {/* ── Lo que sí ha pasado ──────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">
            El yoga también ha salido del estudio
          </h2>
          <p className="medida paso-base mt-4 text-ink-soft">
            Estas son las actividades que Susana ha llevado fuera de la sala:
          </p>

          <ul className="mt-8 flex flex-col border-t border-line">
            {talleresColegios.otros.map((actividad) => (
              <li
                key={actividad}
                className="border-b border-line py-5 font-heading text-xl"
              >
                {actividad}
              </li>
            ))}
          </ul>

          <p className="paso-pequeno mt-6 text-ink-soft">
            Son actividades ya realizadas, no la programación de este curso.
          </p>
        </Contenedor>
      </section>

      {/* ── Mientras tanto ───────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">
            ¿Quieres que te avisemos del próximo?
          </h2>
          <p className="medida paso-base mt-4 text-ink-soft">
            Escríbenos y te lo contamos en cuanto haya fecha.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escríbenos por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/talleres-centros-educativos">
                Ver los talleres en colegios
              </Link>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
