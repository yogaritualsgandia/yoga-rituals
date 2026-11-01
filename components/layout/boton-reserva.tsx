"use client"

import type { ReactNode } from "react"

import { BotonEnlace } from "@/components/layout/boton-enlace"
import { accionPrincipal } from "@/content/site"

/**
 * «Reserva tu clase de prueba».
 *
 * Es el mismo botón en toda la web —la cabecera, el menú y el cierre de cada
 * página— y por eso está en un solo sitio del código: si el día de mañana la
 * reserva deja de ir por WhatsApp, se cambia aquí y cambia en todas partes.
 * Antes eran copias del mismo `<Link>`, y otros tantos sitios donde
 * equivocarse.
 *
 * Es un enlace de verdad y no un botón con JavaScript: lleva a WhatsApp, se
 * puede abrir en otra pestaña, se puede copiar y el buscador lo entiende.
 *
 * Y sigue al ratón en todas sus copias. Ese imán vive en `BotonEnlace`, que es
 * la misma pieza que usan las acciones de las páginas de propuestas: así no hay
 * dos formas de atraer el puntero ni dos sitios donde arreglarlo.
 *
 * Estuvo un tiempo con una chapa de metal líquido detrás, que era un lienzo de
 * WebGL animándose dentro del botón. Se quitó: el botón es el color de la casa
 * y el imán, y ya. Menos código, menos batería y el mismo botón.
 */
export function BotonReserva({
  className,
  onClick,
  children,
}: {
  className?: string
  /** Se usa en un sitio: para cerrar el menú del móvil al pulsar. */
  onClick?: () => void
  children?: ReactNode
}) {
  return (
    <BotonEnlace
      href={accionPrincipal.href}
      externo={accionPrincipal.externo}
      className={className}
      {...(onClick ? { onClick } : {})}
    >
      {children ?? accionPrincipal.etiqueta}
    </BotonEnlace>
  )
}
