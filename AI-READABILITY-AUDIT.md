# Auditoría de legibilidad para IA — YOGA Rituals

Fecha: 13 de noviembre de 2026
Alcance: web pública de `yogarituals.es` (export estático de Next.js 16.4.3), rutas indexables y datos de negocio.
Método: lectura del código, del HTML exportado en `out/` y de los archivos de contenido. Sin modificar nada durante la auditoría.

> **Nota (13/11/2026).** El dominio canónico es `https://www.yogarituals.es` y
> se sirve desde Netlify; el dominio sin `www` redirige allí. Lo que este
> documento decía sobre el dominio y el canonical queda resuelto. El resto se
> deja como estaba, como registro de la auditoría.

---

## Resumen ejecutivo

La web ya tiene una base buena: HTML semántico, textos reales, canonical, Open Graph, JSON-LD de negocio, página de contacto con NAP y páginas legales fuera del índice. El problema principal no es el contenido, sino **cómo se entrega**: el contenido de la página queda después del `<footer>` dentro de un bloque oculto, y las respuestas del acordeón no están en el HTML inicial. Para un rastreador que no ejecuta JavaScript —o para un lector que no lo carga— la página se ve vacía o incompleta.

Prioridad de trabajo:

1. **Crítico** · Devolver el contenido al `<main>` y eliminar el streaming que lo esconde.
2. **Crítico** · Poner las respuestas de las preguntas frecuentes en el HTML inicial.
3. **Crítico** · Publicar versiones `.md`, `llms.txt` y `llms-full.txt` generadas desde la misma fuente de datos.
4. **Importante** · Unificar `SITE_URL` y generar `robots.txt` y `sitemap.xml` con datos reales.
5. **Importante** · Completar el JSON-LD y alinear cada dato estructurado con un dato visible.
6. **Mejora** · Añadir preguntas frecuentes visibles y citables en las páginas transaccionales.

---

## Lo que ya está bien

- **Canonical y metadatos por página.** `lib/metadatos.ts` compone título, descripción, canonical, Open Graph y Twitter desde tres datos. Todas las páginas indexables lo usan.
- **JSON-LD de negocio.** `lib/datos-estructurados.ts` describe `HealthAndBeautyBusiness`, `WebSite` y `Person` con `@id` estables, dirección, geolocalización, horario, precios, formas de pago y fundadora.
- **NAP y contacto.** `/contacto` existe, tiene dirección, teléfono, WhatsApp, correo, horario y mapa de OpenStreetMap.
- **Páginas legales fuera del índice.** `/aviso-legal`, `/privacidad` y `/cookies` llevan `noindex` y no están en el sitemap.
- **Contenido real y verificable.** Horarios, precios, dirección y textos salen de los archivos de `content/`; no hay precios ni reseñas inventadas.
- **Tablas semánticas.** Horarios y precios son `<table>` reales, no imágenes ni rejillas de `div`.
- **Textos de bienestar sin promesas médicas.** Yoga Nidra, restaurativo y yoga oncológico están redactados con lenguaje de acompañamiento, no de curación.

---

## Hallazgos críticos

### C1 · El contenido principal está fuera del `<main>` y dentro de un bloque oculto

**Evidencia**

- En `out/index.html` el `<footer>` empieza en la posición 18.846 y el `<h1>` en la 30.648.
- En `out/primera-vez.html` el `<footer>` termina en la 23.370 y el contenido real empieza después, dentro de `<div hidden id="S:0">`.
- El `<main>` solo contiene el esqueleto de carga (`Skeleton`), no la página.

**Causa probable**

`app/loading.tsx` introduce un límite de Suspense. En el export estático, Next escribe el esqueleto en el `<main>` y el contenido real se queda en el HTML de streaming, oculto y después del pie.

**Impacto**

- Un rastreador que no ejecuta JavaScript puede no leer el contenido principal.
- El orden del DOM es incorrecto para lectores de pantalla y para extracción de texto.
- Aunque Google ejecute JavaScript, otros motores y asistentes no lo hacen.

