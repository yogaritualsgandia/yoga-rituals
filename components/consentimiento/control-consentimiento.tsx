"use client"

import { Button } from "@/components/ui/button"
import { controlCookies } from "@/content/consentimiento"
import { hayAnalitica } from "@/lib/analitica"

import { useConsentimiento } from "./proveedor-consentimiento"

/**
 * El control para desdecirse, al final de la página de cookies.
 *
 * Es la mitad que casi nadie escribe: aceptar es un botón en la primera
 * visita, y retirar el permiso suele ser un trámite escondido. Aquí está en el
 * mismo sitio donde se explica qué son las cookies, en un botón, y dice antes
 * en qué estado está todo —quien entra tiene derecho a saber qué hay decidido
 * sin tener que pulsar nada para averiguarlo—.
 *
 * El estado se lee del navegador, así que en el servidor no se sabe: el texto
 * llega en el primer pintado con la frase de «todavía no has elegido» y se
 * corrige al hidratar. Es un renglón de texto, no un dato que se pueda medir:
 * cambiar de frase medio segundo después no molesta a nadie.
 */
export function ControlConsentimiento() {
  const { estado, reabrir } = useConsentimiento()

  /* Sin analítica no hay nada que retirar, y ofrecer un botón para cambiar una
     decisión que no existe sería una manera rara de decir que no hay nada. */
  if (!hayAnalitica) return null

  return (
    <div>
      <h2 className="font-heading text-2xl">{controlCookies.titulo}</h2>

      <p className="paso-base mt-5 text-ink-soft">{controlCookies.estados[estado]}</p>

      <p className="paso-base mt-4 text-ink-soft">{controlCookies.texto}</p>

      <Button variant="outline" className="mt-6" onClick={reabrir}>
        {controlCookies.boton}
      </Button>
    </div>
  )
}
