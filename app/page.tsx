import { ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { Button } from "@/components/ui/button"
import { gruposPracticas, practicas, talleresColegios } from "@/content/clases"
import {
  duracionEnPalabras,
  duraciones,
  franjasSemanales,
  horarioLibre,
} from "@/content/horario"
import { avisoFotosProvisionales, fotos } from "@/content/medios"
import { cn } from "@/lib/utils"
import { accionPrincipal, whatsappUrl } from "@/content/site"

/**
 * Portada.
 *
 * Fase 2: la estructura y el texto son reales, pero todavía no hay objeto 3D
 * ni narrativa de scroll — eso llega en la fase siguiente. La mitad derecha
 * del bloque de entrada lleva ya la foto que después será el póster estático
 * debajo del lienzo 3D, así que la composición no cambiará: solo se sustituye
 * lo que hay dentro.
 */
export default function Inicio() {
  return (
    <>
      {/* ── Entrada ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-[clamp(2.5rem,7vw,6rem)]">
        <Contenedor className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="etiqueta">Estudio de yoga en Gandia, desde 2017</p>

            <h1 className="paso-display mt-6">
              Tu práctica de yoga, a tu propio ritmo
            </h1>

            <p className="paso-entrada medida mt-7 text-ink-soft">
              Clases de 35, 60 y 75 minutos. Vienes el día que puedes, sin
              reservar y sin avisar a nadie.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={accionPrincipal.href}>
                  {accionPrincipal.etiqueta}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/horarios">Ver los horarios</Link>
              </Button>
            </div>

            <p className="paso-pequeno mt-6 text-ink-soft">
              La primera clase es gratuita, esa sí con reserva. A partir de
              ahí, vienes cuando te encaje.
            </p>
          </div>

          <div className="lg:col-span-6">
            <figure>
              <div className="relative aspect-4/5 overflow-hidden rounded-lg">
                <Image
                  src={fotos.flexionSentado.src}
                  alt={fotos.flexionSentado.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 92vw"
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

      {/* ── El argumento: horarios libres ───────────────────────────────── */}
      <section className="seccion bg-surface-2/60">
        <Contenedor className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="paso-titular">{horarioLibre.titular}</h2>
            <p className="paso-base medida mt-7 text-ink-soft">
              {horarioLibre.entradilla}
            </p>
            <p className="paso-pequeno mt-8 text-ink-soft">
              {franjasSemanales} franjas a la semana, de{" "}
              {duraciones.map(duracionEnPalabras).join(", ")}.
            </p>
          </div>

          <dl className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            {horarioLibre.escenarios.map((escenario) => (
              <div key={escenario.situacion}>
                <dt className="font-heading text-xl">{escenario.situacion}</dt>
                <dd className="medida mt-2 text-ink-soft">
                  {escenario.respuesta}
                </dd>
              </div>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Qué se puede practicar ──────────────────────────────────────── */}
      <section className="seccion">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">
            Lo que puedes practicar aquí
          </h2>
        </Contenedor>

        {/* Los tres grupos van fuera del contenedor, y cada uno pone el suyo
            por dentro, por un motivo: uno lleva campo cálido y el campo tiene
            que llegar de lado a lado. Metido dentro del contenedor, el relleno
            lateral del campo desplazaba el titular de ese grupo respecto a los
            otros dos, y eso se ve. Así el texto de los tres sigue clavado al
            resto de la página.

            El campo es una banda de lado a lado, como la de «Tú diseñas tu
            semana», no un panel con esquinas redondeadas: la web ya usa bandas
            para separar capítulos, y una banda no tiene que pelear con el
            ancho del contenedor. */}
        <div className="mt-16 flex flex-col gap-16">
          {gruposPracticas.map((grupo) => (
            <div
              key={grupo.clave}
              className={cn(grupo.campoCalido && "bg-field-warm py-12")}
            >
              <Contenedor>
                <div
                  className={cn(
                    "grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10",
                    /* Donde hay campo, el campo ya separa y la línea de arriba
                       sobra. */
                    !grupo.campoCalido && "border-t border-line pt-8",
                  )}
                >
                  <div className="lg:col-span-4">
                    <h3 className="font-heading text-2xl">{grupo.titulo}</h3>
                    <p className="medida mt-3 text-base text-ink-soft">
                      {grupo.descripcion}
                    </p>
                  </div>

                  {/* Cuando la práctica tiene página, la fila entera es el
                      enlace: la descripción forma parte de lo que se pincha.

                      Y por eso las que sí la tienen llevan una flecha. Hatha y
                      Vinyasa todavía no tienen página y se quedan como texto
                      plano; si los dos casos se vieran igual, quien mira no
                      sabría qué se puede pulsar. El color por sí solo tampoco
                      vale: un enlace tiene que distinguirse sin depender de
                      que se distingan los colores.

                      El `[&>li:first-child>*]:pt-0` alinea el primer nombre
                      con el titular del grupo. */}
                  <ul className="lg:col-span-6 lg:col-start-6 [&>li:first-child>*]:pt-0">
                    {practicas
                      .filter((practica) => practica.grupo === grupo.clave)
                      .map((practica) => (
                        <li
                          key={practica.slug}
                          className="border-b border-line last:border-b-0"
                        >
                          {practica.conPaginaPropia ? (
                            <Link
                              href={`/${practica.slug}`}
                              className="group/fila flex items-start justify-between gap-6 py-5"
                            >
                              <span>
                                <span className="font-heading text-xl text-ink group-hover/fila:text-brand">
                                  {practica.nombre}
                                </span>
                                <span className="paso-pequeno medida mt-1.5 block text-ink-soft">
                                  {practica.entradilla}
                                </span>
                              </span>
                              <ArrowRight
                                aria-hidden="true"
                                className="mt-2 size-4 shrink-0 text-ink-soft transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/fila:translate-x-1 group-hover/fila:text-brand"
                              />
                            </Link>
                          ) : (
                            <div className="py-5">
                              <p className="font-heading text-xl">
                                {practica.nombre}
                              </p>
                              <p className="paso-pequeno medida mt-1.5 text-ink-soft">
                                {practica.entradilla}
                              </p>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </Contenedor>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prueba real: los talleres en colegios ───────────────────────── */}
      <section className="seccion bg-surface-2/60">
        <Contenedor className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="etiqueta">Desde 2017</p>
            <h2 className="paso-titular mt-5">
              {talleresColegios.talleresRealizadosTexto} talleres en centros
              educativos
            </h2>
            <p className="paso-base medida mt-7 text-ink-soft">
              Llevar la calma a un aula es más difícil que llevarla a una sala
              de yoga, y es lo que llevamos haciendo desde que abrimos. El
              taller más pedido es «{talleresColegios.ejemplo}».
            </p>
            <ul className="mt-8 flex flex-col gap-2">
              {talleresColegios.otros.map((otro) => (
                <li key={otro} className="text-ink-soft">
                  {otro}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <figure>
              <div className="relative aspect-3/2 overflow-hidden rounded-lg">
                <Image
                  src={fotos.material.src}
                  alt={fotos.material.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
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

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section className="seccion">
        <Contenedor className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="paso-titular">
              Empieza por una clase de prueba
            </h2>
            <p className="paso-entrada medida mt-6 text-ink-soft">
              Es gratuita. Nos dices qué día te viene bien, te esperamos unos
              minutos antes y te enseñamos el centro.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9 lg:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={accionPrincipal.href}>
                {accionPrincipal.etiqueta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 text-ink-soft hover:text-ink"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              O escríbeme por WhatsApp
            </a>
          </div>
        </Contenedor>
      </section>
    </>
  )
}
