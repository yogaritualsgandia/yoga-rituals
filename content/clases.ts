/**
 * Lo que se puede practicar en el estudio.
 *
 * Los NOMBRES y las ENTRADILLAS son reales: salen de la web actual. La
 * entradilla es una frase suya, entera o cortada donde acaba la frase; cuando
 * no hay nada escrito, va marcada en lugar de inventada. Se escribe con ella o
 * lo escribe ella, y yo solo lo corrijo.
 *
 * Hatha y Vinyasa siguen sin texto: de la web actual no sale ninguna
 * descripción de ninguno de los dos estilos.
 *
 * Los tres grupos no son decorativos: responden a tres preguntas distintas
 * que se hace quien llega.
 *   clases      → «¿qué hago en una sesión normal?»
 *   actividades → «¿y si busco algo más concreto?»
 *   fuera       → «¿esto solo pasa en la sala?»
 */

export type Practica = {
  slug: string
  nombre: string
  /** Una línea de presentación, con sus palabras. [PENDIENTE] si no hay. */
  entradilla: string
  grupo: "clases" | "actividades" | "fuera"
  /**
   * true  = tiene página propia en /<slug>, así que se enlaza.
   * false = todavía no, y el nombre se queda como texto: un enlace que no
   *         lleva a ninguna parte es peor que no tener enlace.
   * Hatha y Vinyasa son las dos que están sin página.
   */
  conPaginaPropia: boolean
}

const SIN_TEXTO = "[PENDIENTE: texto de Susana]"

export const practicas: Practica[] = [
  {
    slug: "hatha",
    nombre: "Hatha",
    entradilla: SIN_TEXTO,
    grupo: "clases",
    conPaginaPropia: false,
  },
  {
    slug: "vinyasa",
    nombre: "Vinyasa",
    entradilla: SIN_TEXTO,
    grupo: "clases",
    conPaginaPropia: false,
  },
  {
    slug: "yoga-nidra",
    nombre: "Yoga Nidra",
    entradilla:
      "Es una técnica de meditación guiada y relajación que se enmarca en lo que podríamos llamar estilos de yoga pasivos. El objetivo es alcanzar una relajación profunda, pero a la vez consciente.",
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "mindfulness",
    nombre: "Mindfulness",
    entradilla:
      "Desde hace más de 7 años, todos los miércoles, tenemos nuestra sesión de Mindfulness en la Biblioteca Benipeixcar-Raval de Gandia.",
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "breathwork",
    nombre: "Respiración",
    entradilla:
      "La respiración es la herramienta más simple y, al mismo tiempo, la más profunda.",
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "yoga-oncologico",
    nombre: "Yoga oncológico",
    entradilla:
      "Un tipo de yoga creado para acompañar a personas con cáncer en las diferentes etapas de la enfermedad.",
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "retiros",
    nombre: "Retiros y eventos",
    entradilla:
      "Un fin de semana en el corazón de Zarra, un entorno rodeado de historia, paisajes inspiradores y una energía que invita a la calma.",
    grupo: "fuera",
    conPaginaPropia: true,
  },
  {
    slug: "talleres-centros-educativos",
    nombre: "Talleres en centros educativos",
    entradilla:
      "Con más de 500 talleres realizados, llevamos el yoga y el mindfulness a las aulas.",
    grupo: "fuera",
    conPaginaPropia: true,
  },
]

export const gruposPracticas = [
  {
    clave: "clases" as const,
    titulo: "En una sesión normal",
    descripcion:
      "Las clases del día a día. Vienes, practicas y te vas con el cuerpo más suelto.",
    campoCalido: false,
  },
  {
    clave: "actividades" as const,
    titulo: "Propuestas concretas",
    descripcion:
      "Cosas que se practican con un objetivo: dormir mejor, respirar mejor, parar la cabeza.",
    /**
     * Este bloque sí lleva campo de color cálido (el terracota de la marca,
     * aclarado hasta ser un fondo y no un grito).
     *
     * Estos colores estaban sin usar porque con la crema forman la pareja que
     * ya avisamos que había que evitar. Aquí hay un solo bloque cálido en toda
     * la portada, hace un trabajo —separar estas propuestas de las clases del
     * día a día— y el turquesa sigue llevando la acción. No es decoración.
     *
     * Ojo: el grupo incluye también «Yoga oncológico», así que el campo lo
     * lleva él también. Si prefieres que quede fuera, hay que sacarlo del
     * grupo o partirlo en dos.
     */
    campoCalido: true,
  },
  {
    clave: "fuera" as const,
    titulo: "Fuera de la sala",
    descripcion:
      "El yoga también sale del estudio, y lleva años haciéndolo.",
    campoCalido: false,
  },
]

/**
 * Talleres en colegios.
 *
 * Todo lo que hay aquí es real y está copiado de la web actual: más de 500
 * talleres, los tres talleres con su duración y su contenido, a quién van
 * dirigidos y el párrafo con el que se invita a los centros a pedirlos.
 */
export const talleresColegios = {
  titulo: "Talleres en centros educativos",
  talleresRealizados: 500,
  talleresRealizadosTexto: "más de 500",
  ejemplo: "La calma en el examen",
  /** A quién van dirigidos, con sus palabras. */
  destinatarios: "Primaria, ESO, Bachillerato y Formación Profesional",
  /** Los tres talleres, con su duración y su contenido. */
  contenidos: [
    {
      nombre: "Taller de educación postural",
      duracion: "2 sesiones de 1 hora, teoría y práctica",
      descripcion:
        "Ponemos el foco en el cuerpo y la postura: aprender a escucharlo, cuidarlo, practicar los ajustes necesarios para corregirla, y entender cómo nuestras posturas repercuten en nuestro bienestar.",
    },
    {
      nombre: "Taller de Mindfulness",
      duracion: "2 sesiones de 1 hora, teoría y práctica",
      descripcion:
        "Trabajamos la atención en las emociones y los pensamientos, aportando técnicas de conexión con el cuerpo y de gestión emocional que los estudiantes podrán llevar a su día a día.",
    },
    {
      nombre: "Taller de Nidra «Calma en el examen»",
      duracion: "1 sesión de 1 hora",
      descripcion:
        "Una sesión pensada para ayudar a afrontar de forma positiva las inseguridades y bloqueos que puedan surgir en la preparación y realización de los exámenes.",
    },
  ],
  /** Lo que se le dice a un centro que quiera pedirlos. */
  invitacion:
    "Si eres docente, orientador/a o formas parte del equipo directivo de un centro educativo y te interesa ofrecer alguno de estos talleres a tu alumnado, escríbenos y te contamos todos los detalles.",
  /** Otras actividades, tal como me las contó. */
  otros: [
    "Mindfulness en una biblioteca",
    "Actividades en un hospital",
    "Retiros y eventos",
  ],
} as const

/**
 * La idea de marca, en palabras de Susana: la práctica acompaña en cada etapa
 * de la vida y el estudio facilita ese camino. La respiración es el eje.
 */
export const ideaMarca = {
  eje: "La respiración es el eje de todo.",
  acompanamiento: "La práctica acompaña en cada etapa de la vida.",
} as const
