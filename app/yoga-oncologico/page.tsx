import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { preguntasFrecuentes } from "@/content/primeraVez"
import { accionPrincipal, whatsappUrl } from "@/content/site"

export const metadata: Metadata = {
  title: "Yoga oncológico",
  description:
    "Yoga oncológico en YOGA Rituals, Gandia: práctica adaptada para quien está pasando por un proceso oncológico. Escríbenos antes de empezar.",
  alternates: { canonical: "/yoga-oncologico" },
}

/**
 * Yoga oncológico.
 *
 * Esta página todavía no tiene texto propio: el nombre es real, sale de la web
 * actual, pero el contenido no lo tengo y no me lo invento. Lo que sí hay es
 * una respuesta que Susana ya tiene publicada sobre practicar con una lesión o
 * una dolencia, que es justo lo que aquí se pregunta primero, y que se lee del
 * mismo sitio de donde sale todo lo demás: content/primeraVez.ts.
 *
 * La página está en pie, enlazada y es accesible. Lo que falta está a la
 * vista, no escondido.
 */
export default function PaginaYogaOncologico() {
  const sobreLesiones = preguntasFrecuentes.find((pregunta) =>
    pregunta.pregunta.includes("lesión"),
  )

  return (
    <Pagina
      etiqueta="Propuestas concretas"
      titulo="Yoga oncológico"
      entradilla="Una práctica adaptada para quien está pasando por un proceso oncológico."
    >
      <EnPreparacion pendiente="Falta el texto de esta página: qué se hace en una sesión, quién puede venir, cada cuánto, cómo se adaptan las posturas y si hace falta traer algo. Lo tiene que contar Susana. Aquí no se escribe nada que no sea verdad, y menos en algo así." />

      {sobreLesiones ? (
        <section className="seccion pt-0">
          <Contenedor>
            <h2 className="font-heading text-2xl">
              Lo que ya está respondido
            </h2>
            <dl className="mt-8 max-w-3xl border-t border-line">
              <div className="border-b border-line py-6">
                <dt className="font-heading text-lg">
                  {sobreLesiones.pregunta}
                </dt>
                <dd className="medida paso-base mt-3 text-ink-soft">
                  {sobreLesiones.respuesta}
                </dd>
              </div>
            </dl>
            <p className="paso-pequeno mt-6 text-ink-soft">
              Es una de las{" "}
              <Link
                href="/primera-vez"
                className="text-brand underline underline-offset-4 hover:text-brand-hover"
              >
                preguntas frecuentes del estudio
              </Link>
              , no una respuesta escrita para esta página.
            </p>
          </Contenedor>
        </section>
      ) : null}

      {/* ── Mientras tanto ───────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[22ch]">
            Si es para ti o para alguien tuyo, escríbenos
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            Cuéntanos tu caso y te decimos con franqueza si esta práctica te
            encaja, antes de que vengas.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
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
