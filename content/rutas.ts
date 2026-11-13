/**
 * Las rutas públicas del sitio, en un solo sitio.
 *
 * De esta lista salen el sitemap, `llms.txt`, `llms-full.txt` y las versiones
 * `.md`. Es a propósito que no haya una lista en `app/sitemap.ts` y otra en el
 * generador: en cuanto hay dos, una se queda atrás.
 *
 * `fuentes` son los archivos que, si cambian, cambian de verdad esa página. El
 * generador los usa para calcular el `lastmod` con el último commit de Git, no
 * con la fecha del build.
 *
 * No están las páginas legales: existen, pero llevan `noindex` y no deben
 * aparecer ni en el sitemap ni en el resumen para modelos.
 */
export type RutaPublica = {
  /** Ruta absoluta dentro del sitio, con barra inicial. */
  ruta: string
  /** Archivo que genera el export estático. */
  html: string
  /** Archivos de código y contenido que alimentan la página. */
  fuentes: string[]
}

export const RUTAS_PUBLICAS: RutaPublica[] = [
  {
    ruta: "/",
    html: "index.html",
    fuentes: [
      "app/page.tsx",
      "app/layout.tsx",
      "content/site.ts",
      "content/clases.ts",
      "content/horario.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/clases",
    html: "clases.html",
    fuentes: ["app/clases/page.tsx", "content/clases.ts", "content/faqs.ts"],
  },
  {
    ruta: "/hatha",
    html: "hatha.html",
    fuentes: [
      "app/hatha/page.tsx",
      "components/layout/pagina-de-estilo.tsx",
      "content/clases.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/vinyasa",
    html: "vinyasa.html",
    fuentes: [
      "app/vinyasa/page.tsx",
      "components/layout/pagina-de-estilo.tsx",
      "content/clases.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/horarios",
    html: "horarios.html",
    fuentes: [
      "app/horarios/page.tsx",
      "content/horario.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/precios",
    html: "precios.html",
    fuentes: [
      "app/precios/page.tsx",
      "content/precios.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/primera-vez",
    html: "primera-vez.html",
    fuentes: [
      "app/primera-vez/page.tsx",
      "content/primeraVez.ts",
      "content/faqs.ts",
    ],
  },
  {
    ruta: "/sobre-mi",
    html: "sobre-mi.html",
    fuentes: ["app/sobre-mi/page.tsx", "content/sobreMi.ts"],
  },
  {
    ruta: "/mindfulness",
    html: "mindfulness.html",
    fuentes: ["app/mindfulness/page.tsx", "content/mindfulness.ts"],
  },
  {
    ruta: "/yoga-nidra",
    html: "yoga-nidra.html",
    fuentes: ["app/yoga-nidra/page.tsx", "content/yogaNidra.ts"],
  },
  {
    ruta: "/breathwork",
    html: "breathwork.html",
    fuentes: ["app/breathwork/page.tsx", "content/breathwork.ts"],
  },
  {
    ruta: "/yoga-oncologico",
    html: "yoga-oncologico.html",
    fuentes: ["app/yoga-oncologico/page.tsx", "content/yogaOncologico.ts"],
  },
  {
    ruta: "/retiros",
    html: "retiros.html",
    fuentes: ["app/retiros/page.tsx", "content/retiros.ts"],
  },
  {
    ruta: "/talleres-centros-educativos",
    html: "talleres-centros-educativos.html",
    fuentes: [
      "app/talleres-centros-educativos/page.tsx",
      "content/clases.ts",
    ],
  },
  {
    ruta: "/contacto",
    html: "contacto.html",
    fuentes: [
      "app/contacto/page.tsx",
      "content/site.ts",
      "content/horario.ts",
    ],
  },
] as const
