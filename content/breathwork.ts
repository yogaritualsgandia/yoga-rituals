/**
 * Breathwork.
 *
 * El texto es suyo, copiado de la web actual palabra por palabra. Aquí sí he
 * movido una frase de sitio, y lo digo: «La respiración es la herramienta más
 * simple y, al mismo tiempo, la más profunda» estaba dentro del tercer párrafo
 * y ahora abre la página, porque es la mejor frase que tiene para presentarla.
 * En el párrafo se queda lo que venía después, que se lee igual de bien.
 *
 * Las dos estrofas del centro son suyas y también están enteras. Solo se han
 * partido en líneas, que es como se leen: de una en una.
 *
 * La práctica se llama breathwork, con esa palabra: así la llama ella y así se
 * llama la página. «Respiración» se queda donde suena bien, dentro de las
 * frases, que es lo que ella escribe.
 *
 * `datos` no añade nada que no esté: sale de `sesion`, partido. La frase entera
 * se queda en su sitio —se lee seguida y está bien ahí— y los cuatro datos que
 * se vienen a buscar van en su ficha, como en el yoga nidra. Metidos en un
 * párrafo se pierden; en una ficha, no.
 */

export const breathwork = {
  entradilla:
    "La respiración es la herramienta más simple y, al mismo tiempo, la más profunda.",
  /** Los tres párrafos del principio, seguidos, como están en su web. */
  cuerpo: [
    "El cuerpo se asemeja a una biblioteca donde se almacenan nuestras experiencias; es el lugar donde quedan registradas las vivencias como el estrés, el miedo y los momentos de felicidad, guardadas en los tejidos, los músculos y el sistema nervioso. Cuando una vivencia no se procesa completamente, el cuerpo puede quedarse atrapado, generando rigidez, fatiga o dolor.",
    "Breathwork nos ofrece la posibilidad, a través de la respiración, de acceder a esos lugares que no alcanzamos desde la comprensión, acceder a esa memoria corporal, brindando un espacio seguro al cuerpo para liberar lo que quedó atrapado.",
    "El cuerpo y la mente están interconectados y funcionan como un sistema único en constante comunicación bidireccional, siendo la respiración un puente entre ambos.",
  ],
  /** La primera estrofa: qué es y qué no es. */
  estrofa: {
    primera: "No es solo respirar.",
    segunda:
      "Es permitir que tu cuerpo deje de sostener lo que lleva demasiado tiempo cargando.",
  },
  /** La segunda: lo que puede pasar en una sesión, sin prometer nada. */
  aVeces: [
    "A veces el cuerpo necesita expresar.",
    "A veces descansar.",
    "A veces temblar.",
    "A veces llorar.",
    "A veces simplemente sentir seguridad por primera vez en mucho tiempo.",
  ],
  /** Los cuatro datos, que son las preguntas de antes de venir. */
  datos: [
    { etiqueta: "Duración", valor: "90 minutos, aproximadamente." },
    { etiqueta: "Postura", valor: "Tumbada, durante toda la sesión." },
    { etiqueta: "Experiencia", valor: "No hace falta ninguna." },
    { etiqueta: "Formación", valor: "Respiración Inbreath." },
  ],
  sesion:
    "La sesión individual tiene una duración aproximada de 90 minutos, durante los cuales permaneces tumbado. No se necesita experiencia previa alguna.",
  /** La formación con la que trabaja, como ella la nombra. */
  metodo:
    "La respiración Inbreath trabaja desde la respiración consciente y el cuerpo, creando el espacio interno de libertad.",
} as const
