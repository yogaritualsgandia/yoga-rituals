"use client"

import Link from "next/link"

import { useEnlacePropio } from "@/hooks/use-enlace-propio"
import { cn } from "@/lib/utils"

/**
 * Enlace de navegación con el subrayado que crece desde la izquierda al pasar
 * el ratón, y que se queda puesto en la página en la que estás.
 *
 * El subrayado es un pseudo-elemento que se estira con `scale-x`, no una raya
 * que se dibuja: se mueve en la tarjeta gráfica y no vuelve a maquetar la
 * línea. Es la técnica de siempre para esto, y está escrita aquí con los
 * tiempos y las curvas del resto de la web —`--dur-base` y `--ease-out`— en
 * vez de con valores sueltos, para que no haya dos velocidades de subrayado
 * conviviendo en la misma cabecera.
 *
 * Lo que no es de siempre es el estado activo. Va en `aria-current="page"`, que
 * es donde tiene que ir: quien navega con lector de pantalla oye «página
 * actual» en el enlace, y quien no, ve el subrayado ya puesto. Las dos cosas
 * salen del mismo dato y no hay que adivinar ninguna.
 *
 * Y si el enlace es el de la página en la que ya estás, pulsarlo sube arriba.
 * Lo cuenta `useEnlacePropio`, que es de donde sale también el estado activo.
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
  const { propio, alPulsar } = useEnlacePropio()
  const activa = propio(href)

  return (
    <Link
      href={href}
      onClick={(evento) => {
        onClick?.()
        alPulsar(href, evento)
      }}
      aria-current={activa ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center",
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-[var(--dur-base)] before:ease-out-soft",
        "hover:before:origin-left hover:before:scale-x-100",
        "motion-reduce:before:transition-none",
        activa && "before:origin-left before:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  )
}
