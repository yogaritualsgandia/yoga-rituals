# =============================================================================
#  YOGA Rituals · preparar el logotipo para la web
# =============================================================================
#
#  Qué genera
#  Cuatro archivos en public/marca/, a partir de logo-mandala.png:
#
#    logo-sin-fondo.png              tinta oscura (modo claro)
#    logo-sin-fondo-oscuro.png       tinta crema (modo oscuro)
#    logo-sin-fondo-400.png          copia de 400 px para la cabecera
#    logo-sin-fondo-oscuro-400.png   copia de 400 px para la cabecera
#
#  Las copias de 400 px son las que usa la web. El original de 1920 px se
#  conserva para volver a generar, pero no se sirve: pesa 243 KB y en la
#  cabecera se ve a 168 px como mucho.
#
#  Por qué hacen falta dos
#  El original trae la tinta en #333 y el mandala en turquesa, todo pintado
#  sobre blanco. Sobre el crema eso deja un recuadro blanco; y sobre el suelo
#  oscuro la tinta #333 desaparece, porque es más oscura que el propio fondo.
#  Ninguno de los dos se arregla con CSS: un filtro que aclarase la tinta
#  estropearía también el turquesa del mandala. Lo que se ajusta es el color
#  de la tinta, píxel a píxel, y se deja el mandala intacto.
#
#  Cómo lo hace
#  1. Quita el fondo. No recorta por umbral, que deja flecos grises y bordes
#     dentados: deshace la mezcla. Calcula cuánta tinta hay —alfa = 255 menos
#     el canal más apagado— y despeja la fórmula observado = color · alfa +
#     blanco · (1 - alfa) para recuperar el color puro. Los bordes suavizados
#     conservan así su transparencia progresiva.
#  2. En la variante oscura, sustituye por crema los píxeles que no tienen
#     color (el máximo menos el mínimo de sus canales es pequeño: eso es tinta),
#     y deja como están los que sí lo tienen (el mandala).
#
#  Cuándo borrar esto
#  Cuando Susana mande el logo en SVG. Un SVG resuelve las dos cosas a la vez:
#  no tiene fondo y se le puede cambiar el color de la tinta con CSS. Ese día
#  sobran este script y los dos PNG derivados.
#
#  Uso
#  powershell -File scripts/logo-sin-fondo.ps1

Add-Type -AssemblyName System.Drawing

$raiz = Join-Path $PSScriptRoot "..\public\marca"
$origen = Join-Path $raiz "logo-mandala.png"

if (-not (Test-Path $origen)) {
    throw "No encuentro el original: $origen"
}

# La crema de la marca, el mismo --crema de styles/tokens.css.
$cremaR = 245; $cremaG = 241; $cremaB = 234

# Por debajo de esta diferencia entre canales, un píxel se considera tinta sin
# color (negra o gris) y no parte del mandala.
$umbralColor = 28

function Convertir-Logotipo {
    param(
        [System.Drawing.Bitmap]$Original,
        [string]$Destino,
        [bool]$TintaClara
    )

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Original.Width, $Original.Height)
    $datos = $Original.LockBits(
        $rect,
        [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )

    $total = $datos.Stride * $Original.Height
    $buf = New-Object byte[] $total
    [System.Runtime.InteropServices.Marshal]::Copy($datos.Scan0, $buf, 0, $total)

    $transparentes = 0
    $tinta = 0

    for ($i = 0; $i -lt $total; $i += 4) {
        # Formato BGRA.
        $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]

        $min = [Math]::Min($r, [Math]::Min($g, $b))
        $max = [Math]::Max($r, [Math]::Max($g, $b))

        if ($min -ge 250) {
            # Prácticamente blanco: fuera del todo, sin dejar un velo gris.
            $buf[$i] = 0; $buf[$i + 1] = 0; $buf[$i + 2] = 0; $buf[$i + 3] = 0
            $transparentes++
            continue
        }

        $a = 255 - $min
        $af = $a / 255.0
        $blanco = 255.0 * (1.0 - $af)

        $nr = [Math]::Round(($r - $blanco) / $af)
        $ng = [Math]::Round(($g - $blanco) / $af)
        $nb = [Math]::Round(($b - $blanco) / $af)

        $nr = [Math]::Max(0, [Math]::Min(255, $nr))
        $ng = [Math]::Max(0, [Math]::Min(255, $ng))
        $nb = [Math]::Max(0, [Math]::Min(255, $nb))

        if ($TintaClara -and (($max - $min) -le $umbralColor)) {
            $nr = $cremaR; $ng = $cremaG; $nb = $cremaB
            $tinta++
        }

        $buf[$i] = [byte]$nb
        $buf[$i + 1] = [byte]$ng
        $buf[$i + 2] = [byte]$nr
        $buf[$i + 3] = [byte]$a
    }

    [System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $datos.Scan0, $total)
    $Original.UnlockBits($datos)
    $Original.Save($Destino, [System.Drawing.Imaging.ImageFormat]::Png)

    Write-Host ("  {0}" -f (Split-Path $Destino -Leaf))
    Write-Host ("    píxeles transparentes: {0} de {1}" -f $transparentes, ($total / 4))
    if ($TintaClara) {
        Write-Host ("    píxeles de tinta pasados a crema: {0}" -f $tinta)
    }
}

# La copia que se sirve en la cabecera. El PNG original pesa 243 KB y se ve a
# 168 px como mucho; a 400 px sobra para una pantalla de doble densidad.
function Guardar-CopiaWeb {
    param(
        [string]$Origen,
        [string]$Destino
    )

    $fuente = New-Object System.Drawing.Bitmap($Origen)
    $alto = [int][Math]::Round($fuente.Height * 400.0 / $fuente.Width)
    $copia = New-Object System.Drawing.Bitmap(400, $alto)
    $grafico = [System.Drawing.Graphics]::FromImage($copia)
    $grafico.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $grafico.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $grafico.DrawImage($fuente, 0, 0, 400, $alto)
    $copia.Save($Destino, [System.Drawing.Imaging.ImageFormat]::Png)
    $grafico.Dispose()
    $copia.Dispose()
    $fuente.Dispose()

    Write-Host ("  {0} ({1} px de ancho)" -f (Split-Path $Destino -Leaf), 400)
}

Write-Host "Preparando el logotipo:"

$original = New-Object System.Drawing.Bitmap($origen)

Convertir-Logotipo `
    -Original $original `
    -Destino (Join-Path $raiz "logo-sin-fondo.png") `
    -TintaClara $false

$original.Dispose()

# La segunda pasada parte del original otra vez, no del resultado anterior:
# si partiese del claro, la tinta ya estaría enmascarada y no habría forma de
# saber qué píxeles eran tinta y qué píxeles eran mandala.
$original = New-Object System.Drawing.Bitmap($origen)

Convertir-Logotipo `
    -Original $original `
    -Destino (Join-Path $raiz "logo-sin-fondo-oscuro.png") `
    -TintaClara $true

$original.Dispose()

Guardar-CopiaWeb `
    -Origen (Join-Path $raiz "logo-sin-fondo.png") `
    -Destino (Join-Path $raiz "logo-sin-fondo-400.png")

Guardar-CopiaWeb `
    -Origen (Join-Path $raiz "logo-sin-fondo-oscuro.png") `
    -Destino (Join-Path $raiz "logo-sin-fondo-oscuro-400.png")

Write-Host "Listo."
