/**
 * Retiros y eventos.
 *
 * El texto es suyo, copiado de la web actual. Lo que sigue faltando es el
 * calendario —fechas, precio, cómo se reserva—, y ahí no se inventa nada: un
 * retiro sin fecha no se puede reservar, y una fecha falsa se descubre el mismo
 * día que alguien pregunta.
 *
 * La entradilla es su frase, cortada donde acaba la idea («…invita a la calma»)
 * para que quepa en el sitio donde va.
 */
export const retiros = {
  entradilla:
    "Un fin de semana en el corazón de Zarra, un entorno privilegiado rodeado de historia, paisajes inspiradores y una energía que invita a la calma.",
  /** El nombre del retiro, como lo llama ella. */
  nombre: "Retiro de Yoga en Zarra",
  intro:
    "Nuestros retiros combinan la práctica del yoga con actividades que nutren el alma y los sentidos:",
  /** Las cuatro cosas que pasan, con su explicación. */
  programa: [
    {
      titulo: "Yoga, pranayamas y meditación",
      texto:
        "Sesiones para equilibrar el cuerpo y serenar la mente. Los pranayamas son las técnicas de respiración.",
    },
    {
      titulo: "Conexión con el entorno",
      texto:
        "Paseos conscientes por el emblemático Bosque Encantado, una experiencia única de inmersión en la naturaleza.",
    },
    {
      titulo: "Talleres",
      texto:
        "Actividades especiales que varían en cada edición: visitas guiadas, taller gastronómico, taller creativo.",
    },
    {
      titulo: "Prácticas de relajación",
      texto: "Sesiones enfocadas para llevarte a un descanso transformador.",
    },
  ],
  completo:
    "Una experiencia compartida que disfrutarás de un programa completo que incluye alojamiento y comidas, pensado para que tu único objetivo sea disfrutar.",
  /** Sin punto final: encabeza una sección, no cierra una frase. */
  cierre: "Un fin de semana para volver renovada/o",
} as const
