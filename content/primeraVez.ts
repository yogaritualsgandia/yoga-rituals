/**
 * Página «Primera vez».
 *
 * Todo el texto de este archivo es el que ya está publicado en la web actual,
 * respetado palabra por palabra. Es el contenido que más trabaja de toda la
 * web: quien nunca ha hecho yoga necesita que le quiten el miedo antes de
 * dar el paso. No se reescribe por gusto.
 */

export const primeraVez = {
  titulo: "Primera vez",
  entradilla: "Todo lo que necesitas saber para dar el primer paso.",
  ganchos: [
    "No te preocupes: no hace falta ser flexible para empezar.",
    "Nuestros horarios son libres. No necesitas avisar ni reservar para asistir a la sesión.",
  ],
  cuestionarioTexto:
    "¿No sabes qué tipo de yoga es ideal para ti? Completa este breve cuestionario de bienestar. Nos permitirá conocerte mejor y recomendarte el ritual que más se adapte a tus necesidades y objetivos hoy mismo.",
} as const

export const queNecesitas = {
  titulo: "¿Qué necesitas?",
  entradilla:
    "Queremos que tu única preocupación sea encontrar un hueco en tu agenda.",
  puntos: [
    {
      etiqueta: "Ropa",
      texto: "Elige ropa con la que te sientas a gusto.",
    },
    {
      etiqueta: "Calzado",
      texto:
        "No lo necesitas. Practicamos descalzos o con calcetines, tú eliges.",
    },
    {
      etiqueta: "Material",
      texto:
        "La sala dispone de bloques, banquitos de meditación, mantas y bolsters. Nosotros ponemos la esterilla en tus primeros días. Los alumnos que lo deseen pueden dejar su esterilla en el centro.",
    },
  ],
} as const

export const aTenerEnCuenta = {
  titulo: "A tener en cuenta",
  entradilla:
    "Para que disfrutes de la experiencia sin prisas, ten en cuenta estos detalles.",
  puntos: [
    {
      etiqueta: "Llega unos minutos antes",
      texto:
        "Así podremos enseñarte el centro y explicarte lo básico.",
    },
    {
      etiqueta: "Silencio",
      texto:
        "Al entrar al estudio intentamos mantener un tono de voz bajo, para respetar la relajación de quienes ya están en la sala.",
    },
    {
      etiqueta: "Desconexión",
      texto: "Deja el móvil en silencio (o apagado) en el vestuario.",
    },
  ],
} as const

export type Pregunta = {
  /** La pregunta, tal cual. Se lee de un tirón en el acordeón. */
  pregunta: string
  respuesta: string
}

/**
 * Las tres preguntas que ya están publicadas, con su respuesta exacta.
 * El acordeón de shadcn es una petición expresa de Susana, aunque la
 * dirección de arte prefería texto corrido: manda ella.
 */
export const preguntasFrecuentes: Pregunta[] = [
  {
    pregunta: "No soy flexible, ¿puedo hacer yoga?",
    respuesta:
      "¡Por supuesto! La flexibilidad llega con la práctica, no es un requisito.",
  },
  {
    pregunta: "¿Qué pasa si no puedo seguir el ritmo?",
    respuesta:
      "Nada. En YOGA Rituals respetamos los tiempos de cada cuerpo. Si una postura te resulta intensa, puedes descansar en cualquier momento. Siempre hay diferentes opciones.",
  },
  {
    pregunta: "Tengo una lesión o una dolencia, ¿puedo practicar?",
    respuesta:
      "Sí, pero siempre bajo supervisión médica, y avísanos antes de empezar. Adaptaremos las posturas para que tu práctica sea segura y terapéutica.",
  },
]

/** Lo que falta por preguntarle, para no inventarlo. */
export const preguntasPendientes = [
  "[PENDIENTE: ¿hay que llevar algo más la primera vez?]",
  "[PENDIENTE: ¿se puede aparcar cerca del estudio?]",
  "[PENDIENTE: ¿cómo se paga la cuota?]",
] as const

export const cierrePrimeraVez = {
  titular: "Estamos aquí para acompañarte",
  /** La web actual cierra esta página con un botón a WhatsApp. Se mantiene. */
  accion: "Contáctanos por WhatsApp",
} as const
