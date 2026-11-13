# Checklist SEO local · YOGA Rituals

Fecha: 12 de noviembre de 2026
Objetivo: que Google y el resto de directorios asocien «yoga en Gandia» con YOGA Rituals, con el mismo nombre, la misma dirección y el mismo teléfono en todas partes.

## 0. NAP canónico

Este es el único dato válido. Cualquier ficha que diga otra cosa se corrige.

```txt
YOGA Rituals
C/ Sant Francesc de Borja, 36, 1º
46701 Gandia (Valencia)
España
Teléfono y WhatsApp: +34 656 18 77 61 (se puede llamar a cualquier hora)
Correo: yogaritualsgandia@gmail.com
Web: https://www.yogarituals.es
Instagram: https://www.instagram.com/_yogarituals/
Ficha de Google: https://maps.app.goo.gl/ZyN5LZfQHjV5Shy16
Horario: lunes 19:00–20:15; martes 12:00–13:15 y 18:00–19:00;
miércoles 09:10–09:45 y 19:00–20:15; jueves 12:00–13:15 y 18:00–19:00;
viernes 09:10–09:45; sábado 10:00–11:15; domingo cerrado.
```

En la web, este NAP vive en `content/site.ts` y `content/horario.ts`, y se pinta en el pie, en `/contacto` y en el JSON-LD. No hay una segunda copia escrita a mano.

## 1. Google Business Profile

- [ ] Reclamar o verificar la ficha del estudio (si ya existe, comprobar que la gestiona Susana).
- [ ] Nombre exacto: **YOGA Rituals**. Sin «Gandia» pegado al nombre si no forma parte del nombre real.
- [ ] Categoría principal: estudio de yoga. Categorías secundarias solo si existen y son ciertas (por ejemplo, centro de meditación o servicio de bienestar).
- [ ] Dirección exacta, con el piso en el campo de dirección si la ficha lo permite; si no, en la descripción.
- [ ] Teléfono: +34 656 18 77 61.
- [ ] Web: `https://www.yogarituals.es`. Importante: si la ficha apunta a la web antigua, cambiarlo es lo primero, porque Google sigue mandando ahí las visitas.
- [ ] Horario de clases cargado, con los dos tramos de martes y jueves y el domingo cerrado.
- [ ] Teléfono: dejar claro en la descripción que se puede llamar a cualquier hora; no hay horario de atención que anunciar.
- [ ] Servicios: Hatha, Vinyasa, Yoga Nidra, mindfulness, breathwork, yoga oncológico, retiros y talleres. Sin precios inventados.
- [ ] Atributos: «se atiende en español» y «se atiende en valenciano» si la ficha lo permite.
- [ ] Fotos reales: fachada, portal, sala, material y, si existe, un retrato de Susana. No usar fotos de stock como si fueran del local.
- [ ] Primer publicación: «Primera clase de prueba gratuita» con enlace a `/primera-vez`.
- [ ] Preguntas y respuestas: sembrar las dudas reales (reserva, precios, primera vez, dónde está) y responderlas.
- [ ] Activar mensajes solo si Susana puede atenderlos; si no, dejar claro que la vía es WhatsApp.
- [ ] Enlace de la web con UTM para medir: `https://www.yogarituals.es/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- [ ] Revisar la ficha una vez al mes: horario, fotos, publicaciones y reseñas.

**Hecho (13/11/2026):** la ficha ya existe y su enlace corto es `https://maps.app.goo.gl/ZyN5LZfQHjV5Shy16`. Está en `content/site.ts` y se usa como `sameAs` y `hasMap` en el JSON-LD. Queda pendiente verificar que la gestiona Susana y que el sitio web de la ficha apunta al dominio nuevo.

## 2. Consistencia en la web

- [ ] El pie muestra la dirección completa, el teléfono y el correo como texto y como enlaces.
- [ ] `/contacto` muestra el mismo NAP, el horario completo y el mapa.
- [ ] El JSON-LD declara `address`, `geo`, `telephone`, `email`, `openingHoursSpecification`, `hasMap` y `sameAs`.
- [ ] El título y la descripción de `/contacto` mencionan Gandia.
- [ ] `llms.txt` incluye `/contacto` y el horario.
- [ ] `sitemap.xml` incluye `/contacto` y no incluye las páginas legales.
- [ ] Las páginas legales llevan `noindex, follow`.

