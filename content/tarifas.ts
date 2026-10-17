/**
 * Tarifas reales del estudio (datos facilitados por Susana, septiembre 2026).
 * Se pintan siempre como texto real, nunca como tabla-imagen.
 */

export type Plan = {
  /** Nombre corto: es lo que se lee en la tabla grande de tarifas. */
  nombre: string
  clasesPorSemana: number
  /** Por quién es este plan, en una frase llana. */
  para: string
  mensual: number
  trimestral: number
}

export const planes: Plan[] = [
  {
    nombre: "4 clases",
    clasesPorSemana: 1,
    para: "Vienes un día a la semana.",
    mensual: 40,
    trimestral: 105,
  },
  {
    nombre: "8 clases",
    clasesPorSemana: 2,
    para: "Vienes dos días a la semana.",
    mensual: 60,
    trimestral: 165,
  },
  {
    nombre: "12 clases",
    clasesPorSemana: 3,
    para: "Vienes tres días a la semana.",
    mensual: 70,
    trimestral: 195,
  },
]

/** Fuera de los planes: lo que se compra suelto. */
export const bonos = [
  {
    nombre: "Bono de 6 clases",
    precio: 65,
    nota: "Válido 3 meses.",
  },
  {
    nombre: "Clase suelta",
    precio: 15,
    nota: "Sin compromiso.",
  },
] as const

export const pruebaGratuita = {
  etiqueta: "Clase de prueba",
  precio: 0,
  nota: "Gratuita con reserva previa.",
} as const
