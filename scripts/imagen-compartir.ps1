# =============================================================================
#  YOGA Rituals · imagen para compartir enlaces (Open Graph)
# =============================================================================
#
#  Qué genera
#  public/compartir.png, de 1200×630. Es la imagen que aparece al pegar el
#  enlace de la web en WhatsApp, en un correo o en redes.
#
#  Por qué solo el logotipo
#  Porque es lo único de lo que hay certeza. Susana va a mandar una foto con
#  su texto, y entonces esto se sustituye. Mientras tanto, una tarjeta crema
#  con el logotipo centrado es honesta, se ve bien en pequeño y no finge nada:
#  no lleva ni fotos de banco, ni cifras, ni frases que nadie ha dicho.
#
#  Por qué no lleva texto
#  Cualquier frase habría que componerla con una tipografía del sistema
#  (Georgia o parecida), porque Literata no está instalada en Windows y solo
#  existe dentro del build de Next. Una tarjeta con Georgia al lado de una web
#  en Literata se nota. Solo con el logotipo no hay nada que se note. El
#  título y la descripción del enlace ya acompañan a la imagen; la imagen no
#  tiene que repetirlos.
#
#  Cuándo borrar esto
#  Cuando llegue la foto de Susana. Entonces este script sobra y compartir.png
#  se sustituye a mano.
#
#  Uso
#  powershell -File scripts/imagen-compartir.ps1

Add-Type -AssemblyName System.Drawing

$raiz = Join-Path $PSScriptRoot "..\public"
$origen = Join-Path $raiz "marca\logo-sin-fondo.png"
$destino = Join-Path $raiz "compartir.png"

if (-not (Test-Path $origen)) {
    throw "No encuentro el logotipo: $origen. Ejecuta antes logo-sin-fondo.ps1"
}

# Las medidas que piden todas las plataformas para una tarjeta grande.
$ancho = 1200
$alto = 630

# El mismo --crema de styles/tokens.css.
$crema = [System.Drawing.ColorTranslator]::FromHtml("#F5F1EA")

$lienzo = New-Object System.Drawing.Bitmap($ancho, $alto)
$pincel = [System.Drawing.Graphics]::FromImage($lienzo)
$pincel.Clear($crema)
$pincel.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$pincel.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# El logotipo, centrado. El ancho se elige para que quede aire por los lados
# sin que la marca se pierda cuando la vista previa se enseña pequeña.
$logotipo = [System.Drawing.Image]::FromFile($origen)
$anchoMarca = 760
$altoMarca = [int][Math]::Round($logotipo.Height * $anchoMarca / $logotipo.Width)

$sitio = New-Object System.Drawing.Rectangle(
    [int](($ancho - $anchoMarca) / 2),
    [int](($alto - $altoMarca) / 2),
    $anchoMarca,
    $altoMarca
)

# DrawImage respeta el canal alfa del logotipo, así que se compone sobre el
# crema sin devolver el recuadro blanco que traía el archivo original.
$pincel.DrawImage($logotipo, $sitio)

$pincel.Dispose()
$logotipo.Dispose()

$lienzo.Save($destino, [System.Drawing.Imaging.ImageFormat]::Png)
$lienzo.Dispose()

Write-Host ("Guardado: {0} ({1}×{2})" -f $destino, $ancho, $alto)
