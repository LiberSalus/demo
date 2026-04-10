# Workflow: convertir un Markdown a PDF con imagenes y copiarlo a `public`

## Objetivo

Documentar el flujo usado para tomar un archivo `.md` externo, generar un PDF con sus imagenes incluidas y dejar una copia dentro de `public` de este proyecto.

## Caso resuelto

- Markdown origen:
  `C:\Users\usuario\Documents\repositorios\Borrador\mesat\src\components\BorradorDos\FrecuenciaCardiaca\requerimientosGraficasFrecuenciaCardiaca.md`
- PDF generado junto al origen:
  `C:\Users\usuario\Documents\repositorios\Borrador\mesat\src\components\BorradorDos\FrecuenciaCardiaca\requerimientosGraficasFrecuenciaCardiaca.pdf`
- Copia final en este proyecto:
  `c:\Users\usuario\Documents\repositorios\registro\lsinciosesionweb\public\requerimientosGraficasFrecuenciaCardiaca.pdf`

## Restricciones detectadas

- No habia `pandoc`.
- No habia `wkhtmltopdf`.
- No habia librerias Python para Markdown/PDF ya instaladas.
- Si habia navegador disponible en modo headless:
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

## Solucion aplicada

1. Leer el `.md` y detectar imagenes referenciadas en la misma carpeta.
2. Crear un HTML temporal con estilos simples e imagenes embebidas en base64.
3. Imprimir ese HTML a PDF usando Edge en modo headless.
4. Copiar el PDF generado a `public`.

## Archivo auxiliar creado

- Script:
  `c:\Users\usuario\Documents\repositorios\registro\lsinciosesionweb\tools\md_to_pdf_inline.py`

Este script:

- convierte un Markdown basico a HTML
- incrusta imagenes locales como `data:` URL
- genera un HTML autosuficiente para imprimir

## Comando usado para generar el PDF

```powershell
$md = 'C:\Users\usuario\Documents\repositorios\Borrador\mesat\src\components\BorradorDos\FrecuenciaCardiaca\requerimientosGraficasFrecuenciaCardiaca.md'
$html = 'c:\Users\usuario\Documents\repositorios\registro\lsinciosesionweb\tmp\requerimientosGraficasFrecuenciaCardiaca.html'
$pdf = 'C:\Users\usuario\Documents\repositorios\Borrador\mesat\src\components\BorradorDos\FrecuenciaCardiaca\requerimientosGraficasFrecuenciaCardiaca.pdf'
python 'c:\Users\usuario\Documents\repositorios\registro\lsinciosesionweb\tools\md_to_pdf_inline.py' $md $html
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --print-to-pdf=$pdf $html
```

## Comando usado para copiar a `public`

```powershell
$src = 'C:\Users\usuario\Documents\repositorios\Borrador\mesat\src\components\BorradorDos\FrecuenciaCardiaca\requerimientosGraficasFrecuenciaCardiaca.pdf'
$public = 'c:\Users\usuario\Documents\repositorios\registro\lsinciosesionweb\public'
$dest = Join-Path $public 'requerimientosGraficasFrecuenciaCardiaca.pdf'
Copy-Item -LiteralPath $src -Destination $dest -Force
```

## Ruta publica resultante

- `/requerimientosGraficasFrecuenciaCardiaca.pdf`

## Nota para futuras peticiones

Si el usuario pide "hazme un PDF de este Markdown incluyendo imagenes" y no hay herramientas de conversion instaladas, reutilizar este flujo:

- usar `tools/md_to_pdf_inline.py`
- imprimir con Edge headless
- si lo pide, copiar el PDF a `public`
