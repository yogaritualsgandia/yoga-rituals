"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/**
 * Enlace de navegación con el subrayado que crece desde la izquierda al pasar
 * el ratón. La animación está adaptada de Link000 de Skiper UI, versión
 * gratuita — de ahí la atribución obligatoria del pie.
 *
 * Se envuelve en un componente propio por un motivo de accesibilidad: el
 * componente original no admite atributos, y aquí hace falta poner
 * `aria-current="page"` en el enlace activo, que es donde tiene que ir.
 */
export function EnlaceNav({
  href,
  children,
  className,
  onClick,
}: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const ruta = usePathname()
  const activa = href === "/" ? ruta === "/" : ruta.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={activa ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center",
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        "motion-reduce:before:transition-none",
        /* El enlace activo deja el subrayado puesto: no hace falta adivinarlo. */
        activa && "before:origin-left before:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  )
}
