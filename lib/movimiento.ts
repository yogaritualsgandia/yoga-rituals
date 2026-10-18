/**
 * El movimiento.
 *
 * Aquí no están los números, y es a propósito. Están donde se usan: las
 * duraciones y las curvas en `styles/tokens.css` (`--dur-*`, `--ease-*`) y los
 * retardos de las entradas en `styles/movimiento.css`.
 *
 * Hubo aquí una tabla con todos ellos en segundos, «el movimiento en un solo
 * sitio», y era peor que no tenerla: no la leía nadie —el movimiento lo hacen
 * las transiciones de CSS y las animaciones por su cuenta—, decía ser la
 * fuente de la verdad y había dejado de serlo (la duración base eran 320 ms
 * cuando la de verdad siempre han sido 300). Se borró.
 *
 * Lo que sí vive aquí es la única cosa que hay que decidir en JavaScript antes
 * de que se pinte nada: si el movimiento está permitido.
 */

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
