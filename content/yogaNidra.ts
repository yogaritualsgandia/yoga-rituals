/**
 * Yoga Nidra.
 *
 * Todo lo que hay aquí es suyo y está copiado de la web actual: la definición,
 * los siete beneficios, las características y la duración. Ni una frase mía.
 *
 * Lo único que he hecho es separar lo que allí es un bloque de texto seguido:
 * los beneficios ya iban en lista, y la definición y las características se
 * leen mejor sueltas que pegadas a una lista.
 */

export const yogaNidra = {
  entradilla:
    "Es una técnica de meditación guiada y relajación que se enmarca en lo que podríamos llamar estilos de yoga pasivos.",
  queEs:
    "El objetivo de este yoga es alcanzar una relajación profunda, pero a la vez consciente.",
  beneficios: [
    "Favorece estados de relajación profunda.",
    "Ayuda a interiorizar vivencias y hechos.",
    "Combate la ansiedad.",
    "Mitiga el estrés.",
    "Refuerza la conexión entre la mente y el cuerpo.",
    "Contribuye al control de las propias emociones y pensamientos.",
    "Mejora la calidad del sueño.",
  ],
  comoEs:
    "La mayor parte de la sesión se realiza tendido en posición horizontal, en la postura de Savasana. Cada sesión se enfoca en una temática o intención. No es necesaria experiencia previa, ni condición física especial. Lo único que necesitas es ropa cómoda y reservar un hueco en tu agenda.",
  /** Los cuatro datos que resuelven las dudas de antes de venir. */
  datos: [
    { etiqueta: "Duración", valor: "90 minutos, aproximadamente." },
    { etiqueta: "Postura", valor: "Tumbado, en Savasana, casi toda la sesión." },
    { etiqueta: "Experiencia", valor: "No hace falta ninguna." },
    { etiqueta: "Qué llevar", valor: "Ropa cómoda. Nada más." },
  ],
} as const
