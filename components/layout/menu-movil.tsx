"use client"

import { Menu, Phone, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { BotonReserva } from "@/components/layout/boton-reserva"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navegacionPrincipal, site } from "@/content/site"
import { useEnlacePropio } from "@/hooks/use-enlace-propio"

/**
 * Menú de móvil y tablet.
 *
 * Va sobre el Dialog de Radix (a través de Sheet) y no sobre un desplegable
 * hecho a mano, porque Dialog ya trae lo que hay que traer: se encierra el
 * foco dentro, Escape cierra, el fondo queda inerte y el lector de pantalla
 * anuncia un diálogo con su nombre.
 *
 * Como todo shadcn, se ha reestilizado entero: nada del gris por defecto.
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
export function MenuMovil({ className }: { className?: string }) {
  const [abierto, setAbierto] = useState(false)
  const { alPulsar } = useEnlacePropio()

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className={className}>
          <Menu aria-hidden="true" />
          Menú
        </Button>
      </SheetTrigger>

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
                    setAbierto(false)
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
              onClick={() => setAbierto(false)}
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
