"use client"

import { Menu, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  accionPrincipal,
  navegacionCompleta,
  navegacionPrincipal,
  site,
  whatsappUrl,
} from "@/content/site"

/**
 * Menú de móvil y tablet.
 *
 * Va sobre el Dialog de Radix (a través de Sheet) y no sobre un desplegable
 * hecho a mano, porque Dialog ya trae lo que hay que traer: se encierra el
 * foco dentro, Escape cierra, el fondo queda inerte y el lector de pantalla
 * anuncia un diálogo con su nombre.
 *
 * Como todo shadcn, se ha reestilizado entero: nada del gris por defecto.
 */
export function MenuMovil({ className }: { className?: string }) {
  const [abierto, setAbierto] = useState(false)

  const secundarios = navegacionCompleta.filter(
    (item) =>
      item.href !== "/" &&
      item.href !== "/contacto" &&
      !navegacionPrincipal.some((principal) => principal.href === item.href),
  )

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
                  onClick={() => setAbierto(false)}
                  className="flex min-h-12 items-center font-heading text-2xl text-ink"
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>

          <p className="etiqueta mt-6 mb-1">También</p>
          <ul className="flex flex-col">
            {secundarios.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className="flex min-h-12 items-center text-ink-soft"
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Button asChild size="lg" className="min-w-0 flex-1">
              <Link
                href={accionPrincipal.href}
                onClick={() => setAbierto(false)}
              >
                {accionPrincipal.etiqueta}
              </Link>
            </Button>

            <Button asChild variant="outline" size="icon">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                <span className="sr-only">Escríbenos por WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Solo el teléfono. Antes estaban también el correo y la dirección,
              y con ellos el panel no cabía en un móvil de 812 px sin cortar
              el último enlace. Quien quiera el correo lo tiene en el pie y en
              la página de contacto. */}
          <a
            href={`tel:${site.contacto.telefono}`}
            className="mt-1 flex min-h-11 items-center text-sm text-ink-soft"
          >
            {site.contacto.telefonoVisible}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
