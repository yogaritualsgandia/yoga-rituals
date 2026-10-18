import type { Metadata } from "next"
import Image from "next/image"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { avisoFotosProvisionales, fotos } from "@/content/medios"
import { whatsappUrl } from "@/content/site"
import { biografia, cierreSobreMi, formacion, sobreMi } from "@/content/sobreMi"

export const metadata: Metadata = {
  title: "Susana Estruch Espinós",
  description:
    "Susana Estruch Espinós, directora de YOGA Rituals en Gandia: profesora de yoga desde 2005 por AIPYS Madrid, con formación en Yoga Restaurativo, Nidra, Oncológico, Mindfulness MBTB y Breathwork Inbreath.",
  alternates: { canonical: "/sobre-mi" },
}

/**
 * Susana.
 *
 * Su historia va tal cual la cuenta ella, y al lado la formación, que es lo que
 * se viene a comprobar cuando alguien decide en quién confía su espalda. Las
 * dos cosas están arriba, juntas: la historia explica por qué empezó y la
 * formación dice si sabe lo que hace.
 *
 * Aquí estuvieron las opiniones, y se han ido a la portada. En esta página
 * hablaban de ella al lado de su propio relato, que es el sitio donde una
 * opinión se lee con más desconfianza; en la portada hacen el trabajo que
 * tienen que hacer, que es decirle a quien acaba de llegar que esto ya
 * funciona.
 *
 * La foto sigue siendo de ejemplo, y se dice debajo. La suya no existe todavía.
 */
export default function PaginaSobreMi() {
  return (
    <Pagina
      etiqueta="Sobre mí"
      titulo={sobreMi.nombre}
      entradilla={sobreMi.entradilla}
    >
      {/* ── Su historia, y la formación al lado ──────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-2xl">Cómo llegué aquí</h2>

            <div className="flex flex-col gap-5">
              {biografia.map((parrafo) => (
                <p key={parrafo} className="paso-base medida text-ink-soft first:mt-5">
                  {parrafo}
                </p>
              ))}
            </div>

            <p className="paso-base medida mt-8 border-t border-line pt-8 text-ink">
              {cierreSobreMi.titular}.
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <figure>
              <div className="relative aspect-4/5 overflow-hidden rounded-lg">
                <Image
                  src={fotos.incienso.src}
                  alt={fotos.incienso.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 92vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="etiqueta mt-3 block">
                {avisoFotosProvisionales}
              </figcaption>
            </figure>
          </div>
        </Contenedor>
      </section>

      {/* ── La formación ─────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-3xl">Formación</h2>

          <ul className="mt-8 grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2">
            {formacion.map((estudio) => (
              <li
                key={estudio.titulo}
                className="flex flex-col border-b border-line py-4"
              >
                <span>{estudio.titulo}</span>
                {"detalle" in estudio ? (
                  <span className="paso-pequeno mt-1 text-ink-soft">
                    {estudio.detalle}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Cerrar ───────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">
            Ven a conocernos sin compromiso
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {cierreSobreMi.texto}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappUrl("Hola Susana, quiero conoceros.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
