"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { useMontado } from "@/hooks/use-montado"

/**
 * Botón de modo oscuro.
 *
 * Discreto, y su nombre accesible dice lo que va a pasar («Cambiar a modo
 * oscuro»), no el estado en el que está. Así, quien lo lee con un lector de
 * pantalla sabe qué obtiene al pulsarlo.
 *
 * El tema real solo se conoce en el cliente, así que se pregunta con
 * `useMontado()` y hasta entonces se deja un hueco del mismo alto: no salta
 * nada al hidratar.
 */

export function BotonTema() {
  const { resolvedTheme, setTheme } = useTheme()
  const montado = useMontado()

  // Antes de saber el tema no se pinta el icono, pero el botón ya ocupa su
  // sitio: así no salta nada al hidratar.
  if (!montado) {
    return <span className="inline-block min-h-11" aria-hidden="true" />
  }

  const esOscuro = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
      className="inline-flex min-h-11 items-center gap-2.5 text-sm hover:text-ink"
    >
      {esOscuro ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
      {esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    </button>
  )
}
