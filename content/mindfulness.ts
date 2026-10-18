/**
 * Mindfulness.
 *
 * La sesión no es del estudio: se hace en la Biblioteca Benipeixcar-Raval y la
 * lleva la biblioteca. Eso manda sobre todo lo demás, porque es lo que confunde
 * a quien lee «mindfulness» en una web de yoga: aquí no hay que venir a la
 * calle Sant Francesc de Borja.
 *
 * El texto de la entradilla se corta a media palabra en su web —está así,
 * publicado—, así que se copia entero hasta donde está entero. Lo que faltaba
 * no era el relato: eran cuatro datos, y ya están: la hora, lo que dura, quién
 * lleva las plazas y si hay sitio ahora mismo. Con eso la página puede decir
 * todo lo que hay que saber antes de ir, que es a lo que se viene.
 */

export const mindfulness = {
  entradilla:
    "Desde hace más de 7 años, todos los miércoles, tenemos nuestra sesión de Mindfulness en la Biblioteca Benipeixcar-Raval de Gandia.",
  /** Los cuatro datos, que es lo que se viene a buscar aquí. */
  datos: [
    {
      etiqueta: "Cuándo",
      valor: "Miércoles, 10:30 h",
    },
    {
      etiqueta: "Dónde",
      valor: "Biblioteca Benipeixcar-Raval, en Gandia",
    },
    {
      etiqueta: "Duración",
      valor: "1 hora",
    },
    {
      etiqueta: "Reservas",
      valor: "En la propia biblioteca",
    },
  ],
  /**
   * El estado de las plazas.
   *
   * Esto es de hoy y no de siempre: el día que se libere una plaza, aquí pone
   * otra cosa. Lo que no caduca es la segunda mitad —quién lleva la lista—, y
   * por eso está en el mismo bloque: el aviso de que ahora no hay sitio solo
   * sirve si se dice a quién hay que preguntarle.
   */
  aviso: {
    ahora: "Ahora mismo, plazas completas.",
    resto:
      "La lista de plazas la lleva la biblioteca, no el estudio: allí se reserva.",
  },
  /** Qué es la sesión, sin prometer nada que no pase. */
  queEsperar: [
    "Una sesión guiada para aprender a estar presente, con prácticas sencillas de respiración y atención plena.",
    "No hace falta experiencia previa. Ven con ropa cómoda y con ganas de desconectar un rato.",
  ],
  /**
   * El taller que viene.
   *
   * Lleva fecha puesta, así que caduca: el día que pase, o se cambia por el
   * siguiente o se quita el bloque entero.
   */
  proximoTaller: {
    titular: "Próximo taller de respiración",
    cuando: "18, 19 y 20 de noviembre, de 8:00 a 8:50 h",
    donde: "En el estudio, en Gandia.",
  },
  /** El cierre, que lleva a los dos sitios donde se puede preguntar. */
  cierre: {
    titular: "Si quieres venir el miércoles",
    texto:
      "La sesión es de la biblioteca, no del estudio: allí se reserva y allí se pregunta por las plazas que quedan. Si tienes cualquier duda antes de ir, escríbenos. Y si lo que quieres probar son las clases del estudio, la primera es gratis.",
  },
} as const
