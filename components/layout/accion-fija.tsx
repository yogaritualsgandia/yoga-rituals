"use client"

import { Phone } from "lucide-react"
import { useEffect, useState } from "react"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Button } from "@/components/ui/button"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Barra de acción fija, solo para móvil y tablet.
 *
 * Aparece al pasar el primer scroll, no de entrada: tapar la portada con una
 * barra antes de que la persona haya leído nada es empezar pidiendo.
 *
 * El listener del scroll va con requestAnimationFrame y { passive: true }
 * para no bloquear el hilo. Solo se anima transform, nunca layout.
 */
export function AccionFija() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let pendiente = false

    const alDesplazar = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 420)
        pendiente = false
      })
    }

    alDesplazar()
    window.addEventListener("scroll", alDesplazar, { passive: true })
    return () => window.removeEventListener("scroll", alDesplazar)
  }, [])

  return (
    <div
      /* Marca estable para las pruebas: las clases cambian, esto no. */
      data-accion-fija
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 lg:hidden",
        "border-t border-line bg-ground/95 backdrop-blur-md",
        "pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out-soft motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-[115%]",
      )}
    >
      <div className="contenedor flex items-center gap-2">
        <BotonReserva className="min-w-0 flex-1" />

        {/* El segundo botón era WhatsApp y ahora es el teléfono: la reserva ya
            va por WhatsApp, así que repetirlo aquí sería tener dos veces lo
            mismo en la misma barra. Quien no quiera escribir, llama. */}
        <Button asChild variant="outline" size="icon">
          <a href={`tel:${site.contacto.telefono}`} className="shrink-0">
            <Phone aria-hidden="true" />
            <span className="sr-only">
              Llamar al estudio, {site.contacto.telefonoVisible}
            </span>
          </a>
        </Button>
      </div>
    </div>
  )
}
