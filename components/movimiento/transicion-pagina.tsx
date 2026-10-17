"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Entrada de página.
 *
 * Al cambiar de dirección, lo nuevo entra con un desvanecido corto. La clave
 * (`key`) es la dirección, y es justo lo que hace falta: React reutiliza los
 * elementos que se llaman igual, así que sin una clave distinta el bloque no se
 * crearía de nuevo y la animación solo se vería la primera vez, en la primera
 * página que se abriera.
 *
 * La animación la pone el CSS, no JavaScript, y por eso está escrita en
 * styles/movimiento.css detrás del mismo interruptor que todo lo demás: si no
 * hay paquete de JavaScript o se ha pedido menos movimiento, el bloque está
 * desde el primer momento a la vista, sin desvanecido y sin nada que pueda
 * dejarlo en blanco.
 *
 * El `key` no cuesta nada por el camino: al cambiar de dirección el contenido
 * es otro de todas formas.
 */
export function TransicionPagina({ children }: { children: ReactNode }) {
  const ruta = usePathname()

  return (
    <div key={ruta} className="transicion-pagina">
      {children}
    </div>
  )
}
