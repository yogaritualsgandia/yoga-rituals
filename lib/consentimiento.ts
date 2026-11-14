/**
 * El consentimiento de la medición, donde lo necesitan sus dos lados.
 *
 * La clave y la caducidad viven aquí porque tienen que coincidir exactamente:
 * las usa el proveedor de React para guardar y leer la respuesta, y también el
 * guion que corre antes de pintar para saber si hay que enseñar el cartel. Si
 * una de las dos copias se quedara atrás, el cartel aparecería —o dejaría de
 * aparecer— cuando no toca.
 */

/** La clave del almacenamiento del navegador. */
export const CLAVE_CONSENTIMIENTO = "consentimiento-analitica"

/** Lo que dura un permiso antes de volver a preguntar. Dos años, en milisegundos. */
export const CADUCIDAD = 1000 * 60 * 60 * 24 * 365 * 2

/**
 * El guion que se ejecuta antes de que se pinte nada.
 *
 * EL PROBLEMA. El sitio se exporta como HTML estático, y al construirlo no hay
 * navegador de nadie que consultar: la página nace con el cartel de cookies
 * dentro. Al hidratar, React lee `localStorage`, descubre que esa persona ya
 * había contestado y quita el cartel. Entre una cosa y la otra pasan unos
 * milisegundos en los que el cartel se ve, y a quien ya había decidido le
 * aparece en cada visita como un parpadeo.
 *
 * LA SOLUCIÓN. Este guion corre antes de que exista el primer elemento de la
 * página y, si encuentra una decisión válida —«si» o «no», da igual—, pone
 * `data-consentimiento="respondido"` en el <html>. El CSS esconde el cartel
 * mientras ese atributo esté, así que no llega a pintarse ni un fotograma.
 *
 * POR QUÉ NO SE DEJA SOLO A REACT. Porque cuando React decide ya se ha pintado
 * el HTML del servidor: no hay forma de saber la respuesta antes de tiempo
 * desde el paquete. Y por qué no se esconde el cartel siempre: quien entra por
 * primera vez no tiene nada guardado, el atributo no se pone y el cartel sale
 * de inmediato, sin esperar a que llegue el JavaScript.
 *
 * SI ALGO FALLA, SE ENSEÑA. Un valor ilegible, caducado o un navegador que
 * prohíbe el almacenamiento dejan el atributo sin poner, y el cartel se ve: es
 * el lado seguro, porque preguntar de más nunca es el error grave.
 */
export const GUION_CONSENTIMIENTO = `try{var g=JSON.parse(localStorage.getItem("${CLAVE_CONSENTIMIENTO}")||"null");if(g&&(g.estado==="si"||g.estado==="no")&&typeof g.fecha==="number"&&Date.now()-g.fecha<=${CADUCIDAD})document.documentElement.dataset.consentimiento="respondido"}catch(e){}`
