/**
 * Preguntas frecuentes reales.
 *
 * De momento solo quedan las de `/primera-vez`, que ya estaban publicadas.
 * Las de portada, clases, horarios, precios, Hatha y Vinyasa se retiraron
 * porque los textos de la web se van a rehacer: se generarán de nuevo desde
 * los textos definitivos. No se inventa una pregunta para rellenar.
 */

export type Pregunta = {
  /** La pregunta, tal cual. Se lee de un tirón. */
  pregunta: string
  respuesta: string
}

/**
 * Las nueve preguntas de `/primera-vez`. Son las que ya estaban publicadas y
 * las que más se repiten por WhatsApp.
 */
export const preguntasPrimeraVez: Pregunta[] = [
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
      "Sí, pero siempre bajo supervisión médica, y avísanos antes de empezar. Adaptaremos las posturas para que tu práctica sea segura y respetuosa con tu cuerpo.",
  },
  {
    pregunta: "¿Hay que reservar para venir a clase?",
    respuesta:
      "Solo la primera clase de prueba, que se pide por WhatsApp. Las clases normales son con horario libre: vienes el día que te encaja, sin reservar y sin avisar.",
  },
  {
    pregunta: "¿Cuánto cuesta empezar?",
    respuesta:
      "La primera clase es gratuita. Después, los planes van desde 40 € al mes por una clase a la semana. También hay bono de 6 clases por 65 € y clase suelta por 15 €.",
  },
  {
    pregunta: "¿Dónde está el estudio?",
    respuesta:
      "En C/ Sant Francesc de Borja, 36, 1º, en el centro de Gandia (46701). El portal está en la calle y el estudio, en el primer piso.",
  },
  {
    pregunta: "¿Puedo ir si tengo dolor de espalda?",
    respuesta:
      "Sí, con supervisión médica y avisándonos antes de empezar. Susana llegó al yoga por una escoliosis y adapta las posturas para que la práctica sea segura.",
  },
  {
    pregunta: "¿Qué diferencia hay entre Hatha y Vinyasa?",
    respuesta:
      "El Hatha sostiene las posturas con calma y es la puerta de entrada. El Vinyasa enlaza postura y respiración en secuencias más activas. Puedes probar los dos: el horario es libre.",
  },
  {
    pregunta: "¿Cuánto dura una clase?",
    respuesta:
      "Las sesiones duran 35, 60 o 75 minutos. Las de 35 minutos son clases exprés, y dos exprés cuentan como una clase normal.",
  },
]
