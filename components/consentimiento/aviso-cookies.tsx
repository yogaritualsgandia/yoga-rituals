"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

import { Contenedor } from "@/components/layout/contenedor"
import { Button } from "@/components/ui/button"
import { avisoCookies } from "@/content/consentimiento"
import { hayMedicion } from "@/lib/analitica"

import { useConsentimiento } from "./proveedor-consentimiento"

/**
 * El cartel de cookies.
 *
 * Aparece abajo, sobre la página, la primera vez que alguien entra —y solo si
 * hay analítica configurada y todavía no ha contestado—. Es lo primero que se
 * ve de la web en esa visita y por eso está cuidado: dice lo que se va a medir
 * en una frase, ofrece las dos salidas con el mismo peso y se quita de en medio
 * en cuanto se contesta. Nada de carteles que tapan la portada entera ni de
 * ventanas que no dejan leer hasta que se pulsa algo: la web se lee desde el
 * primer segundo, con el cartel y sin él.
 *
 * DOS DETALLES QUE NO SE VEN PERO IMPORTAN:
 *
 *  · El marco va aparte de la caja. El marco es fijo y no se mueve nunca; la
 *    caja es la que sube al entrar. Se hace así porque hay que MEDIR el hueco
 *    que ocupa el cartel —lo lee el pie para no quedar debajo—, y midiendo la
 *    caja la medida incluiría el desplazamiento de su propia animación: durante
 *    el primer cuarto de segundo saldría un hueco negativo. El marco no se
 *    mueve, así que su medida es la buena desde el primer fotograma.
 *
 *  · El marco deja pasar el ratón. Lo único que lo detiene es la caja. Sin eso,
 *    una franja de pantalla —la que va del borde al cartel, a los lados— se
 *    comería los clics de lo que hay debajo, que es justo lo que no puede pasar
 *    en algo que está encima de la página sin haber sido llamado.
 */
export function AvisoCookies() {
  const { estado, decidir } = useConsentimiento()

  const abierto = hayMedicion && estado === "pendiente"

  const marco = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return

    const nodo = marco.current
    if (!nodo) return

    const medir = () => {
      const alto = Math.max(
        0,
        Math.round(window.innerHeight - nodo.getBoundingClientRect().top),
      )

      document.documentElement.style.setProperty(
        "--alto-aviso-cookies",
        `${alto}px`,
      )
    }

    medir()

    /* Se mide otra vez cuando el cartel cambia de alto —el texto que rompe en
       dos líneas al estrecharse la ventana, la tipografía que termina de
       cargar— y cuando alguien gira el móvil. */
    const observador = new ResizeObserver(medir)
    observador.observe(nodo)
    window.addEventListener("resize", medir)

    return () => {
      observador.disconnect()
      window.removeEventListener("resize", medir)
      document.documentElement.style.removeProperty("--alto-aviso-cookies")
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div
      /* Marca estable para las pruebas: las clases cambian, esto no. */
      data-aviso-cookies
      ref={marco}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40"
    >
      <Contenedor className="pb-4">
        <div
          role="region"
          aria-labelledby="titulo-aviso-cookies"
          className="aviso-cookies__caja pointer-events-auto flex flex-col gap-5 rounded-lg border border-line bg-surface p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6"
        >
          <div className="max-w-[58ch]">
            <h2 id="titulo-aviso-cookies" className="font-heading text-lg text-ink">
              {avisoCookies.etiqueta}
            </h2>

            <p className="paso-pequeno mt-2 text-ink-soft">
              {avisoCookies.texto}{" "}
              <Link
                href="/cookies"
                className="text-ink underline underline-offset-4 hover:text-brand"
              >
                {avisoCookies.enlace}
              </Link>
            </p>
          </div>

          {/* En el móvil, uno debajo del otro y del mismo ancho: dos botones
              apretados en el mismo renglón se leen como uno solo con dos
              trozos. */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={() => decidir("si")}>{avisoCookies.aceptar}</Button>

            <Button variant="outline" onClick={() => decidir("no")}>
              {avisoCookies.rechazar}
            </Button>
          </div>
        </div>
      </Contenedor>
    </div>
  )
}
