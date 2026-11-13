# Auditoría SEO · YOGA Rituals

Fecha: 12 de noviembre de 2026
Ámbito: sitio estático Next.js 16 (`output: "export"`) desplegado en Netlify.
Método: lectura del código, del HTML exportado en `out/` y del contenido real; sin herramientas de pago y sin inventar datos.

> **Estado a 13 de noviembre de 2026.** Los cinco problemas del resumen están
> corregidos y el despliegue está decidido: el sitio se publica en Netlify y su
> dirección canónica es `https://www.yogarituals.es`, con el dominio sin `www`
> redirigiendo allí. El proyecto vive en `yogaritualsweb.netlify.app` hasta que
> los DNS de OVHcloud apunten al dominio (pasos en `DESPLIEGUE.md`). Este
> documento se deja como estaba para que se vea de dónde se partía; los datos
> vigentes están en el código y en los otros dos documentos.

## Resumen

La base es mejor de lo habitual: HTML pre-renderizado, títulos y descripciones únicos, canonical por página, Open Graph y Twitter, un solo `H1`, imágenes AVIF/WebP con dimensiones y `loading="lazy"`, `robots.txt`, `sitemap.xml`, 404 real, redirecciones 301 y cabeceras de seguridad.

Los problemas que más pesan no son de plantilla, sino de datos y de arquitectura de la información:

1. Hay **dos dominios vivos** (`yogarituals.es` y `yogaritualsweb.netlify.app`) y todo el código canonicaliza al primero. Si el segundo es producción, el canonical está mal.
2. El JSON-LD del negocio apunta a una **imagen que no existe** (`/fotos-ejemplo/practica-3.jpg`).
3. No hay una **página de contacto** propia: `/contacto` redirige a la portada y el NAP solo vive en el pie.
4. Las páginas legales se indexan y están en el sitemap, cuando no aportan valor de búsqueda.
5. Solo existe un tipo de dato estructurado (`HealthAndBeautyBusiness`). Faltan `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage` y `Person`, y el `FAQ` visible no está marcado.

## Prioridad crítica

### C1 · Dominio canónico ambiguo

- `content/site.ts` fija `https://yogarituals.es`.
- `app/layout.tsx`, `sitemap.ts`, `robots.ts`, `_redirects` y todos los canonical dependen de ese valor.
- `yogaritualsweb.netlify.app` responde y sirve el mismo contenido, pero declara canonical a `yogarituals.es`.

**Riesgo:** si el dominio de Netlify es el que se comparte o se indexa, Google recibe señales contradictorias. Si es staging, no debería ser indexable.

**Decisión pendiente (no se puede resolver sin el cliente):**

- Si producción es `yogarituals.es`: dejar el código como está y usar el subdominio Netlify solo para previews.
- Si producción es `yogaritualsweb.netlify.app`: cambiar `site.url` y volver a generar canonical, sitemap, robots, OG y JSON-LD.
- Si el subdominio Netlify debe seguir público pero no indexarse: añadir `X-Robots-Tag: noindex` solo para ese host (requiere configuración de Netlify, no del export).

### C2 · Imagen rota en los datos estructurados

`lib/datos-estructurados.ts` declara:

```txt
https://yogarituals.es/fotos-ejemplo/practica-3.jpg
```

Ese archivo no existe: la carpeta `public/fotos-ejemplo/` ya no está y las fotos definitivas viven en `public/fotos/`.

**Corrección:** usar una foto real (`/fotos/clases-grupo-1600.jpg`) y añadir `logo` con `/icon.png`.

### C3 · Sin página de contacto ni NAP en URL propia

- `/contacto` está redirigido a `/` en `next.config.ts` y `public/_redirects`.
- La dirección, el teléfono y el correo están en el pie, pero no hay una URL que pueda enlazarse como «contacto», «dónde estáis» o «cómo llegar».
- No hay mapa incrustado ni horario junto al NAP.

**Corrección:** crear `/contacto` con NAP, horario real, mapa y vías de contacto; quitar la redirección; enlazarla desde el pie y añadirla al sitemap.

## Prioridad importante

### I1 · Títulos y H1 sin intención local en las páginas que más convierten

Situación actual:

| Ruta | Título corto | H1 |
| --- | --- | --- |
| `/precios` | Precios | Cuántas clases quieres a la semana |
| `/horarios` | Horarios | Tienes plena libertad para organizar tus horarios |
| `/primera-vez` | Primera vez | Todo lo que necesitas saber |
| `/clases` | Clases y sesiones | Todo lo que se puede practicar |
| `/mindfulness` | Mindfulness | Mindfulness |
| `/yoga-nidra` | Yoga Nidra | Yoga Nidra |
| `/breathwork` | Breathwork | Breathwork |
| `/yoga-oncologico` | Yoga oncológico | Yoga oncológico |

Los títulos son únicos y caben, pero no compiten por «clases de yoga Gandia», «precios yoga Gandia», «horario yoga Gandia» ni «primera clase yoga Gandia». El `H1` puede mantener el tono editorial y, a la vez, incluir la palabra clave y la ciudad.

### I2 · Descripciones al límite o por encima

- `/sobre-mi`: 156 caracteres (por encima del límite recomendado de 155).
- Varias descripciones rondan los 150 y se cortan en Google.
- Conviene reescribirlas con la intención de búsqueda delante y sin repetir el título.

### I3 · Datos estructurados incompletos

