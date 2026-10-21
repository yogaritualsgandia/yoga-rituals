/*
 * Las fotos ya están recortadas y convertidas a AVIF/WebP. `<picture>` permite
 * servir el ancho y el formato justos sin depender del optimizador de Next,
 * porque el sitio se exporta como estático.
 */

import type { Fotografia } from "@/content/medios"
import { cn } from "@/lib/utils"

import { Contenedor } from "./contenedor"
import { Paralaje } from "@/components/movimiento/paralaje"

const srcSet = (foto: Fotografia, extension: "avif" | "webp" | "jpg") =>
  `${foto.src}-800.${extension} 800w, ${foto.src}-1600.${extension} 1600w`

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
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    </picture>
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
