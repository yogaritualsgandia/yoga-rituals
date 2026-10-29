"use client"

import { useRef, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { accionPrincipal } from "@/content/site"
import { useImantado } from "@/hooks/use-imantado"

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
 * Y es el único botón de la web que sigue al ratón, en todas sus copias. El
 * imán va aquí dentro y no envolviendo el botón desde fuera por un motivo
 * práctico: el botón se estira o se esconde según el ancho con clases que le
 * pasa quien lo llama, y cualquier envoltorio se quedaría con esas medidas y
 * las estropearía. Poniéndolo dentro, el imán mueve el enlace que ya está
 * colocado, sin tocar la colocación.
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
  const enlace = useRef<HTMLAnchorElement>(null)
  useImantado(enlace)

  return (
    <Button asChild size="lg" className={className} {...(onClick ? { onClick } : {})}>
      <a
        ref={enlace}
        href={accionPrincipal.href}
        {...(accionPrincipal.externo
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children ?? accionPrincipal.etiqueta}
      </a>
    </Button>
  )
}
