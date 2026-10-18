import type { Metadata } from "next"
import Link from "next/link"

import { Contenedor } from "@/components/layout/contenedor"
import { Button } from "@/components/ui/button"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: `La dirección que has escrito no corresponde a ninguna página de ${site.nombre}.`,
}

/**
 * Página de error 404.
 *
 * La web antigua tenía trece direcciones y esta no conserva todas: unas
 * cambiaron de nombre y siguen funcionando por una redirección —están en
 * `next.config.ts`—, pero un enlace escrito a mano, una letra de menos o una
 * página que ya no existe caen aquí.
 *
 * Es un 404 normal, y eso es lo que tiene que ser: el número grande, la frase
 * que dice qué ha pasado y el camino de vuelta. Quien llega aquí viene de un
 * enlace roto y lo único que necesita es salir, no un discurso ni seis enlaces
 * nuevos que le hagan dudar más. De la cabecera y del pie ya se encarga el
 * resto de la web, que sigue puesta aquí arriba y aquí abajo.
 *
 * Next añade `noindex` a esta página solo, que es justo lo que se quiere: un
 * 404 no debe salir en Google.
 */
export default function PaginaNoEncontrada() {
  return (
    <section className="seccion">
      <Contenedor className="flex min-h-[46vh] flex-col items-center justify-center text-center">
        {/* El número no lleva `text-balance` ni nada que lo parta: son tres
            cifras y tienen que leerse de un golpe. */}
        <p className="etiqueta">Error 404</p>

        <p
          aria-hidden="true"
          className="font-heading mt-4 text-[clamp(5rem,20vw,10rem)] leading-[0.9] text-ink"
        >
          404
        </p>

        <h1 className="paso-entrada mt-6 max-w-[24ch] text-ink-soft">
          No se ha podido encontrar la página.
        </h1>

        <Button asChild size="lg" className="mt-10">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </Contenedor>
    </section>
  )
}
