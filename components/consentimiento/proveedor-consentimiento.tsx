"use client"

import Script from "next/script"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { hayAnalitica, idAnalitica } from "@/lib/analitica"

/**
 * El permiso para medir las visitas.
 *
 * Esta pieza existe por una razón muy concreta: Google Analytics no se puede
 * cargar antes de que alguien lo acepte. Y no se puede de verdad, no vale con
 * cargarlo y decirle que no mida: mientras el guion de Google esté en el
 * navegador, hay una petición suya que sale de casa de quien entra, con su
 * dirección IP dentro. Así que aquí no se carga NADA hasta que hay un sí.
 * Quien rechaza navega por una web que, para Google, no existe.
 *
 * De ahí salen las cuatro decisiones que están escritas abajo:
 *
 *  1. LO QUE SE GUARDA ES SOLO LA RESPUESTA —«si» o «no»— y se guarda en el
 *     navegador de quien contesta, no en un servidor: aquí no hay servidor
 *     donde guardarla. No es una cookie y no viaja a ningún sitio.
 *
 *  2. CADUCA A LOS DOS AÑOS. La Agencia Española de Protección de Datos dice
 *     que un permiso así no puede durar indefinidamente; dos años es el tope
 *     que recomienda. Pasado ese tiempo se vuelve a preguntar, y si alguien ya
 *     no está, deja de contar.
 *
 *  3. RETIRARLO CUESTA LO MISMO QUE DARLO: hay un botón al final de la página
 *     de cookies, y al pulsarlo se borra lo elegido, se borran las cookies de
 *     Google si estaban puestas y vuelve a salir el cartel.
 *
 *  4. PARA ESO HAY QUE RECARGAR, y no es una comodidad: si ya se había
 *     aceptado, el guion de Google está cargado en este mismo documento y sigue
 *     midiendo aunque se borre lo guardado. Borrar la decisión y dejarlo
 *     corriendo sería mentir en el botón. Al recargar, la página nace sin
 *     guion, sin cookies y sin decisión.
 */

export type Decision = "si" | "no"
export type Estado = Decision | "pendiente"

/** La clave del almacenamiento del navegador. Solo la toca este archivo. */
export const CLAVE_CONSENTIMIENTO = "consentimiento-analitica"

/** Lo que dura un permiso antes de volver a preguntar. Dos años, en milisegundos. */
const CADUCIDAD = 1000 * 60 * 60 * 24 * 365 * 2

type Guardado = { estado: Decision; fecha: number }

const avisadores = new Set<() => void>()

function avisarATodos() {
  for (const avisador of avisadores) avisador()
}

/* Se avisa a los dos: a quien esté mirando esta pestaña —React, por medio de
   sus avisadores— y a las otras pestañas abiertas de la misma web, que se
   enteran por el evento `storage` del navegador. Así, si alguien acepta en una
   pestaña y está mirando la web en otra, las dos cuentan lo mismo. */
function suscribir(alCambiar: () => void) {
  avisadores.add(alCambiar)
  window.addEventListener("storage", alCambiar)

  return () => {
    avisadores.delete(alCambiar)
    window.removeEventListener("storage", alCambiar)
  }
}

function leer(): Estado {
  try {
    const guardado = window.localStorage.getItem(CLAVE_CONSENTIMIENTO)
    if (!guardado) return "pendiente"

    const { estado, fecha } = JSON.parse(guardado) as Guardado

    if (estado !== "si" && estado !== "no") return "pendiente"
    if (typeof fecha !== "number" || Date.now() - fecha > CADUCIDAD) {
      return "pendiente"
    }

    return estado
  } catch {
    /* Un valor ilegible —a medio escribir, de una versión anterior, o con el
       almacenamiento prohibido por el navegador— se trata como si no hubiera
       decisión: se pregunta otra vez y no pasa nada. El fallo, en el lado
       seguro. */
    return "pendiente"
  }
}

