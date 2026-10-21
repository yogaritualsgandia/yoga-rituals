import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Contenedor } from "@/components/layout/contenedor"
import { BandaFoto } from "@/components/layout/foto-editorial"
import { Pagina } from "@/components/layout/pagina"
import { Button } from "@/components/ui/button"
import {
  bloquesDePracticas,
  paginaClases,
  practicasEnElEstudio,
  practicasFueraDeLaSala,
  type Practica,
} from "@/content/clases"
import { fotos } from "@/content/medios"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Clases y sesiones",
  descripcion:
    "Todo lo que se puede practicar en YOGA Rituals, Gandia: Hatha, Vinyasa, Yoga Nidra, Mindfulness, Breathwork y Yoga oncológico, retiros y talleres.",
  ruta: "/clases",
})

/**
 * Clases.
 *
 * Hace un trabajo concreto: explicar cómo funciona esto antes de que nadie
 * llame, y enseñar de una vez todo lo que hay. La duda de quien llega no es qué
 * es el vinyasa —eso lo busca en otro sitio— sino cómo se apunta, cuánto dura y
 * si tiene que avisar. Las tres respuestas están en el primer bloque.
 *
 * Y debajo, las dos listas completas. La página enseñaba los tres estilos del
 * horario y nada más, así que el mindfulness, el breathwork, el yoga oncológico
 * o los retiros no aparecían por ninguna parte: había que saberse la portada
 * para saber que existían. Ahora están los seis de dentro y los dos de fuera,
 * cada uno con su entradilla y su enlace, y las dos listas se pintan desde
 * `practicas` —añadir una práctica nueva es añadir una ficha y ya está—.
 *
 * Los dos bloques son los mismos que usa la portada, con los mismos nombres, y
 * a propósito: quien ha visto la portada reconoce el orden, y quien ha llegado
 * aquí desde un buscador se encuentra la misma división que hay allí.
 */
export default function PaginaClases() {
  return (
    <Pagina
      etiqueta="Clases"
      titulo="Todo lo que se puede practicar"
      entradilla={paginaClases.entradilla}
    >
      {/* ── Cómo funciona ────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <div className="medida flex flex-col gap-6">
            {paginaClases.comoFunciona.map((parrafo) => (
              <p key={parrafo} className="paso-base text-ink-soft">
                {parrafo}
              </p>
            ))}
          </div>

          {/* El enlace al horario iba metido dentro de la frase, y ahí es donde
              quedaba mal: partido en dos líneas y con el subrayado turquesa en
              medio del párrafo, la raya cortaba la lectura en seco. Va fuera
              del texto y con el mismo botón que «Ver los precios», que ya está
              explicado tres párrafos más abajo: una píldora con el borde
              puesto. Antes era una flecha con una raya debajo, y era otro
              idioma para decir lo mismo. */}
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/horarios">Ver horario</Link>
            </Button>
          </div>
        </Contenedor>
      </section>

      <BandaFoto foto={fotos.clasesGrupo} aspecto="aspect-3/2" />

      {/* ── Las dos listas ───────────────────────────────────────────────── */}
      <Indice
        titulo="En el estudio"
        linea={paginaClases.lineaEstudio}
        practicas={practicasEnElEstudio}
      />

      <Indice
        titulo="Fuera de la sala"
        linea={bloquesDePracticas.fuera}
        practicas={practicasFueraDeLaSala}
      />

      {/* ── Venir ────────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="paso-titular max-w-[24ch]">
            La primera clase no se paga
          </h2>
          <p className="paso-entrada medida mt-6 text-ink-soft">
            Es gratis, y es lo único de esta web que hay que reservar: nos
            escribes, te decimos qué día te encaja y vienes. No hace falta que
            traigas nada; la esterilla la ponemos nosotros los primeros días.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <BotonReserva />
            <Button asChild variant="outline" size="lg">
              <Link href="/precios">Ver los precios</Link>
            </Button>
          </div>
        </Contenedor>
      </section>
    </Pagina>
  )
}

/**
 * Una de las dos listas de la página: el titular, la línea y las filas.
 *
 * Sale a un componente porque las dos listas son la misma pieza con otro texto
 * dentro, y porque la flecha y el subrayado del enlace son idénticos en las
 * dos: escritos dos veces, se separan a la primera de cambio.
 */
function Indice({
  titulo,
  linea,
  practicas,
}: {
  titulo: string
  linea: string
  practicas: Practica[]
}) {
  return (
    <section className="seccion pt-0">
      <Contenedor>
        <h2 className="font-heading text-2xl">{titulo}</h2>
        <p className="medida paso-base mt-4 text-ink-soft">{linea}</p>

        <ul className="mt-8 border-t border-line">
          {practicas.map((practica) => (
            <li key={practica.slug} className="border-b border-line">
              <Link
                href={`/${practica.slug}`}
                className="group/estilo flex items-start gap-4 py-6"
              >
                <span>
                  <h3 className="font-heading text-lg">{practica.nombre}</h3>
                  <span className="medida paso-base mt-2 block text-ink-soft">
                    {practica.entradilla}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1.5 size-4 shrink-0 text-ink-soft transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/estilo:translate-x-1 group-hover/estilo:text-brand"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  )
}
