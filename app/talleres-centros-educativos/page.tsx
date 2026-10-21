import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { BandaFoto } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Contador } from "@/components/movimiento/contador"
import { Button } from "@/components/ui/button"
import { talleresColegios } from "@/content/clases"
import { fotos } from "@/content/medios"
import { accionPrincipal, site, whatsappUrl } from "@/content/site"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Talleres en centros educativos",
  descripcion:
    "Talleres de educación postural, mindfulness y Yoga Nidra «Calma en el examen» en colegios e institutos de Gandia y La Safor. Más de 500 desde 2017.",
  ruta: "/talleres-centros-educativos",
})

/**
 * Talleres en centros educativos.
 *
 * Esta página tiene un lector concreto: una profesora, un orientador o alguien
 * del equipo directivo que busca algo para su alumnado y tiene dos minutos. Por
 * eso lo primero que se ve son los tres talleres con su duración exacta —dos
 * sesiones de una hora, una sesión de una hora— y no una parrafada sobre lo
 * importante que es el bienestar en las aulas. Eso ya lo sabe.
 *
 * La cifra de los 500 talleres es real y es lo que la hace creíble, pero no se
 * pone en grande: en la portada ya está en grande, y repetir el golpe lo gasta.
 */
export default function PaginaTalleresCentrosEducativos() {
  return (
    <Pagina
      etiqueta="Fuera del estudio"
      titulo="Talleres en centros educativos"
      entradilla="Con más de 500 talleres realizados, llevamos el yoga y el mindfulness a las aulas."
    >
      {/* ── A quién van dirigidos ────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-2xl">Para quién son</h2>
            <p className="paso-base medida mt-5 text-ink-soft">
              {talleresColegios.intro}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="etiqueta">En centros educativos, desde 2017</p>
            <p className="font-heading mt-2 text-4xl">
              {talleresColegios.talleresRealizadosPartes.antes}
              <Contador valor={talleresColegios.talleresRealizados} />
              {talleresColegios.talleresRealizadosPartes.despues}
            </p>
          </div>
        </Contenedor>
      </section>

      <BandaFoto foto={fotos.talleresAula} aspecto="aspect-3/2" />

      {/* ── Los tres talleres ────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">Los tres talleres</h2>

          <ul className="mt-8 border-t border-line">
            {talleresColegios.contenidos.map((taller) => (
              <li key={taller.nombre} className="border-b border-line py-8">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <h3 className="font-heading text-xl">{taller.nombre}</h3>
                    <p className="etiqueta mt-2">{taller.duracion}</p>
                  </div>
                  <p className="paso-base medida text-ink-soft lg:col-span-6 lg:col-start-7">
                    {taller.descripcion}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Pedirlos ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">
            ¿Los quieres en tu centro?
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            {talleresColegios.invitacion}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a
                href={whatsappUrl(
                  "Hola Susana, me interesan los talleres para un centro educativo.",
                )}
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

          <p className="paso-pequeno mt-6 text-ink-soft">
            Si prefieres llamar, el teléfono del estudio es el{" "}
            <a
              href={`tel:${site.contacto.telefono}`}
              className="text-brand underline underline-offset-4 hover:text-brand-hover"
            >
              {site.contacto.telefonoVisible}
            </a>
            .
          </p>
        </Contenedor>
      </section>
    </Pagina>
  )
}
