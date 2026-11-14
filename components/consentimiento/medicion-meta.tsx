"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"
import { useEffect, useRef } from "react"

import { idMeta, registrarWhatsApp } from "@/lib/analitica"

/**
 * El píxel de Meta y el seguimiento de los clics de WhatsApp.
 *
 * Las dos piezas viven aquí y se montan solo desde el proveedor de
 * consentimiento, cuando hay un «sí» y un identificador configurado. No se
 * cargan por su cuenta en ningún sitio: el píxel es una petición a Meta y, sin
 * permiso, no puede salir de casa de quien entra.
 *
 * El píxel entra con `afterInteractive`, igual que los de Google y Microsoft:
 * después de hidratar y sin frenar el primer pintado. Mientras no llega, la web
 * se ve y se usa igual.
 */
export function PixelMeta() {
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${idMeta}");fbq("track","PageView");`}
    </Script>
  )
}

/** Todos los enlaces que abren un chat: `wa.me` y el dominio largo. */
const SELECTOR = 'a[href*="wa.me"], a[href*="api.whatsapp.com"]'

/** De dónde salió el clic, para poder separarlos en Meta. */
function origenDe(enlace: HTMLAnchorElement) {
  const propio = enlace.dataset.origen
  if (propio) return propio
  if (enlace.closest("[data-whatsapp-flotante]")) return "flotante"
  if (enlace.closest("header")) return "cabecera"
  if (enlace.closest("footer")) return "pie"
  return "contenido"
}

/**
 * Un solo oyente para todos los enlaces de WhatsApp de la web.
 *
 * Se escucha en la fase de captura para que el evento salga aunque otro
 * manejador corte la propagación. No se engancha nada a cada botón: cualquier
 * enlace `wa.me` que se añada mañana —en una página nueva, en un pie
 * rediseñado— queda medido solo.
 *
 * De cada clic se manda el texto del enlace y de dónde salió, nada más. La
 * dirección de destino no se manda: lleva dentro el mensaje que se escribe solo
 * («Hola Susana, quiero reservar…»), y eso es texto de la persona.
 */
export function SeguimientoWhatsApp() {
  const ruta = usePathname()
  const primeraRuta = useRef(true)

  /* El píxel ya cuenta la primera página al arrancar. Aquí se cuentan las
     siguientes, para que una visita que empieza en la portada y acaba en
     `/precios` no figure como una sola página vista. */
  useEffect(() => {
    if (primeraRuta.current) {
      primeraRuta.current = false
      return
    }

    window.fbq?.("track", "PageView")
  }, [ruta])

  useEffect(() => {
    const alPulsar = (evento: MouseEvent) => {
      const objetivo = evento.target
      if (!(objetivo instanceof Element)) return

      const enlace = objetivo.closest<HTMLAnchorElement>(SELECTOR)
      if (!enlace) return

      const etiqueta = (
        enlace.getAttribute("aria-label") ??
        enlace.textContent ??
        ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100)

      registrarWhatsApp({ origen: origenDe(enlace), etiqueta })
    }

    document.addEventListener("click", alPulsar, true)
    return () => document.removeEventListener("click", alPulsar, true)
  }, [])

  return null
}
