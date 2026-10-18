/**
 * Las palabras del cartel de cookies.
 *
 * Van aquí, con el resto del texto de la web, y no dentro del componente: es
 * texto que alguien va a leer y corregir, y se corrige mejor al lado de los
 * demás textos que entre llaves de JavaScript.
 *
 * Tres decisiones de redacción, por si alguien las quiere cambiar con motivo:
 *
 *  · Se dice QUÉ SE MIDE Y PARA QUÉ en la primera frase, sin rodearlo. Quien
 *    entra sabe en tres segundos qué se le está pidiendo y por qué.
 *
 *  · Se dice también que rechazar no rompe nada, y se dice antes de que haya
 *    que pulsar: un cartel que solo cuenta lo bueno de aceptar no es un aviso,
 *    es un empujón.
 *
 *  · Los dos botones llevan la misma talla y el mismo peso de letra. El de
 *    aceptar va en el color de la casa y el de rechazar en contorno, y ahí se
 *    acaba la diferencia: la Agencia Española de Protección de Datos exige que
 *    las dos opciones estén al mismo nivel, y esconder una de las dos —en gris,
 *    en letra pequeña o detrás de un «configurar»— es justo lo que sanciona.
 */

export const avisoCookies = {
  /** El antetítulo del cartel. Corto: es una etiqueta, no un titular. */
  etiqueta: "Cookies",
  texto:
    "Para saber cuánta gente entra y qué páginas se leen usamos Google Analytics. Se enciende solo si le das a aceptar; si rechazas, la web funciona igual y no se mide nada.",
  enlace: "Qué son estas cookies",
  aceptar: "Aceptar todas",
  rechazar: "Rechazar todas",
} as const

/**
 * El control que hay al final de la página de cookies.
 *
 * Es lo que hace que retirar el permiso cueste lo mismo que darlo: sin esto,
 * aceptar sería un botón en la primera visita y desdecirse, un trámite. Dice
 * primero en qué estado está todo —quien entra tiene derecho a saberlo sin
 * tocar nada— y luego ofrece el botón.
 */
export const controlCookies = {
  titulo: "Cambiar lo que has elegido",
  texto:
    "El botón borra lo que hayas elegido, borra las cookies de Google si están puestas y te vuelve a preguntar.",
  boton: "Cambiar mi decisión",
  estados: {
    si: "Ahora mismo la analítica está encendida: se cuentan las visitas.",
    no: "Ahora mismo la analítica está apagada: no se cuenta ninguna visita.",
    pendiente: "Todavía no has elegido.",
  },
} as const
