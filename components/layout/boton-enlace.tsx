"use client"

import Link from "next/link"
import { useRef, type ComponentProps, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { useImantado } from "@/hooks/use-imantado"

/**
 * Un botón que es un enlace y sigue al ratón.
 *
 * Es el mismo imán que el de «Reserva tu clase de prueba», sacado aquí para
 * que las acciones que no son la reserva —preguntar por una sesión, escribir
 * por WhatsApp, pedir información de un retiro— se comporten igual. Antes cada
 * página montaba su propio `<Button asChild><a>`, y esos botones no atraían
 * nada: al lado de uno de reserva se notaba que eran de otra familia.
 *
 * El imán va dentro del botón y no envolviéndolo: el botón se estira o se
 * esconde con clases que le pasa quien lo llama, y un envoltorio se quedaría
 * con esas medidas y las estropearía.
 *
 * `externo` es la única diferencia entre un enlace de la web y uno que sale
 * fuera: añade pestaña nueva y `rel`. Se pide a mano para que quien lo usa
 * tenga que pensarlo, igual que en `accionPrincipal`. Los de dentro van con
 * `Link`, para que naveguen sin recargar la página.
 */
export function BotonEnlace({
  href,
  children,
  externo = false,
  variante,
  className,
  onClick,
}: {
  href: string
  children: ReactNode
  /** true = sale de la web (WhatsApp, teléfono, mapas). */
  externo?: boolean
  variante?: ComponentProps<typeof Button>["variant"]
  className?: string
  onClick?: () => void
}) {
  const enlace = useRef<HTMLAnchorElement>(null)
  useImantado(enlace)

  return (
    <Button
      asChild
      size="lg"
      variant={variante}
      className={className}
      {...(onClick ? { onClick } : {})}
    >
      {externo ? (
        <a
          ref={enlace}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ) : (
        <Link ref={enlace} href={href}>
          {children}
        </Link>
      )}
    </Button>
  )
}
