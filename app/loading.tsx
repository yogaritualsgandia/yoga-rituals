import { Contenedor } from "@/components/layout/contenedor"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Lo que se ve mientras una página llega.
 *
 * Next.js llama a esto solo cuando hay que esperar de verdad —al entrar por
 * primera vez a una dirección, o al cambiar de página sin que estuviera ya
 * preparada—, y lo coloca dentro del hueco del contenido: la cabecera, el pie y
 * el fondo se quedan donde están y solo cambia lo del medio. Por eso no parece
 * una pantalla de carga, parece que la página estuviera terminando de montarse.
 *
 * Las medidas no son de adorno. Cada bloque mide lo que mide el texto que va a
 * ocupar su sitio —la etiqueta es corta, el titular son dos líneas largas, la
 * entradilla dos más cortas— y la primera sección tiene el mismo aire arriba y
 * abajo que la cabecera de página de verdad (`components/layout/pagina.tsx`).
 * Sin eso, al llegar el contenido todo saltaría hacia abajo, y el esqueleto
 * habría empeorado la espera en vez de mejorarla.
 *
 * Lo que se anuncia es el conjunto: un estado con su nombre, y las cajas
 * calladas. Una caja gris vacía no le dice nada a nadie.
 */
export default function Cargando() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando la página</span>

      {/* La cabecera de página: antetítulo, titular y entradilla. */}
      <section className="pt-[clamp(2.5rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4.5rem)]">
        <Contenedor>
          <Skeleton className="h-3 w-24" />

          <div className="mt-6 flex flex-col gap-3">
            <Skeleton className="h-[clamp(2.25rem,5vw,3.5rem)] w-[min(20ch,88%)]" />
            <Skeleton className="h-[clamp(2.25rem,5vw,3.5rem)] w-[min(13ch,62%)]" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Skeleton className="h-5 w-[min(52ch,100%)]" />
            <Skeleton className="h-5 w-[min(38ch,74%)]" />
          </div>
        </Contenedor>
      </section>

      {/* Y lo de dentro: una lista de renglones separados por líneas, que es
          como están escritas casi todas las páginas de esta web. */}
      <section className="seccion pt-0">
        <Contenedor>
          <div className="border-t border-line">
            {[0, 1, 2].map((renglon) => (
              <div key={renglon} className="border-b border-line py-7">
                <Skeleton className="h-5 w-[min(24ch,52%)]" />
                <div className="mt-4 flex flex-col gap-2.5">
                  <Skeleton className="h-4 w-[min(62ch,100%)]" />
                  <Skeleton className="h-4 w-[min(44ch,72%)]" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="mt-14 aspect-3/2 w-full rounded-lg sm:aspect-16/9" />
        </Contenedor>
      </section>
    </div>
  )
}