/* En el servidor no se puede saber qué contestó nadie, así que la respuesta es
   «pendiente»: no se pinta ni el cartel ni el guion de Google. El navegador lo
   corrige al hidratar, sin avisar de ninguna diferencia. */
const enElServidor = (): Estado => "pendiente"

/**
 * Borra las cookies que Google haya podido dejar.
 *
 * Se borra cada nombre en las dos formas en que puede estar —en el dominio
 * pelado y en el de primer nivel—, porque una cookie que no coincide
 * exactamente en nombre, ruta y dominio no se borra y se queda ahí sin que
 * nadie se entere. Con el dominio equivocado el navegador no hace nada: no
 * falla, simplemente ignora la orden.
 */
function borrarCookiesDeGoogle() {
  try {
    const caducada = "expires=Thu, 01 Jan 1970 00:00:00 GMT"
    const dominioDePrimerNivel = location.hostname.split(".").slice(-2).join(".")

    for (const trozo of document.cookie.split(";")) {
      const nombre = trozo.split("=")[0]?.trim()
      if (!nombre?.startsWith("_ga")) continue

      document.cookie = `${nombre}=; path=/; ${caducada}`
      document.cookie = `${nombre}=; path=/; domain=.${dominioDePrimerNivel}; ${caducada}`
    }
  } catch {
    /* Si el navegador no deja tocar sus cookies, tampoco las de Google durarán
       mucho más: se van solas al caducar. */
  }
}

type Valor = {
  /** Lo que hay decidido ahora mismo. */
  estado: Estado
  /** Guarda la respuesta y, con ella, enciende o apaga la analítica. */
  decidir: (decision: Decision) => void
  /** Vuelve a preguntar: borra lo elegido, borra las cookies y recarga. */
  reabrir: () => void
}

const Contexto = createContext<Valor | null>(null)

export function useConsentimiento() {
  const estado = useContext(Contexto)

  if (!estado) {
    throw new Error(
      "useConsentimiento() solo funciona dentro de <ProveedorConsentimiento>",
    )
  }

  return estado
}

/**
 * El guion de Google. Solo se monta con un «sí» delante.
 *
 * `afterInteractive` es lo que recomienda la propia documentación de Next para
 * la analítica: ni frena la primera pintura ni se queda para el final.
 *
 * Y las visitas se cuentan con la cookie recortada a trece meses, que es lo
 * que dice la página de cookies. Por defecto Google las deja en dos años.
 */
const MESES_TRECE = 60 * 60 * 24 * 393

function Analitica() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${idAnalitica}`}
        strategy="afterInteractive"
      />
      <Script id="analitica" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${idAnalitica}",{cookie_expires:${MESES_TRECE}});`}
      </Script>
    </>
  )
}

export function ProveedorConsentimiento({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(suscribir, leer, enElServidor)

  const decidir = useCallback((decision: Decision) => {
    try {
      const guardado: Guardado = { estado: decision, fecha: Date.now() }
      window.localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(guardado))
    } catch {
      /* Si no se puede guardar, la decisión vale para esta visita y se vuelve a
         preguntar la próxima. Antes eso que no poder leer nada. */
    }

    if (decision === "no") borrarCookiesDeGoogle()

    avisarATodos()
  }, [])

  const reabrir = useCallback(() => {
    try {
      window.localStorage.removeItem(CLAVE_CONSENTIMIENTO)
    } catch {
      /* Nada que borrar. */
    }

    borrarCookiesDeGoogle()
    window.location.reload()
  }, [])

  const valor = useMemo(() => ({ estado, decidir, reabrir }), [estado, decidir, reabrir])

  return (
    <Contexto.Provider value={valor}>
      {children}

      {/* Sin identificador configurado no hay nada que pedir ni nada que
          cargar, y el cartel no se pinta: se pregunta por cosas que existen. */}
      {hayAnalitica && estado === "si" ? <Analitica /> : null}
    </Contexto.Provider>
  )
}
