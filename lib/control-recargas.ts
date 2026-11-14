/**
 * El control de recargas: la parte que se ejecuta en el navegador.
 *
 * Netlify corta las peticiones con una ventana móvil de 60 s y reescribe el
 * sitio a `public/demasiadas-peticiones.html`. Ese corte **no es pegajoso**: en
 * cuanto el contador baja del límite, la siguiente petición entra, así que
 * pulsar F5 devolvía a la web. Lo que falta —un minuto que aguante, cinco
 * segundos más por recarga, castigo de cinco minutos y cupo que se parte en
 * dos— se lleva aquí, porque el sitio es estático y no hay servidor donde
 * guardar nada por IP.
 *
 * El estado vive en `localStorage`, bajo la clave `yr-recargas`, y lo escribe
 * la pantalla de aviso. Este guion solo lo lee, para una cosa: si hay un
 * castigo corriendo, devolver a esa pantalla a quien intente entrar por otra
 * dirección. Va el primero en el `<body>`, antes de que se pinte nada, igual
 * que `GUION_MOVIMIENTO` y `GUION_CONSENTIMIENTO`, y por el mismo motivo: si
 * esperase al paquete de JavaScript, se vería la web un instante y luego el
 * salto.
 *
 * Tres decisiones que se notan:
 *
 *  1. SI ALGO FALLA, SE DEJA PASAR. Todo va dentro de un `try`: un navegador
 *     sin almacenamiento, un JSON a medias o una fecha rara no pueden dejar a
 *     nadie encerrado fuera de la web.
 *  2. EL DÍA MANDA. Si el estado guardado es de ayer, se ignora: el cupo se
 *     recupera solo al cambiar el día y no hace falta un trabajo que lo limpie.
 *  3. LA CLAVE Y LA DIRECCIÓN ESTÁN DUPLICADAS a propósito en el HTML de la
 *     pantalla (`public/demasiadas-peticiones.html`). Ese archivo tiene que
 *     servirse sin pedir nada más —cuando se sirve, el sitio entero está
 *     cortado—, así que no puede importar este módulo. Si cambia una, cambia
 *     la otra.
 */
export const CLAVE_CONTROL_RECARGAS = "yr-recargas"

/** Dónde vive la pantalla de aviso. Tiene que existir en `public/`. */
export const PAGINA_CONTROL_RECARGAS = "/demasiadas-peticiones.html"

export const GUION_CONTROL_RECARGAS = `(function () {
  try {
    var e = JSON.parse(localStorage.getItem("${CLAVE_CONTROL_RECARGAS}") || "null")
    if (!e) return
    var d = new Date()
    var hoy = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    if (e.dia !== hoy) return
    var fin = Math.max(e.hasta || 0, e.hastaManana || 0)
    if (fin <= Date.now()) return
    if (location.pathname === "${PAGINA_CONTROL_RECARGAS}") return
    location.replace("${PAGINA_CONTROL_RECARGAS}")
  } catch (error) {}
})()`
