[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

foreach ($directory in @('docs', 'api', 'web', 'app')) {
    $directoryPath = Join-Path $projectRoot $directory
    $readmePath = Join-Path $directoryPath 'README.md'

    if (-not (Test-Path -LiteralPath $directoryPath -PathType Container)) {
        $errors.Add("Diretório obrigatório ausente: $directory/")
    }
    elseif (-not (Test-Path -LiteralPath $readmePath -PathType Leaf)) {
        $errors.Add("README obrigatório ausente: $directory/README.md")
    }
}

$bmcPdf = Join-Path $projectRoot 'docs/BMC.pdf'
$bmcMarkdown = Join-Path $projectRoot 'docs/BMC.md'
if (-not (Test-Path -LiteralPath $bmcPdf -PathType Leaf) -and -not (Test-Path -LiteralPath $bmcMarkdown -PathType Leaf)) {
    $errors.Add('Documento obrigatório ausente: docs/BMC.pdf ou docs/BMC.md')
}

$dataDocument = Join-Path $projectRoot 'docs/DADOS.pdf'
if (-not (Test-Path -LiteralPath $dataDocument -PathType Leaf)) {
    $errors.Add('Documento obrigatório ausente: docs/DADOS.pdf')
}

$docsReadme = Join-Path $projectRoot 'docs/README.md'
if (Test-Path -LiteralPath $docsReadme -PathType Leaf) {
    $docsContent = Get-Content -LiteralPath $docsReadme -Raw
    if ($docsContent -match '\[PREENCHER') {
        $errors.Add('docs/README.md ainda contém campos [PREENCHER].')
    }
    if ($docsContent -notmatch 'https://(www\.)?youtube\.com/|https://youtu\.be/') {
        $errors.Add('docs/README.md ainda não contém um link do YouTube.')
    }
}

$nodeModules = Get-ChildItem -LiteralPath $projectRoot -Directory -Recurse -Force -Filter node_modules -ErrorAction SilentlyContinue
if ($nodeModules.Count -gt 0) {
    $warnings.Add("Foram encontrados $($nodeModules.Count) diretórios node_modules locais. O gerador do ZIP irá excluí-los.")
}

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'desktop') -PathType Container)) {
    $warnings.Add('Nenhuma aplicação desktop foi encontrada. Confirme com o professor se ela é exigida para este grupo.')
}

if (Test-Path -LiteralPath (Join-Path $projectRoot '.git') -PathType Container) {
    $trackedNodeModules = @(& git -C $projectRoot ls-files | Where-Object { $_ -match '(^|/)node_modules/' })
    if ($trackedNodeModules.Count -gt 0) {
        $errors.Add('Há arquivos de node_modules versionados no Git.')
    }
}

Write-Host ''
Write-Host 'Validação da entrega VITTA'
Write-Host '==========================='

foreach ($warning in $warnings) {
    Write-Host "AVISO: $warning" -ForegroundColor Yellow
}

foreach ($validationError in $errors) {
    Write-Host "ERRO: $validationError" -ForegroundColor Red
}

if ($errors.Count -gt 0) {
    Write-Host ''
    Write-Host "Resultado: $($errors.Count) erro(s) e $($warnings.Count) aviso(s)." -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host "Resultado: nenhum erro e $($warnings.Count) aviso(s)." -ForegroundColor Green
exit 0
