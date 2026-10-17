import { Contenedor } from "./contenedor"

/**
 * Bloque de contenido pendiente.
 *
 * Existe para que se vea lo que falta en lugar de inventarlo o de dejar un
 * hueco vacío. Se pinta en la propia web, no en un comentario del código: si
 * no se ve al navegar, se olvida y se publica a medias.
 */
export function EnPreparacion({ pendiente }: { pendiente: string }) {
  return (
    <section className="seccion pt-0">
      <Contenedor>
        <div className="max-w-[46rem] rounded-lg border border-dashed border-line bg-surface-2/50 p-7 sm:p-9">
          <p className="etiqueta">Contenido pendiente</p>
          <p className="paso-base mt-4">{pendiente}</p>
          <p className="paso-pequeno mt-4 text-ink-soft">
            La página ya está en pie, enlazada y accesible. Solo falta el texto,
            que tiene que salir de Susana: aquí no se escribe nada que no sea
            verdad.
          </p>
        </div>
      </Contenedor>
    </section>
  )
}
