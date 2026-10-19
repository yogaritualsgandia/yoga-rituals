# ============================================================================
#  El servidor de casa, siempre encendido
# ============================================================================
#
#  Deja la web en http://localhost:3000 y la vuelve a levantar si se cae.
#
#  Por qué existe. `next start` ya no sirve para este proyecto: la web se
#  publica como archivos estáticos (`output: "export"` en next.config.ts), y en
#  ese modo Next se niega a arrancar un servidor. Lo que sí funciona es
#  `next dev`, que es el que compila al vuelo y el que se usa para revisar.
#
#  Qué hace, en bucle y sin ruido:
#
#    1. Pregunta si el 3000 contesta.
#    2. Si no contesta, levanta `npm run dev` en una ventana oculta y espera.
#    3. Vuelve a preguntar cada quince segundos.
#
#  Si el servidor se cae —porque se ha cerrado la ventana, porque ha petado al
#  compilar algo, porque el ordenador ha estado suspendido—, esto lo levanta
#  solo en menos de un minuto. No hay que hacer nada.
#
#  Se para cerrando esta ventana, o matando el proceso de PowerShell que lo
#  lleva. Arrancarlo a mano:
#
#      powershell -ExecutionPolicy Bypass -File scripts\servidor-local.ps1
#
# ============================================================================

$ErrorActionPreference = "SilentlyContinue"

$puerto = 3000
$raiz = Split-Path -Parent $PSScriptRoot
$registro = Join-Path $raiz "servidor-local.log"

Set-Location $raiz

function Esta-Vivo {
    try {
        $respuesta = Invoke-WebRequest -Uri "http://localhost:$puerto" `
            -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return $respuesta.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Anotar($texto) {
    $linea = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $texto
    Add-Content -Path $registro -Value $linea -Encoding utf8
}

Anotar "Vigilante arrancado. Puerto $puerto."

$ultimoIntento = [datetime]::MinValue

while ($true) {
    if (-not (Esta-Vivo)) {
        # No se intenta levantar dos veces seguidas: entre el arranque de Next y
        # el primer 200 pasan unos segundos, y sin esta espera el bucle lanzaría
        # un `npm run dev` nuevo cada quince segundos, cada uno en un puerto
        # distinto, hasta dejar el ordenador sin aire.
        if (((Get-Date) - $ultimoIntento).TotalSeconds -gt 60) {
            $ultimoIntento = Get-Date
            Anotar "El $puerto no contesta. Levantando la web."

            Start-Process -FilePath "cmd.exe" `
                -ArgumentList "/c", "npm run dev >> `"$registro`" 2>&1" `
                -WorkingDirectory $raiz `
                -WindowStyle Hidden

            Start-Sleep -Seconds 25
        }
    }

    Start-Sleep -Seconds 15
}
