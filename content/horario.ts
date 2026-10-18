/**
 * Horario real del estudio (datos de la web actual, septiembre 2026).
 *
 * IMPORTANTE · Modelo «horario libre»
 * YOGA Rituals no funciona con reserva por franja: el horario son las horas
 * a las que el estudio está abierto, y cada persona elige cada día a qué
 * clase viene, sin avisar. Por eso una franja NO lleva asignada una
 * disciplina: sería inventármelo. Si en realidad sí hay estilos fijos por
 * hora, Susana lo dice y se añade.
 *
 * Este horario se pinta SIEMPRE como texto real en el DOM (nunca como
 * imagen), por SEO y por accesibilidad.
 */

export type Franja = {
  inicio: string
  fin: string
  duracionMin: number
  /** Las sesiones de 35 minutos de las 9:10 se anuncian como «exprés». */
  expres: boolean
}

export type DiaHorario = {
  dia: string
  /** Índice ISO: 1 = lunes … 7 = domingo. */
  iso: number
  /** Para el `openingHoursSpecification` del LocalBusiness. */
  abre: string | null
  cierra: string | null
  franjas: Franja[]
}

function aMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number)
  return h * 60 + m
}

function franja(inicio: string, fin: string): Franja {
  const duracionMin = aMinutos(fin) - aMinutos(inicio)
  return { inicio, fin, duracionMin, expres: duracionMin <= 35 }
}

const dia = (
  nombre: string,
  iso: number,
  tramos: [string, string][],
): DiaHorario => {
  const franjas = tramos.map(([inicio, fin]) => franja(inicio, fin))
  return {
    dia: nombre,
    iso,
    abre: franjas.at(0)?.inicio ?? null,
    cierra: franjas.at(-1)?.fin ?? null,
    franjas,
  }
}

export const horario: DiaHorario[] = [
  dia("Lunes", 1, [["19:00", "20:15"]]),
  dia("Martes", 2, [
    ["12:00", "13:15"],
    ["18:00", "19:00"],
  ]),
  dia("Miércoles", 3, [
    ["09:10", "09:45"],
    ["19:00", "20:15"],
  ]),
  dia("Jueves", 4, [
    ["12:00", "13:15"],
    ["18:00", "19:00"],
  ]),
  dia("Viernes", 5, [["09:10", "09:45"]]),
  dia("Sábado", 6, [["10:00", "11:15"]]),
  dia("Domingo", 7, []),
]

/** Total de franjas semanales. Dato real, no decorativo. */
export const franjasSemanales = horario.reduce(
  (total, d) => total + d.franjas.length,
  0,
)

/** Las tres duraciones que existen de verdad: 35, 60 y 75 minutos. */
export const duraciones = [35, 60, 75] as const

/** «35 min» / «1 h 15 min» — para pintar la duración sin ceros raros. */
export function duracionEnPalabras(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  if (resto === 0) return horas === 1 ? "1 hora" : `${horas} horas`
  return horas === 1
    ? `1 h ${resto} min`
    : `${horas} h ${resto} min`
}

/**
 * Cómo funciona el horario libre. Todo lo de aquí está sostenido por lo que
 * dice la web actual; nada de promesas que no pueda cumplir.
 *
 * Lo de recuperar la clase sí lo dice ella, en dos sitios: aquí («esa clase no
 * la pierdes, puedes recuperarla cualquier otro día del mes») y en precios
 * («las clases del mes hay que disfrutarlas dentro del mismo mes, ya que no se
 * acumulan para el siguiente»). Antes no estaba puesto porque no me constaba;
 * ahora consta. Es la pregunta que más frena a quien paga mes a mes.
 */
export const horarioLibre = {
  titular: "Tú diseñas tu semana",
  entradilla:
    "En YOGA Rituals no hay grupos cerrados ni reservas. El horario de abajo son las horas a las que el estudio está abierto: eliges el día que te encaja y vienes. Sin avisar y sin apuntarte a nada.",
  escenarios: [
    {
      situacion: "Hoy te ha surgido algo y no llegas.",
      respuesta:
        "No hay ninguna reserva que cancelar, así que no tienes que dar explicaciones a nadie. Y esa clase no la pierdes: puedes recuperarla cualquier otro día del mes.",
    },
    {
      situacion: "Trabajas a turnos y cada semana es distinta.",
      respuesta:
        "Vienes cuando puedes, no cuando te toca. Hay clases de mañana, de mediodía y de tarde.",
    },
    {
      situacion: "Nunca he hecho yoga y no soy flexible.",
      respuesta:
        "No hace falta ser flexible para empezar. Es justo al contrario: se empieza y la flexibilidad llega.",
    },
    {
      situacion: "Hay días que quiero una clase larga y días que no tengo ni media hora.",
      respuesta:
        "Las sesiones duran 35, 60 o 75 minutos. Tú decides cada día cuál te encaja.",
    },
  ],
} as const