**Solución**

Eliminar `app/loading.tsx` y comprobar que el contenido queda dentro de `<main>` antes del `<footer>`. No hace falta un esqueleto de carga en un sitio estático.

**Archivos afectados**

- `app/loading.tsx` (eliminar)
- `app/layout.tsx` (verificar el orden)
- `components/ui/skeleton.tsx` (puede quedar sin uso)

---

### C2 · Las respuestas del acordeón no están en el HTML inicial

**Evidencia**

- `out/primera-vez.html` contiene el texto «No soy flexible» (la pregunta), pero no contiene «La flexibilidad llega con la práctica» (la respuesta).
- El JSON-LD de `/primera-vez` sí declara 9 preguntas con sus respuestas completas.
- El acordeón es Radix (`components/ui/accordion.tsx`) y desmonta el contenido cerrado.

**Impacto**

- El HTML visible y el JSON-LD no coinciden: el marcado declara respuestas que el rastreador no puede ver.
- Un asistente que lea solo el HTML no puede citar las respuestas.
- Es un riesgo de incumplimiento de las políticas de datos estructurados de Google (el contenido marcado debe ser visible).

**Solución**

- Añadir `forceMount` al `AccordionContent` de `/primera-vez` para que el panel exista siempre en el DOM.
- Mantener el acordeón y su animación; Radix seguirá ocultando el panel cerrado con `hidden`.
- Verificar que la respuesta aparece en el HTML exportado.

**Archivos afectados**

- `app/primera-vez/page.tsx`
- `components/ui/accordion.tsx` (si se opta por `forceMount` por defecto)

---

### C3 · No hay versiones `.md`, ni `llms-full.txt`, ni enlaces alternativos

**Evidencia**

- `out/` no contiene ningún `.md`.
- Ninguna página emite `<link rel="alternate" type="text/markdown">`.
- `public/llms.txt` es un archivo estático escrito a mano, con URLs y precios duplicados.
- No existe `llms-full.txt`.

**Impacto**

- Los asistentes tienen que parsear HTML, navegación, scripts y JSON-LD para extraer el contenido.
- `llms.txt` puede quedar desactualizado en cuanto cambie un precio o un horario.
- No hay una versión limpia y citable de cada página.

**Solución**

- Generar `out/<ruta>.md` desde el HTML exportado, con frontmatter (título, descripción, canonical, fecha).
- Generar `out/llms.txt` y `out/llms-full.txt` desde los mismos datos y las mismas páginas.
- Añadir `alternates.types` en `lib/metadatos.ts` y en el layout raíz.
- Eliminar `public/llms.txt` como fuente manual; el build lo sustituye.

**Archivos afectados**

- `scripts/generar-archivos-ia.mjs` (nuevo)
- `package.json` (`postbuild`)
- `lib/metadatos.ts`
- `app/layout.tsx`
- `public/llms.txt` (eliminar)

---

## Hallazgos importantes

### I1 · `SITE_URL` está escrito a mano

**Evidencia**

- `content/site.ts` fija `url: "https://yogarituals.es"`.
- `app/sitemap.ts` y `app/robots.ts` lo leen de ahí, pero no hay forma de cambiarlo por entorno.
- El dominio provisional `yogaritualsweb.netlify.app` no está contemplado.

**Impacto**

- Cambiar de dominio exige tocar código y reconstruir.
- Los previews de Netlify no pueden usar su propia URL canónica.
- Un error de copia puede dejar canonical, sitemap y JSON-LD apuntando a sitios distintos.

**Solución**

- Exportar `SITE_URL` desde `content/site.ts` con `NEXT_PUBLIC_SITE_URL` como override y `https://yogarituals.es` como valor por defecto.
- Usar `SITE_URL` en canonical, JSON-LD, sitemap, robots, `llms.txt` y `.md`.

