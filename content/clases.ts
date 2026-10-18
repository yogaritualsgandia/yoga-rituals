/**
 * Lo que se puede practicar en el estudio.
 *
 * Los NOMBRES y las ENTRADILLAS son reales: salen de la web actual. La
 * entradilla es una frase suya, entera o cortada donde acaba la frase; cuando
 * no hay nada escrito, va marcada en lugar de inventada. Se escribe con ella o
 * lo escribe ella, y yo solo lo corrijo.
 *
 * Hatha y Vinyasa estuvieron meses sin texto —en su web no había ni una línea
 * sobre ninguno de los dos— y ya lo tienen: lo escribió ella, y está entero en
 * `estilos`, aquí abajo. Las dos tienen página propia desde entonces.
 *
 * Los dos bloques no son decorativos: responden a una pregunta cada uno.
 *   estilos / sesiones → «¿qué se practica aquí?» (las seis van juntas)
 *   fuera             → «¿esto solo pasa en la sala?»
 *
 * Ojo con el primero, que es donde estaba el error: el yoga nidra, el
 * mindfulness, el breathwork y el yoga oncológico son sesiones normales, con
 * su horario y su precio, igual que el hatha y el vinyasa. Estuvieron en un
 * bloque aparte —«propuestas concretas»— y eso daba a entender que eran otra
 * cosa. No lo son.
 *
 * La práctica de respiración se llama breathwork, con esa palabra: así lo dice
 * ella y así se llama la página. «Respiración» se queda para cuando la palabra
 * va dentro de una frase, que es donde suena bien.
 */

export type Practica = {
  slug: string
  nombre: string
  /** Una línea de presentación, con sus palabras. [PENDIENTE] si no hay. */
  entradilla: string
  /**
   * Dónde encaja dentro de la web.
   *   estilos  → los estilos del horario semanal (hatha y vinyasa)
   *   sesiones → lo demás que se practica en el estudio
   *   fuera    → lo que pasa fuera de la sala
   */
  grupo: "estilos" | "sesiones" | "fuera"
  /**
   * true  = tiene página propia en /<slug>, así que se enlaza.
   * false = todavía no, y el nombre se queda como texto: un enlace que no
   *         lleva a ninguna parte es peor que no tener enlace.
   * Hatha y Vinyasa son las dos que están sin página.
   */
  conPaginaPropia: boolean
}

/**
 * Hatha y Vinyasa, contados por Susana.
 *
 * Son los dos estilos del horario semanal, y eran los dos únicos puntos de la
 * web con el texto sin escribir: en su página no había ni una línea sobre
 * ninguno, y una descripción de manual se nota a la legua. El texto es suyo.
 * Aquí solo se ha ordenado —titular, qué es, qué se hace en clase, qué aporta,
 * para quién es— y se han quitado cuatro coletillas. Lo que dice es lo que ella
 * dice.
 *
 * La estructura es la misma en los dos, y es a propósito: quien duda entre uno
 * y otro tiene que poder comparar lo mismo en el mismo sitio. Los cuatro
 * titulares son idénticos para que se comparen las respuestas y no las
 * preguntas.
 *
 * `lema` es el que abre la página, y está entero suyo. `paraQuien` es la frase
 * que decide, y por eso va pegada al botón y no escondida en medio.
 */
export type EstiloDetalle = {
  slug: string
  nombre: string
  /** La línea corta que abre su página. Suya. */
  lema: string
  /** Dos frases, para la lista de clases y para la tarjeta de la portada. */
  entradilla: string
  /** Cómo es la práctica, para el primer párrafo. */
  intro: string
  /** Lo que pasa dentro de la clase, punto por punto. */
  enClase: readonly string[]
  /** Qué se lleva quien practica. */
  aporta: string
  /** Para quién es. Es la frase que cierra la venta. */
  paraQuien: string
}

export const estilos = {
  hatha: {
    slug: "hatha",
    nombre: "Hatha",
    lema: "Despacio, con presencia y a tu ritmo",
    entradilla:
      "Posturas que se sostienen unos instantes y se acompañan de la respiración. La puerta de entrada a la práctica, y el sitio al que siempre se vuelve.",
    intro:
      "El Hatha es la forma más tranquila de empezar, y también el sitio al que siempre se vuelve. Las posturas se sostienen unos instantes y se exploran con calma, acompañadas de la respiración, para que aprendas a escuchar tu cuerpo sin prisa y sin exigencia.",
    enClase: [
      "Posturas explicadas paso a paso, con adaptaciones para cada cuerpo.",
      "Trabajo de movilidad, estabilidad y flexibilidad.",
      "Respiración consciente y relajación para cerrar la clase.",
      "Un ambiente tranquilo, donde no hay que llegar a ninguna parte.",
    ],
    aporta:
      "Más conciencia corporal, menos tensión acumulada y una mente más serena. La práctica se ajusta a ti y a cómo llegas ese día.",
    paraQuien:
      "Si estás empezando, o si lo que buscas es una práctica más pausada, empieza por aquí.",
  },
  vinyasa: {
    slug: "vinyasa",
    nombre: "Vinyasa",
    lema: "Muévete con la respiración",
    entradilla:
      "Cada movimiento nace de una inhalación o de una exhalación: las posturas se enlazan en una secuencia fluida. Para quien quiere moverse y soltar el ruido mental.",
    intro:
      "En Vinyasa cada movimiento nace de una inhalación o de una exhalación. Las posturas se enlazan en una secuencia fluida y activa, y el cuerpo, la respiración y la mente van a la vez de principio a fin.",
    enClase: [
      "Secuencias fluidas que construyen fuerza, equilibrio y flexibilidad.",
      "Un ritmo activo, con opciones para ajustar la intensidad en cada postura.",
      "La respiración como hilo conductor de toda la clase.",
      "Un cierre con relajación, para integrar lo que se ha trabajado.",
    ],
    aporta:
      "Energía, vitalidad y una sensación de ligereza al terminar. Una práctica que mueve por dentro y por fuera y que ayuda a soltar el ruido mental.",
    paraQuien:
      "Si te gusta sentir el movimiento y quieres una práctica con más dinamismo, empieza por aquí.",
  },
} as const satisfies Record<string, EstiloDetalle>

