"use client"

import { Menu } from "lucide-react"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"

/**
 * El botón que abre el menú de móvil.
 *
 * El botón se pinta con el HTML y no depende de JavaScript: si el paquete no
 * llega, se ve y se puede pulsar, aunque no abra nada. El panel —Radix Dialog,
 * el foco atrapado, el fondo inerte, Escape— se descarga aparte, la primera vez
 * que alguien lo pide. Antes viajaba en el arranque de todas las páginas y lo
 * usaba una minoría: en escritorio el menú ni siquiera se ve.
 *
 * Se empieza a descargar al pasar el puntero o al enfocar el botón, para que en
 * el momento del clic ya esté o falte poco. Si la red es lenta, el panel tarda
 * un instante en aparecer; el botón no se queda muerto, y el `aria-expanded`
 * dice que se ha pedido abrir.
 *
 * El panel está en `menu-movil-panel.tsx`, y el porqué de la separación, allí.
 */
const Panel = dynamic(
  () =>
    import("./menu-movil-panel").then((modulo) => modulo.MenuMovilPanel),
  { ssr: false },
)

function cargarPanel() {
  void import("./menu-movil-panel")
}

export function MenuMovil({ className }: { className?: string }) {
  const [abierto, setAbierto] = useState(false)
  const disparador = useRef<HTMLButtonElement>(null)

  /**
   * Radix devuelve el foco al disparador cuando el diálogo se cierra, pero
   * aquí el panel se desmonta en el mismo instante en que `abierto` pasa a
   * `false`, así que esa devolución no llega a ocurrir. Sin esto, cerrar con
   * Escape dejaba el foco en el `body` y quien navega con teclado tenía que
   * empezar la página desde el principio. Se espera un fotograma para que el
   * desmontaje termine antes de devolver el foco.
   */
  function cambiarEstado(nuevoEstado: boolean) {
    setAbierto(nuevoEstado)

    if (!nuevoEstado) {
      requestAnimationFrame(() => disparador.current?.focus())
    }
  }

  return (
    <>
      <Button
        ref={disparador}
        variant="outline"
        size="default"
        className={className}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={() => cambiarEstado(true)}
        onPointerEnter={cargarPanel}
        onFocus={cargarPanel}
      >
        <Menu aria-hidden="true" />
        Menú
      </Button>

      {abierto ? <Panel abierto={abierto} alCambiar={cambiarEstado} /> : null}
    </>
  )
}
