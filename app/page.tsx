import { ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { MarcaTuRitmo } from "@/components/home/marca-tu-ritmo"
import { Contenedor } from "@/components/layout/contenedor"
import { Magnetico } from "@/components/movimiento/magnetico"
import { Paralaje } from "@/components/movimiento/paralaje"
import { Revelar, Titular } from "@/components/movimiento/revelar"
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
 * Fase 3: el texto y la estructura son los de la fase anterior; lo que se ha
 * añadido es el movimiento. Dos maneras de entrar, según dónde esté la pieza:
 * `entrada` para lo que ya se ve al abrir, que se anima con CSS y no espera a
 * ningún archivo, y `bloque` para lo de más abajo, que se enseña al llegar.
 * El porqué de cada una está en styles/movimiento.css.
 */
export default function Inicio() {
  return (
    <>
      {/* ── Entrada ─────────────────────────────────────────────────────── */}
      <section className="seccion pt-[clamp(2.5rem,7vw,6rem)]">
        <Contenedor className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Revelar
              as="p"
              cuando="entrada"
              retardo={0}
              className="etiqueta"
            >
              Estudio de yoga en Gandia, desde 2017
            </Revelar>

            <Titular
              as="h1"
              cuando="entrada"
              retardo={1}
              className="paso-display mt-6"
              texto="Tu práctica de yoga, a tu propio ritmo"
            />

            <Revelar
              as="p"
              cuando="entrada"
              retardo={7}
              className="paso-entrada medida mt-7 text-ink-soft"
            >
              Clases de 35, 60 y 75 minutos. Vienes el día que puedes, sin
              reservar y sin avisar a nadie.
            </Revelar>

            <Revelar
              cuando="entrada"
              retardo={8}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Magnetico>
                <Button asChild size="lg">
                  <Link href={accionPrincipal.href}>
                    {accionPrincipal.etiqueta}
                  </Link>
                </Button>
              </Magnetico>
              <Button asChild variant="outline" size="lg">
                <Link href="/horarios">Ver los horarios</Link>
              </Button>
            </Revelar>

            <Revelar
              as="p"
              cuando="entrada"
              retardo={9}
              className="paso-pequeno mt-6 text-ink-soft"
            >
              La primera clase es gratuita, esa sí con reserva. A partir de ahí,
              vienes cuando te encaje.
            </Revelar>
          </div>

          <div className="lg:col-span-6">
            <figure>
              <Paralaje className="aspect-4/5 rounded-lg">
                <Image
                  src={fotos.flexionSentado.src}
                  alt={fotos.flexionSentado.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </Paralaje>
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
            <Titular
              texto={horarioLibre.titular}
              className="paso-titular"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={2}
              className="paso-base medida mt-7 text-ink-soft"
            >
              {horarioLibre.entradilla}
            </Revelar>
            <Revelar
              as="p"
              retardo={3}
              className="paso-pequeno mt-8 text-ink-soft"
            >
              {franjasSemanales} franjas a la semana, de{" "}
              {duraciones.map(duracionEnPalabras).join(", ")}.
            </Revelar>
          </div>

          <dl className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            {horarioLibre.escenarios.map((escenario, i) => (
              <Revelar key={escenario.situacion} retardo={i + 1}>
                <dt className="font-heading text-xl">{escenario.situacion}</dt>
                <dd className="medida mt-2 text-ink-soft">
                  {escenario.respuesta}
                </dd>
              </Revelar>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Marca tu ritmo ──────────────────────────────────────────────────
          El alto de la página para respirar. Va aquí, entre lo práctico
          (horarios) y la oferta (las clases), porque es el sitio donde no
          estorba: ya se sabe cuándo se puede venir y todavía no se ha visto
          qué hay. */}
      <MarcaTuRitmo />

      {/* ── Qué se puede practicar ──────────────────────────────────────── */}
      <section className="seccion">
        <Contenedor>
          <Titular
            texto="Lo que puedes practicar aquí"
            className="paso-titular max-w-[24ch]"
          />
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
                    <Titular
                      as="h3"
                      texto={grupo.titulo}
                      className="font-heading text-2xl"
                      retardo={0}
                    />
                    <Revelar
                      as="p"
                      retardo={2}
                      className="medida mt-3 text-base text-ink-soft"
                    >
                      {grupo.descripcion}
                    </Revelar>
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
                      .map((practica, i) => (
                        <Revelar
                          as="li"
                          key={practica.slug}
                          retardo={i + 1}
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
                        </Revelar>
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
            <Revelar as="p" retardo={0} className="etiqueta">
              Desde 2017
            </Revelar>
            <Titular
              texto={`${talleresColegios.talleresRealizadosTexto} talleres en centros educativos`}
              className="paso-titular mt-5"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={3}
              className="paso-base medida mt-7 text-ink-soft"
            >
              Llevar la calma a un aula es más difícil que llevarla a una sala
              de yoga, y es lo que llevamos haciendo desde que abrimos. El
              taller más pedido es «{talleresColegios.ejemplo}».
            </Revelar>
            <ul className="mt-8 flex flex-col gap-2">
              {talleresColegios.otros.map((otro, i) => (
                <Revelar
                  as="li"
                  key={otro}
                  retardo={i + 4}
                  className="text-ink-soft"
                >
                  {otro}
                </Revelar>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <figure>
              <Paralaje className="aspect-3/2 rounded-lg">
                <Image
                  src={fotos.material.src}
                  alt={fotos.material.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </Paralaje>
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
            <Titular
              texto="Empieza por una clase de prueba"
              className="paso-titular"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={2}
              className="paso-entrada medida mt-6 text-ink-soft"
            >
              Es gratuita. Nos dices qué día te viene bien, te esperamos unos
              minutos antes y te enseñamos el centro.
            </Revelar>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9 lg:justify-center">
            <Revelar
              retardo={3}
              className="flex w-full flex-col items-start gap-4"
            >
              <Magnetico>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={accionPrincipal.href}>
                    {accionPrincipal.etiqueta}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetico>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 text-ink-soft hover:text-ink"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                O escríbeme por WhatsApp
              </a>
            </Revelar>
          </div>
        </Contenedor>
      </section>
    </>
  )
}
