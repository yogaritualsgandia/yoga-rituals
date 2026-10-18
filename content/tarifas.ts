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

/**
 * Cómo se paga, en sus palabras.
 *
 * Esto lo copio de la web actual, donde sí está puesto. Aquí no estaba: la
 * página de tarifas no decía ni cuándo se paga ni con qué, y era una de las
 * preguntas que quedaban sin respuesta. Quien va a pagar 85 € al mes quiere
 * saberlo antes de escribir, no después.
 */
export const formasDePago = {
  titulo: "Cómo se paga",
  formas: "Efectivo, Bizum o transferencia bancaria.",
  fecha: "La cuota se abona durante los primeros 5 días de cada mes.",
  recuperacion:
    "Nuestros horarios son libres, por lo que tienes total libertad para organizar tus clases. Ten en cuenta que las clases del mes hay que disfrutarlas dentro del mismo mes, ya que no se acumulan para el siguiente.",
  descuento:
    "Tienes la posibilidad de beneficiarte de un descuento con la opción del pago trimestral. Esta opción no admite devoluciones, y las mensualidades no se pueden pausar ni aplazar.",
} as const
