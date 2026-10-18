"use client"

import Image from "next/image"
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
 *  Los dos se generan con `scripts/logo-sin-fondo.ps1`, que se puede repetir.
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
export function Marca({ className }: { className?: string }) {
  const { alPulsar } = useEnlacePropio()

  return (
    <Link
      href="/"
      onClick={(evento) => alPulsar("/", evento)}
      aria-label={`${site.nombre}, ir al inicio`}
      className={cn("inline-flex items-center rounded-sm", className)}
    >
      <Image
        src="/marca/logo-sin-fondo.png"
        alt=""
        width={1920}
        height={495}
        priority
        sizes="(min-width: 768px) 168px, 134px"
        className="h-8 w-auto md:h-10 dark:hidden"
      />
      <Image
        src="/marca/logo-sin-fondo-oscuro.png"
        alt=""
        width={1920}
        height={495}
        priority
        sizes="(min-width: 768px) 168px, 134px"
        className="hidden h-8 w-auto md:h-10 dark:block"
      />
    </Link>
  )
}
