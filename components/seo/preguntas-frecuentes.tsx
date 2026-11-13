import { Contenedor } from "@/components/layout/contenedor"
import type { Pregunta } from "@/content/faqs"

/**
 * Preguntas frecuentes visibles y semánticas.
 *
 * Es una lista de definición, no un acordeón: la respuesta tiene que estar en
 * el HTML desde el primer byte para que la pueda leer un rastreador que no
 * ejecuta JavaScript. En `/primera-vez` se mantiene el acordeón porque fue una
 * petición expresa, pero allí el panel se fuerza a vivir en el DOM.
 *
 * No lleva estado ni animación propia: entra con el mismo ritmo de sección que
 * el resto de la página.
 */
export function PreguntasFrecuentes({
  preguntas,
  titulo = "Preguntas frecuentes",
  id = "preguntas-frecuentes",
}: {
  preguntas: readonly Pregunta[]
  titulo?: string
  id?: string
}) {
  if (preguntas.length === 0) return null

  return (
    <section className="seccion pt-0" aria-labelledby={id}>
      <Contenedor>
        <h2 id={id} className="paso-titular max-w-[26ch]">
          {titulo}
        </h2>

        <dl className="mt-12 max-w-3xl border-t border-line">
          {preguntas.map((pregunta) => (
            <div key={pregunta.pregunta} className="border-b border-line py-6">
              <dt className="font-heading text-lg text-ink">
                {pregunta.pregunta}
              </dt>
              <dd className="paso-base medida mt-3 text-ink-soft">
                {pregunta.respuesta}
              </dd>
            </div>
          ))}
        </dl>
      </Contenedor>
    </section>
  )
}
