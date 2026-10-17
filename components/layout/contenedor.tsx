import type { ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Ancho máximo y aire lateral de toda la web.
 *
 * El valor real vive en la clase `.contenedor` de app/globals.css, para que
 * haya un solo sitio donde cambiarlo. Este componente existe para no repetir
 * el `className` en cada sección.
 */
export function Contenedor({
  as,
  children,
  className,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
}) {
  const Etiqueta = as ?? "div"
  return <Etiqueta className={cn("contenedor", className)}>{children}</Etiqueta>
}
