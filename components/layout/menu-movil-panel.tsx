"use client"

import { Phone, X } from "lucide-react"
import Link from "next/link"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { navegacionPrincipal, site } from "@/content/site"
import { useEnlacePropio } from "@/hooks/use-enlace-propio"

/**
 * El panel del menú de móvil, separado del botón que lo abre.
 *
 * Está en su propio archivo para que Radix Dialog —el motor del panel— no
 * viaje en el primer paquete de JavaScript. El botón se pinta con el HTML y no
 * necesita nada; el diálogo se descarga la primera vez que alguien pulsa
 * «Menú». En un móvil eso quita del arranque el código de foco, portal,
 * bloqueo del fondo y cierre con Escape, que hasta ese momento nadie usa.
 *
 * El botón que abre vive en `menu-movil.tsx` y se lo pasa a este componente con
 * `open`. Por eso aquí no hay `SheetTrigger`: el disparador es de fuera y Radix
 * acepta un diálogo controlado sin él.
 *
 * DENTRO SOLO HAY SEIS COSAS Y UN BOTÓN, y es una decisión que se tomó después
 * de verlo lleno. Hubo aquí un bloque «También» con las ocho páginas de dentro
 * —Mindfulness, Yoga Nidra, Breathwork, Yoga Oncológico, Retiros, Talleres— y
 * un enlace de texto a WhatsApp al final. En un móvil eso era una lista de
 * catorce renglones para llegar a lo mismo que se llega por el pie, y el
 * WhatsApp aparecía dos veces en el mismo panel: una en el botón de reserva y
 * otra escrita debajo.
 *
 * Quien quiere el yoga nidra lo tiene en la portada, en «Lo que puedes
 * practicar», que es una lista mejor que esta: está explicada. Y el pie tiene
 * las tres columnas completas, agrupadas por lo que se viene a buscar.
 */
export function MenuMovilPanel({
  abierto,
  alCambiar,
}: {
  abierto: boolean
  alCambiar: (abierto: boolean) => void
}) {
  const { alPulsar } = useEnlacePropio()

  return (
    <Sheet open={abierto} onOpenChange={alCambiar}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 bg-ground p-0 sm:max-w-[26rem]"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-heading text-lg text-ink">{site.nombre}</span>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X aria-hidden="true" />
              <span className="sr-only">Cerrar el menú</span>
            </Button>
          </SheetClose>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex-1 overflow-y-auto px-5 py-5"
        >
          <ul className="flex flex-col">
            {navegacionPrincipal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(evento) => {
                    alCambiar(false)
                    /* Si el enlace es el de la página en la que ya estás, no
                       hay a dónde ir: cierra el menú y sube arriba. */
                    alPulsar(item.href, evento)
                  }}
                  className="flex min-h-12 items-center font-heading text-2xl text-ink"
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <BotonReserva
              className="min-w-0 flex-1"
              onClick={() => alCambiar(false)}
            />

            <Button asChild variant="outline" size="icon">
              <a href={`tel:${site.contacto.telefono}`}>
                <Phone aria-hidden="true" />
                <span className="sr-only">
                  Llamar al estudio, {site.contacto.telefonoVisible}
                </span>
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
