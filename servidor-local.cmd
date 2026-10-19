@echo off
REM Doble clic para tener la web en http://localhost:3000 mientras trabajas.
REM Deja esta ventana abierta: si se cierra, la web deja de estar disponible.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\servidor-local.ps1"
