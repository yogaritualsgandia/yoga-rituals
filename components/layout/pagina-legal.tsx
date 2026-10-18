import type { ReactNode } from "react"

import { Contenedor } from "@/components/layout/contenedor"
import { EnPreparacion } from "@/components/layout/en-preparacion"
import { Pagina } from "@/components/layout/pagina"
import type { DocumentoLegal } from "@/content/legal"

/**
 * Una página legal.
 *
 * Los tres documentos —aviso legal, privacidad y cookies— son la misma pieza
 * con otro texto dentro, así que se pintan desde aquí y no tres veces. Lo que
 * cambia se queda en `content/legal.ts`, que es donde se lee y se corrige.
 *
 * El ritmo no es el de las demás páginas, y es a propósito: en el resto, cada
 * bloque es una idea y va separado por el hueco grande de la casa. Aquí el
 * texto es uno solo y se lee seguido, así que los bloques van más juntos. Un
 * aviso legal con los huecos de la portada se hace eterno y no se lee, que es
 * justo lo contrario de lo que tiene que pasar.
 *
 * El ancho también es distinto: 46 caracteres son cómodos para un párrafo
 * suelto, pero una lista de derechos con ese ancho baja hasta el infinito. El
 * documento entero se limita a sesenta y cinco, que es lo que aguanta una
 * lectura larga sin que la vista tenga que barrer.
 *
 * Y admite hijos al final, después del último bloque. Existe por una sola
 * página: la de cookies, que necesita un botón de verdad —para cambiar lo que
 * se haya elegido— y un botón no cabe en un texto. Lo que se pasa aquí se
 * coloca con el mismo ritmo que los bloques y con las mismas clases que usa el
 * renderizador, así que no se nota que viene de fuera.
 */
export function PaginaLegal({
  documento,
  children,
}: {
  documento: DocumentoLegal
  children?: ReactNode
}) {
  return (
    <Pagina
      etiqueta="Legal"
      titulo={documento.titulo}
      entradilla={documento.entradilla}
    >
      {documento.falta ? <EnPreparacion pendiente={documento.falta} /> : null}

      <section className="seccion pt-0">
        <Contenedor>
          <div className="flex max-w-[65ch] flex-col gap-12">
            {documento.bloques.map((bloque) => (
              <div key={bloque.titulo}>
                <h2 className="font-heading text-2xl">{bloque.titulo}</h2>

                {bloque.datos ? (
                  <dl className="mt-6">
                    {bloque.datos.map((dato) => (
                      <div
                        key={dato.etiqueta}
                        className="border-t border-line py-4 first:border-t-0 first:pt-0"
                      >
                        <dt className="etiqueta">{dato.etiqueta}</dt>
                        <dd className="paso-pequeno mt-1.5">{dato.valor}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {bloque.parrafos ? (
                  <div className="mt-5 flex flex-col gap-4">
                    {bloque.parrafos.map((parrafo) => (
                      <p key={parrafo} className="paso-base text-ink-soft">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                ) : null}

                {bloque.lista ? (
                  <ul className="mt-5 flex flex-col gap-3">
                    {bloque.lista.map((punto) => (
                      <li
                        key={punto}
                        className="paso-base flex gap-3 text-ink-soft"
                      >
                        {/* El punto va fuera del texto y sin voz: una lista de
                            derechos leída en alto no necesita oír «punto» en
                            cada línea. */}
                        <span
                          aria-hidden="true"
                          className="bg-brand mt-[0.7em] size-1.5 shrink-0 rounded-full"
                        />
                        <span>{punto}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            {children}

            <p className="etiqueta border-t border-line pt-6">
              Última actualización: {documento.actualizado}
            </p>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
