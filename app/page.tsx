import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { Contador } from "@/components/movimiento/contador"
import { Paralaje } from "@/components/movimiento/paralaje"
import { Revelar, Titular } from "@/components/movimiento/revelar"
import { Button } from "@/components/ui/button"
import {
  bloquesDePracticas,
  practicasEnElEstudio,
  practicasFueraDeLaSala,
  talleresColegios,
} from "@/content/clases"
import { horarioLibre } from "@/content/horario"
import { avisoFotosProvisionales, fotos } from "@/content/medios"
import { site, mapaUrl } from "@/content/site"
import { testimonios } from "@/content/testimonios"

/**
 * Portada.
 *
 * Tres cosas que se han decidido aquí y no en otro sitio:
 *
 *  1. LA PÁGINA ES UN ÍNDICE, NO UN ESCAPARATE. Lo que hace es contestar tres
 *     preguntas por orden: cómo funciona el horario, qué se puede practicar y
 *     por dónde se empieza. Cada bloque es una respuesta, y por eso ninguno
 *     repite a otro.
 *
 *  2. LAS CLASES VAN EN UNA LISTA NUMERADA Y CORRIDA, no en tarjetas de tres
 *     en tres. Una lista con su número, su nombre en letra grande y una línea
 *     debajo se lee de un vistazo y no finge que cada práctica es un producto.
 *     Las tarjetas iguales de tres en tres son el aspecto de una plantilla.
 *
 *  3. «FUERA DE LA SALA» SÍ LLEVA CAMPO DE COLOR, y las clases no. Es lo único
 *     cálido de la portada y hace un trabajo: separar lo que pasa dentro de lo
 *     que pasa fuera. El color de la acción —el turquesa— no se toca.
 *
 * El movimiento va en dos velocidades, y el porqué está en styles/movimiento.css:
 * `entrada` para lo que ya se ve al abrir (CSS, no espera a ningún archivo) y
 * `bloque` para lo de más abajo (se enseña al llegar).
 */
