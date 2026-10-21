import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { FotoDeSeccion } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { fotos } from "@/content/medios"
import { mindfulness } from "@/content/mindfulness"
import { accionPrincipal, whatsappUrl } from "@/content/site"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Mindfulness",
  descripcion:
    "Mindfulness en la Biblioteca Benipeixcar-Raval de Gandia: miércoles a las 10:30, una hora. Con Susana Estruch, monitora de Mindfulness MBTB.",
  ruta: "/mindfulness",
})

/**
 * Mindfulness.
 *
 * La página se ordena como se pregunta: dónde es y a qué hora —los cuatro
 * datos, arriba y en fichas, porque es lo único que se viene a buscar—, si hay
 * sitio ahora mismo, qué pasa dentro de la hora que dura, y qué más hay del
 * mismo tema en el estudio.
 *
 * El aviso de las plazas va pegado a los datos y no en un bloque aparte: es la
 * letra pequeña del dato «Reservas», y separarlo sería hacer que se leyera
 * tarde, justo cuando ya ha decidido venir.
 */
export default function PaginaMindfulness() {
  return (
    <Pagina
      etiqueta="Propuestas concretas"
      titulo="Mindfulness"
      entradilla={mindfulness.entradilla}
    >
      {/* ── Los cuatro datos, y el estado de las plazas ──────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <dl className="grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {mindfulness.datos.map((dato) => (
              <div key={dato.etiqueta}>
                <dt className="etiqueta">{dato.etiqueta}</dt>
                <dd className="font-heading mt-2 text-xl">{dato.valor}</dd>
              </div>
            ))}
          </dl>

          <p className="paso-base medida mt-10 border-l-2 border-brand/40 bg-surface-2/60 py-4 pl-5 text-ink-soft">
            <strong className="font-medium text-ink">
              {mindfulness.aviso.ahora}
            </strong>{" "}
            {mindfulness.aviso.resto}
          </p>
        </Contenedor>
      </section>

      {/* ── Qué esperar ──────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="font-heading text-2xl">Qué esperar</h2>

            <div className="medida mt-5 flex flex-col gap-4">
              {mindfulness.queEsperar.map((parrafo) => (
                <p key={parrafo} className="paso-base text-ink-soft">
                  {parrafo}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <FotoDeSeccion
              foto={fotos.mindfulnessBuda}
              aspecto="aspect-4/5"
              sizes="(min-width: 1024px) 38vw, 92vw"
            />
          </div>
        </Contenedor>
      </section>

      {/* ── El taller de respiración que viene ───────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <div className="rounded-lg border border-line p-6 md:flex md:items-center md:justify-between md:gap-10 md:p-8">
            <div>
              <p className="etiqueta">{mindfulness.proximoTaller.titular}</p>
              <p className="font-heading mt-2 text-xl">
                {mindfulness.proximoTaller.cuando}
              </p>
              <p className="paso-pequeno mt-1 text-ink-soft">
                {mindfulness.proximoTaller.donde}
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-6 shrink-0 md:mt-0"
            >
              <Link href="/breathwork">Ver el taller</Link>
            </Button>
          </div>
        </Contenedor>
      </section>

      {/* ── Preguntar ────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[22ch]">
            {mindfulness.cierre.titular}
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {mindfulness.cierre.texto}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a
                href={whatsappUrl(
                  "Hola Susana, quiero venir a la sesión de mindfulness.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preguntar por la sesión
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={accionPrincipal.href}>
                {accionPrincipal.etiqueta}
              </Link>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
