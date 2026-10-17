import type { NextConfig } from "next"

/**
 * Redirecciones desde la web antigua (Webnode).
 *
 * Las direcciones salen del mapa del sitio de la web vieja
 * (https://www.yogarituals.es/sitemap.xml), que lista trece. Aquí no hay ni
 * una inventada.
 *
 * Por qué van aquí y no en un archivo `_redirects` de Netlify, que sería lo
 * típico:
 *
 *  · Funcionan en cualquier alojamiento, no solo en Netlify. El día que la web
 *    se mude otra vez, esto se viene con ella.
 *
 *  · Funcionan también en local, así que las pruebas comprueban de verdad que
 *    redirigen, en vez de leer una lista y confiar en que sea correcta. La
 *    diferencia importa: una redirección mal escrita no da ningún error, no
 *    avisa, simplemente no hace su trabajo. Y eso se descubre meses después,
 *    cuando las direcciones antiguas ya han desaparecido del buscador.
 *
 * Por qué 301 y no 302
 * Un 302 dice «esto es temporal», así que el buscador no traslada nada a la
 * dirección nueva. El 301 sí. Es la diferencia entre mudarse y desaparecer.
 *
 * Las direcciones que la web nueva conserva tal cual —/horarios/,
 * /primera-vez/, /retiros/, /yoga-oncologico/, /breathwork/, /yoga-nidra/— no
 * están aquí. Solo les cambia la barra final, y de eso ya se encarga Next.js
 * solo.
 *
 * Lo que NO se puede hacer desde aquí
 * Que `www.yogarituals.es` lleve a `yogarituals.es` es cosa del alojamiento,
 * no de Next, y se configura una vez en Netlify (ver DESPLIEGUE.md). Se deja
 * fuera a propósito: si se pusiera también aquí y el dominio principal
 * estuviera al revés, las dos reglas se darían de comer la una a la otra y la
 * web dejaría de cargar.
 */
export const REDIRECCIONES_ANTIGUAS = [
  // «Actividades» era el listado de todo lo que se puede practicar. Su sitio
  // lo ocupa ahora «Clases».
  { desde: "/actividades", hacia: "/clases" },

  // «Precios» es «Tarifas»: el mismo contenido, en castellano.
  { desde: "/precios", hacia: "/tarifas" },

  // Ojo: en la web vieja estaba escrito «minfulness», sin la primera d. Se
  // respeta tal cual, porque así es como lo ha tenido publicado durante años y
  // así es como lo tiene indexado Google.
  { desde: "/minfulness", hacia: "/mindfulness" },

  // «Contacto imágenes» era la página de contacto.
  { desde: "/contacto-imagenes", hacia: "/contacto" },

  // Los talleres pierden el «en».
  {
    desde: "/talleres-en-centros-educativos",
    hacia: "/talleres-centros-educativos",
  },

  // «Próximamente» era el aviso de que la web estaba en obras. No tiene
  // equivalente y no se le inventa uno: va a la portada.
  { desde: "/proximamente", hacia: "/" },
]

const nextConfig: NextConfig = {
  async redirects() {
    return REDIRECCIONES_ANTIGUAS.flatMap(({ desde, hacia }) =>
      // Las dos formas, con barra final y sin ella. Son seis reglas cortas y
      // ahorran un salto de más a quien llegue con la barra puesta.
      [desde, `${desde}/`].map((source) => ({
        source,
        destination: hacia,
        statusCode: 301,
      })),
    )
  },
}

export default nextConfig
