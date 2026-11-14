# Pendientes de Susana

Todo lo que falta en la web y que solo puede contestar el estudio. Está
ordenado por lo que bloquea, no por dónde vive en el código.

Nada de esto se inventa. Donde falta un dato, la web lo dice con palabras (o no
lo dice) en lugar de rellenarlo con algo plausible; los textos provisionales que
quedan están marcados en su propia página.

---

## 1. Fotos

**Todas las fotos de la web son de ejemplo.** Están en `public/fotos-ejemplo/` y
debajo de cada una se lee «Fotos de ejemplo. Se sustituirán por las del estudio
de Gandia». No hace falta que sean profesionales: hace falta que sean del sitio,
de la sala y de una clase.

Las fotos que hacen falta:

| Dónde | Qué se ve |
| --- | --- |
| Portada, arriba | Una clase o la sala, en vertical |
| Portada, pruebas | El material: esterillas, bloques, cinturones |
| Portada, testimonios | La sala vacía o preparada |
| Hatha / Vinyasa | Alguien practicando, en vertical |
| Sobre mí | Susana |
| Talleres en centros educativos | Un taller en un aula |
| Retiros | Un retiro, o el sitio donde se hace |

La página de **Breathwork** usa hoy la misma foto del incienso que «Sobre mí»,
porque entre las que hay es la única que se parece a una respiración. Le vendría
bien una suya, en vertical.

También `public/compartir.png` es un provisional: es la imagen que se ve al
compartir la web por WhatsApp o redes (1200 × 630).

## 2. El logo

El logo que hay es un PNG sacado de la web actual, puesto sobre blanco. Se ha
recortado el fondo y se ha hecho una versión para el modo oscuro, pero **un SVG
resolvería los dos problemas de una vez** (no tiene fondo y la tinta se cambia
por CSS). Si lo tiene, mándelo.

## 3. Las reseñas de Google

Resuelto. En la portada hay cuatro reseñas reales, cada una con el enlace a su
propia reseña —no a la ficha del estudio—, copiado del diálogo «Compartir
reseña» de Google Maps. La primera es larga y lleva «Leer más». Si alguna se
borra en Google, su enlace deja de funcionar: se sustituye por otra y listo.

## 4. Textos legales

Escritos: `/aviso-legal`, `/privacidad` y `/cookies` describen lo que hace la
web de verdad, incluidos Google Analytics y Microsoft Clarity y el
consentimiento previo. Solo falta un dato: el **NIF**. En `content/legal.ts`
aparece entre corchetes como `[NIF de Susana Estruch Espinós]`; cuando llegue,
se sustituye esa línea y no hay que tocar nada más.

## 5. Horario y clases

- **¿Cada franja del horario tiene un estilo fijo?** Ahora el horario se enseña
  como «horarios libres»: vienes el día que puedes y se practica lo que toca ese
  día. Si cada hora es de una cosa (los lunes Hatha, los martes Vinyasa…), se
  pone, y es información muy buscada.
- **Yoga Nidra:** ¿se hace la sesión?, ¿con qué frecuencia? Ahora no está en el
  horario semanal y se anuncia aparte.
- **Yoga oncológico:** no se hace de momento; no se anuncia ninguna franja.
  La página del servicio se queda como información, sin horario.
- **Aparcamiento:** resuelto. En `/contacto` figuran los dos parkings públicos
  más cercanos: Parking Colón (C/ Alzira, 26), a unos 230 m, y Parking Plaza del
  Prado, a unos 350 m.

## 6. Retiros

Ahora mismo **no hay ningún retiro convocado**. La página cuenta cómo es el
retiro de Zarra y dice expresamente que no hay fecha abierta. Cuando se convoque
uno, faltarán la fecha, el precio, el alojamiento y la reserva.

## 7. Breathwork

- El **taller de respiración del 18, 19 y 20 de noviembre de 2026** se retiró de
  la web: ya habrá pasado cuando se publique. Si hay otra edición, se añade con
  año, precio e inscripción.
- La sesión individual son 90 minutos tumbado. ¿Se ofrece también en grupo?

## 8. Mindfulness

Lo que faltaba ya está puesto (miércoles a las 10:30, una hora, las plazas las
lleva la biblioteca). Quedan dos cosas:

- **«Ahora mismo, plazas completas»**: es un estado, y caduca. Cuando se libere
  una plaza, hay que avisar para cambiarlo.
- En su web la frase se corta a media palabra: «Un lugar de encuentro,
  conexio». Si quiere decir el resto, se añade.

## 9. Precios

- **«Ilimitadas» no existe**: no se añade.
- Las cuotas y los bonos están tal como estaban publicados. Si algo ha cambiado,
  se cambia.

---

## 10. Legibilidad para asistentes y buscadores

La web ya genera `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml`,
`/.well-known/ai-catalog.json`, `/.well-known/ard.json` y una versión `.md` de
cada página en el build. Estas son las decisiones que quedan:

- **Textos de la web.** Se van a rehacer. Cuando estén, se regeneran desde ellos
  las preguntas frecuentes, los `.md`, `llms.txt` y `llms-full.txt`. No se
  publica texto nuevo hasta entonces.
- **Dominio.** Resuelto el 13/11/2026: se publica en Netlify y el canónico es
  `https://www.yogarituals.es`, con el dominio sin `www` redirigiendo allí. El
  proyecto sigue en `yogaritualsweb.netlify.app` hasta que los DNS de OVHcloud
  apunten al dominio. Los pasos están en `DESPLIEGUE.md`.
- **Bots de entrenamiento.** `robots.txt` permite por defecto a `GPTBot`,
  `ClaudeBot`, `CCBot`, `Google-Extended`, etc. Si se prefiere bloquear el
  entrenamiento, están las líneas `Disallow: /` comentadas para descomentar.
- **Noindex provisional.** El sitio sale con `X-Robots-Tag: noindex` mientras
  viva en `yogaritualsweb.netlify.app`. Se controla con `NOINDEX = "1"` en
  `netlify.toml`; hay que quitarlo el día que el dominio definitivo esté
  activo.
- **Preguntas frecuentes nuevas.** Se retiraron el 13/11/2026 de portada,
  clases, horarios, precios, Hatha y Vinyasa. Los textos de la web se van a
  rehacer; cuando estén, las preguntas, los `.md` y el `FAQPage` se generarán de
  nuevo desde esos textos, no desde los actuales.

---

## Decisiones de diseño pendientes de un «sí»

1. **El color de las bandas de la portada.** Los bloques alternos van ahora en un
   tono cálido suave. ¿Es el «canela» que tenía en la cabeza?
2. **La velocidad del fondo.** El fondo se mueve despacio, unos seis segundos por
   ciclo. ¿Se queda así?
3. **Los titulares de sección.** En «Sobre mí», «Formación» se ha subido a 30 px
   porque lo pidió. En el resto de las páginas los titulares de sección están a
   24 px. **¿Se suben todos a 30?** (Queda raro que unos sí y otros no.)
4. **La página de contacto.** Se quitó, y el contacto vive en el pie, en el botón
   de WhatsApp y en el de reserva. ¿Se queda así?