## 3. Citaciones y directorios

No se trata de estar en cien sitios: se trata de estar bien en los que Google usa para verificar identidad y ubicación. Prioridad:

### Imprescindibles

- [ ] Google Business Profile (arriba).
- [ ] Apple Business Connect (Apple Maps).
- [ ] Bing Places for Business.
- [ ] Waze (si se puede reclamar el punto).

### Recomendables en España

- [ ] Páginas Amarillas.
- [ ] QDQ.
- [ ] Yelp España.
- [ ] Hotfrog.
- [ ] Directorios locales de Gandia o de la comarca de La Safor (ayuntamiento, asociaciones de comercio, guías locales).

En todos: mismo nombre, misma dirección, mismo teléfono y enlace a `https://www.yogarituals.es`. Si un directorio no permite editar el NAP, se corrige o se elimina la ficha; no se deja una ficha duplicada.

## 4. Reseñas

- [ ] Pedir reseña a quien ya viene, en persona o por WhatsApp, sin incentivos.
- [ ] Enviar el enlace directo a la reseña de Google, no a la ficha genérica.
- [ ] Responder a todas, también a las críticas, en tono natural y sin datos de salud.
- [ ] No comprar reseñas, no intercambiarlas y no pedirlas solo a quien va a poner cinco estrellas.
- [ ] No marcar las reseñas de la web con `AggregateRating`: Google no muestra estrellas autoalojadas para un negocio local y puede considerarlo spam.

## 5. Enlaces locales

Oportunidades reales, sin comprar enlaces:

- [ ] **Biblioteca Benipeixcar-Raval**: la sesión de mindfulness ya se imparte allí. Pedir una ficha o un enlace en la agenda de actividades.
- [ ] **Centros educativos** donde se han hecho talleres: enlace desde la memoria de actividades o la web del centro, con permiso.
- [ ] **Estudio o casa rural de Zarra**: enlace cruzado en la página del retiro.
- [ ] **Asociaciones de comercio de Gandia**: ficha de socio con enlace.
- [ ] **Prensa local** (Levante-EMV, Las Provincias, Gandia Televisió): notas de prensa solo cuando haya una noticia real (nuevo horario, retiro, aniversario, taller solidario).
- [ ] **Colaboraciones** con otras profesionales del bienestar de Gandia: enlaces en páginas de colaboradores, no en listas masivas.

## 6. Contenido local en la web

- [ ] La portada dice «estudio de yoga en Gandia» en el H1 y en el primer párrafo.
- [ ] `/contacto` explica dónde está el portal y que el estudio está en el primer piso.
- [ ] `/clases`, `/horarios` y `/precios` mencionan Gandia en título y texto.
- [ ] `/talleres-centros-educativos` menciona Gandia y La Safor.
- [ ] `/retiros` menciona Zarra y Valencia.
- [ ] Las páginas de servicio no repiten «Gandia» en cada párrafo: una vez en el título, una en la entradilla y una en el cierre es suficiente.

## 7. Seguimiento mensual

| Tarea | Herramienta | Frecuencia |
| --- | --- | --- |
| Impresiones y clics por página | Search Console | Mensual |
| Consultas nuevas | Search Console | Mensual |
| Llamadas y rutas | Google Business Profile | Mensual |
| Reseñas nuevas y respuestas | Google Business Profile | Semanal |
| Horario y precios | Web y GBP | Al cambiar |
| Enlaces roto | Search Console + revisión manual | Trimestral |
| Fotos nuevas | GBP y web | Trimestral |

## 8. Errores que no se cometen

- Poner «YOGA Rituals Gandia» como nombre si el negocio se llama «YOGA Rituals».
- Meter palabras clave en la dirección o en el nombre de la ficha.
- Duplicar la ficha con otro teléfono o una dirección antigua.
- Usar el dominio de Netlify como si fuera el dominio principal.
- Publicar horarios de oficina que no existen.
- Inventar precios, plazas o fechas de retiro.
