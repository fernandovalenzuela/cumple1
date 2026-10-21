$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$files = Get-ChildItem -Path $root -Recurse -File |
  Where-Object {
    $_.FullName -notmatch "\\(node_modules|\.next|out|dist|build|\.git)\\" -and
    $_.Extension -in ".css", ".scss", ".sass", ".less",
                     ".ts", ".tsx", ".js", ".jsx", ".mjs", ".html"
  }

function Remove-CssComments {
  param([string]$Content)

  return [regex]::Replace(
    $Content,
    '(?s)/\*.*?\*/',
    ''
  )
}

$allContent = ($files | ForEach-Object {
  Get-Content -LiteralPath $_.FullName -Raw
}) -join "`n"

$allContent = Remove-CssComments $allContent

$globalCssPath = Join-Path $root "app\globals.css"

if (-not (Test-Path $globalCssPath)) {
  throw "No se encontró: $globalCssPath"
}

$globalCss = Get-Content -LiteralPath $globalCssPath -Raw
$globalCssWithoutComments = Remove-CssComments $globalCss

# Obtiene todas las variables definidas mediante --nombre: valor.
$variables = [regex]::Matches(
  $globalCssWithoutComments,
  '(?m)(?<![\w-])--([a-zA-Z0-9_-]+)\s*:'
) |
  ForEach-Object {
    $_.Groups[1].Value
  } |
  Sort-Object -Unique

Write-Output ""
Write-Output "===  v2 VARIABLES CSS NO USADAS ==="

$unusedVariables = @()

foreach ($variable in $variables) {
  # Detecta:
  # var(--admin-bg)
  # var(--admin-bg, fallback)
  $usagePattern = '(?i)var\s*\(\s*--' +
    [regex]::Escape($variable) +
    '(?=\s*[,)])'

  $usageCount = [regex]::Matches(
    $allContent,
    $usagePattern
  ).Count

  if ($usageCount -eq 0) {
    $unusedVariables += "--$variable"
  }
}

if ($unusedVariables.Count -eq 0) {
  Write-Output "Ninguna"
} else {
  $unusedVariables | Sort-Object
}

Write-Output ""
Write-Output "=== CLASES CSS POSIBLEMENTE NO USADAS ==="

# Detecta clases CSS definidas en cualquier selector de globals.css,
# incluyendo selectores separados por comas y media queries.
$classes = [regex]::Matches(
  $globalCssWithoutComments,
  '(?<![a-zA-Z0-9_-])\.([a-zA-Z_][a-zA-Z0-9_-]*)'
) |
  ForEach-Object {
    $_.Groups[1].Value
  } |
  Sort-Object -Unique

$unusedClasses = @()

foreach ($className in $classes) {
  # Busca el nombre sin exigir el punto.
  # Esto detecta tanto:
  # .admin-button-secondary
  # className="admin-button-secondary"
  # class="admin-button-secondary"
  $classTokenPattern =
    '(?<![a-zA-Z0-9_-])' +
    [regex]::Escape($className) +
    '(?![a-zA-Z0-9_-])'

  $totalOccurrences = [regex]::Matches(
    $allContent,
    $classTokenPattern
  ).Count

  # Cuenta la propia definición CSS.
  $definitionPattern =
    '(?<![a-zA-Z0-9_-])\.' +
    [regex]::Escape($className) +
    '(?![a-zA-Z0-9_-])'

  $definitionOccurrences = [regex]::Matches(
    $globalCssWithoutComments,
    $definitionPattern
  ).Count

  # Si aparece fuera de globals.css, está siendo usada.
  if ($totalOccurrences -le $definitionOccurrences) {
    $unusedClasses += ".$className"
  }
}

if ($unusedClasses.Count -eq 0) {
  Write-Output "Ninguna"
} else {
  $unusedClasses | Sort-Object
}

Write-Output ""
Write-Output "La búsqueda incluye usos internos de globals.css."