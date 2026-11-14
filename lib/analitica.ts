/**
 * La analítica de las visitas.
 *
 * Aquí se contesta una sola pregunta —si esta web mide algo— y de la respuesta
 * salen tres cosas que tienen que ir siempre juntas: los guiones de medición, el
 * cartel que pide permiso y los párrafos legales que lo describen. Si alguna de
 * las tres se escribiera por su cuenta, un día dirían cosas distintas.
 *
 * El valor llega de una variable de entorno y no de una línea escrita aquí, y
 * eso tiene consecuencias que conviene tener claras:
 *
 *  1. SIN IDENTIFICADOR NO HAY MEDICIÓN. Y sin medición no se puede enseñar un
 *     cartel pidiendo permiso para algo que no existe: el cartel sale de la
 *     misma respuesta que los guiones. Lo que no hay, no se anuncia.
 *
 *  2. Los identificadores no son ningún secreto, pero no viven en el
 *     repositorio. Se ponen en el alojamiento (Netlify) y, para el ordenador de
 *     casa, en un archivo `.env.local` que no se publica. Los pasos están en
 *     DESPLIEGUE.md.
 *
 *  3. `NEXT_PUBLIC_` quiere decir que Next los mete dentro del paquete que baja
 *     al navegador, porque es el navegador quien habla con Google, Microsoft o
 *     Meta. Y los mete EN EL MOMENTO DE COMPILAR: cambiar un identificador
 *     obliga a volver a publicar.
 */

export const idAnalitica = process.env.NEXT_PUBLIC_GA_ID ?? ""

/** Microsoft Clarity: mapas de calor y grabaciones de sesión. */
export const idClaridad = process.env.NEXT_PUBLIC_CLARITY_ID ?? ""

/**
 * Meta (Facebook e Instagram): el píxel.
 *
 * Es el identificador que Meta llama «ID del píxel». Se saca de
 * `NEXT_PUBLIC_META_PIXEL_ID`; mientras no esté, no se carga nada de Meta y la
 * web funciona igual.
 */
export const idMeta = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""

/** ¿Hay analítica configurada? Es la pregunta que hace todo lo demás. */
export const hayAnalitica = idAnalitica !== ""

/** ¿Hay Clarity configurado? */
export const hayClaridad = idClaridad !== ""

/** ¿Hay píxel de Meta configurado? */
export const hayMeta = idMeta !== ""

/**
 * ¿Se mide algo, sea lo que sea?
 *
 * El cartel no pregunta «¿aceptas Google Analytics?»: pregunta si se puede
 * medir. Si mañana se quita una herramienta y queda otra, o se añade una
 * tercera, el cartel sigue saliendo sin tocar nada.
 */
export const hayMedicion = hayAnalitica || hayClaridad || hayMeta

/**
 * El nombre del evento de Meta que se lanza al pulsar un enlace de WhatsApp.
 *
 * Es un evento personalizado y no el estándar `Contact` a propósito: `Contact`
 * lo lanza Meta también en otros sitios y aquí lo que se quiere contar es
 * exactamente «alguien ha abierto un chat de WhatsApp desde esta web». Con un
 * nombre propio no se mezcla con nada. Si algún día se prefiere el estándar
 * —porque se quiera usar como conversión en una campaña—, se cambia esta
 * constante y no hay que tocar ningún botón.
 */
export const EVENTO_WHATSAPP = "WhatsAppClick"

/** Lo que se manda con el evento. Nada que identifique a la persona. */
export type DatosDeWhatsApp = {
  /** De dónde salió el clic: «cabecera», «pie», «contacto»… */
  origen: string
  /** El texto del enlace o su nombre accesible, recortado. */
  etiqueta: string
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Avisa a Meta de que alguien ha pulsado un enlace de WhatsApp.
 *
 * Se llama desde el seguimiento global de clics, no desde cada botón: todos los
 * enlaces de WhatsApp de la web apuntan a `wa.me`, así que un solo oyente los
 * cubre todos, incluido el flotante, y un botón nuevo queda medido sin que
 * nadie se acuerde de nada.
 *
 * Si el píxel no está cargado —no hay identificador, no se ha aceptado, el
 * guion todavía no ha llegado— no hace nada y no falla: la web sigue igual.
 * No se manda la dirección de destino porque lleva dentro el mensaje que se
 * escribe solo, y eso es texto de la persona, no un dato de navegación.
 */
export function registrarWhatsApp({ origen, etiqueta }: DatosDeWhatsApp) {
  if (typeof window === "undefined") return

  window.fbq?.("trackCustom", EVENTO_WHATSAPP, {
    origen,
    etiqueta,
    pagina: window.location.pathname,
  })
}