export default function Inicio() {
  return (
    <>
      {/* ── Entrada ─────────────────────────────────────────────────────── */}
      <section className="pt-[clamp(2.5rem,7vw,6rem)] pb-[clamp(3rem,6vw,5rem)]">
        <Contenedor>
          {/* La línea de cabecera: a la izquierda, de qué va esto; a la
              derecha, dónde está. Es la cabecera de un periódico, y hace que
              la dirección esté en la primera pantalla sin un mapa. */}
          <Revelar
            cuando="entrada"
            retardo={0}
            className="flex items-baseline justify-between gap-6 border-b border-line pb-4"
          >
            <p className="etiqueta">Estudio de yoga en Gandia, desde 2017</p>
            {/* La dirección se puede pulsar, y no se anuncia como se anuncian
                los botones: sin subrayado, sin icono y sin color hasta que
                pasas por encima. Está aquí por si alguien la lee y quiere saber
                por dónde se entra al portal; el que la lea de paso no tiene que
                enterarse de que es un enlace. En el pie está igual, y allí es
                donde se busca de verdad. */}
            <p className="paso-pequeno hidden sm:block">
              <a
                href={mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft transition-colors duration-[var(--dur-base)] hover:text-brand"
              >
                {site.direccion.calle} · {site.direccion.codigoPostal}{" "}
                {site.direccion.ciudad}
              </a>
            </p>
          </Revelar>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Titular
                as="h1"
                cuando="entrada"
                retardo={1}
                className="paso-display max-w-[15ch]"
                texto="Yoga a tu propio ritmo"
              />

              <Revelar
                as="p"
                cuando="entrada"
                retardo={8}
                className="paso-entrada medida mt-9 text-ink-soft"
              >
                Clases de 75, 60 y 35 minutos. Vienes el día que puedes, sin
                reservar y sin avisar a nadie.
              </Revelar>

              <Revelar
                cuando="entrada"
                retardo={9}
                className="mt-11 flex flex-wrap items-center gap-4"
              >
                <BotonReserva />
                <Button asChild variant="outline" size="lg">
                  <Link href="/horarios">Ver los horarios</Link>
                </Button>
              </Revelar>

              <Revelar
                as="p"
                cuando="entrada"
                retardo={10}
                className="paso-pequeno mt-7 text-ink-soft"
              >
                La clase de prueba es gratuita, y es lo único que hay que
                reservar. A partir de ahí, vienes cuando te encaje.
              </Revelar>
            </div>

            {/* La foto baja veinte píxeles respecto al titular a propósito: al
                quedar más alta la columna de la derecha, la línea de la
                cabecera y el titular forman una sola mancha de texto y la
                página deja de estar partida por la mitad. Veinte y no más:
                con el hueco entero, la foto se salía por abajo de la pantalla
                y asomaba cortada. */}
            <div className="lg:col-span-5 lg:pt-5">
              <figure>
                <Paralaje className="aspect-4/5 rounded-lg">
                  <Image
                    src={fotos.flexionSentado.src}
                    alt={fotos.flexionSentado.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    className="object-cover"
                  />
                </Paralaje>
                <figcaption className="etiqueta mt-3 block">
                  {avisoFotosProvisionales}
                </figcaption>
              </figure>
            </div>
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
          </div>

          <dl className="flex flex-col lg:col-span-6 lg:col-start-7">
            {horarioLibre.escenarios.map((escenario, i) => (
              <Revelar
                key={escenario.situacion}
                retardo={i + 1}
                className="border-t border-line py-7 first:border-t-0 first:pt-0"
              >
                <dt className="font-heading text-xl">{escenario.situacion}</dt>
                <dd className="medida mt-2 text-ink-soft">
                  {escenario.respuesta}
                </dd>
              </Revelar>
            ))}
          </dl>
        </Contenedor>
      </section>

      {/* ── Lo que se puede practicar ───────────────────────────────────────
          Las seis del estudio, juntas y numeradas. Aquí estuvieron separadas
          en dos bloques —«en una sesión normal» y «propuestas concretas»— y
          estaba mal: son todas sesiones normales, con su horario y su precio.
          El segundo bloque, el de fuera de la sala, va debajo aparte. */}
      <section className="seccion">
        <Contenedor className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Titular
              texto="Lo que puedes practicar"
              className="paso-titular"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={2}
              className="paso-base medida mt-7 text-ink-soft"
            >
              {bloquesDePracticas.estudio}
            </Revelar>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6">
            {practicasEnElEstudio.map((practica, i) => (
              <Revelar
                as="li"
                key={practica.slug}
                retardo={Math.min(i, 4)}
                className="border-b border-line first:border-t first:border-line"
              >
                {practica.conPaginaPropia ? (
                  <Link
                    href={`/${practica.slug}`}
                    className="group/fila flex items-start gap-4 py-6"
                  >
                    <Celda practica={practica} numero={i} />
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-1.5 size-4 shrink-0 text-ink-soft transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/fila:translate-x-1 group-hover/fila:text-brand"
                    />
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 py-6">
                    <Celda practica={practica} numero={i} />
                  </div>
                )}
              </Revelar>
            ))}
          </ol>
        </Contenedor>
      </section>

      {/* ── Fuera de la sala ────────────────────────────────────────────────
          Esta banda llevaba el único color cálido de la portada —un melocotón
          suave—, y hacía un trabajo: separar lo que pasa dentro de lo que pasa
          fuera. Se ha quedado con el mismo fondo que la banda de arriba. Dos
          tonos cálidos distintos con una sección en medio no se leían como dos
          ideas, se leían como un descuido; con uno solo, la portada alterna
          crema y banda, y se ve que alterna. */}
      <section className="seccion bg-surface-2/60">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Titular
              as="h2"
              texto="Fuera de la sala"
              className="paso-titular"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={2}
              className="paso-base medida mt-7 text-ink-soft"
            >
              {bloquesDePracticas.fuera}
            </Revelar>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {practicasFueraDeLaSala.map((practica, i) => (
              <Revelar
                as="li"
                key={practica.slug}
                retardo={i + 1}
                className="border-t border-line/60 first:border-t-0"
              >
                <Link
                  href={`/${practica.slug}`}
                  className="group/fuera flex items-start gap-4 py-7"
                >
                  <Celda practica={practica} numero={i} />
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1.5 size-4 shrink-0 text-ink-soft transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/fuera:translate-x-1 group-hover/fuera:text-brand"
                  />
                </Link>
              </Revelar>
            ))}
          </ul>
        </Contenedor>
      </section>

      {/* ── Prueba real: los talleres en colegios ───────────────────────── */}
      <section className="seccion">
        <Contenedor className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Titular
              texto={`${talleresColegios.talleresRealizadosTitular} en centros educativos`}
              /* La cifra no se escribe aquí: cuenta. La palabra que se
                 sustituye tiene que coincidir literalmente con la que hay en el
                 titular del contenido —«500»—; si algún día dejan de ser 500,
                 se cambian las dos y ya está. */
              reemplazo={{
                palabra: String(talleresColegios.talleresRealizados),
                por: (
                  <Contador valor={talleresColegios.talleresRealizados} />
                ),
              }}
              className="paso-titular mt-5"
              retardo={0}
            />
            <Revelar
              as="p"
              retardo={3}
              className="paso-base medida mt-7 text-ink-soft"
            >
              Llevar la calma a un aula es más difícil que llevarla a una sala
              de yoga, y es lo que llevamos haciendo desde que abrimos.
            </Revelar>
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

      {/* ── Lo que dicen quienes vienen ─────────────────────────────────────
          Cuatro reseñas reales de Google, sin corregir: son suyas. La primera
          es larga de verdad y por eso lleva «Leer más», que lleva a la reseña
          entera; las otras tres caben como están.

          Cada nombre enlaza a SU reseña, no a la lista del estudio: quien
          quiera comprobar que dice eso llega exactamente a esa frase. Son los
          enlaces que se copian desde el diálogo «Compartir reseña» de Maps, y
          desde aquí no se pueden componer a mano.

          La rejilla es de dos columnas y no de tres porque ahora son cuatro: en
          tres, la cuarta se quedaría sola en una fila coja. Cada tarjeta tiene
          su línea arriba y su firma abajo, así que las cuatro quedan alineadas
          aunque midan distinto.

          Va aquí, entre los talleres y el cierre, y no antes: primero está lo
          que hace el estudio —las clases, los horarios, los talleres en los
          colegios— y después lo que dicen quienes ya vinieron. Al revés,
          empezaría pidiendo confianza antes de contar nada. */}
      <section className="seccion bg-surface-2/60">
        <Contenedor>
          <Titular
            texto="Lo que dicen quienes vienen"
            className="paso-titular"
            retardo={0}
          />

          <ul className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {testimonios.map((testimonio, i) => {
              const visibles = testimonio.parrafos.slice(
                0,
                testimonio.visibles ?? testimonio.parrafos.length,
              )
              const hayMas = visibles.length < testimonio.parrafos.length

              return (
                <Revelar
                  as="li"
                  key={testimonio.autor}
                  retardo={Math.min(i, 4)}
                  className="flex flex-col border-t border-line pt-7"
                >
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: testimonio.estrellas }).map(
                      (_, estrella) => (
                        <Star
                          key={estrella}
                          className="size-3.5 fill-current text-estrella"
                        />
                      ),
                    )}
                  </div>
                  <span className="sr-only">
                    {testimonio.estrellas} de 5 estrellas.
                  </span>

                  <blockquote className="paso-pequeno mt-5 space-y-4 text-ink-soft">
                    {visibles.map((parrafo, parrafoIndice) => (
                      <p key={`${testimonio.autor}-${parrafoIndice}`}>
                        {parrafo}
                      </p>
                    ))}
                  </blockquote>

                  {hayMas ? (
                    <p className="mt-4">
                      <a
                        href={testimonio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="paso-pequeno font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
                      >
                        Leer más
                        <span className="sr-only">
                          {" "}
                          de la reseña de {testimonio.autor} en Google
                        </span>
                      </a>
                    </p>
                  ) : null}

                  {/* El nombre se va abajo del todo de la columna, así que las
                      firmas quedan a la misma altura aunque los textos no midan
                      lo mismo.

                      Y es un enlace, porque quien lee una opinión de cinco
                      estrellas quiere poder comprobarla. Lleva a ESA reseña, no
                      a la ficha del estudio: sin subrayado y sin icono, con el
                      subrayado solo al pasar por encima, para que la rejilla
                      siga siendo texto y no un formulario. */}
                  <p className="etiqueta mt-auto pt-8">
                    <a
                      href={testimonio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline-offset-4 hover:text-brand hover:underline"
                    >
                      {testimonio.autor}
                      <span className="sr-only"> en Google</span>
                    </a>
                  </p>
                </Revelar>
              )
            })}
          </ul>
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
            <Revelar retardo={3} className="w-full">
              <BotonReserva className="w-full sm:w-auto">
                Reserva tu clase de prueba
                <ArrowRight aria-hidden="true" />
              </BotonReserva>
            </Revelar>
          </div>
        </Contenedor>
      </section>
    </>
  )
}

/**
 * Una fila del índice: el número, el nombre y la entradilla.
 *
 * El número es la pieza que hace que los dos bloques —el de dentro y el de
 * fuera— se lean como una lista y no como dos listas sueltas: los dos empiezan
 * por el uno y los dos van en pequeño y en versalitas, para que ordenen sin
 * llamar. La flecha, cuando la hay, la pone quien envuelve la fila: aquí no se
 * sabe si la fila es un enlace.
 */
function Celda({
  practica,
  numero,
}: {
  practica: { nombre: string; entradilla: string }
  numero: number
}) {
  return (
    <>
      <span className="etiqueta w-9 shrink-0 pt-1 tabular-nums">
        {String(numero + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading text-xl text-ink group-hover/fila:text-brand group-hover/fuera:text-brand">
          {practica.nombre}
        </span>
        <span className="paso-pequeno medida mt-1.5 block text-ink-soft">
          {practica.entradilla}
        </span>
      </span>
    </>
  )
}
