# Publicar la web y mudar el dominio

Esta guía es para hacerlo una vez. Está escrita para poder seguirla en orden,
sin saber nada de servidores, y para poder comprobar en cada paso si ha salido
bien antes de dar el siguiente.

La web se publica en **Netlify** y el dominio (yogarituals.es) sigue siendo el
mismo. Eso último es importante: **el dominio no cambia**, solo cambia dónde
apunta. Por eso no hay que hacer ninguna «migración de dominio» ni decirle nada
especial a Google; basta con que las direcciones viejas redirijan a las nuevas.

---

## 1. Publicar la web (sin tocar el dominio todavía)

1. Entra en [netlify.com](https://www.netlify.com) y crea una cuenta.
2. **Add new site → Import an existing project**. La web tiene que estar subida
   a GitHub (o GitLab) primero; si no lo está, es el momento de subirla.
3. Netlify reconoce Next.js solo. No hay que configurar nada: ni comando de
   construcción, ni carpeta de salida, ni complementos. El archivo `netlify.toml`
   del proyecto ya lleva lo poco que hace falta.
4. Espera. Cuando termine, Netlify da una dirección provisional del tipo
   `algo-random.netlify.app`. **Ábrela y pruébala entera** antes de seguir:
   móvil y escritorio, el menú, la reserva, el WhatsApp. Esa dirección es
   temporal y no la va a ver nadie, así que un error aquí no cuesta nada.

## 2. Conectar el dominio

Solo cuando la dirección provisional esté perfecta.

1. En Netlify: **Domain management → Add a domain** y escribe
   `yogarituals.es`.
2. Netlify dirá que hay que apuntar los DNS. Hay dos caminos:
   - **Cambiar los servidores de nombres** en el sitio donde esté registrado el
     dominio, a los que Netlify indique. Es el camino más simple y el que
     recomiendo.
   - **Mantener los DNS donde están** y añadir los registros que Netlify pida.
     Más trabajo y más fácil equivocarse.
3. Deja `yogarituals.es` como dominio principal y añade `www.yogarituals.es`
   como alias. Netlify redirige el `www` al principal por su cuenta, y eso es
   justo lo que queremos: hoy la web antigua sirve las dos versiones a la vez,
   las dos con un 200, y eso para Google es duplicar cada página. Quedarnos con
   una arregla eso de paso.
4. El certificado HTTPS lo pone Netlify solo, gratis, en cuanto los DNS
   apunten. Puede tardar unos minutos. Hasta que no esté, no toques nada más.

### Dos avisos sobre los DNS

- **El correo.** La web no tiene correo propio: en el pie figura
  `yogaritualsgandia@gmail.com`, que es Gmail y no depende del dominio, así que
  cambiar los DNS no rompe nada. **Si algún día hay correo con el dominio**
  (`algo@yogarituals.es`), antes de tocar los servidores de nombres hay que
  copiar a Netlify los registros MX. Si no, el correo deja de llegar en
  silencio, y eso se descubre cuando alguien dice «te escribí y no contestaste».
- **No canceles Webnode el mismo día.** Déjala viva al menos un mes. Es el
  seguro: si algo de la web nueva falla, las direcciones antiguas redirigen
  igual, y siempre se puede volver atrás cambiando los DNS otra vez.

## 3. Comprobar que no se ha perdido nada

Estas son las comprobaciones de verdad. Se pegan en una terminal, una detrás de
otra, sustituyendo nada. La primera columna es lo que hay que hacer, la segunda
lo que tiene que responder.

```bash
# Las direcciones que cambian de nombre redirigen con un 301 permanente.
curl -sI https://yogarituals.es/actividades/ | head -3
#   HTTP/2 301
#   location: /clases

curl -sI https://yogarituals.es/precios/ | head -3
#   HTTP/2 301
#   location: /tarifas

curl -sI https://yogarituals.es/minfulness/ | head -3
#   HTTP/2 301
#   location: /mindfulness

# El www lleva al dominio principal, y no al revés.
curl -sI https://www.yogarituals.es/ | head -3
#   HTTP/2 301
#   location: https://yogarituals.es/

# Una dirección que no existe da un 404 de verdad, no un 200 disfrazado.
curl -sI https://yogarituals.es/esto-no-existe | head -1
#   HTTP/2 404

# El mapa del sitio está y lleva las dieciséis páginas.
curl -s https://yogarituals.es/sitemap.xml | grep -c "<loc>"
#   16

# Y robots.txt apunta a ese mapa.
curl -s https://yogarituals.es/robots.txt
#   User-Agent: *
#   Allow: /
#   Sitemap: https://yogarituals.es/sitemap.xml
```

Si alguna de estas no sale, no sigas. Mira `next.config.ts`, que es donde están
las redirecciones con el motivo de cada una, y la configuración de dominios de
Netlify. Y avísame: esas mismas redirecciones están comprobadas automáticamente
en cada cambio, así que si fallan en producción es que Netlify está haciendo
algo por su cuenta antes de llegar a la web.

## 4. Decirle a Google

1. En [Google Search Console](https://search.google.com/search-console), añade
   la propiedad `yogarituals.es` si no la tienes y verifícala.
2. **Sitemaps → Añadir un sitemap**: `sitemap.xml`.
3. **Inspección de URL**: pega dos o tres direcciones antiguas
   (`https://yogarituals.es/actividades/`, `/precios/`, `/minfulness/`) y
   comprueba que Google ve la redirección y la página nueva. Tarda unos días en
   actualizar el índice.
4. **No hay que usar «Change of address».** Ese trámite es para cuando la web
   se muda a OTRO dominio, y aquí el dominio es el mismo. Usarlo cuando no toca
   solo confunde.

Conviene repetir la inspección a la semana y al mes, y mirar **Cobertura** para
ver que las páginas antiguas van desapareciendo y las nuevas van entrando. Es
normal que durante unas semanas convivan unas y otras.

## 5. Lo que todavía no está

No hay que hacer nada con esto ahora; está apuntado para que no se olvide:

- **La página de contacto y su formulario.** Existe y está enlazada, pero el
  formulario aún no está montado. Mientras tanto, la reserva va por WhatsApp,
  que ya funciona.
- **Las fotos.** Las seis que hay son de ejemplo y está dicho en la propia web.
  Cuando lleguen las del estudio, se sustituyen en `public/fotos-ejemplo/` sin
  tocar el código, cada una en su sitio.
- **El logotipo en SVG.** El actual es un PNG al que se le ha quitado el fondo
  y del que se ha hecho una segunda versión clara para el modo oscuro. Con un
  SVG, las dos versiones sobran.
- **La imagen para compartir.** Es una tarjeta crema con el logotipo. Cuando
  Susana mande una foto, se sustituye `public/compartir.png` y ya está.
- **Una página 404 propia.** Ahora sale la de Next, correcta pero sosa.

## 6. Cómo se publica a partir de ahora

Una vez conectado el repositorio, cada vez que se suba un cambio a la rama
principal, Netlify reconstruye y publica sola, en un par de minutos, sin
desconectar la web. Y cada propuesta de cambio recibe además su propia
dirección temporal para verla antes de publicarla, que es la forma de no
romper nada sin querer.
