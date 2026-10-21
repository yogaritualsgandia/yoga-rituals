import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { FotoDeSeccion } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import { breathwork } from "@/content/breathwork"
import { fotos } from "@/content/medios"
import { accionPrincipal, whatsappUrl } from "@/content/site"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Breathwork",
  descripcion:
    "Sesiones individuales de breathwork en Gandia: respiración consciente para soltar lo que el cuerpo guarda. 90 minutos, sin experiencia previa.",
  ruta: "/breathwork",
})

/**
 * Breathwork.
 *
 * La página es un texto y una banda. No lleva tarjetas de relleno, ni cifras
 * grandes, ni iconos, porque el texto habla solo y cualquier adorno lo
 * estropearía: es el único sitio de la web donde se habla de lo que el cuerpo
 * guarda, y ahí conviene no distraer.
 *
 * Pero el texto en una columna estrecha, a pantalla ancha, deja media pantalla
 * en blanco, y eso no es aire: es un hueco. Así que cada bloque va a dos
 * columnas, y la derecha siempre tiene algo que hacer:
 *
 *   1. El texto de introducción, con la foto al lado.
 *   2. La estrofa, con las cinco líneas del «a veces» en la otra columna: es
 *      una lista de cosas que pasan y se lee mejor enfrente de la frase que la
 *      provoca que debajo.
 *   3. La sesión, con sus cuatro datos en ficha (duración, postura, experiencia
 *      y formación), que es lo que se viene a buscar antes de escribir.
 *   4. Y el cierre, con los botones a la derecha, como en la portada.
 *
 * La foto es un incienso: humo que sube recto, que es lo más parecido a una
 * respiración que hay en las fotos del estudio.
 */
export default function PaginaBreathwork() {
  return (
    <Pagina
      etiqueta="Sesión individual"
      titulo="Breathwork"
      entradilla={breathwork.entradilla}
    >
      {/* ── El texto ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="medida flex flex-col gap-6 lg:col-span-6">
            {breathwork.cuerpo.map((parrafo) => (
              <p key={parrafo} className="paso-base text-ink-soft">
                {parrafo}
              </p>
            ))}
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <FotoDeSeccion
              foto={fotos.breathworkIncienso}
              aspecto="aspect-4/5"
              sizes="(min-width: 1024px) 38vw, 92vw"
            />
          </div>
        </Contenedor>
      </section>

      {/* ── La estrofa ───────────────────────────────────────────────────── */}
      <section className="bg-surface-2/60 py-16 lg:py-24">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="paso-entrada font-heading max-w-[24ch] text-balance">
              {breathwork.estrofa.primera}
            </p>
            <p className="paso-entrada font-heading mt-4 max-w-[24ch] text-balance">
              {breathwork.estrofa.segunda}
            </p>
          </div>

          <ul className="flex flex-col gap-3 lg:col-span-5 lg:col-start-8">
            {breathwork.aVeces.map((linea) => (
              <li key={linea} className="paso-base text-ink-soft">
                {linea}
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── La sesión ────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="font-heading text-2xl">Cómo es la sesión</h2>
            <p className="medida paso-base mt-5 text-ink-soft">
              {breathwork.sesion}
            </p>
            <p className="medida paso-base mt-4 text-ink-soft">
              {breathwork.metodo}
            </p>
          </div>

          <dl className="lg:col-span-4 lg:col-start-9">
            {breathwork.datos.map((dato) => (
              <div
                key={dato.etiqueta}
                className="border-t border-line py-4 first:border-t-0 first:pt-0"
              >
                <dt className="etiqueta">{dato.etiqueta}</dt>
                <dd className="paso-pequeno mt-1.5">{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Escribir ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="paso-titular max-w-[22ch]">
              Escríbenos y te contamos
            </h2>
            <p className="paso-entrada medida mt-6 text-ink-soft">
              Es una sesión individual y se pide cita, así que lo hablamos
              antes: qué te trae, qué día te encaja y qué puedes esperar.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9 lg:justify-center">
            <Button asChild size="lg">
              <a
                href={whatsappUrl("Hola Susana, me interesa el breathwork.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
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
