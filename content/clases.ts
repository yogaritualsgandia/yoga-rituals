/**
 * Lo que se puede practicar en el estudio.
 *
 * Los NOMBRES son reales: salen de la web actual (actividades) y de lo que me
 * contó Susana (estilos de clase). Las DESCRIPCIONES no las tengo todavía, así
 * que van marcadas en lugar de inventadas. Se escriben con ella o las escribe
 * ella y yo solo las corrijo.
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
  /** Una línea de presentación. [PENDIENTE] hasta que la escriba Susana. */
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
    entradilla: SIN_TEXTO,
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "mindfulness",
    nombre: "Mindfulness",
    entradilla: SIN_TEXTO,
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "breathwork",
    nombre: "Respiración",
    entradilla: SIN_TEXTO,
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "yoga-oncologico",
    nombre: "Yoga oncológico",
    entradilla: SIN_TEXTO,
    grupo: "actividades",
    conPaginaPropia: true,
  },
  {
    slug: "retiros",
    nombre: "Retiros y eventos",
    entradilla: SIN_TEXTO,
    grupo: "fuera",
    conPaginaPropia: true,
  },
  {
    slug: "talleres-centros-educativos",
    nombre: "Talleres en centros educativos",
    entradilla: SIN_TEXTO,
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
 * Talleres en colegios. Cifras reales que sí me ha dado: más de 500 talleres
 * hechos y «La calma en el examen» como ejemplo.
 */
export const talleresColegios = {
  titulo: "Talleres en centros educativos",
  talleresRealizados: 500,
  talleresRealizadosTexto: "más de 500",
  ejemplo: "La calma en el examen",
  /** [PENDIENTE] El contenido de cada taller: no lo tengo. */
  contenidos: [
    "[PENDIENTE: contenido del taller de posturas]",
    "[PENDIENTE: contenido del taller de mindfulness]",
    "[PENDIENTE: contenido del taller de Yoga Nidra]",
  ],
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
