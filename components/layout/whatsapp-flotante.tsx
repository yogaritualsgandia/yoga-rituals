"use client"

import { useEffect, useRef, useState } from "react"

import { accionPrincipal } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Acceso directo a WhatsApp, siempre a mano.
 *
 * Va abajo a la derecha y no a la izquierda: es donde el pulgar llega solo en
 * un móvil y donde ya se busca un botón de WhatsApp. En móvil se queda pegado
 * al borde inferior, con el mismo aire que en escritorio.
 *
 * El bocadillo no sale de entrada. Espera unos segundos, se escribe letra a
 * letra, se queda un rato y se borra igual. Solo pasa una vez por sesión: un
 * aviso que se repite deja de ser un aviso y empieza a ser un estorbo.
 *
 * Con `prefers-reduced-motion` no hay máquina de escribir: aparece entero, se
 * queda y se va. El texto sigue estando para quien lo lea.
 */

const MENSAJE = "¿Te apetece probar? La primera clase es gratis."
const CLAVE_SESION = "burbuja-whatsapp-vista"

const esperar = (ms: number) =>
  new Promise<void>((resolver) => {
    window.setTimeout(resolver, ms)
  })

export function WhatsAppFlotante() {
  const [visible, setVisible] = useState(false)
  const [texto, setTexto] = useState("")
  const [escribiendo, setEscribiendo] = useState(false)
  const descartado = useRef(false)

  useEffect(() => {
    let activo = true

    try {
      if (window.sessionStorage.getItem(CLAVE_SESION)) return
    } catch {
      // Si el navegador no deja usar sessionStorage, se muestra igual.
    }

    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const recordar = () => {
      try {
        window.sessionStorage.setItem(CLAVE_SESION, "1")
      } catch {
        // Sin sessionStorage no se puede recordar; no pasa nada.
      }
    }

    const guion = async () => {
      await esperar(6500)
      if (!activo || descartado.current) return

      recordar()
      setVisible(true)

      if (reducido) {
        setTexto(MENSAJE)
        await esperar(9000)
        if (!activo) return
        setVisible(false)
        return
      }

      setEscribiendo(true)
      for (let i = 1; i <= MENSAJE.length; i += 1) {
        await esperar(52)
        if (!activo || descartado.current) return
        setTexto(MENSAJE.slice(0, i))
      }
      setEscribiendo(false)

      await esperar(6500)
      if (!activo || descartado.current) return

      for (let i = MENSAJE.length - 1; i >= 0; i -= 1) {
        await esperar(20)
        if (!activo || descartado.current) return
        setTexto(MENSAJE.slice(0, i))
      }

      setVisible(false)
    }

    void guion()

    return () => {
      activo = false
    }
  }, [])

  const cerrar = () => {
    descartado.current = true
    setVisible(false)
    setTexto("")
    try {
      window.sessionStorage.setItem(CLAVE_SESION, "1")
    } catch {
      // Sin sessionStorage no se puede recordar; no pasa nada.
    }
  }

  return (
    <div
      data-whatsapp-flotante
      className="fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-3 sm:right-5 lg:right-6"
    >
      {/* En una pantalla muy baja, el bocadillo taparía el botón de reserva.
          Ahí se queda solo el botón de WhatsApp. */}
      <a
        href={accionPrincipal.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={cerrar}
        aria-label={MENSAJE}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={cn(
          "relative w-[min(17rem,calc(100vw-5.5rem))] rounded-2xl border border-line bg-surface px-4 py-3 text-ink shadow-[0_18px_40px_-20px_rgba(20,50,60,0.45)]",
          "[@media(max-height:740px)]:hidden",
          "after:absolute after:right-6 after:-bottom-1.5 after:size-3 after:rotate-45 after:border-r after:border-b after:border-line after:bg-surface",
          "transition-[opacity,transform] duration-300 ease-out-soft motion-reduce:transition-none",
          visible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <span aria-hidden="true" className="paso-pequeno block">
          {texto}
          <span
            className={cn(
              "ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.16em] bg-ink",
              escribiendo ? "animate-pulse" : "opacity-0",
              "motion-reduce:hidden",
            )}
          />
        </span>
      </a>

      <a
        href={accionPrincipal.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={cerrar}
        aria-label="Abrir WhatsApp para reservar la clase de prueba gratuita"
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-[0_12px_30px_-10px_rgba(18,140,126,0.65)]",
          "transition-[background-color,transform] duration-200 ease-out-soft hover:scale-[1.04] hover:bg-[#0E7468] active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
          "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  )
}
