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
} as const

export const queNecesitas = {
  titulo: "¿Qué necesitas?",
  entradilla:
    "Queremos que tu única preocupación sea encontrar un hueco en la agenda.",
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
      texto: "Así podremos enseñarte el centro y explicarte lo básico.",
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

/**
 * Las preguntas viven en `content/faqs.ts` desde que las usan varias páginas.
 * Se reexportan aquí para no romper las importaciones antiguas.
 */
export {
  preguntasPrimeraVez as preguntasFrecuentes,
  type Pregunta,
} from "./faqs"

export const cierrePrimeraVez = {
  titular: "Estamos aquí para acompañarte",
} as const
