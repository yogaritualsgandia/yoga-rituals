/**
 * La respiración, como número.
 *
 * Una sola función para el objeto 3D y para el círculo de CSS. Si estuviera
 * escrita dos veces, algún día se cambiaría una y la otra no, y las dos
 * estarían diciendo cosas distintas del mismo ritmo.
 *
 * Devuelve un valor de 0 a 1: 0 es «pulmones vacíos» y 1 es «pulmones llenos».
 * Se tarda lo que se tarde en inspirar en llegar a 1 y lo que se tarde en
 * espirar en volver a 0, con las esquinas redondeadas para que no se note
 * dónde cambia de dirección.
 */
export function escalaDeRespiracion(
  milisegundos: number,
  inspirar: number,
  espirar: number,
): number {
  const ciclo = (inspirar + espirar) * 1000
  const fase = ((milisegundos % ciclo) + ciclo) % ciclo

  const inspirando = fase < inspirar * 1000
  const avance = inspirando
    ? fase / (inspirar * 1000)
    : (fase - inspirar * 1000) / (espirar * 1000)

  /* Suavizado en los dos extremos. Sin esto el círculo llega arriba y se da la
     vuelta de golpe, y eso no lo hace un pulmón. */
  const suave = avance * avance * (3 - 2 * avance)

  return inspirando ? suave : 1 - suave
}

/**
 * Cuánto crece el objeto al final de la inspiración.
 *
 * Un 16 % es bastante para que se vea el aire y poco para que no parezca que
 * late. Pasado el 20 % empieza a resultar agitado, que es lo contrario de lo
 * que se quiere aquí.
 */
export const AMPLITUD_RESPIRACION = 0.16

/** El ritmo con el que arranca, si nadie ha tocado nada. */
export const RITMO_INICIAL = { inspirar: 4, espirar: 6 } as const
