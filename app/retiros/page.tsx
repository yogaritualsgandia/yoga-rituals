import type { Metadata } from "next"

import { BotonEnlace } from "@/components/layout/boton-enlace"
import { Contenedor } from "@/components/layout/contenedor"
import { FotoDeSeccion } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { talleresColegios } from "@/content/clases"
import { fotos } from "@/content/medios"
import { retiros } from "@/content/retiros"
import { whatsappUrl } from "@/content/site"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Retiros y eventos",
  descripcion:
    "Retiro de Yoga en Zarra con YOGA Rituals: un fin de semana de yoga, pranayama, meditación y paseos por el Bosque Encantado, con alojamiento y comidas.",
  ruta: "/retiros",
})

/**
 * Retiros y eventos.
 *
 * Esta página pasó de no tener nada a tener casi todo: su texto estaba en la web
 * actual y lo que faltaba era el calendario. Ahora mismo hace dos cosas y las
 * dos importan: cuenta cómo es el fin de semana —que es lo que decide a quien
 * está dudando— y pide la fecha, que es lo que falta para poder reservar.
 *
 * El programa va en una lista con líneas, y no en tarjetas con iconos: son
 * cuatro cosas que pasan en el mismo fin de semana, en orden, y una lista lo
 * dice mejor que cuatro cajas sueltas. Además, este es un sitio que no vende
 * con iconos.
 */
export default function PaginaRetiros() {
  return (
    <Pagina
      etiqueta="Fuera de la sala"
      titulo="Retiros y eventos"
      entradilla={retiros.entradilla}
    >
      {/* ── El programa ──────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-2xl">
              Lo que vivirás en cada encuentro
            </h2>
            <p className="medida paso-base mt-4 text-ink-soft">
              {retiros.intro}
            </p>

            <ul className="mt-8 border-t border-line">
              {retiros.programa.map((parte) => (
                <li key={parte.titulo} className="border-b border-line py-6">
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-10">
                    <h3 className="font-heading text-lg lg:col-span-4">
                      {parte.titulo}
                    </h3>
                    <p className="medida paso-base text-ink-soft lg:col-span-7 lg:col-start-6">
                      {parte.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="medida paso-base mt-8 text-ink-soft">
              {retiros.completo}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <FotoDeSeccion
              foto={fotos.retiroZarra}
              aspecto="aspect-4/5"
              sizes="(min-width: 1024px) 33vw, 92vw"
            />
          </div>
        </Contenedor>
      </section>

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

      {/* ── Reservar ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">{retiros.cierre}</h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            Escríbenos y te contamos cuándo es el próximo y qué hay que hacer
            para guardarte una plaza.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <BotonEnlace
              href={whatsappUrl(
                "Hola Susana, quiero información sobre el próximo retiro.",
              )}
              externo
            >
              Preguntar por el próximo retiro
            </BotonEnlace>
            <BotonEnlace href="/clases" variante="outline">
              Ver las clases
            </BotonEnlace>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}