export const practicas: Practica[] = [
  {
    slug: "hatha",
    nombre: estilos.hatha.nombre,
    entradilla: estilos.hatha.entradilla,
    grupo: "estilos",
    conPaginaPropia: true,
  },
  {
    slug: "vinyasa",
    nombre: estilos.vinyasa.nombre,
    entradilla: estilos.vinyasa.entradilla,
    grupo: "estilos",
    conPaginaPropia: true,
  },
  {
    slug: "yoga-nidra",
    nombre: "Yoga Nidra",
    entradilla:
      "Es una técnica de meditación guiada y relajación que se enmarca en lo que podríamos llamar estilos de yoga pasivos. El objetivo es alcanzar una relajación profunda, pero a la vez consciente.",
    grupo: "sesiones",
    conPaginaPropia: true,
  },
  {
    slug: "mindfulness",
    nombre: "Mindfulness",
    entradilla:
      "Desde hace más de 7 años, todos los miércoles, tenemos nuestra sesión de Mindfulness en la Biblioteca Benipeixcar-Raval de Gandia.",
    grupo: "sesiones",
    conPaginaPropia: true,
  },
  {
    slug: "breathwork",
    nombre: "Breathwork",
    entradilla:
      "La respiración es la herramienta más simple y, al mismo tiempo, la más profunda.",
    grupo: "sesiones",
    conPaginaPropia: true,
  },
  {
    slug: "yoga-oncologico",
    nombre: "Yoga oncológico",
    entradilla:
      "Un tipo de yoga creado para acompañar a personas con cáncer en las diferentes etapas de la enfermedad.",
    grupo: "sesiones",
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

/**
 * Las listas que pinta la portada, una por bloque.
 *
 * Se derivan de `practicas` y no se escriben a mano: así, añadir una práctica
 * nueva o cambiarle el grupo la coloca en su bloque sin tocar la página.
 */
export const practicasEnElEstudio = practicas.filter(
  (practica) => practica.grupo !== "fuera",
)

export const practicasFueraDeLaSala = practicas.filter(
  (practica) => practica.grupo === "fuera",
)

/**
 * Las dos entradillas de los dos bloques de la portada.
 *
 * El primer bloque no lleva título, y es a propósito: titularlo «las clases»
 * cuando el titular de arriba ya dice «lo que puedes practicar» es repetir.
 * Lo que lleva es esta línea, que explica en una frase de qué va el bloque.
 */
export const bloquesDePracticas = {
  estudio:
    "Las clases del día a día, todas con horario libre. Vienes, practicas y te vas con el cuerpo más suelto.",
  fuera:
    "El yoga también sale del estudio, y lleva años haciéndolo.",
} as const

/**
 * La página de clases.
 *
 * Es la puerta de entrada, así que lo que más se pregunta se contesta arriba,
 * antes de la lista: cómo funciona el horario y cuánto dura cada sesión.
 *
 * Antes esta página enseñaba solo los tres estilos del horario y parecía que en
 * el estudio no hubiera nada más. No es verdad: hay seis cosas dentro y dos
 * fuera, y quien entra por aquí tiene que verlas todas sin ir a buscarlas a la
 * portada. Las dos listas salen de `practicas`, así que añadir una nueva es
 * añadir una ficha y ya está.
 */
export const paginaClases = {
  entradilla:
    "Seis formas de practicar dentro del estudio y dos fuera. Cada una tiene su página, con lo que hay que saber antes de venir.",
  comoFunciona: [
    "El horario del estudio no es una lista de clases cerradas a las que hay que apuntarse: son las horas a las que hay sesión. Eliges el día que te encaja y vienes, sin avisar y sin reservar nada.",
    "Las sesiones duran 35, 60 o 75 minutos, según la franja. La primera de la mañana, a las 9:10, es la más corta: 35 minutos.",
  ],
  /**
   * La línea del primer bloque.
   *
   * La del segundo no está aquí: es la misma que usa la portada, y se escribe
   * una vez sola (`bloquesDePracticas.fuera`). Esta no vale para la portada ni
   * la de la portada vale para aquí, porque la portada quiere presentar el
   * bloque y esta página solo tiene que decir qué se va a encontrar debajo.
   */
  lineaEstudio:
    "Las clases del horario, que son libres, y las sesiones que se piden aparte.",
} as const

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
  /**
   * La cifra, escrita entera y con mayúscula.
   *
   * La mayúscula no es un capricho de estilo: esto encabeza un titular, tanto
   * en la portada como en su propia página, y ahí «más» va con mayúscula. Cuando
   * la cifra cae dentro de una frase —la entradilla de la tarjeta, por
   * ejemplo— se escribe en minúscula, y para eso está `practicas`.
   */
  talleresRealizadosTitular: "Más de 500 talleres realizados",
  /** A quién van dirigidos, con sus palabras. */
  destinatarios: "Primaria, ESO, Bachillerato y Formación Profesional",
  intro:
    "Trabajamos con alumnado de Primaria, ESO, Bachillerato y Formación Profesional, ofreciendo herramientas prácticas para acompañarles en esta etapa tan intensa.",
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
