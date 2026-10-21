import Link from "next/link"

import { Contenedor } from "./contenedor"
import { Pagina } from "./pagina"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { FotoDeSeccion } from "@/components/layout/foto-editorial"
import { Button } from "@/components/ui/button"
import type { EstiloDetalle } from "@/content/clases"
import type { Fotografia } from "@/content/medios"
import { whatsappUrl } from "@/content/site"

/**
 * La página de un estilo: Hatha o Vinyasa.
 *
 * Las dos se cuentan igual —qué es, qué se hace en clase, qué aporta y para
 * quién es— porque quien llega aquí muchas veces está decidiendo entre las dos,
 * y para decidir hace falta leer lo mismo en el mismo orden. Si cada página
 * contara lo suyo a su manera, comparar sería un trabajo.
 *
 * Está en un solo componente por eso mismo: dos copias de la misma estructura
 * se separan en cuanto alguien toca una. El texto de cada estilo vive en
 * `content/clases.ts`, entero, y aquí solo se coloca.
 *
 * Los cuatro titulares son los mismos en las dos páginas y son las cuatro
 * preguntas que se hace quien va a venir. Ninguna se llama «beneficios»: eso es
 * vocabulario de folleto.
 *
 * La foto la elige cada página y la pasa aquí, en vez de vivir dentro de este
 * componente: así se puede cambiar sin tocar la estructura. Hatha y Vinyasa no
 * comparten proporción porque las dos fotos no comparten forma.
 */
export function PaginaDeEstilo({
  estilo,
  foto,
  aspecto = "aspect-4/5",
}: {
  estilo: EstiloDetalle
  foto: Fotografia
  aspecto?: string
}) {
  return (
    <Pagina etiqueta="Clases" titulo={estilo.nombre} entradilla={estilo.lema}>
      {/* ── Qué es ───────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <p className="paso-entrada medida text-ink-soft">{estilo.intro}</p>
        </Contenedor>
      </section>

      {/* ── Qué vas a encontrar en clase ─────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="paso-titular max-w-[24ch]">
              Qué vas a encontrar en clase
            </h2>

            {/* Las líneas largas siguen cortadas a `medida` aunque la columna
                dé para más: la raya de debajo de cada punto marca dónde acaba
                la lectura, y sin ese tope cada punto mediría lo que mida la
                pantalla. */}
            <ul className="mt-12 flex flex-col border-t border-line">
              {estilo.enClase.map((punto) => (
                <li
                  key={punto}
                  className="medida paso-base border-b border-line py-5 text-ink-soft"
                >
                  {punto}
                </li>
              ))}
            </ul>
          </div>

          {/* La foto baja veinte píxeles respecto al titular, igual que en la
              portada, para que la línea del titular y la primera raya no se
              lean como un único bloque de texto pegado al borde de la foto. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-20">
            <FotoDeSeccion
              foto={foto}
              aspecto={aspecto}
              sizes="(min-width: 1024px) 38vw, 92vw"
            />
          </div>
        </Contenedor>
      </section>

      {/* ── Qué puede aportarte ──────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[22ch]">Qué puede aportarte</h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {estilo.aporta}
          </p>
        </Contenedor>
      </section>

      {/* ── Esta es tu clase ─────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="paso-titular max-w-[24ch]">{estilo.paraQuien}</h2>

            <p className="paso-entrada medida mt-6 text-ink-soft">
              La primera clase es gratis, y es la única de la web que se
              reserva: nos escribes, te decimos qué día encaja mejor y vienes
              sin traer nada. A partir de ahí, el horario es libre y vienes el
              día que puedas, sin apuntarte a nada.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9 lg:justify-center">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappUrl(
                  `Hola Susana, me interesa el ${estilo.nombre}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preguntar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/horarios">Ver horarios</Link>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
