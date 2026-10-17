"use client"

import { useSyncExternalStore } from "react"

/**
 * ¿Ya estamos en el navegador?
 *
 * Hay cosas que solo se pueden saber en el cliente —el tema, si el navegador
 * ha pedido menos movimiento, si este cacharro puede con el 3D— y que cambian
 * lo que se pinta. Preguntarlo con un `useState` encendido desde un efecto es
 * el patrón que React desaconseja: provoca un segundo renderizado en cascada
 * justo al hidratar.
 *
 * Preguntándoselo al propio React no hay cascada: en el servidor devuelve
 * `false`, en el navegador `true`, y quien lo usa pinta un hueco del mismo
 * tamaño mientras tanto para que no salte nada.
 */

const nadaQueEscuchar = () => () => {}
const enElCliente = () => true
const enElServidor = () => false

export function useMontado() {
  return useSyncExternalStore(nadaQueEscuchar, enElCliente, enElServidor)
}
