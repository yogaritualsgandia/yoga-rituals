/*
 * Las fotos ya están recortadas y convertidas a AVIF/WebP. `<picture>` permite
 * servir el ancho y el formato justos sin depender del optimizador de Next,
 * porque el sitio se exporta como estático.
 */

import type { Fotografia } from "@/content/medios"
import { cn } from "@/lib/utils"

import { Contenedor } from "./contenedor"
import { Paralaje } from "@/components/movimiento/paralaje"

const ANCHOS = [400, 700, 800, 1200, 1600] as const

const srcSet = (foto: Fotografia, extension: "avif" | "webp" | "jpg") =>
  ANCHOS.map((ancho) => `${foto.src}-${ancho}.${extension} ${ancho}w`).join(", ")

/**
 * Cinco anchos y no dos.
 *
 * El navegador elige el primero que cubre el ancho de maquetación por la
 * densidad de la pantalla. Con solo 800 y 1600, un móvil de densidad 1 se
 * bajaba la de 800 para pintarla a 372 px —más del doble de lo que necesita— y
 * un móvil de densidad alta saltaba directamente a la de 1600. Los 400 evitan
 * lo primero; los 1200, lo segundo.
 *
 * Los 700 cubren el caso intermedio que queda justo por debajo de 800: un móvil
 * de densidad 1,75 pinta la portada a unos 372 px, o sea que necesita 651 px
 * reales. Sin el escalón de 700 el navegador subía a 800 y Lighthouse seguía
 * marcando la foto como más grande de lo necesario. Los 800 y 1600 siguen ahí
 * para las pantallas grandes y para los navegadores sin `srcset`.
 */

/**
 * Una foto responsive, sin JavaScript y sin depender del optimizador.
 *
 * El navegador elige AVIF si puede, luego WebP y por último JPEG. `sizes` lo
 * pasa cada sitio porque solo allí se sabe cuánto va a medir la imagen.
 */
export function FotoEditorial({
  foto,
  sizes = "(min-width: 1024px) 40vw, 92vw",
  prioridad = false,
  className,
}: {
  foto: Fotografia
  sizes?: string
  /** true solo en la imagen grande de la primera pantalla (LCP). */
  prioridad?: boolean
  className?: string
}) {
  return (
    <>
      {/* La foto de la primera pantalla va sin `<picture>` y en AVIF directo.
          Es la única excepción, y tiene motivo: el navegador descarga la imagen
          del `<source>` que elige, y el `fetchPriority` del `<img>` no llega
          hasta ahí, así que la foto que decide el LCP se descargaba con
          prioridad baja. Con el AVIF en el propio `<img>`, la prioridad se
          aplica. AVIF lo entienden todos los navegadores desde 2023; en el
          resto de fotos se mantiene `<picture>` con sus tres formatos. */}
      {prioridad ? (
        <img
          src={`${foto.src}-1600.avif`}
          srcSet={srcSet(foto, "avif")}
          sizes={sizes}
          alt={foto.alt}
          width={foto.ancho}
          height={foto.alto}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={cn("h-full w-full object-cover", className)}
        />
      ) : (
        <picture className="block h-full w-full">
          <source
            type="image/avif"
            srcSet={srcSet(foto, "avif")}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={srcSet(foto, "webp")}
            sizes={sizes}
          />
          <img
            src={`${foto.src}-1600.jpg`}
            srcSet={srcSet(foto, "jpg")}
            sizes={sizes}
            alt={foto.alt}
            width={foto.ancho}
            height={foto.alto}
            loading="lazy"
            decoding="async"
            className={cn("h-full w-full object-cover", className)}
          />
        </picture>
      )}
    </>
  )
}

/**
 * La foto dentro de su marco, con el paralaje de siempre y un pie opcional.
 */
export function FotoDeSeccion({
  foto,
  aspecto = "aspect-3/2",
  sizes = "(min-width: 1024px) 44vw, 92vw",
  prioridad = false,
  className,
}: {
  foto: Fotografia
  aspecto?: string
  sizes?: string
  prioridad?: boolean
  className?: string
}) {
  return (
    <figure className={className}>
      <Paralaje className={cn("rounded-lg", aspecto)}>
        <FotoEditorial foto={foto} sizes={sizes} prioridad={prioridad} />
      </Paralaje>
      {foto.pie ? (
        <figcaption className="etiqueta mt-3 block">{foto.pie}</figcaption>
      ) : null}
    </figure>
  )
}

/**
 * Una banda de foto entre dos bloques de texto.
 *
 * Va dentro de su propio contenedor para no romper el ritmo de la página, pero
 * no lleva titular: la foto no es una sección, es una pausa.
 */
export function BandaFoto({
  foto,
  aspecto = "aspect-3/2",
  sizes = "(min-width: 1280px) 1120px, 92vw",
}: {
  foto: Fotografia
  aspecto?: string
  sizes?: string
}) {
  return (
    <div className="seccion pt-0">
      <Contenedor>
        <FotoDeSeccion foto={foto} aspecto={aspecto} sizes={sizes} />
      </Contenedor>
    </div>
  )
}
