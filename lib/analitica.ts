/**
 * La analítica de las visitas.
 *
 * Aquí se contesta una sola pregunta —si esta web mide algo— y de la respuesta
 * salen tres cosas que tienen que ir siempre juntas: el guion de Google, el
 * cartel que pide permiso y los párrafos legales que lo describen. Si alguna
 * de las tres se escribiera por su cuenta, un día dirían cosas distintas.
 *
 * El valor llega de una variable de entorno y no de una línea escrita aquí, y
 * eso tiene consecuencias que conviene tener claras:
 *
 *  1. SIN IDENTIFICADOR NO HAY ANALÍTICA. Y sin analítica no se puede enseñar
 *     un cartel pidiendo permiso para algo que no existe: el cartel sale de la
 *     misma respuesta que el guion. Lo que no hay, no se anuncia.
 *
 *  2. El identificador no es ningún secreto, pero no vive en el repositorio.
 *     Se pone en el alojamiento (Netlify) y, para el ordenador de casa, en un
 *     archivo `.env.local` que no se publica. Los pasos están en DESPLIEGUE.md.
 *
 *  3. `NEXT_PUBLIC_` quiere decir que Next lo mete dentro del paquete que baja
 *     al navegador, porque es el navegador quien habla con Google. Y lo mete EN
 *     EL MOMENTO DE COMPILAR: cambiar el identificador obliga a volver a
 *     publicar. Cambiarlo en el panel de Netlify y no republicar no hace nada.
 */

export const idAnalitica = process.env.NEXT_PUBLIC_GA_ID ?? ""

/** ¿Hay analítica configurada? Es la pregunta que hace todo lo demás. */
export const hayAnalitica = idAnalitica !== ""