- Solo `HealthAndBeautyBusiness`.
- Sin `WebSite` (nombre del sitio, idioma, editorial).
- Sin `WebPage` por URL.
- Sin `BreadcrumbList`, aunque `/hatha` y `/vinyasa` cuelgan de `/clases`.
- Sin `FAQPage`, aunque `/primera-vez` ya tiene un acordeón con preguntas reales.
- Sin `Person` para Susana, con su formación real.
- Sin `logo`, `hasMap`, `paymentAccepted`, `knowsLanguage` ni `slogan`.
- `sameAs` solo incluye Instagram, que es lo correcto: no hay otras redes activas.

### I4 · Páginas legales indexables

`/aviso-legal`, `/privacidad` y `/cookies` declaran `index, follow` y aparecen en el sitemap. No son contenido de búsqueda y diluyen el índice.

**Corrección:** `robots: { index: false, follow: true }` y fuera del sitemap. No usar `Disallow` en `robots.txt`.

### I5 · Enlazado interno escaso entre páginas de servicio

- `/hatha` y `/vinyasa` enlazan a `/horarios`, pero no entre sí.
- `/precios` no enlaza a `/primera-vez` ni a `/horarios`.
- `/horarios` no enlaza a `/precios`.
- `/primera-vez` no enlaza al horario ni a precios en el cierre.

**Corrección:** enlaces contextuales dentro del texto existente, sin bloques de «relacionados» genéricos.

### I6 · Canonical del 404

`app/not-found.tsx` no declara canonical y hereda el de la portada. Un 404 no debe declarar la home como su versión canónica.

**Corrección:** canonical propio (`/404`) y `noindex` explícito.

### I7 · `llms.txt` desactualizado

Dice que las fotos son provisionales, pero `content/medios.ts` ya las marca todas como `definitiva: true`. También faltan `/contacto` y los datos de horario en el resumen.

### I8 · Sin manifiesto web ni `theme-color`

No hay `manifest.webmanifest` ni `theme-color`. No es crítico para Google, pero mejora la instalación en móvil y la coherencia de la marca en la barra del navegador.

## Prioridad de mejora

### M1 · Oportunidades de contenido no cubiertas

Búsquedas con intención real que hoy no tienen respuesta dedicada:

- «yoga para principiantes Gandia» → se puede cubrir desde `/primera-vez`.
- «yoga dolor de espalda Gandia» → hay una historia real (escoliosis de Susana) y formación restaurativa; merece un apartado, no una página inventada.
- «yoga oncológico Gandia» → ya existe página; falta enlazado y marcado.
- «retiro yoga Zarra / Valencia» → ya existe página; faltan fechas y precio (TODO real).
- «talleres yoga colegios Gandia» → ya existe página; falta reforzar la entidad local.
- «mindfulness Gandia» → ya existe página con datos concretos.

El plan editorial está en `SEO-CONTENT-PLAN.md`.

### M2 · Reseñas

Las reseñas de la portada son reales y enlazan a Google, pero **no conviene marcarlas con `Review`/`AggregateRating`**: Google no muestra estrellas de reseñas autoalojadas para un negocio local y el marcado puede considerarse spam. Se dejan como contenido visible y se trabaja la ficha de Google (ver `SEO-LOCAL-CHECKLIST.md`).

### M3 · Rendimiento

Lo que ya está bien:

- Imágenes en AVIF, WebP y JPEG, dos anchos, `srcset`, `sizes`, `width`/`height`, `decoding="async"`.
- LCP de la portada con `fetchPriority="high"`, `loading="eager"` y precarga HTTP en `_headers`.
- Fuentes autohospedadas con `next/font` y `display: "swap"`.
- GSAP y Lenis se cargan de forma diferida y se desactivan con `prefers-reduced-motion`.

Lo que falta:

- No hay reglas de caché para `/fotos/*` ni para `/_next/static/*` en `_headers`, aunque el comentario del archivo dice que existen.
- No hay `manifest` ni `theme-color`.
- El CSS global es una sola hoja; con el tamaño actual no compensa dividirla, pero conviene vigilar el presupuesto en cada build.

Objetivos: LCP < 2,5 s, INP < 200 ms, CLS < 0,1.

### M4 · Arquitectura y migas

El sitio es plano salvo `/clases` → `/hatha` y `/vinyasa`. No se añade miga visual para no romper el ritmo editorial; se añade `BreadcrumbList` en JSON-LD, que es donde Google lo lee. Si en el futuro crece el árbol, la miga visible se añade en `components/layout/pagina.tsx`.

## Lo que ya está resuelto y no se toca

- `lang="es"`, un solo `H1` por página y jerarquía de encabezados coherente.
- Títulos y descripciones únicos, canonical autorreferente y OG/Twitter por página.
- `robots.txt` abierto, con rastreadores de IA nombrados, y `sitemap.xml` sin `priority` ni `lastModified` falsos.
- 404 real con `noindex`.
- Redirecciones 301 de la web antigua, con prueba que compara `next.config.ts` y `public/_redirects`.
- Dirección y teléfono como texto real, no como imagen.
- Contraste, foco visible, enlace «Saltar al contenido», controles de 44 px y menú móvil accesible.
- Sin cookies de terceros hasta que se acepta el aviso; mapa de contacto con OpenStreetMap para no añadir cookies de Google.

## Datos que faltan y no se inventan

- Fecha, precio y plazas del próximo retiro de Zarra.
- Confirmación de si el dominio de producción es `yogarituals.es` o el subdominio de Netlify.
- Ficha de Google Business Profile verificada y su URL corta (para `sameAs` y para el mapa).
- Horario de atención telefónica (no el de clases).
- Fotos reales de Susana y del interior del estudio, si existen.
