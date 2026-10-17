/**
 * El movimiento, en un solo sitio.
 *
 * Los números viven también en styles/tokens.css, porque la mitad del
 * movimiento lo hacen las transiciones de CSS. Aquí están en segundos, que es
 * como los quiere GSAP. Si se cambia uno, se cambian los dos: son el mismo
 * valor escrito para dos sitios distintos, no dos valores.
 */

export const MOVIMIENTO = {
  /** Duración, en segundos. */
  rapida: 0.18,
  base: 0.32,
  lenta: 0.6,

  /** Curvas. En CSS son `--ease-out` y `--ease-inout`. */
  salida: "power2.out",
  suave: "power1.inOut",

  /** Lo que se separan las palabras de un titular al entrar. */
  palabra: 0.045,

  /** Hasta dónde sube un bloque antes de quedarse en su sitio, en píxeles. */
  subida: 18,
} as const

/**
 * El guion que se ejecuta antes de que se pinte nada.
 *
 * Son tres líneas y van dentro del <body>, las primeras, así que corren antes
 * de que exista el primer elemento de la página. Su único trabajo es decir si
 * el movimiento está permitido, y lo dicen poniendo un atributo en el <html>.
 *
 * Por qué existe en lugar de dejárselo al paquete de JavaScript: las entradas
 * de más abajo parten escondidas, y el CSS solo las esconde si ve ese
 * atributo. Si lo pusiera el paquete, entre el primer pintado y la llegada del
 * archivo habría un instante en el que el CSS no escondería nada; y si algún
 * día el archivo no llegara, no habría forma de enseñar lo escondido. Con el
 * guion aquí, las dos cosas quedan resueltas: no hay instante, y si el
 * JavaScript falla el atributo no está y no se esconde nada.
 *
 * Si el navegador ha pedido menos movimiento, el atributo no se pone y la
 * página se ve entera desde el principio, quieta.
 */
export const GUION_MOVIMIENTO = `try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.movimiento="listo"}}catch(e){}`

/**
 * ¿Este aparato puede con el objeto 3D?
 *
 * La pregunta importa porque el objeto cuesta: es un lienzo de WebGL que se
 * repinta sesenta veces por segundo, y en un móvil modesto eso se paga en
 * batería y en fluidez. Antes de dibujar nada se comprueba, en este orden:
 *
 *  1. Si se ha pedido menos movimiento, no. Nunca. El objeto no se llega ni a
 *     descargar y en su lugar queda el círculo de CSS, que también respira.
 *  2. Si el navegador dice que hay ahorro de datos o que la conexión es muy
 *     lenta, no. Quien tiene eso puesto lo tiene puesto por algo.
 *  3. Si el aparato es modesto —dos núcleos o menos, dos gigas o menos—, no.
 *  4. Si no hay WebGL, no. Es lo último que se mira, y es lo único que no se
 *     puede deducir de nada: hay que preguntarlo.
 */
export function puedeDibujarObjeto(): boolean {
  if (typeof window === "undefined") return false
  if (respuesta === null) respuesta = revisarElAparato()
  return respuesta
}

/* La respuesta se guarda porque averiguarla cuesta: hay que crear un lienzo y
   pedirle un contexto de WebGL, que no es gratis. Y la respuesta no cambia en
   toda la visita: el aparato es el que es. */
let respuesta: boolean | null = null

function revisarElAparato(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false

  const navegador = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
    deviceMemory?: number
  }

  const conexion = navegador.connection
  if (conexion?.saveData) return false
  if (conexion?.effectiveType && /slow-2g|2g/.test(conexion.effectiveType)) {
    return false
  }

  const nucleos = navigator.hardwareConcurrency ?? 8
  const memoria = navegador.deviceMemory ?? 8
  if (nucleos <= 2 || memoria <= 2) return false

  return hayWebGL()
}

function hayWebGL(): boolean {
  try {
    const lienzo = document.createElement("canvas")
    const contexto =
      lienzo.getContext("webgl2") ?? lienzo.getContext("webgl")

    // El contexto de prueba se suelta en el acto: los navegadores solo
    // permiten unos pocos vivos a la vez, y dejarlo abierto puede impedir que
    // el de verdad se cree después.
    if (contexto && "getExtension" in contexto) {
      contexto.getExtension("WEBGL_lose_context")?.loseContext()
    }

    return contexto !== null
  } catch {
    return false
  }
}
