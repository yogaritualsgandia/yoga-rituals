import Link from "next/link"

import { Button } from "@/components/ui/button"
import { accionPrincipal, navegacionPrincipal } from "@/content/site"

import { Contenedor } from "./contenedor"
import { EnlaceNav } from "./enlace-nav"
import { Marca } from "./marca"
import { MenuMovil } from "./menu-movil"

/**
 * Cabecera.
 *
 * Tres decisiones que no son obvias:
 *
 * 1. La navegación completa aparece a partir de 1280 px, no antes. Con cinco
 *    enlaces, el logo y el botón de reserva, a 1024 la línea iba apretada; es
 *    preferible un menú cómodo que una barra apretujada.
 *
 * 2. La cabecera solo se queda fija en escritorio. En móvil sería una segunda
 *    barra pegada (la de abajo ya lleva la reserva) y se come la pantalla.
 *
 * 3. La línea de abajo solo aparece a partir de 768 px, que es cuando la
 *    cabecera se queda fija y el contenido empieza a pasar por debajo. En
 *    móvil no hay nada que separar y sería una raya de adorno.
 */
export function Cabecera() {
  return (
    <header className="relative z-40 md:border-b md:border-line xl:sticky xl:top-0 xl:bg-ground/85 xl:backdrop-blur-md">
      <Contenedor className="flex items-center justify-between gap-4 py-5 xl:py-4">
        <Marca />

        <nav aria-label="Navegación principal" className="hidden xl:block">
          <ul className="flex items-center gap-9">
            {navegacionPrincipal.map((item) => (
              <li key={item.href}>
                <EnlaceNav href={item.href}>{item.etiqueta}</EnlaceNav>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="lg" className="hidden lg:inline-flex">
            <Link href={accionPrincipal.href}>{accionPrincipal.etiqueta}</Link>
          </Button>
          <MenuMovil className="xl:hidden" />
        </div>
      </Contenedor>
    </header>
  )
}
