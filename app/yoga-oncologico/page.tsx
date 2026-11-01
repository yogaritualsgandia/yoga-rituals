import type { Metadata } from "next"

import { BotonEnlace } from "@/components/layout/boton-enlace"
import { Contenedor } from "@/components/layout/contenedor"
import { BandaFoto } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { fotos } from "@/content/medios"
import { preguntasFrecuentes } from "@/content/primeraVez"
import { whatsappUrl } from "@/content/site"
import { yogaOncologico } from "@/content/yogaOncologico"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Yoga oncológico",
  descripcion:
    "Yoga oncológico en Gandia: práctica adaptada para quien está pasando por un proceso oncológico, con o sin experiencia. Escríbenos antes de empezar.",
  ruta: "/yoga-oncologico",
})

/**
 * Yoga oncológico.
 *
 * Esta página ya tiene su texto —el que está publicado en su web— y por eso ha
 * dejado de ser una página con un aviso. Se ordena así:
 *
 *   1. Qué es, en sus dos frases, sin adornos.
 *   2. Que formamos parte de la Red Internacional, que es lo que respalda que
 *      esto se hace con criterio y no de buena fe.
 *   3. La respuesta que ya estaba publicada sobre practicar con una dolencia,
 *      que es la primera duda de quien llega aquí.
 *   4. El horario, que no se puede poner todavía porque hay dos versiones.
 *
 * El bloque 3 se queda aunque ahora haya texto propio, y no sobra: la pregunta
 * por una lesión o una dolencia es anterior a cualquier otra y aquí se contesta
 * con lo que el estudio tiene publicado, no con una frase escrita para esta
 * página.
 *
 * De dónde sale esa respuesta se cuenta aquí, en el comentario, y no debajo del
 * bloque: quién la lee no necesita saber que ya estaba escrita en otro sitio, y
 * decírselo era explicarle la web en lugar de contestarle.
 */
export default function PaginaYogaOncologico() {
  const sobreLesiones = preguntasFrecuentes.find((pregunta) =>
    pregunta.pregunta.includes("lesión"),
  )

  return (
    <Pagina
      etiqueta="Propuestas concretas"
      titulo="Yoga oncológico"
      entradilla={yogaOncologico.entradilla}
    >
      {/* ── Qué es ───────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <div className="medida flex flex-col gap-6">
            {yogaOncologico.parrafos.map((parrafo) => (
              <p key={parrafo} className="paso-base text-ink-soft">
                {parrafo}
              </p>
            ))}
          </div>

          <p className="paso-base medida mt-8 border-t border-line pt-8">
            {yogaOncologico.red.textoAntes}{" "}
            <a
              href={yogaOncologico.red.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-4 hover:text-brand-hover"
            >
              {yogaOncologico.red.enlace}
            </a>
            .
          </p>
        </Contenedor>
      </section>

      <BandaFoto foto={fotos.oncoRestaurativo} aspecto="aspect-3/2" />

      {/* ── La duda de siempre ───────────────────────────────────────────── */}
      {sobreLesiones ? (
        <section className="seccion pt-0">
          <Contenedor>
            {/* El bloque va sin titular, y a propósito: la pregunta se presenta
                sola, y ponerle encima «Lo que ya está respondido» era contar de
                dónde viene la respuesta en vez de contestarla. */}
            <dl className="max-w-3xl border-t border-line">
              <div className="border-b border-line py-6">
                <dt className="font-heading text-lg">
                  {sobreLesiones.pregunta}
                </dt>
                <dd className="medida paso-base mt-3 text-ink-soft">
                  {sobreLesiones.respuesta}
                </dd>
              </div>
            </dl>
          </Contenedor>
        </section>
      ) : null}

      {/* ── Estamos aquí ─────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[22ch]">
            Estamos aquí para acompañarte
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            Cuéntanos tu caso y te decimos con franqueza si esta práctica te
            encaja, antes de que vengas.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <BotonEnlace
              href={whatsappUrl(
                "Hola Susana, quiero información sobre el yoga oncológico.",
              )}
              externo
            >
              Escríbenos por WhatsApp
            </BotonEnlace>
            <BotonEnlace href="/primera-vez" variante="outline">
              Primera vez
            </BotonEnlace>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
