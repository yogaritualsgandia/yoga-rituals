"use client"

import Link from "next/link"

import { site } from "@/content/site"
import { useEnlacePropio } from "@/hooks/use-enlace-propio"
import { cn } from "@/lib/utils"

/**
 * El logotipo del estudio: mandala turquesa, «YOGA» en serif y «Rituals» en
 * script.
 *
 * OJO · No se usa el PNG original. Los dos archivos que se ven aquí salen de
 * él, y hacen falta por dos motivos distintos:
 *
 *   · `logo-sin-fondo.png` — el original viene pintado sobre blanco y sin
 *     canal alfa, así que sobre el suelo crema dejaba un recuadro blanco bien
 *     visible. Se probó primero con `mix-blend-multiply`, el truco de siempre,
 *     y no funciona aquí: la cabecera lleva `z-index`, eso la convierte en su
 *     propio contexto de apilado, y dentro de él el blanco ya no tiene el
 *     crema detrás con el que mezclarse.
 *
 *   · `logo-sin-fondo-oscuro.png` — la tinta del logo es #333, más oscura que
 *     el suelo del modo oscuro, así que ahí desaparecía. Un filtro de CSS que
 *     la aclarase habría estropeado el turquesa del mandala, así que lo que se
 *     cambia es solo la tinta, píxel a píxel, y el mandala queda intacto.
 *
 *  Los dos se generan con `scripts/logo-sin-fondo.ps1` (los PNG) y
 *  `scripts/imagenes-responsive.mjs` (los AVIF que se sirven), que se pueden
 *  repetir. El original mide 1920 px de ancho y pesa 243 KB; aquí se usan las
 *  copias de 128, 256 y 400 px. En AVIF la de 400 pesa 9 y 11 KB, frente a los
 *  24 y 28 KB de los PNG: el logotipo se pide en la primera pantalla, y cada
 *  kilo ahí se paga dos veces —se descarga y compite con la foto de portada—.
 *  El `srcset` deja que un móvil de densidad 1 se baje la de 128 px (2,3 KB) y
 *  que uno de doble densidad se baje la de 256 (5,2 KB); la de 400 queda para
 *  las pantallas de densidad 2,5 o más.
 *
 *  El `srcset` va a mano y no con `next/image`: el sitio se exporta estático y
 *  el optimizador de Next está apagado, así que `next/image` no genera anchos.
 *  Un `<img>` con `srcSet` sí los ofrece y no añade JavaScript.
 *
 *  Lo correcto, de todas formas, es que Susana pase el logo en SVG: un SVG no
 *  tiene fondo y su tinta se cambia por CSS, así que los dos PNG derivados se
 *  borrarían junto con este comentario.
 *
 *  El texto alternativo va vacío a propósito, y en las dos imágenes: están
 *  dentro de un enlace que ya tiene su propio nombre accesible, así que
 *  describirlas otra vez solo haría que se anunciara dos veces.
 *
 *  El logo es un enlace a la portada, y en la portada ya estás: ahí pulsarlo
 *  sube la página al principio, que es lo que se espera de él. Lo hace el mismo
 *  `useEnlacePropio` que la barra de arriba.
 */
const SRC_SET_CLARO = [
  "/marca/logo-sin-fondo-128.avif 128w",
  "/marca/logo-sin-fondo-256.avif 256w",
  "/marca/logo-sin-fondo-400.avif 400w",
].join(", ")

const SRC_SET_OSCURO = [
  "/marca/logo-sin-fondo-oscuro-128.avif 128w",
  "/marca/logo-sin-fondo-oscuro-256.avif 256w",
  "/marca/logo-sin-fondo-oscuro-400.avif 400w",
].join(", ")

/** El ancho real del logo: 32 px de alto en móvil y 40 en escritorio. */
const TAMANOS = "(min-width: 768px) 156px, 125px"

export function Marca({ className }: { className?: string }) {
  const { alPulsar } = useEnlacePropio()

  return (
    <Link
      href="/"
      onClick={(evento) => alPulsar("/", evento)}
      aria-label={`${site.nombre}, ir al inicio`}
      className={cn("inline-flex items-center rounded-sm", className)}
    >
      <img
        src="/marca/logo-sin-fondo-400.avif"
        srcSet={SRC_SET_CLARO}
        sizes={TAMANOS}
        alt=""
        width={400}
        height={103}
        loading="eager"
        decoding="async"
        fetchPriority="low"
        className="h-8 w-auto md:h-10 dark:hidden"
      />
      <img
        src="/marca/logo-sin-fondo-oscuro-400.avif"
        srcSet={SRC_SET_OSCURO}
        sizes={TAMANOS}
        alt=""
        width={400}
        height={103}
        loading="lazy"
        decoding="async"
        className="hidden h-8 w-auto md:h-10 dark:block"
      />
    </Link>
  )
}
