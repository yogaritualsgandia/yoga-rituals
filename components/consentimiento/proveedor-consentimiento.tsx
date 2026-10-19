"use client"

import Script from "next/script"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  hayAnalitica,
  hayClaridad,
  idAnalitica,
  idClaridad,
} from "@/lib/analitica"

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

/** Marca de un solo uso: «al recargar, borra lo que quede de la medición». */
const CLAVE_BORRAR = "medicion-por-borrar"

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
 * Borra lo que hayan dejado Google y Microsoft.
 *
 * Se borra cada nombre en las dos formas en que puede estar —en el dominio
 * pelado y en el de primer nivel—, porque una cookie que no coincide
 * exactamente en nombre, ruta y dominio no se borra y se queda ahí sin que
 * nadie se entere. Con el dominio equivocado el navegador no hace nada: no
 * falla, simplemente ignora la orden.
 *
 * De Google: `_ga` y `_ga_<contenedor>`. De Microsoft: `_clck`, `_clsk`,
 * `MUID`, `ANONCHK`, `SM` y `SRM_B`. Además se limpia el almacenamiento local
 * que usa Clarity, que no es una cookie pero cumple la misma función.
 */
const NOMBRES_DE_MICROSOFT = /^(_cl|MUID$|ANONCHK$|SM$|SRM_B$)/

function borrarRastroDeMedicion() {
  try {
    const caducada = "expires=Thu, 01 Jan 1970 00:00:00 GMT"
    const dominioDePrimerNivel = location.hostname.split(".").slice(-2).join(".")

    for (const trozo of document.cookie.split(";")) {
      const nombre = trozo.split("=")[0]?.trim()
      if (!nombre) continue
      if (!nombre.startsWith("_ga") && !NOMBRES_DE_MICROSOFT.test(nombre)) continue

      document.cookie = `${nombre}=; path=/; ${caducada}`
      document.cookie = `${nombre}=; path=/; domain=.${dominioDePrimerNivel}; ${caducada}`
    }

    for (const almacen of [window.localStorage, window.sessionStorage]) {
      for (const clave of Object.keys(almacen)) {
        if (/clarity|^_cl/i.test(clave)) almacen.removeItem(clave)
      }
    }
  } catch {
    /* Si el navegador no deja tocar sus cookies, tampoco las de Google ni las
       de Microsoft durarán mucho más: se van solas al caducar. */
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

/**
 * Microsoft Clarity.
 *
 * Es el fragmento que da Microsoft, sin cambiarle nada: monta su propio
 * cargador y se lleva la cuenta de mapas de calor y grabaciones de sesión.
 * Solo se monta con un «sí», igual que el de Google, y por eso tampoco hay
 * ninguna petición a Microsoft antes de que alguien acepte.
 */
function Claridad() {
  return (
    <Script id="claridad" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${idClaridad}");`}
    </Script>
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

    if (decision === "no") borrarRastroDeMedicion()

    avisarATodos()
  }, [])

  const reabrir = useCallback(() => {
    try {
      window.localStorage.removeItem(CLAVE_CONSENTIMIENTO)

      /* La marca sobrevive a la recarga, que es justo lo que hace falta: Google
         escribe su última cookie mientras la página se va. */
      window.sessionStorage.setItem(CLAVE_BORRAR, "1")
    } catch {
      /* Nada que borrar. */
    }

    borrarRastroDeMedicion()
    window.location.reload()
  }, [])

  /* Un «no» no puede dejar nada de la medición, y retirar el permiso tampoco.
   *
   * No basta con borrar al pulsar «retirar»: al recargar, Google alcanza a
   * escribir una última actualización de su cookie en el camino de salida, y la
   * cookie reaparecía después de haberla borrado. Por eso `reabrir` deja una
   * marca de un solo uso en el almacenamiento de la sesión y aquí se borra otra
   * vez al montar, ya con la página nueva y el guion de Google sin cargar.
   *
   * No se borra con cualquier estado distinto de «si», aunque parezca lo más
   * simple: en el servidor no se sabe qué contestó nadie y el primer render
   * dice «pendiente» aunque la respuesta guardada sea «si». Borrar ahí sería
   * borrarle la cookie a quien ya había aceptado en cada carga completa. */
  useEffect(() => {
    let porBorrar = false

    try {
      porBorrar = window.sessionStorage.getItem(CLAVE_BORRAR) === "1"
      if (porBorrar) window.sessionStorage.removeItem(CLAVE_BORRAR)
    } catch {
      /* Sin almacenamiento no hay marca; el borrado de `reabrir` ya se hizo. */
    }

    if (estado === "no" || porBorrar) borrarRastroDeMedicion()
  }, [estado])

  const valor = useMemo(() => ({ estado, decidir, reabrir }), [estado, decidir, reabrir])

  return (
    <Contexto.Provider value={valor}>
      {children}

      {/* Sin identificador configurado no hay nada que pedir ni nada que
          cargar, y el cartel no se pinta: se pregunta por cosas que existen. */}
      {estado === "si" && hayAnalitica ? <Analitica /> : null}
      {estado === "si" && hayClaridad ? <Claridad /> : null}
    </Contexto.Provider>
  )
}
