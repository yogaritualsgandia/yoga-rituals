# Publicar la web y quedarse con el dominio

Esta guía es para hacerlo una vez. Está escrita para poder seguirla en orden,
sin saber nada de servidores, y para poder comprobar en cada paso si ha salido
bien antes de dar el siguiente.

La web se publica en **Netlify**. El dominio `yogarituals.es` está contratado
en **OVHcloud** y sigue siendo el mismo: lo que cambia es dónde apunta y qué
hay detrás. Hoy en ese dominio hay una web hecha con **Webnode**; cuando los DNS
apunten a Netlify, esa web deja de servirse sola. No hay que hacer ninguna
«migración de dominio» ni usar «Change of address» en Google: el dominio no
cambia.

La dirección canónica es **`https://www.yogarituals.es`**, con `www`. La
versión sin `www` redirige allí. Se elige `www` por dos motivos: es la que ya
usan hoy la web antigua y los enlaces y fichas que existen, así que no se mueve
nada de sitio; y, con los DNS fuera de Netlify, `www` puede ser un CNAME y
aprovechar la CDN, mientras que el dominio sin `www` no admite CNAME y Netlify
lo recomienda solo como redirección.

---

## 1. Publicar la web (sin tocar el dominio todavía)

1. Entra en [netlify.com](https://www.netlify.com) y crea una cuenta.
2. **Add new site → Import an existing project**. La web tiene que estar subida
   a GitHub (o GitLab) primero; si no lo está, es el momento de subirla.
3. Netlify reconoce Next.js solo. No hay que configurar nada: ni comando de
   construcción, ni carpeta de salida, ni complementos. El archivo `netlify.toml`
   del proyecto ya lleva lo poco que hace falta.
4. Espera. Cuando termine, Netlify da una dirección provisional del tipo
   `algo-random.netlify.app` (la actual es `yogaritualsweb.netlify.app`).
   **Ábrela y pruébala entera** antes de seguir: móvil y escritorio, el menú, la
   reserva, el WhatsApp, `/contacto` y el mapa. Esa dirección es temporal, así
   que un error aquí no cuesta nada.
5. En **Site configuration → Environment variables**, comprueba que
   `NEXT_PUBLIC_SITE_URL` no existe o vale `https://www.yogarituals.es`. Si
   vale otra cosa, el canonical y el mapa del sitio apuntarán ahí.
   Y añade `NEXT_PUBLIC_META_PIXEL_ID` con el identificador del píxel de Meta.
   Es un dato público, como los de Google y Clarity, así que también puede ir
   en `netlify.toml`; mientras falte, no se carga nada de Meta y la web
   funciona igual.
6. **Noindex provisional.** `netlify.toml` lleva `NOINDEX = "1"` mientras la web
   solo viva en `*.netlify.app`. Eso añade `X-Robots-Tag: noindex` a todo el
   sitio. El día que el dominio definitivo esté activo, **quita esa línea** y
   vuelve a publicar; si no, el dominio bueno también saldría con `noindex`.

## 2. Añadir el dominio en Netlify

Solo cuando la dirección provisional esté perfecta.

1. En Netlify: **Domain management → Add a domain** y escribe
   `www.yogarituals.es`.
2. Si Netlify pregunta, elige **usar los DNS actuales** (los de OVH). No hace
   falta que Netlify gestione la zona para que el dominio funcione.
3. Deja `www.yogarituals.es` como **dominio principal**. Netlify añade el
   dominio sin `www` como alias y lo redirige al principal por su cuenta, con
   un 301. Por eso esa redirección **no** está escrita en `public/_redirects`:
   duplicarla solo serviría para montar un bucle el día que alguien cambie el
   dominio principal.
4. Netlify te dirá qué registros DNS faltan. Son los del paso siguiente.

## 3. Apuntar el dominio desde OVHcloud

Hay dos caminos. El primero es el más simple y el que recomiendo.

### Camino A · Delegar los DNS en Netlify (recomendado)

1. En Netlify, en la ficha del dominio, apunta los cuatro servidores de nombres
   que te da (del tipo `dns1.p0X.nsone.net`).
2. En OVHcloud: **Web Cloud → Dominios → yogarituals.es → Servidores DNS**.
   Elige la opción de usar servidores DNS personalizados y escribe esos cuatro.
   OVH pide un mínimo de dos; pon los cuatro.
3. Guarda. La propagación puede tardar hasta 24 horas, aunque suele ser menos.
4. Ventaja: Netlify crea y mantiene los registros del dominio sin que nadie
   tenga que acordarse de ellos. Si algún día se cambia de hosting, se cambian
   los servidores de nombres y ya está.

### Camino B · Mantener los DNS en OVHcloud

Si prefieres no tocar los servidores de nombres, hay que crear dos registros en
la zona DNS de OVH (**Web Cloud → Dominios → yogarituals.es → Zona DNS**):

| Tipo  | Subdominio | Valor                          |
| ----- | ---------- | ------------------------------ |
| CNAME | `www`      | `yogaritualsweb.netlify.app.`  |
| A     | `@` (vacío)| `75.2.60.5`                    |

- El `CNAME` es el que sirve la web. El `A` del dominio sin `www` solo existe
  para que Netlify pueda redirigir de ahí al `www`; apunta al balanceador de
  Netlify, que es esa IP fija.
- OVH no ofrece registros `ALIAS`/`ANAME`, así que el dominio raíz va con `A`.
  Es el motivo de que el canónico sea `www` y no el dominio a secas.
- **Antes de borrar nada, mira lo que ya hay.** La zona probablemente tenga un
  `A` o un `CNAME` apuntando al alojamiento de la web antigua: ese es el que se
  sustituye. Pero si hay registros `MX`, `TXT` (SPF, verificaciones) o `CNAME`
  de correo, **no se tocan**. Borrar la zona entera para «empezar limpio» es la
  forma más rápida de perder el correo sin enterarse.

En los dos caminos, el certificado HTTPS lo pone Netlify solo y gratis en cuanto
los DNS apunten. Puede tardar unos minutos. Hasta que no esté, no toques nada
más.

## 4. Retirar la web antigua

Primero se comprueba que la nueva funciona (paso 5). Después:

1. La web antigua deja de verse sola en cuanto los DNS apuntan a Netlify. No
   hay que «despublicarla»: ya no recibe visitas.
2. La web antigua está publicada con **Webnode** (responde con
   `Server: webnode`). **No canceles el plan el mismo día.** Déjalo vivo al
   menos un mes. Es el seguro: si algo falla, se puede volver atrás cambiando
   los DNS otra vez.
3. Pasado ese mes, se cancela la suscripción de Webnode desde su panel. El
   dominio **no** se toca: sigue en OVHcloud, que es quien lo registra y quien
   cobra la renovación.
4. En OVHcloud no hay que cancelar ningún alojamiento por esto: el dominio es
   solo el registro y la zona DNS. Si algún día hay correo con el dominio, ese
   correo no se toca: se queda donde esté y solo se cambian los registros de la
   web.

## 5. Comprobar que no se ha perdido nada

Estas son las comprobaciones de verdad. Se pegan en una terminal, una detrás de
otra. La primera línea es lo que hay que hacer, la segunda lo que tiene que
responder.

```bash
# Las direcciones que cambian de nombre redirigen con un 301 permanente.
curl -sI https://www.yogarituals.es/actividades/ | head -3
#   HTTP/2 301
#   location: /clases

# El dominio bueno ya se puede indexar: no debe salir X-Robots-Tag.
curl -sI https://www.yogarituals.es/ | grep -i x-robots-tag
#   (sin salida)

curl -sI https://www.yogarituals.es/tarifas/ | head -3
#   HTTP/2 301
#   location: /precios

curl -sI https://www.yogarituals.es/minfulness/ | head -3
#   HTTP/2 301
#   location: /mindfulness

# El dominio sin www lleva al www, y no al revés.
curl -sI https://yogarituals.es/ | head -3
#   HTTP/2 301
#   location: https://www.yogarituals.es/

# Una dirección que no existe da un 404 de verdad, no un 200 disfrazado.
curl -sI https://www.yogarituals.es/esto-no-existe | head -1
#   HTTP/2 404

# El mapa del sitio está y lleva las quince páginas indexables.
curl -s https://www.yogarituals.es/sitemap.xml | grep -c "<loc>"
#   15

# Y robots.txt apunta a ese mapa.
curl -s https://www.yogarituals.es/robots.txt
#   User-Agent: *
#   Allow: /
#   Sitemap: https://www.yogarituals.es/sitemap.xml

# El catálogo para agentes existe y se sirve como JSON.
curl -sI https://www.yogarituals.es/.well-known/ai-catalog.json | head -4
#   HTTP/2 200
#   content-type: application/ai-catalog+json; charset=utf-8
```

Si alguna no sale, no sigas. Mira la configuración de dominios de Netlify y la
zona DNS de OVH. Y avísame: esas mismas redirecciones están comprobadas
automáticamente en cada cambio, así que si fallan en producción es que los DNS
o Netlify están haciendo algo por su cuenta antes de llegar a la web.

## 6. Decirle a Google

1. En [Google Search Console](https://search.google.com/search-console), añade
   la propiedad de **dominio** `yogarituals.es` (la que se verifica con un
   registro `TXT` en el DNS). Esa propiedad cubre `www` y sin `www` a la vez.
2. **Sitemaps → Añadir un sitemap**: `sitemap.xml`.
3. **Inspección de URL**: pega tres o cuatro direcciones antiguas
   (`/actividades/`, `/tarifas/`, `/minfulness/`) y comprueba que Google ve la
   redirección y la página nueva. Tarda unos días en actualizar el índice.
4. **No hay que usar «Change of address».** Ese trámite es para mudanzas a otro
   dominio, y aquí el dominio es el mismo: solo cambia el `www`.
5. En la ficha de Google (Perfil de Empresa), cambia el campo **Sitio web** a
   `https://www.yogarituals.es`. Si apunta a la web antigua, Google sigue
   mandando visitas allí.

Conviene repetir la inspección a la semana y al mes, y mirar **Cobertura** para
ver que las páginas antiguas van desapareciendo y las nuevas van entrando. Es
normal que durante unas semanas convivan unas y otras.

## 7. Lo que todavía no está

No hay que hacer nada con esto ahora; está apuntado para que no se olvide.

- **Las fotos.** Las que hay son de ejemplo. Cuando lleguen las del estudio y
  de Susana, se sustituyen en `public/fotos/` sin tocar el código, cada una en
  su sitio.
- **El logotipo en SVG.** El actual es un PNG al que se le ha quitado el fondo
  y del que se ha hecho una segunda versión clara para el modo oscuro. Con un
  SVG, las dos versiones sobran.
- **La imagen para compartir.** Es una tarjeta con el logotipo. Cuando haya una
  foto, se sustituye `public/compartir.png` y ya está.
- **El NIF del aviso legal.** En `/aviso-legal` aparece entre corchetes
  `[NIF de Susana Estruch Espinós]`. Cuando llegue el número, se cambia en
  `content/legal.ts` y no hay que tocar nada más.
- **Los retiros.** Cuando haya fecha, precio y plazas, se añaden a `/retiros` y
  se marcan como evento en los datos estructurados.

## 8. Que no llegue una factura rara

La web es estática: no hay servidor que tumbar ni base de datos que llenar. Lo
único que se paga es el ancho de banda, y hay dos seguros puestos:

1. **El plan.** En el plan gratuito de Netlify hay un tope de 300 créditos al
   mes —unos 15 GB de ancho de banda—. Al agotarlos, la web se pausa hasta el
   mes siguiente: **no genera factura**. Si algún día se pasa a un plan de pago,
   deja la **recarga automática apagada** (viene apagada de fábrica): así los
   créditos se acaban en vez de comprarse solos.
2. **El límite de peticiones.** `netlify.toml` lleva una regla que corta a 300
   peticiones por minuto y por dirección IP. Una visita normal gasta 43
   peticiones en frío y 23 por recarga —de las cuales 22 son las precargas de
   Next, una por cada enlace que hay en pantalla—, así que aguantan unas trece
   recargas seguidas: nadie que esté leyendo la web la va a notar; un rastreador
   que va a mil, sí. Al pasarse, Netlify reescribe la petición a
   `public/demasiadas-peticiones.html`, una página de cortesía que dice qué ha
   pasado, en vez de un `429` en blanco. También hay que saber dos cosas de cómo
   funciona: tarda hasta diez segundos en empezar a cortar, y cuando corta,
   corta el sitio entero —por eso esa página no puede pedir ni una fuente, ni
   una foto, ni una hoja de estilos—. Si alguna vez se ve una página en blanco
   en vez de ese aviso, es que la regla está apuntando a un archivo que no
   existe en el despliegue.

3. **El minuto de castigo.** La ventana de Netlify es móvil: se suelta sola en
   cuanto el contador baja del límite, así que darle a F5 devolvía a la web. Por
   eso el aviso no se queda en un texto: guarda su estado en el navegador
   (`localStorage`, clave `yr-recargas`) y lo aplica el resto del sitio.

   - Al llegar, abre una espera de **un minuto** con el botón en gris azulado y
     la cuenta atrás debajo.
   - **Cada recarga suma cinco segundos** y no reinicia la cuenta.
   - Pasadas tantas recargas como el cupo (**20**), el aviso pasa a **castigo de
     cinco minutos** y el cupo se parte en dos: 20, 10, 5, 2, 1.
   - Cuando el cupo llega a cero, **no se entra hasta el día siguiente**. El
     cupo se recupera solo al cambiar el día.
   - Mientras el castigo corre, cualquier otra dirección del sitio devuelve a
     esta pantalla (`lib/control-recargas.ts`), para que no baste con escribir
     otra ruta.

   Es un control **del navegador, no de la IP**: el corte por IP es el de
   Netlify. Si alguien borra los datos del sitio o entra desde otro navegador,
   el contador vuelve a empezar —pero el límite de peticiones sigue ahí—. Para
   un castigo por IP de verdad haría falta una Edge Function con Netlify Blobs:
   una lectura por visita, unos 50-150 ms más en cada página, y dejar de ser una
   web estática. No está puesto a propósito.

   Para deshacer un castigo (por ejemplo, si te bloqueas tú probando), borra los
   datos del sitio en el navegador, o en la consola:
   `localStorage.removeItem("yr-recargas")`.

   Recargar muchas veces seguidas una misma página **sí** agota el límite. No
   es un fallo de la web: es la regla haciendo su trabajo, y ahora el aviso
   explica cuánto falta en vez de dejar la pantalla en blanco.

Para comprobar que Netlify ha leído la regla, se mira el registro del
despliegue, en la etapa **post-processing**: tiene que aparecer el límite. Si no
aparece, la regla no ha pasado la validación y hay que revisarla, aunque el
despliegue no falle por ello.

## 9. Cómo se publica a partir de ahora

Una vez conectado el repositorio, cada vez que se suba un cambio a la rama
principal, Netlify reconstruye y publica sola, en un par de minutos, sin
desconectar la web. Y cada propuesta de cambio recibe además su propia
dirección temporal para verla antes de publicarla, que es la forma de no
romper nada sin querer.
