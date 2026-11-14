"use client"

import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Entrada de página.
 *
 * Al cambiar de dirección, lo nuevo entra con un desvanecido corto. La clave
 * (`key`) es la dirección, y es justo lo que hace falta: React reutiliza los
 * elementos que se llaman igual, así que sin una clave distinta el bloque no se
 * crearía de nuevo y la animación solo se vería la primera vez, en la primera
 * página que se abriera.
 *
 * En la PRIMERA carga no se anima, y eso es a propósito: el desvanecido de la
 * página entera retrasa el pintado del titular y de la foto de portada, que es
 * justo lo que mide el LCP. Al abrir la web, lo que tiene que entrar son las
 * palabras del titular, que ya lo hacen por su cuenta; el desvanecido se
 * reserva para cuando de verdad hay un cambio de página.
 *
 * La animación la pone el CSS, no JavaScript, y por eso está escrita en
 * styles/movimiento.css detrás del mismo interruptor que todo lo demás: si no
 * hay paquete de JavaScript o se ha pedido menos movimiento, el bloque está
 * desde el primer momento a la vista, sin desvanecido y sin nada que pueda
 * dejarlo en blanco.
 */
export function TransicionPagina({ children }: { children: ReactNode }) {
  const ruta = usePathname()
  /* `useState` guarda la ruta de la primera carga y no cambia después. Antes
     era un `useRef`, pero leerlo durante el render es justo lo que prohíbe la
     regla `react-hooks/refs` de ESLint: el valor no se recalcula al cambiar la
     ruta, que es lo que se busca, y el estado deja la intención más clara. */
  const [rutaInicial] = useState(ruta)
  const esPrimeraCarga = ruta === rutaInicial

  return (
    <div
      key={ruta}
      className={cn(!esPrimeraCarga && "transicion-pagina")}
    >
      {children}
    </div>
  )
}
