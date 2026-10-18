/**
 * Susana, contada por ella.
 *
 * Todo lo que hay aquí es suyo y está copiado de la web actual: ni una palabra
 * inventada, ni una formación añadida, ni un año que ella no diga. Lo único que
 * he hecho es partir en párrafos lo que allí va de un tirón y poner la
 * formación en una lista, que allí también es una lista.
 *
 * La entradilla es la excepción y es su historia con menos palabras: el relato
 * completo va justo debajo. La foto de Susana todavía no existe, así que en la
 * página se ve el aviso de que las fotos son provisionales.
 */

export const sobreMi = {
  nombre: "Susana Estruch Espinós",
  cargo: "Directora de YOGA Rituals",
  entradilla:
    "Empecé con yoga por el dolor de espalda de una escoliosis. Sigo aquí.",
} as const

/** Su historia, en sus párrafos. */
export const biografia = [
  "Como muchos, llegué al Yoga para aliviar mis dolores de espalda, en mi caso, causados por la escoliosis que me detectaron en la adolescencia, pero a pesar de seguir los consejos médicos mis dolores aumentaban.",
  "Buscando una solución comencé a practicar Yoga, y para mi sorpresa, el alivio fue inmediato, así que el flechazo era inevitable.",
  "Poco a poco fui gestando y fusionando el Yoga con mi carrera universitaria de Relaciones Laborales, Universitat de València, y la formación posterior de Gestión del estrés laboral.",
] as const

/**
 * La formación, en el orden en que ella la cuenta. El año solo lo dice en una,
 * y por eso solo una lo lleva: lo que no está escrito, no se pone.
 */
export const formacion = [
  { titulo: "Título de Profesora de Yoga", detalle: "AIPYS Madrid, 2005" },
  { titulo: "Formación en Yoga Restaurativo" },
  { titulo: "Formación en Yoga Nidra" },
  { titulo: "Especialización en Yoga Oncológico" },
  { titulo: "Monitora de Mindfulness MBTB" },
  { titulo: "Formación Breathwork Inbreath" },
  { titulo: "Formación en Educadora de Masaje Infantil", detalle: "AEMI" },
  { titulo: "Formación en Reflexología podal" },
] as const

/**
 * El cierre, con dos frases suyas: la que cierra su historia y la que resume lo
 * que quiere que pase en el estudio.
 */
export const cierreSobreMi = {
  titular: "El mundo del Yoga es amplio y apasionante",
  texto:
    "En YOGA Rituals queremos que cada pequeño esfuerzo que hagas por cuidarte se convierta en bienestar real.",
} as const
