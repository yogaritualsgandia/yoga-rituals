/**
 * El fondo de toda la web.
 *
 * Tres manchas de color del estudio que se desplazan muy despacio y un grano
 * de papel. Va en el `layout`, una sola vez, y por eso está en todas las
 * páginas: es lo último que se queda en el sitio cuando la página cambia.
 *
 * No lleva estado ni JavaScript. Es un `div` con tres `span` dentro, y todo lo
 * que hace lo hace el CSS de `styles/ambiente.css`, que es donde está explicado
 * por qué se mueve como se mueve y por qué se para cuando se para todo.
 *
 * `aria-hidden` no es una formalidad: la bruma y el grano no dicen nada, y sin
 * él un lector de pantalla tendría tres cajas vacías que anunciar.
 */
export function FondoAmbiente() {
  return (
    <div aria-hidden="true" className="fondo-ambiente">
      <span className="fondo-ambiente__bruma fondo-ambiente__bruma--turquesa" />
      <span className="fondo-ambiente__bruma fondo-ambiente__bruma--salvia" />
      <span className="fondo-ambiente__bruma fondo-ambiente__bruma--terracota" />
      <span className="fondo-ambiente__grano" />
    </div>
  )
}