**Archivos afectados**

- `content/site.ts`
- `lib/datos-estructurados.ts`
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`

---

### I2 · `robots.txt` no tiene fecha de revisión ni política de entrenamiento explícita

**Evidencia**

- `out/robots.txt` lista bots, pero incluye `Claude-Web`, que es un nombre obsoleto.
- No hay comentario de fecha de revisión.
- No hay una política separada para bots de entrenamiento con `Disallow` comentado.
- No incluye algunos bots actuales de búsqueda con IA.

**Impacto**

- No queda documentado cuándo se revisó la política.
- Un cambio de criterio sobre entrenamiento exige reescribir el archivo desde cero.
- Los nombres obsoletosdan una falsa sensación de cobertura.

**Solución**

- Generar `robots.txt` en el postbuild con:
  - grupos explícitos para buscadores y asistentes;
  - `Sitemap` absoluto;
  - comentario de última revisión y próxima revisión;
  - política de entrenamiento con `Allow: /` y líneas `Disallow: /` comentadas para poder cambiar de criterio sin reescribir.

**Archivos afectados**

- `scripts/generar-archivos-ia.mjs`
- `app/robots.ts` (eliminar o dejar de ser la fuente)

---

### I3 · El sitemap no tiene `lastmod`

**Evidencia**

- `out/sitemap.xml` solo contiene `<loc>`.
- `app/sitemap.ts` explica que se omitió `lastModified` porque Next pondría la fecha del build.

**Impacto**

- Los rastreadores no saben qué páginas han cambiado de verdad.
- Un cambio de precio u horario no se comunica.

**Solución**

- Generar el sitemap en el postbuild con `lastmod` calculado desde el último commit de Git de los archivos que alimentan cada ruta.
- Si Git no está disponible, usar la fecha de modificación del archivo como respaldo, nunca la fecha del build.
- Incluir solo rutas indexables con respuesta 200.

**Archivos afectados**

- `scripts/generar-archivos-ia.mjs`
- `content/rutas.ts` (nuevo, lista única de rutas y fuentes)
- `app/sitemap.ts` (eliminar o dejar de ser la fuente)

---

### I4 · Faltan cabeceras MIME y la política de previews

**Evidencia**

- `public/_headers` no define `Content-Type` para `llms.txt`, `llms-full.txt` ni `.md`.
- No hay `X-Robots-Tag: noindex` para deploy previews.
- No hay una redirección preparada desde `yogaritualsweb.netlify.app`.

**Impacto**

- Netlify puede servir `.md` con un tipo genérico.
- Un preview puede indexarse y competir con producción.
- El día del cambio de dominio habrá que improvisar la redirección.

**Solución**

- Añadir reglas MIME y de caché para los archivos de IA.
- Generar `out/_headers` con `X-Robots-Tag: noindex` cuando `CONTEXT` no sea `production`.
- Dejar comentada la redirección 301 desde el dominio provisional, para activarla el día del cambio.

**Archivos afectados**

- `public/_headers`
- `public/_redirects`
- `scripts/generar-archivos-ia.mjs`
- `netlify.toml`

---

### I5 · Hay datos estructurados que no tienen un dato visible equivalente

**Evidencia**

- El `FAQPage` de `/primera-vez` declara 9 preguntas, pero las respuestas no están en el HTML inicial (ver C2).
- El `HealthAndBeautyBusiness` declara precios y horarios que sí están visibles en `/precios` y `/horarios`, pero no en la portada.
- No hay `hasOfferCatalog` que agrupe las prácticas.

**Impacto**

- Los datos estructurados pueden considerarse incompletos o no coincidentes.
- Un asistente que solo lea JSON-LD puede citar una respuesta que la página no muestra.

**Solución**

- Alinear el `FAQPage` con preguntas visibles.
- Añadir `hasOfferCatalog` con las prácticas reales, sin precios inventados.
- No añadir `AggregateRating` ni `Review` si no hay una fuente verificable y visible.

**Archivos afectados**

- `lib/datos-estructurados.ts`
- `content/faqs.ts` (nuevo)
- `components/seo/preguntas-frecuentes.tsx` (nuevo)

---

### I6 · Fechas de eventos sin año y sin `<time datetime>`

**Evidencia**

- `content/mindfulness.ts` anuncia «18, 19 y 20 de noviembre, de 8:00 a 8:50 h».
- No consta el año.
- No se emite `<time datetime="...">` ni `Event` JSON-LD.

**Impacto**

- La fecha es ambigua para una persona y para un motor.
- No se puede publicar un `Event` válido.
- El dato caduca sin que nadie lo sepa.

**Solución**

- No inventar el año. Mantener el texto y marcarlo como pendiente.
- Cuando se confirme, añadir `<time datetime="2026-11-18">` y, si procede, `Event` JSON-LD con fecha, lugar y precio reales.
- Añadir el recordatorio en `PENDIENTES.md` y en las preguntas finales.

**Archivos afectados**

- `content/mindfulness.ts`
- `app/mindfulness/page.tsx`
- `PENDIENTES.md`

---

## Mejoras recomendadas

### M1 · Preguntas frecuentes visibles en las páginas transaccionales

La portada, `/clases`, `/horarios` y `/precios` responden a dudas reales, pero no las formulan como preguntas. Añadir un bloque semántico de preguntas frecuentes en esas páginas:

- mejora la extracción por parte de asistentes;
- permite un `FAQPage` honesto, porque las respuestas están visibles;
- no cambia el diseño existente si se usa el mismo ritmo de secciones y una lista de definición.

No se añadirán preguntas a páginas donde no haya una respuesta real y verificable.

### M2 · Resumen citable al principio de cada página

Cada `.md` generado llevará un resumen de una frase y los datos clave (dirección, horario, precio, reserva) antes del cuerpo. Así un asistente puede citar sin recorrer toda la página.

### M3 · Enlaces internos entre páginas y datos

El sitio ya enlaza clases, horarios y precios. Conviene mantener una lista única de rutas (`content/rutas.ts`) para que sitemap, `llms.txt` y `.md` no se separen.

### M4 · Revisión periódica

Dejar documentada una fecha de revisión de `robots.txt` y de los datos de negocio. Los precios y horarios cambian; la web debe decir cuándo se revisaron.

---

## Archivos que se van a crear o modificar

| Archivo | Cambio |
| --- | --- |
| `AI-READABILITY-AUDIT.md` | Este documento |
| `content/site.ts` | `SITE_URL` con override por entorno |
| `content/negocio.ts` | Punto único de importación para scripts de build |
| `content/faqs.ts` | Preguntas frecuentes reales y reutilizables |
| `content/rutas.ts` | Rutas indexables y archivos fuente para `lastmod` |
| `components/seo/preguntas-frecuentes.tsx` | Bloque visible y semántico de FAQ |
| `components/layout/pagina.tsx` | Acepta preguntas para el JSON-LD de cualquier tipo de página |
| `components/layout/pagina-de-estilo.tsx` | FAQ de Hatha y Vinyasa |
| `components/ui/accordion.tsx` | Soporte para contenido siempre montado |
| `app/loading.tsx` | Eliminar |
| `app/page.tsx` | FAQ visible y JSON-LD |
| `app/clases/page.tsx` | FAQ visible y JSON-LD |
| `app/horarios/page.tsx` | FAQ visible y JSON-LD |
| `app/precios/page.tsx` | FAQ visible y JSON-LD |
| `app/primera-vez/page.tsx` | Respuestas en el HTML inicial |
| `app/sitemap.ts` | Eliminar; lo genera el postbuild |
| `app/robots.ts` | Eliminar; lo genera el postbuild |
| `public/llms.txt` | Eliminar; lo genera el postbuild |
| `public/_headers` | MIME y caché para `.md` y `llms*.txt` |
| `public/_redirects` | 301 preparada desde el dominio provisional |
| `scripts/generar-archivos-ia.mjs` | Generador de `.md`, `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml` y `_headers` de preview |
| `package.json` | `postbuild` encadenado |
| `DESPLIEGUE.md` | Cambio de dominio, previews y `SITE_URL` |
| `PENDIENTES.md` | Nuevas confirmaciones pendientes |

---

## Verificación prevista

1. `npm run typecheck`
2. `npm run build`
3. En `out/index.html` y `out/primera-vez.html`:
   - el `<h1>` aparece antes del `<footer>`;
   - no existe `<div hidden id="S:0">` con el contenido principal;
   - las respuestas del acordeón aparecen en el HTML.
4. En `out/`:
   - existen `index.md`, `clases.md`, `horarios.md`, `precios.md`, `primera-vez.md` y el resto de rutas;
   - existen `llms.txt` y `llms-full.txt`;
   - `robots.txt` tiene grupos, `Sitemap`, fecha de revisión y `Disallow` comentados;
   - `sitemap.xml` tiene `lastmod` y no incluye legales.
5. En el HTML de cada página:
   - `<link rel="alternate" type="text/markdown" href="...">`;
   - canonical absoluto con `SITE_URL`.
6. Validar el JSON-LD con el validador de schema.org y comprobar que cada pregunta del `FAQPage` está visible.

---

## Preguntas pendientes (no se inventa nada)

> Las respuestas a estas preguntas, cuando las hay, están aplicadas en «Estado
> de implementación». Se deja la lista como registro de lo que se preguntó.

1. **Taller de respiración:** «18, 19 y 20 de noviembre, de 8:00 a 8:50 h» — ¿de qué año? ¿Se repite? ¿Hay precio o inscripción?
2. **Retiro de Zarra:** fecha del próximo retiro, precio, alojamiento y forma de reserva.
3. **NIF:** falta en `content/legal.ts` como `[NIF de Susana Estruch Espinós]`.
4. **Dominio provisional:** ¿`yogaritualsweb.netlify.app` debe indexarse mientras sea el sitio de pruebas, o se deja `noindex`?
5. **Bots de entrenamiento:** la política propuesta es permitir. ¿Se confirma o se prefiere bloquear `GPTBot`, `ClaudeBot`, `CCBot`, etc.?
6. **Plan «Ilimitadas»:** la web antigua lo anuncia a 85 €/mes o 240 €/trimestre. ¿Se añade a la web nueva?
7. **Estilos por franja:** ¿cada hora del horario tiene un estilo fijo (por ejemplo, lunes Hatha) o el horario es libre como está ahora?
8. **Yoga oncológico:** la web antigua anuncia viernes de 11:00 a 12:00, pero el horario actual no tiene esa franja. ¿Cuál es la buena?
9. **Aparcamiento:** ¿hay aparcamiento cerca del estudio? Es una pregunta habitual y no hay información.
10. **Preguntas frecuentes nuevas:** las preguntas de portada, clases, horarios y precios se han redactado a partir de datos ya publicados. ¿Se confirma que se pueden publicar tal cual?

---

## Estado de implementación (13/11/2026)

Lo que sigue ya está en el código y comprobado sobre el export de `out/`. Esta
sección no cambia los hallazgos de arriba: los deja fechados y dice qué se hizo
con cada uno.

| Hallazgo | Estado | Dónde |
| --- | --- | --- |
| C1 · contenido fuera del `<main>` | Resuelto. Se eliminó `app/loading.tsx`; el HTML deja el contenido en `<main>`, antes del `<footer>`, y ya no hay bloques `S:0`. | `app/loading.tsx` (eliminado) |
| C2 · respuestas del acordeón | Resuelto. `AccordionContent` acepta `forceMount` y `/primera-vez` lo usa: las nueve respuestas están en el HTML inicial. | `components/ui/accordion.tsx`, `app/primera-vez/page.tsx` |
| C3 · versiones para máquinas | Resuelto. El postbuild genera 15 `.md`, `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml` y `_headers`. Cada página indexable lleva su `alternate` `text/markdown`. | `scripts/generar-archivos-ia.mjs`, `lib/metadatos.ts` |
| I1 · `SITE_URL` a mano | Resuelto. Un único valor, con `NEXT_PUBLIC_SITE_URL` como override. De ahí salen canonical, sitemap, robots, llms y `.md`. | `content/site.ts` |
| I2 · robots sin política | Resuelto. Grupos explícitos, `Sitemap`, fecha de revisión y `Disallow` de entrenamiento comentados para poder cambiarlos sin reescribir el archivo. | `out/robots.txt` (generado) |
| I3 · sitemap sin `lastmod` | Resuelto. 15 URLs indexables con `lastmod` real de la fuente de cada página; las legales no entran. | `content/rutas.ts`, `out/sitemap.xml` |
| I4 · MIME y previews | Resuelto. Reglas para `llms*.txt` y `.md`; los previews de Netlify añaden `X-Robots-Tag: noindex` cuando `CONTEXT` no es producción. | `public/_headers`, generador |
| I5 · JSON-LD sin equivalente visible | Resuelto en `/primera-vez`, la única página que conserva preguntas: su `FAQPage` se genera desde las mismas preguntas que se ven. | `lib/datos-estructurados.ts`, `content/faqs.ts` |
| I6 · fechas sin año ni `<time>` | **Pendiente de dato.** El taller de respiración se retiró de la web: era de 2026 y ya habrá pasado. El retiro no tiene fecha. No se ha inventado nada. | `content/mindfulness.ts`, `app/retiros/page.tsx` |
| M1 · FAQ en páginas transaccionales | **Retirado.** Los seis bloques nuevos se quitaron el 13/11/2026: los textos de la web se van a rehacer y se generarán de nuevo desde los definitivos. | `app/page.tsx`, `app/clases`, `app/horarios`, `app/precios`, `components/layout/pagina-de-estilo.tsx` |
| M2 · resumen citable | Cubierto por `llms.txt` y por la cabecera de cada `.md`; no se ha añadido un bloque visible nuevo para no cambiar el diseño. | generador |
| M3 · enlaces internos | Las FAQ y los bloques nuevos enlazan a horarios, precios, primera vez y contacto. | páginas y `content/faqs.ts` |

Comprobado con `npm run typecheck` y `npm run build`, y con una revisión del
export que verifica: canonical y `alternate` en las 15 páginas, `.md` con
frontmatter y H1, preguntas del `FAQPage` presentes en el texto del HTML,
ausencia de `AggregateRating`/`Review`, enlaces internos sin 404, `sitemap.xml`
válido con 15 `lastmod`, y `robots.txt` sin ningún `Disallow` activo.

Decisiones aplicadas el 13/11/2026: el taller de respiración era de 2026 y se
retiró de la web; no hay ningún retiro convocado y la página lo dice; el dominio
provisional lleva `X-Robots-Tag: noindex`; los bots de entrenamiento siguen
permitidos; no existe la tarifa «Ilimitadas»; yoga oncológico no se hace de
momento y no se anuncia franja; el aparcamiento está en `/contacto`. El NIF sigue
pendiente para antes del despliegue. Las preguntas frecuentes nuevas se
retiraron porque los textos de la web se van a rehacer.

Queda una decisión que afecta al canonical: se ha fijado
`https://www.yogarituals.es` (con `www`) porque es lo que encaja con Netlify y
los DNS en OVHcloud, y así lo recogen `DESPLIEGUE.md` y las pruebas. Si se
prefiere el dominio sin `www`, se cambia el valor por defecto de `SITE_URL` o se
define `NEXT_PUBLIC_SITE_URL=https://yogarituals.es`; no hay que tocar nada más.

